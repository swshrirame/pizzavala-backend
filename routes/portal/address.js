const express = require('express')
const db = require('../../db')
const utils = require('../../utils')

const router = express.Router()


router.get('/', (request, response) => {
    const statement = `select * from user_address where userId = ${request.userId}`
    db.query(statement, (error, data) => {
        response.send(utils.createResult(error, data))
    })
})

router.get('/:id', (request, response) => {
    const statement = `select * from user_address where id = ${request.id}`
    db.query(statement, (error, data) => {
        response.send(utils.createResult(error, data))
    })
})

router.post('/', (request, response) => {
    const { line1, line2, city, state, zipCode, title } = request.body
    const statement = `insert into user_address (line1, line2, city, state, zipCode, title, userId) values (
    '${line1}', '${line2}', '${city}', '${state}', '${zipCode}', '${title}', ${request.userId}
  )`
    db.query(statement, (error, data) => {
        response.send(utils.createResult(error, data))
    })
})

router.put('/:id', (request, response) => {
    const { id } = request.params
    const { line1, line2, city, state, zipCode, title } = request.body
    const statement = `update user_address set
      line1 = '${line1}', 
      line2 = '${line2}', 
      city = '${city}', 
      state = '${state}', 
      zipCode = '${zipCode}', 
      title = '${title}'
    where id = ${id}
  `
    db.query(statement, (error, data) => {
        response.send(utils.createResult(error, data))
    })
})

router.delete('/:id', (request, response) => {
    const { id } = request.params
    const statement = `delete from user_address where id = ${id}`
    db.query(statement, (error, data) => {
        response.send(utils.createResult(error, data))
    })
})

module.exports = router