const express = require('express')
const db = require('../../db')
const utils = require('../../utils')
const fs = require('fs')

const router = express.Router()

router.get('/details/:id', (request, response) => {
    const { id } = request.params
    const statement = `
    select pizza.*, category.title as categoryTitle
    from pizza 
      inner join category on category.id = pizza.categoryId
    where pizza.id = ${id}`
    db.query(statement, (error, pizzas) => {

        // the pizzas is an array
        // this is a where clause checking the id 
        // (whcich will return only one record..)
        response.send(utils.createResult(error, pizzas[0]))
    })
})

router.get('/', (request, response) => {
    const statement = `
    select pizza.*, category.title as categoryTitle
    from pizza 
      inner join category on category.id = pizza.categoryId`
    db.query(statement, (error, data) => {
        response.send(utils.createResult(error, data))
    })
})

router.get('/search/:text', (request, response) => {
    const { text } = request.params
    const statement = `
    select pizza.*, category.title as categoryTitle
      from pizza 
        inner join category on category.id = pizza.categoryId
    where pizza.title like '%${text}%' or category.description like '%${text}%'`
    db.query(statement, (error, data) => {
        response.send(utils.createResult(error, data))
    })
})

// router.post('/filter', (request, response) => {
//   const {categoryId, brandId} = request.body

//   let categoryClause = ''
//   let brandClause = ''

//   // categoryId == 0: all categories
//   // brandId == 0: all brands

//   if (categoryId != 0) { categoryClause = ` pizza.categoryId = ${categoryId} ` }
//   if (brandId != 0) { brandClause = ` pizza.brandId = ${brandId} ` }

//   let whereClause = ''
//   if ((categoryClause.length > 0) || (brandClause.length > 0)) {
//     whereClause = categoryClause

//     if (brandClause.length > 0) {
//       // for anding the result of category and brand
//       if (whereClause.length > 0) { whereClause += ' and ' }
//       whereClause += brandClause
//     }

//     whereClause = ' where ' + whereClause
//   } 

//   const statement = `
//     select pizza.*, category.title as categoryTitle, brand.title as brandTitle 
//       from pizza 
//         inner join brand on pizza.brandId = brand.id 
//         inner join category on category.id = pizza.categoryId
//     ${whereClause}`

//   console.log(statement)

//   db.query(statement, (error, data) => {
//     response.send(utils.createResult(error, data))
//   })
// })

router.post('/filter', (request, response) => {
    const { categoryId } = request.body

    let categoryClause = ''

    // categoryId == 0: all categories

    if (categoryId != 0) { categoryClause = ` pizza.categoryId = ${categoryId} ` }

    let whereClause = ''
    if (categoryClause.length > 0) {
        whereClause = categoryClause

        whereClause = ' where ' + whereClause
    }

    const statement = `
    select pizza.*, category.title as categoryTitle
    from pizza 
        inner join category on category.id = pizza.categoryId
    ${whereClause}`

    console.log(statement)

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

module.exports = router
