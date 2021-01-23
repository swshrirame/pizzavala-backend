const express = require('express')
const db = require('../../db')
const config = require('../../config')
const utils = require('../../utils')

const router = express.Router()

router.get('/', (request, response) => {
  const statement = `select id, firstName, lastName, email, phone, status from user`
  db.query(statement, (error, data) => {
    response.send(utils.createResult(error, data))
  })
})

router.put('/change-status/:id', (request, response) => {
  const {id} = request.params
  const {status} = request.body

  const statement = `update user set status = ${status} where id = ${id}`
  db.query(statement, (error, data) => {
    response.send(utils.createResult(error, data))
  })
})

module.exports = router