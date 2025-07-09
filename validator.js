const validator = require('validator');

function luhnCheck(cardNumber) {
  let sum = 0;
  let shouldDouble = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return (sum % 10) === 0;
}

function sanitizeText(input) {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[^a-zA-Z0-9]/g, '');
}

async function validateDonation(data) {
  const errors = [];

  // Sanitize text fields (remove special chars)
  const textFields = [
    'client_name', 'first_name', 'last_name', 'organaization',
    'city', 'country', 'state', 'notes',
    'employer_name'
  ];

  textFields.forEach(field => {
    if (!data[field] || typeof data[field] !== 'string') {
      errors.push(`${field} is required and must be a string.`);
    } else {
      data[field] = sanitizeText(data[field]);
    }
  });

  // Email validation
  if (!validator.isEmail(data.email || '')) {
    errors.push('Invalid email.');
  } else {
    data.email = validator.normalizeEmail(data.email);
  }

  if (!validator.isEmail(data.employer_email || '')) {
    errors.push('Invalid employer email.');
  } else {
    data.employer_email = validator.normalizeEmail(data.employer_email);
  }

  // Zip validation (numeric)
  if (!validator.isPostalCode(data.zip.toString(), 'any')) {
    errors.push('Invalid zip/postal code.');
  }

  // Phone (numeric, length check optional)
  if (!validator.isNumeric(data.phone.toString())) {
    errors.push('Invalid phone number.');
  }

  // Card number (Luhn)
  if (!validator.isCreditCard(data.card_number) || !luhnCheck(data.card_number)) {
    errors.push('Invalid card number.');
  }

  // Card Expiry
  const month = parseInt(data.card_exp_month, 10);
  const year = parseInt(data.card_exp_year, 10);

  if (!(month >= 1 && month <= 12)) {
    errors.push('Invalid card expiry month.');
  }

  const now = new Date();
  const thisYear = now.getFullYear();
  const thisMonth = now.getMonth() + 1;

  if (year < thisYear || (year === thisYear && month < thisMonth)) {
    errors.push('Card expiry date is in the past.');
  }

  // CVV (3 or 4 digits)
  if (!validator.isNumeric(data.cvv.toString()) || !(data.cvv.toString().length === 3 || data.cvv.toString().length === 4)) {
    errors.push('Invalid CVV.');
  }

  return {
    sanitizedData: data,
    errors
  };
}

module.exports = validateDonation;