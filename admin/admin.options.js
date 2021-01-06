const { default: AdminBro } = require('admin-bro');
const AdminBroMongoose = require('@admin-bro/mongoose');
AdminBro.registerAdapter(AdminBroMongoose);
const User =require('../models/User');
const options = {
  resources: [User],
 };

module.exports = options;