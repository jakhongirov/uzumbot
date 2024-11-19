const express = require("express")
const router = express.Router()

//Middlawares
const { AUTH } = require('../middleware/auth')
const { PAYME_CHECK_TOKEN, PAYME_ERROR } = require('../middleware/payme')
const FileUpload = require('../middleware/multer')

// files
const admin = require('./admin/admin')
const users = require('./users/users')
const payme = require('./payme/payme')
const click = require('./click/click')
const transaction = require('./transaction/transaction')

router

   // ADMIN API
   .get('/admin/list', AUTH, admin.GET_ADMIN)
   .post('/admin/register', admin.REGISTER_ADMIN)
   .post('/admin/login', admin.LOGIN_ADMIN)
   .put('/admin/edit', AUTH, admin.EDIT_ADMIN)
   .delete('/admin/delete', AUTH, admin.DELETE_ADMIN)

   // USERS
   .get('/users/list', AUTH, users.GET)
   .get('/user/:chat_id', AUTH, users.GET_ID)
   .get('/users/statistics', AUTH, users.USER_STATIS)
   .get('/users/statistics/source', AUTH, users.STATISTICS_SOURCE)
   .get('/users/statistics/increase', AUTH, users.STATISTICS_INCREASE)
   .get('/users/source/list', AUTH, users.GET_SOURCE)

   // PAYME
   .post('/payme', PAYME_CHECK_TOKEN, payme.PAYMENT)

   // CLICK
   .post('/click/prepare', click.Prepare)
   .post('/click/complete', click.Complete)

   // TRANSACTION
   .get('/transaction/click', AUTH, transaction.GET_CLICK)
   .get('/transaction/payme', AUTH, transaction.GET_PAYME)
   .get('/transaction/user/:chat_id', AUTH, transaction.GET_USER_ID)
   .get('/transaction/total/amount', AUTH, transaction.TOTAL_AMOUNT)
   .get('/transaction/click/:id', AUTH, transaction.GET_CLICK_TRANS_ID)
   .get('/transaction/payme/:id', AUTH, transaction.GET_PAYME_TRANS_ID)
   .get('/transaction/statistics/month', AUTH, transaction.GET_STATIS_MONTHS)
   .get('/transaction/statistics/increase', AUTH, transaction.GET_STATIS_INCREASE)

module.exports = router
