const {
   fetch,
   fetchALL
} = require('../postgres')

const usersList = () => {
   const QUERY = `
      SELECT 
         *
      FROM 
         users
      WHERE 
         lesson_date::timestamptz BETWEEN (NOW() - INTERVAL '30 minutes') AND (NOW() - INTERVAL '29 minutes')
         AND lesson != 9; 
   `;

   return fetchALL(QUERY)
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

module.exports = {
   usersList,
   editStep
}