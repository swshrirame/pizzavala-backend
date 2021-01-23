const express = require('express')
const db = require('../../db')
const config = require('../../config')
const utils = require('../../utils')

const router = express.Router()

router.get('/', (request, response) => {
    const statement = `select userOrder.*, CONCAT(user.firstName, ' ', user.lastName) as name, user.id AS userId from userOrder INNER JOIN user ON userOrder.userId = user.id`
    db.query(statement, (error, data) => {
        response.send(utils.createResult(error, data))
    })
})

router.put('/update-status/:id', (request, response) => {
    const { id } = request.params
    const { status } = request.body

    const statement = `update userOrder set orderState = ${status} where id = ${id}`
    db.query(statement, (error, data) => {
        response.send(utils.createResult(error, data))
    })
})

router.get('/:userId/:id', (request, response) => {
    const { userId, id } = request.params
    const statement = `select userOrderDetails.*, userOrder.totalAmount AS grandTotal, pizza.title 
    from userOrderDetails INNER JOIN userOrder 
    ON userOrderDetails.orderId = userOrder.id INNER JOIN pizza 
    ON userOrderDetails.pizzaId = pizza.id where userOrder.userId = ${userId} AND userOrder.id = ${id}
  `
    db.query(statement, (error, data) => {
        response.send(utils.createResult(error, data))
    })
})

module.exports = router