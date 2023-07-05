const asyncHandler = require("express-async-handler")
const Product = require("../models/products")

const checkout = asyncHandler(async (req, res, next) => {
    const products = req.body.cartItems

    var flag = true

    for (var product of products) {
        let id = product._id
        const _product = await Product.findById(id)

        if (product.size === "S") {
            if (!_product.quantity[0] > product.quantity) {
                flag = false
                res.json({
                    message: product.productName + " is not available",
                })
            }
        } else if (product.size === "M") {
            if (!_product.quantity[1] > product.quantity) {
                flag = false

                res.json({
                    message: product.productName + " is not available",
                })
            }
        } else if (product.size === "L") {
            if (!_product.quantity[2] > product.quantity) {
                flag = false

                res.json({
                    message: product.productName + " is not available",
                })
            }
        } else {
            res.json({
                message: "Wronge size information",
            })
        }
    }

    flag && next()
})

module.exports = { checkout }
