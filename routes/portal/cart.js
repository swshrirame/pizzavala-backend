const express = require('express')
const db = require('../../db')
const utils = require('../../utils')

const router = express.Router()

router.get('/', (request, response) => {
    const statement = `
      select cart.*, pizza.imageFile, pizza.title, pizza.description from cart 
        inner join pizza on cart.pizzaId = pizza.id
      where userId = ${request.userId}`
    db.query(statement, (error, data) => {
        response.send(utils.createResult(error, data))
    })
})

router.post('/', (request, response) => {
    const { pizzaId, price, quantity } = request.body
    const statement = `insert into cart (userId, pizzaId, price, quantity) values (
    ${request.userId}, ${pizzaId}, ${price}, ${quantity}
  )`
    db.query(statement, (error, data) => {
        response.send(utils.createResult(error, data))
    })
})

router.put('/:id', (request, response) => {
    const { id } = request.params
    const { quantity } = request.body
    const statement = `update cart set
      quantity =  ${quantity}
    where id = ${id}
    `
    db.query(statement, (error, data) => {
        response.send(utils.createResult(error, data))
    })
})

router.delete('/:id', (request, response) => {
    const { id } = request.params
    const statement = `delete from cart where id = ${id}`
    db.query(statement, (error, data) => {
        response.send(utils.createResult(error, data))
    })
})

module.exports = router