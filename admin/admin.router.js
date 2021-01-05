const {default : AdminBro}= require('admin-bro');
const { buildRouter } = require('@admin-bro/express');
const express = require('express');

const buildAdminRouter = (admin) => {
    const router = buildRouter(admin);
    return router;
};

module.exports = buildAdminRouter;