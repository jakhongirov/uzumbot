const { fetch, fetchALL } = require('../../lib/postgres')

const foundUser = (user_id) => {
   const QUERY = `
      SELECT
         *
      FROM
         users
      WHERE
         chat_id = $1
   `;

   return fetch(QUERY, user_id)
}
const foundTransaction = (id) => {
   const QUERY = `
      SELECT
         *
      FROM
         payme
      WHERE
         transaction = $1;
   `;

   return fetch(QUERY, id)
};
const updateTransaction = (id, state, reason) => {
   const QUERY = `
      UPDATE
         payme
      SET
         state = $2,
         reason = $3
      WHERE
         transaction = $1
      RETURNING *;
   `;

   return fetch(QUERY, id, state, reason)
}
const addTransaction = (
   user_id,
   state,
   amount,
   id,
   time
) => {
   const QUERY = `
      INSERT INTO
         payme (
            user_id,
            state,
            amount,
            transaction,
            create_time
         ) VALUES (
            $1,
            $2,
            $3,
            $4,
            $5
         ) RETURNING *;
   `;

   return fetch(
      QUERY,
      user_id,
      state,
      amount,
      id,
      time
   )
};
const updateTransactionPerform = (
   id,
   state,
   reason,
   currentTime
) => {
   const QUERY = `
      UPDATE
         payme
      SET
         state = $2,
         reason = $3,
         cancel_time = $4
      WHERE
         transaction = $1
      RETURNING *;
   `;

   return fetch(
      QUERY,
      id,
      state,
      reason,
      currentTime
   )
}
const updateTransactionPaid = (
   id,
   state,
   currentTime
) => {
   const QUERY = `
      UPDATE
         payme
      SET
         state = $2,
         perform_time = $3
      WHERE
         transaction = $1
      RETURNING *;
   `;

   return fetch(
      QUERY,
      id,
      state,
      currentTime
   )
}
const editUserPaid = (user_id, payment) => {
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

   return fetch(QUERY, user_id, payment)
}
const updateTransactionState = (
   id,
   state,
   reason,
   currentTime
) => {
   const QUERY = `
      UPDATE
         payme
      SET
         state = $2,
         reason = $3,
         cancel_time = $4
      WHERE
         transaction = $1
      RETURNING *;
   `;

   return fetch(
      QUERY,
      id,
      state,
      reason,
      currentTime
   )
};
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
   foundTransaction,
   updateTransaction,
   addTransaction,
   updateTransactionPerform,
   updateTransactionPaid,
   editUserPaid,
   updateTransactionState,
   editStep,
   editLesson,
   addLike
}