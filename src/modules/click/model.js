const { fetch, fetchALL } = require('../../lib/postgres')

const foundUser = async (id) => {
   const QUERY = `
     SELECT
       *
     FROM
       users
     WHERE
       chat_id = $1;
   `;

   return await fetch(QUERY, id);
}
const editUserPaid = (user_id, payment_type) => {
   const QUERY = `
      UPDATE
         users
      SET
         pay_status = true,
         pay_type = $2
      WHERE
         chat_id = $1
      RETURNING *;
   `;

   return fetchALL(QUERY, user_id, payment_type)
}

const addTransaction = (
   click_trans_id,
   amount,
   param2,
   merchant_trans_id,
   error,
   error_note,
   status
) => {
   const QUERY = `
      INSERT INTO
         click (
            click_id,
            amount,
            user_id,
            merchant_id,
            error,
            error_note,
            status
         ) VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7
         ) RETURNING *;
   `;

   return fetch(
      QUERY,
      click_trans_id,
      amount,
      param2,
      merchant_trans_id,
      error,
      error_note,
      status
   )
}
const foundTrans = (click_trans_id) => {
   const QUERY = `
      SELECT
         *
      FROM
         click
      WHERE
         click_id = $1;
   `;

   return fetch(QUERY, click_trans_id)
}
const editTrans = (click_trans_id, status) => {
   const QUERY = `
      UPDATE
         click
      SET
         status = $2
      WHERE
         click_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, click_trans_id, status)
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
   editUserPaid,
   addTransaction,
   foundTrans,
   editTrans,
   editStep,
   editLesson,
   addLike
}