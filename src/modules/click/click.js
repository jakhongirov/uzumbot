const model = require('./model')
const iconv = require('iconv-lite');
const axios = require("axios")

module.exports = {
   Prepare: async (req, res) => {
      try {
         const { click_trans_id, amount, param2, merchant_trans_id, error, error_note } = req.body
         let code = '';

         console.log("click pr", req.body)

         const makeCode = (length) => {
            let characters = '0123456789';
            let charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
               code += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
         }

         if (error_note === 'Success') {
            await model.addTransaction(click_trans_id, amount, param2, merchant_trans_id, error, error_note, "prepare")
         }

         makeCode(4)

         return res.status(200).json({
            merchant_prepare_id: code,
            merchant_trans_id: merchant_trans_id,
            click_trans_id: click_trans_id,
            error: error,
            error_note: error_note
         })

      } catch (error) {
         console.log(error)
         res.status(500).json({
            status: 500,
            message: "Internal Server Error",
         })
      }
   },

   Complete: async (req, res) => {
      try {
         const { click_trans_id, merchant_trans_id, amount, param2, error, error_note } = req.body

         console.log("click cp", req.body)

         if (error_note === 'Success') {
            const foundTrans = await model.foundTrans(click_trans_id)
            const foundUser = await model.foundUser(foundTrans?.user_id)
            await model.editUserPaid(foundUser, "click")
            await model.editTrans(click_trans_id, 'paid')
         }

         return res.status(200).json({
            merchant_prepare_id: 5,
            merchant_trans_id: merchant_trans_id,
            click_trans_id: click_trans_id,
            merchant_confirm_id: null,
            error: error,
            error_note: error_note
         })
      } catch (error) {
         console.log(err)
         res.status(500).json({
            status: 500,
            message: "Internal Server Error",
         })
      }
   }
}