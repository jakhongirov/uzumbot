const {
   fetchALL,
   fetch
} = require('../../lib/postgres')

const clickTrans = (limit, page) => {
   const QUERY = `
      SELECT
         *
      FROM
         click
      ORDER BY
         id DESC
      LIMIT ${limit}
      OFFSET ${Number((page - 1) * limit)};
   `;

   return fetchALL(QUERY)
}
const paymeTrans = (limit, page) => {
   const QUERY = `
      SELECT
         *
      FROM
         payme
      ORDER BY
         id DESC
      LIMIT ${limit}
      OFFSET ${Number((page - 1) * limit)};
   `;

   return fetchALL(QUERY)
}
const clickTransUserId = (chat_id) => {
   const QUERY = `
      SELECT
         *
      FROM
         click
      WHERE
         user_id = $1;
   `;

   return fetchALL(QUERY, chat_id)
}
const paymeTransUserId = (chat_id) => {
   const QUERY = `
      SELECT
         *
      FROM
         payme
      WHERE
         user_id = $1;
   `;

   return fetchALL(QUERY, chat_id)
}
const clickTotalAmount = () => {
   const QUERY = `
      SELECT
         sum(amount)
      FROM
         click;
   `;

   return fetch(QUERY)
}
const paymeTotalAmount = () => {
   const QUERY = `
      SELECT
         sum(amount)
      FROM
         payme;
   `;

   return fetch(QUERY)
}
const foundClickTrans = (id) => {
   const QUERY = `
      SELECT
         *
      FROM
         click
      WHERE
         id = $1;
   `;

   return fetch(QUERY, id)
}
const foundPaymeTrans = (id) => {
   const QUERY = `
      SELECT
         *
      FROM
         payme
      WHERE
         id = $1;
   `;

   return fetch(QUERY, id)
}
const statisticsClickMonths = () => {
   const QUERY = `
      SELECT
         TO_CHAR(month, 'Month') AS month,
         COALESCE(SUM(c.amount), 0) AS total_amount
      FROM
         GENERATE_SERIES(
            DATE_TRUNC('year', CURRENT_DATE),
            DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '11 months',
            '1 month'
         ) AS month
      LEFT JOIN
         click c ON DATE_TRUNC('month', c.transaction_create_at) = month
      WHERE
         EXTRACT(YEAR FROM month) = EXTRACT(YEAR FROM CURRENT_DATE)
      GROUP BY
         month
      ORDER BY
         EXTRACT(MONTH FROM month);
   `;

   return fetchALL(QUERY)
}
const statisticsPaymeMonths = () => {
   const QUERY = `
      SELECT
         TO_CHAR(month, 'Month') AS month,
         COALESCE(SUM(c.amount), 0) AS total_amount
      FROM
         GENERATE_SERIES(
            DATE_TRUNC('year', CURRENT_DATE),
            DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '11 months',
            '1 month'
         ) AS month
      LEFT JOIN
         payme c ON DATE_TRUNC('month', c.transaction_create_at) = month
      WHERE
         EXTRACT(YEAR FROM month) = EXTRACT(YEAR FROM CURRENT_DATE)
      GROUP BY
         month
      ORDER BY
         EXTRACT(MONTH FROM month);
   `;

   return fetchALL(QUERY)
}
const statisticsClickIncrease = () => {
   const QUERY = `
      WITH monthly_totals AS (
         SELECT
            DATE_TRUNC('month', transaction_create_at) AS month,
            SUM(amount) AS total_amount,
            COUNT(DISTINCT user_id) AS user_count  -- Count unique user IDs per month
         FROM
            click
         GROUP BY
            DATE_TRUNC('month', transaction_create_at)
      ),
      all_months AS (
         SELECT
            DATE_TRUNC('month', generate_series) AS month
         FROM
            GENERATE_SERIES(
                  DATE_TRUNC('year', CURRENT_DATE),
                  DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '11 months',
                  '1 month'
            ) AS generate_series
      ),
      monthly_growth AS (
         SELECT
            all_months.month,
            COALESCE(mt.total_amount, 0) AS total_amount,
            COALESCE(mt.user_count, 0) AS user_count,  -- Use COALESCE to set missing counts to 0
            LAG(COALESCE(mt.total_amount, 0)) OVER (ORDER BY all_months.month) AS previous_total
         FROM
            all_months
         LEFT JOIN
            monthly_totals mt ON all_months.month = mt.month
      )
      SELECT
         TO_CHAR(month, 'Month') AS month,
         total_amount,
         user_count,  -- Display the count of unique users
         CASE
            WHEN previous_total = 0 OR total_amount = 0 THEN NULL
            ELSE ROUND(((total_amount - previous_total) * 100.0 / previous_total), 2)
         END AS percentage_increase
      FROM
         monthly_growth
      ORDER BY
         EXTRACT(MONTH FROM month);
   `;

   return fetchALL(QUERY)
}
const statisticsPaymeIncrease = () => {
   const QUERY = `
      WITH monthly_totals AS (
         SELECT
            DATE_TRUNC('month', transaction_create_at) AS month,
            SUM(amount) AS total_amount,
            COUNT(DISTINCT user_id) AS user_count  -- Count unique user IDs per month
         FROM
            payme
         GROUP BY
            DATE_TRUNC('month', transaction_create_at)
      ),
      all_months AS (
         SELECT
            DATE_TRUNC('month', generate_series) AS month
         FROM
            GENERATE_SERIES(
                  DATE_TRUNC('year', CURRENT_DATE),
                  DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '11 months',
                  '1 month'
            ) AS generate_series
      ),
      monthly_growth AS (
         SELECT
            all_months.month,
            COALESCE(mt.total_amount, 0) AS total_amount,
            COALESCE(mt.user_count, 0) AS user_count,  -- Use COALESCE to set missing counts to 0
            LAG(COALESCE(mt.total_amount, 0)) OVER (ORDER BY all_months.month) AS previous_total
         FROM
            all_months
         LEFT JOIN
            monthly_totals mt ON all_months.month = mt.month
      )
      SELECT
         TO_CHAR(month, 'Month') AS month,
         total_amount,
         user_count,  -- Display the count of unique users
         CASE
            WHEN previous_total = 0 OR total_amount = 0 THEN NULL
            ELSE ROUND(((total_amount - previous_total) * 100.0 / previous_total), 2)
         END AS percentage_increase
      FROM
         monthly_growth
      ORDER BY
         EXTRACT(MONTH FROM month);
   `;

   return fetchALL(QUERY)
}

module.exports = {
   clickTrans,
   paymeTrans,
   clickTransUserId,
   paymeTransUserId,
   clickTotalAmount,
   paymeTotalAmount,
   foundClickTrans,
   foundPaymeTrans,
   statisticsClickMonths,
   statisticsPaymeMonths,
   statisticsClickIncrease,
   statisticsPaymeIncrease
}