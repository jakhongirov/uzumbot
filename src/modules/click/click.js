const model = require('./model')
const iconv = require('iconv-lite');
const axios = require("axios")
const fs = require('fs')
const { bot } = require('../../lib/bot')
const { getDate } = require('../../lib/functions')
const lessons = require('../../../lessons.json')
const localText = require('../../text/text.json')

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
            const editUserPaid = await model.editUserPaid(foundUser, "click")
            await model.editTrans(click_trans_id, 'paid')

            if (editUserPaid) {
               const foundLesson = lessons.find(e => e.order == Number(editUserPaid?.lesson + 1))

               bot.sendPhoto(editUserPaid?.chat_id, fs.readFileSync(foundLesson.path), {
                  reply_markup: {
                     keyboard: [
                        [{
                           text: localText.channelBtn,
                        }],
                        [{
                           text: localText.contactAdminBtn,
                        }],
                     ],
                     resize_keyboard: true
                  },
                  caption: foundLesson.title
               }).then(async () => {
                  const nextLessonDate = getDate()
                  await model.editLesson(editUserPaid?.chat_id, nextLessonDate, lessonOrder)
                  await model.editStep(editUserPaid?.chat_id, `lesson_${lessonOrder}`)
                  await model.addLike(editUserPaid?.chat_id, 1)
               }).catch(e => console.log(e))
            }
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