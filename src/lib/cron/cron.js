const model = require('./model')
const lessons = require('../../../lessons.json')
const localText = require('../../text/text.json')
const {
   bot
} = require('../bot')

const sendLessons = async () => {
   const users = await model.usersList()
   console.log("users", users)

   for (const user of users) {
      const foundLesson = lessons?.find(e => e.order == Number(user.lesson + 1))

      if (user?.lesson == 2 || user?.lesson == 4) {
         bot.sendMessage(user?.chat_id, localText.questionAboutLesson, {
            reply_markup: {
               inline_keyboard: [
                  [{
                     text: localText.likeBtn,
                     callback_data: `like_${foundLesson.id}`
                  }],
                  [{
                     text: localText.dislikeBtn,
                     callback_data: `dislike_${foundLesson.id}`
                  }]
               ]
            }
         })
      } else {
         if (foundLesson?.free) {
            bot.sendMessage(user.chat_id, localText.nextLessonText, {
               reply_markup: {
                  inline_keyboard: [
                     [{
                        text: `${foundLesson?.order}${localText.nextLessonBtn}`,
                        callback_data: `lesson_${foundLesson?.order}`
                     }]
                  ]
               }
            }).then(async () => {
               await model.editStep(user.chat_id, "ask_new_lesson")
            })
         } else {
            if (user?.pay_status) {
               bot.sendMessage(user.chat_id, `${foundLesson?.text}`, {
                  reply_markup: {
                     inline_keyboard: [
                        [{
                           text: `${foundLesson?.order}${localText.nextLessonBtn}`,
                           callback_data: `lesson_${foundLesson?.order}`
                        }]
                     ]
                  }
               }).then(async () => {
                  await model.editStep(user.chat_id, "ask_new_lesson")
               })
            } else {
               bot.sendMessage(user.chat_id, `${localText.payText}`, {
                  reply_markup: {
                     inline_keyboard: [
                        [{
                           text: `${localText.payBtn}`,
                           callback_data: `start_pay`
                        }]
                     ]
                  }
               }).then(async () => {
                  await model.editStep(user.chat_id, "ask_pay")
               })
            }
         }
      }

   }
}

module.exports = {
   sendLessons
}