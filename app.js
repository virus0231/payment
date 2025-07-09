const express = require('express');
const sequelize = require('./connection');
const { DataTypes, Sequelize, Op } = require('sequelize');  
const validateDonation =  require("./validator")
const { json } = require('body-parser');
const moment = require('moment');
const app = express();

const yoc_client_model =  require("./models/yoc_client");
const yoc_client = yoc_client_model(sequelize, DataTypes);

const yoc_donor_model =  require("./models/yoc_donor");
const yoc_donor = yoc_donor_model(sequelize, DataTypes);

const yoc_transaction_model =  require("./models/yoc_transaction");
const yoc_transaction = yoc_transaction_model(sequelize, DataTypes);

const yoc_transaction_detail_model =  require("./models/yoc_transaction_detail");
const yoc_transaction_detail = yoc_transaction_detail_model(sequelize, DataTypes);

const yoc_schedule_model =  require("./models/yoc_schedule");
const yoc_schedule = yoc_schedule_model(sequelize, DataTypes);

// Creratee connection  with database
sequelize.authenticate()
  .then(() => console.log('✅ Connected to MySQL'))
  .catch(err => console.error('❌ Unable to connect:', err));

// Middleware
app.use(express.json());
// Middleware for URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Sync models
sequelize.sync()
  .then(() => console.log('✅ Models synced'))
  .catch(err => console.error('❌ Sync error:', err));

// Order ID
const now = new Date();
const orderNo = 
  `${(now.getMonth() + 1).toString().padStart(2, '0')}` +
  `${now.getDate().toString().padStart(2, '0')}` +
  `${now.getFullYear()}` +
  `${now.getHours().toString().padStart(2, '0')}` +
  `${now.getMinutes().toString().padStart(2, '0')}` +
  `${now.getSeconds().toString().padStart(2, '0')}` +
  `${Math.floor(Math.random() * 10)}`;

let global_values = {
    "donor": {},
    "client": {},
    "card": {},
    "amount": {},
    "order_id": orderNo,
    "invoice_id": "",
    "transaction_id": "",
    "currency": "USD"
};

function getTimeTimestamp({ days = 0, months = 0, years = 0 }) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setMonth(date.getMonth() + months);
  date.setFullYear(date.getFullYear() + years);
  return Math.floor(date.getTime() / 1000);
}

const client_verification = async(client_name, api_key, secret_key)=>{
    try {
        const client = await yoc_client.findOne({
            attributes: ['id', 'live_stripe_key', 'test_stripe_key', "isproduction", "website_url"],
            where: { 
                client_name: client_name,
                api_key: api_key,
                secret_key: secret_key
            }
        });

        return client.toJSON();

    } catch (error) {
        return {"error while checking client auth": error}        
    }
}

const donor = async(data)=>{
    try {

        let
        id = 0, 
        first_name = data.first_name,
        last_name = data.last_name,
        organaization = data.organaization,
        add1 = data.add1,
        add2 = data.add2,
        city = data.city,
        country = data.country,
        zip = data.zip,
        state = data.state,
        phone = data.phone,
        email = data.email,
        four_digit = data.card_number.slice(-4),
        stripe_id = '',
        client_id = '';

        const donor = await yoc_donor.findOne({
            attributes: ['id', 'stripe_id', 'client_id'],
            where: { 
                last_name: last_name,
                email: email
            }
        });

        if(!donor){
            const new_donor = await yoc_donor.create({
                client_id: global_values.client.id,
                stripe_id: '',
                email: email,
                first_name: first_name,
                last_name: last_name,
                org: organaization,
                address_1: add1,
                address_2: add2,
                city: city,
                country: country,
                state: state,
                postcode: zip,
                phone: phone,
                four_digit: four_digit
            });

            id = new_donor.id;

        }else{
            id = donor.id;
            stripe_id = donor.stripe_id;
            client_id = donor.client_id;

            const update_donor = await yoc_donor.update({
                address_1: add1,
                address_2: add2,
                city: city,
                country: country,
                state: state,
                postcode: zip,
                four_digit: four_digit,    
            },{
              where: { 
                      id: id
                }
            }
          );

        }

        global_values.donor = {
            "id": id, 
            "stripe_id": stripe_id,
            "client_id": client_id,
            "first_name": first_name,
            "last_name": last_name,
            "organaization": organaization,
            "add1": add1,
            "city": city,
            "country": country,
            "zip": zip,
            "state": state,
            "phone": phone,
            "email":  email,
            "four_digit": four_digit
        }

    } catch (error) {
        return {"error": error}        
    }

}

