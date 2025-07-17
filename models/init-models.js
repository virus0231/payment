var DataTypes = require("sequelize").DataTypes;
var _yoc_abandoned_cart = require("./yoc_abandoned_cart");
var _yoc_amount = require("./yoc_amount");
var _yoc_appeal = require("./yoc_appeal");
var _yoc_attribution_journey = require("./yoc_attribution_journey");
var _yoc_capi = require("./yoc_capi");
var _yoc_client = require("./yoc_client");
var _yoc_crm_hook = require("./yoc_crm_hook");
var _yoc_curl_request = require("./yoc_curl_request");
var _yoc_donor = require("./yoc_donor");
var _yoc_donor_login = require("./yoc_donor_login");
var _yoc_employer = require("./yoc_employer");
var _yoc_error_handling = require("./yoc_error_handling");
var _yoc_error_log = require("./yoc_error_log");
var _yoc_fund = require("./yoc_fund");
var _yoc_fund_matching = require("./yoc_fund_matching");
var _yoc_g4_request = require("./yoc_g4_request");
var _yoc_otp = require("./yoc_otp");
var _yoc_schedule = require("./yoc_schedule");
var _yoc_session = require("./yoc_session");
var _yoc_sf_fund = require("./yoc_sf_fund");
var _yoc_sf_relation = require("./yoc_sf_relation");
var _yoc_transaction = require("./yoc_transaction");
var _yoc_transaction_detail = require("./yoc_transaction_detail");
var _yoc_transaction_holder = require("./yoc_transaction_holder");
var _yoc_user = require("./yoc_user");
var _yoc_user_client = require("./yoc_user_client");
var _yoc_user_history = require("./yoc_user_history");
var _yoc_user_permission = require("./yoc_user_permission");
var _yoc_user_role = require("./yoc_user_role");
var _yoc_user_role_permission = require("./yoc_user_role_permission");

