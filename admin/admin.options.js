const { default: AdminBro } = require('admin-bro');
const AdminBroMongoose = require('@admin-bro/mongoose');
AdminBro.registerAdapter(AdminBroMongoose);
const User =require('../models/User');
const Topic =require('../models/Topic');
const Question =require('../models/Question');

const options = {
  resources: [User,Topic,Question],
 };

module.exports = options;