const createPaymentMethod = async(stripe)=> {
    
    try {
        const paymentMethod = await stripe.paymentMethods.create({
            type: 'card',
            card: {
                number: global_values.card.card_number,
                exp_month: global_values.card.card_exp_month,
                exp_year: global_values.card.card_exp_year,
                cvc: global_values.card.cvv,
            },
            billing_details: {
                name: global_values.donor.first_name + " " + global_values.donor.last_name,
                email: global_values.donor.email,
            },
        });

        if(paymentMethod && paymentMethod.id){
            return paymentMethod.id
        }else{
            return {"error": "failed to get payment method"}
        }

    } catch (error) {
        return {"error": error}
    }

}

const createCustomer = async(stripe, pm)=>{

    try {
        const customer = await stripe.customers.create({
            name: global_values.donor.first_name + " " + global_values.donor.last_name,
            email: global_values.donor.email,
            phone: global_values.donor.phone,
            description: `Donor from client ${global_values.client.client_name}`,
            payment_method: pm,
            metadata: {
                userId: global_values.donor.id
            },
            address: {
                line1: global_values.donor.add1,
                state: global_values.donor.state,
                city: global_values.donor.city,
                country: global_values.donor.country
            }
        });
        
        console.log(customer);

        if(customer && customer.id){
            await yoc_donor.update(
                { stripe_id: customer.id },
                { where: { id: global_values.donor.id } }
            );
            return customer.id;
        }else{
            return {"error": "Failed to create customer id"}
        }

    } catch (error) {
        console.log(json({"error": error}));
        return {"error": error}
    }

}

const createChargeIntent = async( stripe, paymentMethodId, customerId )=> {
  try {
    // Description text
    const description = `${(global_values.amount.total_amount).toFixed(2)} Charge for OrderNo = ${global_values.order_id}`;

    // Convert charges to integer cents
    const tccCharges = Math.round(global_values.amount.card_fee);
    const totalCharge = Math.round(tccCharges + global_values.amount.total_amount);

    const metadata = {
        order_no: global_values.order_id,
        card_fee: global_values.amount.card_fee.toString()
    };

    const cart = global_values.cart;

    cart.forEach((item, index) => {
        metadata[`item${index + 1}_appeal_id`] = String(item.appeal_id);
        metadata[`item${index + 1}_amount_id`] = String(item.amount_id);
        metadata[`item${index + 1}_fund_id`] = String(item.fund_id);
        metadata[`item${index + 1}_amount`] = String(item.amount);
        metadata[`item${index + 1}_quantity`] = String(item.quantity);
        metadata[`item${index + 1}_frequency`] = String(item.frequency);
    });


    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      setup_future_usage: 'off_session',
      confirm: true,
      amount: totalCharge,
      currency: global_values.currency,
      payment_method: paymentMethodId,
      customer: customerId,
      description,
      metadata: metadata,
      return_url: 'https://action4you.youronlineconversation.com/thank-you/'
    });

    global_values.transaction = {"platform_id": paymentIntent.id, "charge_id": paymentIntent.latest_charge, "status": paymentIntent.status, "reason": ""};

    return paymentIntent.id;

  } catch (error) {
    global_values.transaction = {"platform_id": "", "charge_id": "", "status": "declined", "reason": error.message};
    return { error: error.message };
  }
}

const innsertTransaction = async()=> {

    const time = Date.now().toString(16);
    const rand = Math.floor(Math.random() * 1000).toString(16);
    const tid = global_values.client.client_name + "-" + time + rand;
    global_values.invoice_id = tid;
    console.log(tid);

    const transaction = await yoc_transaction.create({
        client_id: global_values.client.id,
        did: global_values.donor.id,
        tid: tid,
        order_id: global_values.order_id,
        visit_id: "",
        platform_id: global_values.transaction.platform_id,
        charge_id: global_values.transaction.charge_id,
        amount: global_values.amount.total_amount,
        card_fee: global_values.amount.card_fee,
        payment_type: "cc",
        reason: global_values.transaction.reason,
        notes: global_values.notes,
        gift_aid: 0,
        employer_match: 0,
        status: global_values.transaction.status
    });

    global_values.transaction_id = transaction.id;

    return transaction.id;

}

