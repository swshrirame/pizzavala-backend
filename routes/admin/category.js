const express = require('express')
const db = require('../../db')
const utils = require('../../utils')

const router = express.Router()

router.get('/', (request, response) => {
  const statement = `select id, title, description from category`
  db.query(statement, (error, data) => {
    response.send(utils.createResult(error, data))
  })
})

router.post('/', (request, response) => {
  const {title, description} = request.body
  const statement = `insert into category (title, description) values (
    '${title}', '${description}'
  )`
  db.query(statement, (error, data) => {
    response.send(utils.createResult(error, data))
  })
})

router.put('/:id', (request, response) => {
  const {id} = request.params
  const {title, description} = request.body
  const statement = `update category set title = '${title}', description = '${description}' 
    where id = ${id}`
  db.query(statement, (error, data) => {
    response.send(utils.createResult(error, data))
  })
})

router.delete('/:id', (request, response) => {
  const {id} = request.params
  const statement = `delete from category where id = ${id}`
  db.query(statement, (error, data) => {
    response.send(utils.createResult(error, data))
  })
})



module.exports = router