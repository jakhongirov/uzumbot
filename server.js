require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require('path');
const fs = require('fs');
const app = express();
const localText = require('./src/text/text.json');
const lessons = require('./lessons.json');
const {
   bot
} = require('./src/lib/bot');
const model = require('./model');
const {
   CronJob
} = require('cron');
const {
   sendLessons
} = require('./src/lib/cron/cron');
const {
   getDate
} = require('./src/lib/functions')

const publicFolderPath = path.join(__dirname, 'public');
const imagesFolderPath = path.join(publicFolderPath, 'images');

if (!fs.existsSync(publicFolderPath)) {
   fs.mkdirSync(publicFolderPath);
   console.log('Public folder created successfully.');
} else {
   console.log('Public folder already exists.');
}

if (!fs.existsSync(imagesFolderPath)) {
   fs.mkdirSync(imagesFolderPath);
   console.log('Images folder created successfully.');
} else {
   console.log('Images folder already exists within the public folder.');
}

bot.onText(/\/start ?(.*)?/, async (msg, match) => {
   const chatId = msg.chat.id;
   const param = match[1]?.trim();
   const foundUser = await model.foundUser(chatId)

   if (foundUser) {
      if (foundUser?.lesson == 0 && !foundUser?.phone_number) {
         bot.sendMessage(chatId, localText.sendContact, {
            reply_markup: {
               keyboard: [
                  [{
                     text: localText.sendContactBtn,
                     request_contact: true,
                     one_time_keyboard: true
                  }]
               ],
               resize_keyboard: true
            }
         }).then(async () => {
            await model.editStep(chatId, 'register')
         }).catch(e => console.log(e))
      } else if (foundUser?.lesson > 0) {
         const foundLesson = lessons.find(e => e.order == foundUser?.lesson)

         bot.sendPhoto(chatId, fs.readFileSync(foundLesson.path), {
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
            await model.editStep(chatId, `lesson_${foundUser?.lesson}`)
         }).catch(e => console.log(e))
      }
   } else {
      bot.sendMessage(chatId, localText.startTextFromBot, {
         reply_markup: {
            inline_keyboard: [
               [{
                  text: localText?.ofertaLink,
                  web_app: {
                     url: `https://google.com`
                  }
               }],
               [{
                  text: localText?.startLessonBtn,
                  callback_data: "start_lesson"
               }]
            ]
         }
      }).then(async () => {
         await model.createUser(
            chatId,
            "start",
            param ? param : "organic"
         )
      })
   }
})

bot.on('contact', async (msg) => {
   const chatId = msg.chat.id;
   const foundUser = await model.foundUser(chatId)

   if (msg.contact && foundUser?.step == "register") {
      let phoneNumber = msg.contact.phone_number;
      let name = msg.contact.first_name;

      if (msg.contact.user_id !== msg.from.id) {
         return bot.sendMessage(chatId, localText.contactRegisterError, {
            reply_markup: {
               keyboard: [
                  [{
                     text: buttonText,
                     request_contact: true
                  }]
               ],
               resize_keyboard: true,
               one_time_keyboard: true
            }
         })
      }

      if (!phoneNumber.startsWith('+')) {
         phoneNumber = `+${phoneNumber}`;
      }

      const addPhoneUser = await model.addPhoneUser(chatId, phoneNumber, name)

      if (addPhoneUser) {
         const foundLesson = lessons.find(e => e.order == 1)

         bot.sendPhoto(chatId, fs.readFileSync(foundLesson.path), {
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
            await model.editLesson(chatId, nextLessonDate, 1)
            await model.editStep(chatId, 'lesson_1')
         }).catch(e => console.log(e))
      }
   }
})

bot.on('callback_query', async (msg) => {
   const chatId = msg.message.chat.id;
   const data = msg.data;
   const foundUser = await model.foundUser(chatId)

   if (data == "start_lesson") {
      bot.sendMessage(chatId, localText.sendContact, {
         reply_markup: {
            keyboard: [
               [{
                  text: localText.sendContactBtn,
                  request_contact: true,
                  one_time_keyboard: true
               }]
            ],
            resize_keyboard: true
         }
      }).then(async () => {
         await model.editStep(chatId, 'register')
      }).catch(e => console.log(e))
   } else if (data.startsWith('lesson_')) {
      const lessonOrder = data?.split('lesson_')[1]
      const foundLesson = lessons.find(e => e.order == lessonOrder)

      bot.sendPhoto(chatId, fs.readFileSync(foundLesson.path), {
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
         await model.editLesson(chatId, nextLessonDate, lessonOrder)
         await model.editStep(chatId, `lesson_${lessonOrder}`)
      }).catch(e => console.log(e))
   } else if (data.startsWith('like_')) {
      const lessonOrder = data?.split('like_')[1]
      const foundLesson = lessons.find(e => e.order == lessonOrder)

      if (lessonOrder == 5) {
         bot.sendMessage(chatId, localText.networkGroup)
      }

      bot.sendPhoto(chatId, fs.readFileSync(foundLesson.path), {
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
         await model.editLesson(chatId, nextLessonDate, lessonOrder)
         await model.editStep(chatId, `lesson_${lessonOrder}`)
         await model.addLike(chatId, 1)
      }).catch(e => console.log(e))

   } else if (data.startsWith('dislike_')) {
      const lessonOrder = data?.split('dislike_')[1]
      const foundLesson = lessons.find(e => e.order == lessonOrder)

      if (lessonOrder == 5) {
         bot.sendMessage(chatId, localText.networkGroup)
      }

      bot.sendPhoto(chatId, fs.readFileSync(foundLesson.path), {
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
         await model.editLesson(chatId, nextLessonDate, lessonOrder)
         await model.editStep(chatId, `lesson_${lessonOrder}`)
         await model.addLike(chatId, 2)
      }).catch(e => console.log(e))

   } else if (data == 'start_pay') {
      bot.sendMessage(chatId, localText.payText2, {
         reply_markup: {
            inline_keyboard: [
               [{
                  text: localText.payment_type,
                  callback_data: "click"
               }],
               [{
                  text: localText.payment_type2,
                  callback_data: "payme"
               }],
            ]
         }
      })
   }
})

bot.on('message', async (msg) => {
   const chatId = msg.chat.id;
   const text = msg.text;
   const foundUser = await model.foundUser(Number(chatId))

   if (text == localText.channelBtn) {
      bot.sendMessage(chatId, localText.channelLinkText).then(async () => {
         await model.editStep(chatId, "channel_join")
      })
   } else if (text == localText.contactAdminBtn) {
      bot.sendMessage(chatId, localText.contactAdminText, {
         reply_markup: {
            keyboard: [
               [{
                  text: localText.backBtn
               }]
            ],
            resize_keyboard: true
         }
      }).then(async () => {
         await model.editStep(chatId, "contact_admin")
      })
   } else if (text == localText.backBtn) {
      if (foundUser?.step == "contact_admin") {
         bot.sendMessage(chatId, localText.menuText, {
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
            }
         })
      }
   }
})

app.use(cors({
   origin: "*"
}));
app.use(express.json());
app.use(express.urlencoded({
   extended: true
}));
app.use('/public', express.static(path.resolve(__dirname, 'public')))
// app.use("/api/v1", router);

// Job that runs every 2 minutes
const job = new CronJob('*/1 * * * *', async () => {
   await sendLessons()
});

// Start the job
job.start();

app.listen(8000, console.log(8000))