const insertTransactionDetail = async () => {
  try {
    const cart = global_values.cart;

    await Promise.all(
      cart.map((data, index) => {
        return yoc_transaction_detail.create({
          client_id: global_values.client.id,
          tid: global_values.transaction_id,
          amount: data.amount,
          appeal_id: data.appeal_id,
          amount_id: data.amount_id,
          fund_id: data.fund_id,
          sf_id: "",
          freq: data.frequency
        });
      })
    );

    return { success: true };

  } catch (error) {
    return { error: error };
  }
};

const frequency = async(frequency) => {
  let freq = "month";
  let interval = 0;
  if (frequency == 1 || frequency === "month") {
      freq = "month";
      interval = getTimeTimestamp({ months: 1 });
  } else if (frequency == 2 || frequency === "yearly") {
    freq = "yearly";
    interval = getTimeTimestamp({ years: 1 });
  } else if (frequency == 3 || frequency === "week") {
    freq = "week";
    interval = getTimeTimestamp({ days: 7 });
  } else if (frequency == 4 || frequency === "day") {
    freq = "day";
    interval = getTimeTimestamp({ days: 1 });
  } else {
    console.warn(`invalid frequency ${frequency}`);
    return null;
  }

  return {freq, interval}

}

const makeSubscribtion = async(stripe, customer_id, metadata, interval, items, payment_method) => {

  try {

    const obj = {
        customer: customer_id,
        start_date: interval,
        end_behavior: 'release',
        metadata: metadata,
        phases: [
            {
            items: items,
            proration_behavior: 'none',
            iterations: 60,
            default_payment_method: payment_method
            }
        ]
    };

    const subscription = await stripe.subscriptionSchedules.create(obj);

    if(subscription && subscription.id){
        return subscription.id;
    }else{
      return { error: subscription.message }
    }
    
  } catch (error) {
    return { error: error }
  }

}

const makePlan = async (stripe, customer_id, paymentMethod) => {
  try {
    const cart = global_values.cart;

    await Promise.all(
      cart.map(async (data, index) => {
        // Get frequency and interval
        const frequencyData = await frequency(data.frequency);

        // Skip item if frequency is invalid
        if (!frequencyData) {
          console.log(`Skipping invalid item at index ${index}`);
          return; // Skip this item
        }

        const { freq, interval } = frequencyData;
        console.log(`Frequency for item at index ${index}: ${freq}`);

        // Metadata
        const metadata = {
          appeal_id: String(data.appeal_id),
          amount_id: String(data.amount_id),
          fund_id: String(data.fund_id),
          amount: String(data.amount),
          quantity: String(data.quantity),
          frequency: String(freq)
        };

        const plan = await stripe.plans.create({
          amount: data.amount,
          currency: global_values.currency,
          interval: freq,
          metadata: metadata,
          product: {
            name: `Appeal-${data.appeal_id}-Amount-${data.amount}`
          }
        });

        if (plan && plan.id) {
          const schedule_meta = {
            [`appeal_${index}_id`]: data.appeal_id,
            [`appal_${index}_name`]: "",
            [`item_${index}_amount`]: data.amount,
            [`item_${index}_quantity`]: data.quantity
          };

          const items = [
              {
              "price": plan.id,
              "quantity": data.quantity
            }
          ];

          // Await makeSubscription to get subscription ID
          const sub_id = await makeSubscribtion(stripe, customer_id, schedule_meta, interval, items, paymentMethod);

          insertSchedule(plan.id, sub_id, customer_id, freq, data.amount, data.appeal_id, data.amount_id, data.fund_id, data.schedule_type);

          console.log(`Created price ID: ${JSON.stringify(plan)}`);
        } else {
          console.warn(`Failed to create price for item at index ${index}`);
        }
      })
    );

    return { success: true };

  } catch (error) {
    console.error('Error in makePlan:', error);
    return { error: error.message };
  }
};

