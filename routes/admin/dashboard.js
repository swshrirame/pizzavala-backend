const express = require('express')
const db = require('../../db')
const utils = require('../../utils')

const router = express.Router()

router.get('/', (request, response) => {
    const statement = `select date(created_on) created_on, SUM(totalAmount) AS sale from userOrder  group by date(created_on)`
    db.query(statement, (error, data) => {
        response.send(utils.createResult(error, data))
    })
})

module.exports = router