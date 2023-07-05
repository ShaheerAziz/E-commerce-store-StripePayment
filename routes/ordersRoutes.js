const express = require('express');
const router = express.Router();

const {placeOrder, usersAllOrder, designersAllOrder,
    updateOrderStatusToProcessing, updateOrderStatusToDelivered} = require('../controllers/ordersController')

router.post('/placeOrder', placeOrder)
router.get('/usersAllOrder', usersAllOrder)
router.get('/designersAllOrders', designersAllOrder)
router.put('/updateOrderStatusToProcessing', updateOrderStatusToProcessing)
router.put('/updateOrderStatusToDelivered', updateOrderStatusToDelivered)

module.exports = router;