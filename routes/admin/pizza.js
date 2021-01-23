const express = require('express')
const db = require('../../db')
const utils = require('../../utils')
const multer = require('multer')
const upload = multer({ dest: 'images/' })
const fs = require('fs')

const router = express.Router()

router.get('/', (request, response) => {
    const statement = `select pizza.*, category.title as categoryTitle
        from pizza 
        inner join category on category.id = pizza.categoryId`
    db.query(statement, (error, data) => {
        response.send(utils.createResult(error, data))
    })
})

router.get('/image/:filename', (request, response) => {
    const { filename } = request.params
    const path = __dirname + '/../../images/' + filename
    const data = fs.readFileSync(path)
    response.send(data)
})

router.post('/', upload.single('photo'), (request, response) => {
    const { title, description, categoryId, price } = request.body
    const statement = `insert into pizza (title, description, categoryId, price, imageFile) values (
    '${title}', '${description}', '${categoryId}', '${price}', '${request.file.filename}'
  )`
    db.query(statement, (error, data) => {
        response.send(utils.createResult(error, data))
    })
})

router.put('/:id', (request, response) => {
    const { id } = request.params
    const { title, description, categoryId, price } = request.body
    const statement = `update pizza 
    set title = '${title}', 
        description = '${description}',
        categoryId = '${categoryId}',
        price = '${price}'
    where id = ${id}`
    db.query(statement, (error, data) => {
        response.send(utils.createResult(error, data))
    })
})

router.delete('/:id', (request, response) => {
    const { id } = request.params
    const statement = `delete from pizza where id = ${id}`
    db.query(statement, (error, data) => {
        response.send(utils.createResult(error, data))
    })
})


module.exports = router