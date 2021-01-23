const express = require('express')
const db = require('../../db')
const config = require('../../config')
const utils = require('../../utils')

const router = express.Router()

router.get('/', (request, response) => {
    const statement = `select userOrder.*, CONCAT(user.firstName, ' ', user.lastName) as name, user.id AS userId, user.phone, user_address.title, user_address.line1, user_address.line2, user_address.city, user_address.zipCode from userOrder INNER JOIN user ON userOrder.userId = user.id INNER JOIN user_address ON user_address.id = userOrder.addressId`
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

module.exports = router