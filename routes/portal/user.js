const express = require('express')
const db = require('../../db')
const crypto = require('crypto-js')
const jwt = require('jsonwebtoken')
const config = require('../../config')
const utils = require('../../utils')
const uuid = require('uuid')
const mailer = require('../../mailer')
const router = express.Router()

router.post('/signin', (request, response) => {
    const { email, password } = request.body
    const encryptedPassword = crypto.SHA256(password)
    const statement = `select id, firstName, lastName, phone, status,active from user where email = '${email}' and password = '${encryptedPassword}'`
    db.query(statement, (error, users) => {
        const result = {}
        if (error) {
            result['status'] = 'error'
            result['error'] = error
        } else {
            if (users.length == 0) {
                result['status'] = 'error'
                result['error'] = 'user not found'
            } else {
                const user = users[0]

                // check if user is active user
                if (user['active'] == 0 || user['status'] == 0) {
                    // user account is not active
                    result['status'] = 'error'
                    result['data'] = 'your account is not active. please activate your account by using the link you have received in your registration confirmation email.'
                }
                if (user['status'] == 2) {
                    //                     // user account is suspended
                    result['status'] = 'error'
                    result['error'] = 'your account is suspended, please contact <admin@pizzavala.com>'
                } else if (user['active'] == 1 && user['status'] == 1) {

                    // create the token
                    const token = jwt.sign({ id: user['id'] }, config.secret)

                    result['status'] = 'success'
                    result['data'] = {
                        id: user['id'],
                        firstName: user['firstName'],
                        lastName: user['lastName'],
                        phone: user['phone'],
                        token: token
                    }
                }
            }
        }

        response.send(result)
    })
})

router.post('/signup', (request, response) => {
    const { firstName, lastName, phone, email, password } = request.body
    const encryptedPassword = crypto.SHA256(password)

    // create uuid for user activation
    const activationToken = uuid.v1()

    const statement = `insert into user(firstName, lastName, phone, email, password, activationToken) values 
    ('${firstName}', '${lastName}', '${phone}','${email}','${encryptedPassword}', '${activationToken}')`

    db.query(statement, (error, result) => {

        // send activation link by email 
        const body = `
    <h1>Welcome to the PizzaVala Store.</h1>
    <div>
      Please activate your account here 
      <div>
        <a href="http://localhost:4100/user/activate/${activationToken}">activate my account</a>
      </div>
    </div>
  `
        mailer.sendEmail(email, 'Activate your account', body, (mailerError, mailerResult) => {
            console.log(mailerError)
            console.log(mailerResult)
            response.send(utils.createResult(error, result))
        })
    })
})

router.get('/activate/:token', (request, response) => {
    console.log("hello")
    const { token } = request.params
    const statement = `update user set active = 1,status=1 where activationToken = '${token}'`
    db.query(statement, (error, data) => {
        let body = ''
        if (error) {
            body = `
      <h1>Error occurred whiel activating your account..</h1>
      <h5>${error}</h5>
    `
        } else {
            body = `
      <h1>Congratulations!!! Successfully activated your account.</h1>
      <h5>Please login to continue</h5>
    `
        }

        //TODO: delete the activationToken

        response.send(body)
    })
})

router.get('/profile/:id', (request, response) => {
    const { id } = request.params
    const statement = `select id, firstName, lastName, email, phone from user where id = ${id}`
    db.query(statement, (error, data) => {
        response.send(utils.createResult(error, data[0]))
    })
})

router.put('/update-profile/:id', (request, response) => {
    const { id } = request.params
    const { firstName, lastName, phone, email } = request.body


    const statement = `update user set
    firstName = '${firstName}', 
    lastName = '${lastName}', 
    phone = '${phone}', 
    email = '${email}' where id = ${id}`
    db.query(statement, (error, data) => {
        response.send(utils.createResult(error, data))
    })

})
router.put('/forget-password/:id', (request, response) => {
    const { id } = request.params
    const encryptedNewPassword = crypto.SHA256(password)
    const statement = `update user set
password = '${encryptedNewPassword}' 
where id = ${id}
`
    db.query(statement, (error, data) => {
        response.send(utils.createResult(error, data))
    })
})

router.put('/change-password/:id', (request, response) => {
    const { id } = request.params
    const { password } = request.body
    const encryptedPassword = crypto.SHA256(password)
    const statement = `update user set
password = '${encryptedPassword}' 
where id = ${id}
`
    db.query(statement, (error, data) => {
        response.send(utils.createResult(error, data))
    })
})

router.post('/forget-password', (request, response) => {
    const { email } = request.body
    const statement = `select * from user where
           email = '${email}' `
    db.query(statement, (error, users) => {
        const result = {}
        if (error) {
            result['status'] = 'error'
            result['error'] = error
        } else {
            if (users.length == 0) {
                result['status'] = 'error'
                result['error'] = 'user not found'
            } else {
                const user = users[0]

                // check if user is active user
                if (user['active'] == 0 || user['status'] == 0) {
                    // user account is not active
                    result['status'] = 'error'
                    result['data'] = 'your account is not active. please activate your account by using the link you have received in your registration confirmation email.'
                }
                if (user['status'] == 2) {
                    //                     // user account is suspended
                    result['status'] = 'error'
                    result['error'] = 'your account is suspended, please contact <admin@pizzavala.com>'
                } else if (user['active'] == 1 && user['status'] == 1) {

                    // create the token
                    const token = jwt.sign({ id: user['id'] }, config.secret)

                    result['status'] = 'success'
                    result['data'] = {
                        id: user['id'],
                        firstName: user['firstName'],
                        lastName: user['lastName'],
                        phone: user['phone'],
                        token: token
                    }
                }
            }
        }

        response.send(result)
    })
})

module.exports = router