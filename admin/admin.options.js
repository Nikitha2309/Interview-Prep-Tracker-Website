const { default: AdminBro } = require('admin-bro');
const AdminBroMongoose = require('@admin-bro/mongoose');
AdminBro.registerAdapter(AdminBroMongoose);
const User =require('../models/User');
const Topic =require('../models/Topic');
const Question =require('../models/Question');
const {adminOptions} = require('../models/Admin');

const options = {
  resources: [adminOptions,User,Topic,Question],
 };

module.exports = options;