function initModels(sequelize) {
  var yoc_abandoned_cart = _yoc_abandoned_cart(sequelize, DataTypes);
  var yoc_amount = _yoc_amount(sequelize, DataTypes);
  var yoc_appeal = _yoc_appeal(sequelize, DataTypes);
  var yoc_attribution_journey = _yoc_attribution_journey(sequelize, DataTypes);
  var yoc_capi = _yoc_capi(sequelize, DataTypes);
  var yoc_client = _yoc_client(sequelize, DataTypes);
  var yoc_crm_hook = _yoc_crm_hook(sequelize, DataTypes);
  var yoc_curl_request = _yoc_curl_request(sequelize, DataTypes);
  var yoc_donor = _yoc_donor(sequelize, DataTypes);
  var yoc_donor_login = _yoc_donor_login(sequelize, DataTypes);
  var yoc_employer = _yoc_employer(sequelize, DataTypes);
  var yoc_error_handling = _yoc_error_handling(sequelize, DataTypes);
  var yoc_error_log = _yoc_error_log(sequelize, DataTypes);
  var yoc_fund = _yoc_fund(sequelize, DataTypes);
  var yoc_fund_matching = _yoc_fund_matching(sequelize, DataTypes);
  var yoc_g4_request = _yoc_g4_request(sequelize, DataTypes);
  var yoc_otp = _yoc_otp(sequelize, DataTypes);
  var yoc_schedule = _yoc_schedule(sequelize, DataTypes);
  var yoc_session = _yoc_session(sequelize, DataTypes);
  var yoc_sf_fund = _yoc_sf_fund(sequelize, DataTypes);
  var yoc_sf_relation = _yoc_sf_relation(sequelize, DataTypes);
  var yoc_transaction = _yoc_transaction(sequelize, DataTypes);
  var yoc_transaction_detail = _yoc_transaction_detail(sequelize, DataTypes);
  var yoc_transaction_holder = _yoc_transaction_holder(sequelize, DataTypes);
  var yoc_user = _yoc_user(sequelize, DataTypes);
  var yoc_user_client = _yoc_user_client(sequelize, DataTypes);
  var yoc_user_history = _yoc_user_history(sequelize, DataTypes);
  var yoc_user_permission = _yoc_user_permission(sequelize, DataTypes);
  var yoc_user_role = _yoc_user_role(sequelize, DataTypes);
  var yoc_user_role_permission = _yoc_user_role_permission(sequelize, DataTypes);

  yoc_client.belongsToMany(yoc_user, { as: 'user_id_yoc_users', through: yoc_user_client, foreignKey: "client_id", otherKey: "user_id" });
  yoc_user.belongsToMany(yoc_client, { as: 'client_id_yoc_clients', through: yoc_user_client, foreignKey: "user_id", otherKey: "client_id" });
  yoc_abandoned_cart.belongsTo(yoc_client, { as: "client", foreignKey: "client_id"});
  yoc_client.hasMany(yoc_abandoned_cart, { as: "yoc_abandoned_carts", foreignKey: "client_id"});
  yoc_amount.belongsTo(yoc_client, { as: "client", foreignKey: "client_id"});
  yoc_client.hasMany(yoc_amount, { as: "yoc_amounts", foreignKey: "client_id"});
  yoc_appeal.belongsTo(yoc_client, { as: "client", foreignKey: "client_id"});
  yoc_client.hasMany(yoc_appeal, { as: "yoc_appeals", foreignKey: "client_id"});
  yoc_attribution_journey.belongsTo(yoc_client, { as: "client", foreignKey: "client_id"});
  yoc_client.hasMany(yoc_attribution_journey, { as: "yoc_attribution_journeys", foreignKey: "client_id"});
  yoc_capi.belongsTo(yoc_client, { as: "client", foreignKey: "client_id"});
  yoc_client.hasMany(yoc_capi, { as: "yoc_capis", foreignKey: "client_id"});
  yoc_crm_hook.belongsTo(yoc_client, { as: "client", foreignKey: "client_id"});
  yoc_client.hasMany(yoc_crm_hook, { as: "yoc_crm_hooks", foreignKey: "client_id"});
  yoc_curl_request.belongsTo(yoc_client, { as: "client", foreignKey: "client_id"});
  yoc_client.hasMany(yoc_curl_request, { as: "yoc_curl_requests", foreignKey: "client_id"});
  yoc_donor.belongsTo(yoc_client, { as: "client", foreignKey: "client_id"});
  yoc_client.hasMany(yoc_donor, { as: "yoc_donors", foreignKey: "client_id"});
  yoc_donor_login.belongsTo(yoc_client, { as: "client", foreignKey: "client_id"});
  yoc_client.hasMany(yoc_donor_login, { as: "yoc_donor_logins", foreignKey: "client_id"});
  yoc_employer.belongsTo(yoc_client, { as: "client", foreignKey: "client_id"});
  yoc_client.hasMany(yoc_employer, { as: "yoc_employers", foreignKey: "client_id"});
  yoc_error_handling.belongsTo(yoc_client, { as: "client", foreignKey: "client_id"});
  yoc_client.hasMany(yoc_error_handling, { as: "yoc_error_handlings", foreignKey: "client_id"});
  yoc_fund.belongsTo(yoc_client, { as: "client", foreignKey: "client_id"});
  yoc_client.hasMany(yoc_fund, { as: "yoc_funds", foreignKey: "client_id"});
  yoc_fund_matching.belongsTo(yoc_client, { as: "client", foreignKey: "client_id"});
  yoc_client.hasMany(yoc_fund_matching, { as: "yoc_fund_matchings", foreignKey: "client_id"});
  yoc_g4_request.belongsTo(yoc_client, { as: "client", foreignKey: "client_id"});
  yoc_client.hasMany(yoc_g4_request, { as: "yoc_g4_requests", foreignKey: "client_id"});
  yoc_otp.belongsTo(yoc_client, { as: "client", foreignKey: "client_id"});
  yoc_client.hasMany(yoc_otp, { as: "yoc_otps", foreignKey: "client_id"});
  yoc_schedule.belongsTo(yoc_client, { as: "client", foreignKey: "client_id"});
  yoc_client.hasMany(yoc_schedule, { as: "yoc_schedules", foreignKey: "client_id"});
  yoc_sf_fund.belongsTo(yoc_client, { as: "client", foreignKey: "client_id"});
  yoc_client.hasMany(yoc_sf_fund, { as: "yoc_sf_funds", foreignKey: "client_id"});
  yoc_sf_relation.belongsTo(yoc_client, { as: "client", foreignKey: "client_id"});
  yoc_client.hasMany(yoc_sf_relation, { as: "yoc_sf_relations", foreignKey: "client_id"});
  yoc_transaction.belongsTo(yoc_client, { as: "client", foreignKey: "client_id"});
  yoc_client.hasMany(yoc_transaction, { as: "yoc_transactions", foreignKey: "client_id"});
  yoc_transaction_detail.belongsTo(yoc_client, { as: "client", foreignKey: "client_id"});
  yoc_client.hasMany(yoc_transaction_detail, { as: "yoc_transaction_details", foreignKey: "client_id"});
  yoc_transaction_holder.belongsTo(yoc_client, { as: "client", foreignKey: "client_id"});
  yoc_client.hasMany(yoc_transaction_holder, { as: "yoc_transaction_holders", foreignKey: "client_id"});
  yoc_user_client.belongsTo(yoc_client, { as: "client", foreignKey: "client_id"});
  yoc_client.hasMany(yoc_user_client, { as: "yoc_user_clients", foreignKey: "client_id"});
  yoc_user_history.belongsTo(yoc_client, { as: "client", foreignKey: "client_id"});
  yoc_client.hasMany(yoc_user_history, { as: "yoc_user_histories", foreignKey: "client_id"});
  yoc_user_client.belongsTo(yoc_user, { as: "user", foreignKey: "user_id"});
  yoc_user.hasMany(yoc_user_client, { as: "yoc_user_clients", foreignKey: "user_id"});
  yoc_user_role_permission.belongsTo(yoc_user_permission, { as: "permission", foreignKey: "permission_id"});
  yoc_user_permission.hasMany(yoc_user_role_permission, { as: "yoc_user_role_permissions", foreignKey: "permission_id"});
  yoc_user.belongsTo(yoc_user_role, { as: "role", foreignKey: "role_id"});
  yoc_user_role.hasMany(yoc_user, { as: "yoc_users", foreignKey: "role_id"});
  yoc_user_role_permission.belongsTo(yoc_user_role, { as: "role", foreignKey: "role_id"});
  yoc_user_role.hasMany(yoc_user_role_permission, { as: "yoc_user_role_permissions", foreignKey: "role_id"});

  return {
    yoc_abandoned_cart,
    yoc_amount,
    yoc_appeal,
    yoc_attribution_journey,
    yoc_capi,
    yoc_client,
    yoc_crm_hook,
    yoc_curl_request,
    yoc_donor,
    yoc_donor_login,
    yoc_employer,
    yoc_error_handling,
    yoc_error_log,
    yoc_fund,
    yoc_fund_matching,
    yoc_g4_request,
    yoc_otp,
    yoc_schedule,
    yoc_session,
    yoc_sf_fund,
    yoc_sf_relation,
    yoc_transaction,
    yoc_transaction_detail,
    yoc_transaction_holder,
    yoc_user,
    yoc_user_client,
    yoc_user_history,
    yoc_user_permission,
    yoc_user_role,
    yoc_user_role_permission,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
