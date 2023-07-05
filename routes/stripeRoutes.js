// This example sets up an endpoint using the Express framework.
// Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.

const Express = require('express');
const router = Express.Router()

const {createCheckoutSession} = require('../controllers/stripeController')
const {checkout} = require('../Middleware/checkout')

router.post('/create-checkout-session', checkout, createCheckoutSession)

module.exports = router
