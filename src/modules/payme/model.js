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

module.exports = {
   foundUser,
   foundTransaction,
   updateTransaction,
   addTransaction,
   updateTransactionPerform,
   updateTransactionPaid,
   editUserPaid,
   updateTransactionState
}