const insertSchedule = async (plan_id, sub_id, customer_id, freq, amount, appeal_id, amount_id, fund_id, schedule_type) => { 
  try {
  
    const startDate = moment().format('YYYY-MM-DD');
    let lastChargeDate = startDate;
    let nextChargeDate = moment(startDate);

    switch (freq) {
      case 'month':
        nextChargeDate.add(1, 'months');
        break;
      case 'week':
        nextChargeDate.add(1, 'weeks');
        break;
      case 'day':
        nextChargeDate.add(1, 'days');
        break;
      case 'quarterly':
        nextChargeDate.add(3, 'months');
        break;
      case 'year':
        nextChargeDate.add(1, 'years');
        break;
      default:
        nextChargeDate = moment(startDate);
    }

    const sch = await yoc_schedule.create({
      client_id: global_values.client.id,
      customer_id: customer_id,
      did: global_values.donor.id,
      payment_method: "cc",
      appeal_id: appeal_id,
      amount_id: amount_id,
      amount: amount,
      fund_list_id: fund_id,
      order_id: global_values.order_id,
      plan_id: plan_id,
      sub_id: sub_id,
      schedule_type: schedule_type,
      latest_donation_count: 1,
      last_charge_date: lastChargeDate,
      next_charge_date: nextChargeDate.format('YYYY-MM-DD'),
      start_date: startDate,
    });

    console.log("Schedule created successfully: ", sch);
  } catch (error) {
    console.error("Error in creating schedule: ", error);
  }
};


const stripe = async() => {
    
    // Stripe

    const stripe = require('stripe')(global_values.client.strip_key);

    // Create Payment method
    const paymentMethod = await createPaymentMethod(stripe);

    // Customer Id
    const customer_id = (global_values.donor.stripe_id != "") ? global_values.donor.stripe_id : await createCustomer(stripe, paymentMethod);

    // Attach payment method
    const attach_paymentmethod = await stripe.paymentMethods.attach(
        paymentMethod,
        {
            customer: customer_id
        }
    );

    // Create Charge Intent
    const chargeIntent = await createChargeIntent ( stripe, paymentMethod, customer_id );

    // Insert Records

    //Transaction
    const tid = await innsertTransaction();
    console.log(`tid: ${tid}`);

    // Transaction Detail
    const transaction_detail = await insertTransactionDetail();
    if(transaction_detail && transaction_detail.error){
        console.error(transaction_detail);
    }

    // Schedule
    const schedule = makePlan(stripe, customer_id, paymentMethod);

}

app.post('/api/donation', async(req, res)=>{

    // Ddata Sanitization
    const { sanitizedData, errors } = await validateDonation(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }

    // Setting card value
    global_values.card = {
        card_number: sanitizedData.card_number,
        card_exp_month: sanitizedData.card_exp_month,
        card_exp_year: sanitizedData.card_exp_year,
        card_cvv: sanitizedData.cvv
    };

    // Cart Items, Quantity, Amount
    const cart = sanitizedData.cart;
    const items = cart.items;
    const card_fee_status = cart.card_fee;
    let card_fee = 0;

    // Total Amount
    const totalAmount = items.reduce((sum, item) => {
        return sum + (item.amount * item.quantity);
    }, 0); 

    // Card fee
    if(card_fee_status){
        card_fee = totalAmount * 0.03;
    }

    global_values.amount = {
        "total_amount": totalAmount,
        "card_fee": card_fee
    };

    // Cart Items
    global_values.cart = items;

    // notes
    global_values.notes = sanitizedData.notes;

    // Client authentication
    const client_status = await client_verification(sanitizedData.client_name, sanitizedData.api_key, sanitizedData.secret_key);
    if(client_status.error){
        console.log(client_status);
    }
    else if(client_status.id){
        try {
            let stripe_key = '';
            if(client_status.isproduction == false){
                stripe_key = client_status.test_stripe_key;
            }else{
                stripe_key = client_status.live_stripe_key;
            }
            global_values.client = {"id": client_status.id, "strip_key": stripe_key, "client_name": sanitizedData.client_name, "website_url": client_status.website_url};
        } catch (error) {
            console.log(json({"error while setting client:": error}));
        }
    }else{
        console.log(json({"error":"Client authentication failed"}));
        return res.status(400).json({"error":"Unable to make transaction at the moment"});
    }

    // create donor
    const donor_response = await donor(sanitizedData);

    if(donor_response && donor_response.error){
        console.log(json({"donor_error": donor_response}));
    }

    const stripe_function = await stripe();

    // Insert Schedule



    console.log(global_values);
    
    res.json({ message: 'Validated and sanitized!', data: sanitizedData });

});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});