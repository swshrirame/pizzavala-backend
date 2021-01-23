const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const utils = require('./utils')
const jwt = require('jsonwebtoken')
const config = require('./config')
const morgan = require('morgan')

// routers
const routeAdmins = require('./routes/admin/admins')
const routePizza = require('./routes/admin/pizza')
const routeCategory = require('./routes/admin/category')
const routeOrder = require('./routes/admin/order')
const routeUser = require('./routes/admin/user')
const routeFeedback = require('./routes/admin/feedback')
const routeDashboard = require('./routes/admin/dashboard')
const routeDeliveryBoy = require('./routes/admin/delivery_boy')


const app = express()

// for json type data
app.use(bodyParser.json())

// for url encoded type data (image in the pizza)
app.use(bodyParser.urlencoded())

app.use(cors('*'))
app.use(morgan('combined'))

// middleware to check if the request has received with 
// a valid and verified token
// scenario 1: token is missing: send 401
// scenario 2: token is invalid: send 401
// scenario 3: token is valid and verified: call the next()
function authorizeUser(request, response, next) {
    // token will not be available for signin, signup and activate urls
    if (
        (request.url == '/admins/signin') ||
        (request.url.startsWith('/pizza/image'))
    ) {
        // no token is required for these APIs
        next()
    } else {

        // all these APIs require the token
        const token = request.headers['token']
        if (!token) {

            // do not call next() as the user id is missing

            // token is missing
            response.status(401)
            response.send(utils.createResult('token is missing'))
        } else {

            // token is sent in the headers
            try {
                // verify the token and get the id
                const data = jwt.verify(token, config.secret)

                // add the user id in the request object
                // so that we can share this in all the APIs
                request.userId = data.id

                // go to the next function
                next()

            } catch (ex) {

                // do not call next() as the user id is missing
                response.status(401)
                response.send(utils.createResult('invalid token'))
            }
        }
    }
}

app.use(authorizeUser)

// add routes
app.use('/admins', routeAdmins)
app.use('/pizza', routePizza)
app.use('/category', routeCategory)
app.use('/order', routeOrder)
app.use('/user', routeUser)
app.use('/feedback', routeFeedback)
app.use('/dashboard', routeDashboard)
app.use('/delivery_boy', routeDeliveryBoy)

app.listen(4000, '0.0.0.0', () => {
    console.log('server started on port 4000')
})