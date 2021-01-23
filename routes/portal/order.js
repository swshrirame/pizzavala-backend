const express = require('express')
const utils = require('../../utils')
const mysql2 = require('mysql2/promise')
const db = require('../../db')

const router = express.Router()

const pool = mysql2.createPool({
    host: 'localhost',
    user: 'root',
    password: 'manager',
    database: 'pizzavala',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

router.get('/', (request, response) => {
    const statement = `select * from userOrder where userId = ${request.userId}`
    db.query(statement, (error, data) => {
        response.send(utils.createResult(error, data))
    })
})

router.delete('/cancel/:id', (request, response) => {
    const { id } = request.params
    const statement = `update userOrder set orderState = 6 where id = ${id}`
    db.query(statement, (error, data) => {
        response.send(utils.createResult(error, data))
    })
})

router.post('/', (request, response) => {

    (async() => {

        const { addressId } = request.body

        // step 1: get the cart items
        const [items] = await pool.query(`select * from cart where userId = ${request.userId}`)

        let totalAmount = 0
        for (let index = 0; index < items.length; index++) {
            const item = items[index];
            totalAmount += (item.price * item.quantity)
        }

        // step 2: insert the order main details in userOrder table
        const statement = `insert into userOrder (userId, totalAmount, addressId) values (
      ${request.userId}, ${totalAmount}, ${addressId}
    )`
        const [result] = await pool.query(statement)

        // the insert Id of newly inserted order main details will be 
        // used as orderId in the userOrderDetails table
        const orderId = result.insertId

        // step 3: insert the order pizza details in userOrderDetails table
        for (let index = 0; index < items.length; index++) {
            const pizza = items[index];
            const insertOrderDetailsStatement = `
        insert into userOrderDetails (orderId, pizzaId, price, quantity, totalAmount) values (
          ${orderId}, ${pizza.pizzaId}, ${pizza.price}, ${pizza.quantity}, ${pizza.price * pizza.quantity}
        )
      `
            await pool.query(insertOrderDetailsStatement)
        }

        // step 4: remove the cart items
        await pool.query(`delete from cart where userId = ${request.userId}`)

        response.send({ status: 'success' })
    })()

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