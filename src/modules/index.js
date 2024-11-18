const express = require("express")
const router = express.Router()

//Middlawares
const { AUTH } = require('../middleware/auth')
const { PAYME_CHECK_TOKEN, PAYME_ERROR } = require('../middleware/payme')
const FileUpload = require('../middleware/multer')

// files
const admin = require('./admin/admin')
const payme = require('./payme/payme')
const click = require('./click/click')

router

   // ADMIN API
   .get('/admin/list', AUTH, admin.GET_ADMIN)
   .post('/admin/register', admin.REGISTER_ADMIN)
   .post('/admin/login', admin.LOGIN_ADMIN)
   .put('/admin/edit', AUTH, admin.EDIT_ADMIN)
   .delete('/admin/delete', AUTH, admin.DELETE_ADMIN)

   // PAYME
   .post('/payme', PAYME_CHECK_TOKEN, payme.PAYMENT)
   
   // CLICK
   .post('/click/prepare', click.Prepare)
   .post('/click/complete', click.Complete)

module.exports = router
