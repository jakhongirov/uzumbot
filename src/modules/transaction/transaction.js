const model = require('./model')

module.exports = {
   GET_CLICK: async (req, res) => {
      try {
         const {
            limit,
            page
         } = req.query

         if (limit && page) {
            const clickTrans = await model.clickTrans(limit, page)

            if (clickTrans?.length > 0) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: clickTrans
               })
            } else {
               return res.status(404).json({
                  status: 404,
                  message: "Not found"
               })
            }
         } else {
            return res.status(400).json({
               status: 400,
               message: "Bad request"
            })
         }

      } catch (error) {
         console.log(error);
         return res.status(500).json({
            status: 500,
            message: "Interval Server Error"
         })
      }
   },

   GET_PAYME: async (req, res) => {
      try {
         const {
            limit,
            page
         } = req.query

         if (limit && page) {
            const paymeTrans = await model.paymeTrans(limit, page)

            if (paymeTrans?.length > 0) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: paymeTrans
               })
            } else {
               return res.status(404).json({
                  status: 404,
                  message: "Not found"
               })
            }
         } else {
            return res.status(400).json({
               status: 400,
               message: "Bad request"
            })
         }

      } catch (error) {
         console.log(error);
         return res.status(500).json({
            status: 500,
            message: "Interval Server Error"
         })
      }
   },

   GET_USER_ID: async (req, res) => {
      try {
         const { chat_id } = req.params
         const clickTransUserId = await model.clickTransUserId(chat_id)
         const paymeTransUserId = await model.paymeTransUserId(chat_id)

         if (clickTransUserId?.length > 0 || paymeTransUserId?.length > 0) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: {
                  click: clickTransUserId,
                  payme: paymeTransUserId
               }
            })
         } else {
            return res.status(404).json({
               status: 404,
               message: "Not found"
            })
         }

      } catch (error) {
         console.log(error);
         return res.status(500).json({
            status: 500,
            message: "Interval Server Error"
         })
      }
   },

   TOTAL_AMOUNT: async (req, res) => {
      try {
         const clickTotalAmount = await model.clickTotalAmount()
         const paymeTotalAmount = await model.paymeTotalAmount()
         const totalAmount = Number((clickTotalAmount?.sum * 100) + paymeTotalAmount)

         return res.status(200).json({
            status: 200,
            message: "Success",
            data: {
               click: clickTotalAmount,
               payme: totalAmount,
               total: totalAmount
            }
         })

      } catch (error) {
         console.log(error);
         return res.status(500).json({
            status: 500,
            message: "Interval Server Error"
         })
      }
   },

   GET_CLICK_TRANS_ID: async (req, res) => {
      try {
         const { id } = req.params
         const foundClickTrans = await model.foundClickTrans(id)

         if (foundClickTrans) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: foundClickTrans
            })
         } else {
            return res.status(404).json({
               status: 404,
               message: "Not found"
            })
         }

      } catch (error) {
         console.log(error);
         return res.status(500).json({
            status: 500,
            message: "Interval Server Error"
         })
      }
   },

   GET_PAYME_TRANS_ID: async (req, res) => {
      try {
         const { id } = req.params
         const foundPaymeTrans = await model.foundPaymeTrans(id)

         if (foundPaymeTrans) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: foundPaymeTrans
            })
         } else {
            return res.status(404).json({
               status: 404,
               message: "Not found"
            })
         }

      } catch (error) {
         console.log(error);
         return res.status(500).json({
            status: 500,
            message: "Interval Server Error"
         })
      }
   },

   GET_STATIS_MONTHS: async (req, res) => {
      try {
         const statisticsClickMonths = await model.statisticsClickMonths()
         const statisticsPaymeMonths = await model.statisticsPaymeMonths()

         return res.status(200).json({
            status: 200,
            message: "Success",
            data: {
               click: statisticsClickMonths,
               payme: statisticsPaymeMonths
            }
         })

      } catch (error) {
         console.log(error);
         return res.status(500).json({
            status: 500,
            message: "Interval Server Error"
         })
      }
   },

   GET_STATIS_INCREASE: async (req, res) => {
      try {
         const statisticsClickIncrease = await model.statisticsClickIncrease()
         const statisticsPaymeIncrease = await model.statisticsPaymeIncrease()

         return res.status(200).json({
            status: 200,
            message: "Success",
            data: {
               click: statisticsClickIncrease,
               payme: statisticsPaymeIncrease
            }
         })

      } catch (error) {
         console.log(error);
         return res.status(500).json({
            status: 500,
            message: "Interval Server Error"
         })
      }
   }
}