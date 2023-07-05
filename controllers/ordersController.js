const asyncHandler = require("express-async-handler")
const Order = require("../models/order")
const Product = require("../models/products")
const Designer = require("../models/designer")
const mongoose = require("mongoose")

const placeOrder = asyncHandler(async (req, res) => {
    const products = req.body.cartItems
    const userID = req.body.userID
    const fullName = req.body.fullName
    const postalCode = req.body.postalCode
    const address = req.body.address
    let price = 0

    // updating data database
    for (var product of products) {
        const productID = product._id
        const _product = await Product.findById(productID)
        const designerID = product.designerID
        const designer = await Designer.findById(designerID)

        // updating data of products in database

        if (product.size === "S") {
            _product.quantity[0] = _product.quantity[0] - product.quantity
            _product.noOfSales = _product.noOfSales + product.quantity
            price = product.price + price
            await _product.save()
        } else if (product.size === "M") {
            _product.quantity[1] = _product.quantity[1] - product.quantity
            _product.noOfSales = _product.noOfSales + product.quantity
            price = product.price + price
            await _product.save()
        } else if (product.size === "L") {
            _product.quantity[2] = _product.quantity[2] - product.quantity
            _product.noOfSales = _product.noOfSales + product.quantity
            price = product.price + price
            await _product.save()
        } else {
            res.json({
                message: "Wronge size information",
            })
        }

        // updating data of products in database
        //console.log(designer)
        designer.totalNoOfOrders = designer.totalNoOfOrders + product.quantity
        designer.totalSales =
            designer.totalSales + product.price * product.quantity
        await designer.save()
    }

    // creating product object array

    var _products = req.body.cartItems.map((product) => {
        return {
            designerID: product.designerID,
            productID: product._id,
            productName: product.productName,
            image: product.image,
            size: product.size,
            price: product.price,
            quantity: product.quantity,
        }
    })

    // Creating product array with index/key of designer ID

    const productsByDesigner = _products.reduce((acc, product) => {
        if (acc[product.designerID]) {
            acc[product.designerID].push(product)
        } else {
            acc[product.designerID] = [product]
        }
        return acc
    }, {})

    // console.log(productsByDesigner)

    // array of designerID and Products arrays
    _designerProducts = []

    for (id in productsByDesigner) {
        const designerID = id
        const products = productsByDesigner[id]

        _designerProducts.push({
            designerID,
            products,
        })
    }

    // creating order
    const order = new Order({
        customerID: userID,
        designerProducts: _designerProducts,
        price: price,
        fullName: fullName,
        postalCode: postalCode,
        address: address,
    })

    // console.log(order)
    try {
        await order.save()
        res.json(order)
    } catch (err) {
        res.status(400).json({
            message: err,
        })
    }
})

const updateOrderStatusToProcessing = asyncHandler(async(req, res) => {

    try{
        const id = req.query.id
        const order = await Order.findById(id)

        if(order){
            order.status = "processing"
            await order.save()
            res.status(200).json({
                message: "Order status updated sucessfully",
                order: order
            })
        }
        else{
            res.status(400).json({
                message: "Order not found"
            })
        }
    }
    catch(err){
        res.status(400).json({
            message: err
        })
    }

})

const updateOrderStatusToDelivered = asyncHandler(async(req, res) => {
    
    try{
        const id = req.query.id
        const order = await Order.findById(id)

        if(order){
            order.status = "delivered"
            await order.save()
            res.status(200).json({
                message: "Order status updated sucessfully",
                order: order
            })
        }
        else{
            res.status(400).json({
                message: "Order not found"
            })
        }
    }
    catch(err){
        res.status(400).json({
            message: err
        })
    }
})

const usersAllOrder = asyncHandler(async (req, res) => {
    const id = req.query.id
    const orders = await Order.find({ customerID: id })
    if (orders) {
        res.json({
            orders,
        })
    } else {
        res.status(400).json({ message: "Unable to get the orders" })
    }
})

const designersAllOrder = asyncHandler(async (req, res) => {
    const designerID = req.query.id
    const orders = await Order.find()
    requiredOrders = []
    if (orders) {
        for (var order of orders) {
            for (var data of order.designerProducts) {
                if (data.designerID === designerID) {
                    order.designerProducts = data
                    requiredOrders.push(order)
                }
            }
        }
        res.json({
            requiredOrders
        })
    } else {
        res.status(400).json({ message: "Unable to get the orders" })
    }
})

module.exports = { placeOrder, usersAllOrder, designersAllOrder,
    updateOrderStatusToProcessing, updateOrderStatusToDelivered}
