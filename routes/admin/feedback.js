const express = require('express')
const db = require('../../db')
const utils = require('../../utils')

const router = express.Router()

router.get('/', (request, response) => {
    const statement = `select pizzaReviews.*, pizza.title from pizzaReviews INNER JOIN pizza ON pizzaReviews.pizzaId = pizza.id`
    db.query(statement, (error, data) => {
        response.send(utils.createResult(error, data))
    })
})

module.exports = router