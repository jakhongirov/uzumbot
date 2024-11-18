const {
   fetch,
   fetchALL
} = require('./src/lib/postgres')

const foundUser = (chatId) => {
   const QUERY = `
      SELECT
         *
      FROM
         users
      WHERE
         chat_id = $1;
   `;

   return fetch(QUERY, chatId)
}
const editStep = (chatId, step) => {
   const QUERY = `
      UPDATE
         users
      SET
         step = $2
      WHERE
         chat_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, chatId, step)
}
const createUser = (
   chatId,
   step,
   param
) => {
   const QUERY = `
      INSERT INTO
         users (
            chat_id,
            step,
            source
         ) VALUES (
            $1, 
            $2, 
            $3 
         ) RETURNING *;
   `;

   return fetch(QUERY, chatId, step, param)
}
const addPhoneUser = (chatId, phoneNumber, name) => {
   const QUERY = `
      UPDATE
         users
      SET
         phone_number = $2,
         name = $3
      WHERE
         chat_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, chatId, phoneNumber, name)
}
const editLesson = (chatId, nextLessonDate, lesson) => {
   const QUERY = `
      UPDATE
         users
      SET
         lesson_date = $2,
         lesson = $3
      WHERE
         chat_id = $1
      RETURNING *;
   `

   return fetch(QUERY, chatId, nextLessonDate, lesson)
}
const addLike = (chatId, action) => {
   const QUERY = `
      INSERT INTO 
         actions (
            user_id,
            action
         ) VALUES (
            $1, 
            $2 
         ) RETURNING *;
   `;

   return fetch(QUERY, chatId, action)
}

module.exports = {
   foundUser,
   editStep,
   createUser,
   addPhoneUser,
   editLesson,
   addLike
}