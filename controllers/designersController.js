const Designer = require("../models/designer")
const Shop = require("../models/shop")
const Order = require("../models/order")
const asyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt")
const { generateToken } = require("../utilities/jwt.js")
const jwt = require("jsonwebtoken")

const getDesignerDetails = asyncHandler(async (req, res) => {
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            var token = req.headers.authorization.split(" ")[1]
            var decoded = jwt.verify(token, process.env.SECRETKEY)

            const designer = await Designer.findOne({ _id: decoded.id })

            res.status(200).json({ ...designer._doc, userType: "Designer" })
        } catch (err) {
            res.status(401).json({
                message: err,
            })
        }
    } else {
        res.status(401).json({
            message: "Not logged IN",
        })
    }
})

const getDesignerDetailsById = asyncHandler(async (req, res) => {
    const id = req.params.id
    console.log(id)
    const designer = await Designer.findById(id)
    console.log(designer)
    if (designer) {
        res.json(designer)
    } else {
        res.status(400).json({ message: "Unable to get the designer" })
    }
})

const registerDesigner = asyncHandler(async (req, res) => {
    const { myName, email, accountName, bankName, accountNo } = req.body
    const designerExists = await Designer.findOne({ email })
    if (designerExists) {
        res.status(400).json({ message: "Designer already exist." })
    } else {
        const designer = new Designer({
            myName,
            email,
            accountName,
            bankName,
            accountNo,
        })

        designer
            .save()
            .then((result) => {
                res.json({
                    _id: result.id,
                    myName: myName,
                    email: email,
                    accountName: accountName,
                    bankName: bankName,
                    accountNo: accountNo,
                    userType: "Designer",
                    token: generateToken(result.id),
                })
            })
            .catch((err) => {
                console.log(err)
                res.status(400).json({ messaeg: err })
            })
    }
})

const loginDesigner = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    console.log("Designer Login")
    const designer = await Designer.findOne({ email })
    flag = false
    if (designer) {
        const flag = await bcrypt.compare(password, designer.password)

        if (flag) {
            res.json({
                _id: designer.id,
                name: designer.myName,
                email: designer.email,
                accountName: designer.accountName,
                bankName: designer.bankName,
                accountNo: designer.accountNo,
                userType: "Designer",
                token: generateToken(result.id),
            })
        } else {
            res.status(400).json({ message: "Invalid Password" })
        }
    } else {
        res.status(400).json({ message: "Invalid Email" })
    }
})

const updateDesigner = asyncHandler(async (req, res) => {
    const { myName, accountName, bankName, accountNo } = req.body
    const id = req.query.id
    const designer = await Designer.findById(id)

    if (designer) {
        if (myName) {
            designer.myName = myName
        }
        if (bankName) {
            designer.bankName = bankName
        }
        if (accountName) {
            designer.accountName = accountName
        }
        if (accountNo) {
            designer.accountNo = accountNo
        }

        try {
            await designer.save()
            res.status(200).json({
                message: "Designer successfully Updated",
                designer: { ...designer._doc, userType: "Designer" },
            })
        } catch (err) {
            res.status(400).json({
                message: err,
            })
        }
    } else {
        res.status(400).json({
            message: "Designer does not exist",
        })
    }
})

const highestRating = asyncHandler(async (req, res) => {
    //console.log("hello")

    const designer = await Designer.find({})
        .sort({ avgRatingOfProducts: -1 })
        .limit(3)

    return designer
})

const highestSales = asyncHandler(async (req, res) => {
    //console.log("hello")

    const designer = await Designer.find({}).sort({ totalSales: -1 }).limit(3)

    return designer
})

const highestProducts = asyncHandler(async (req, res) => {
    //console.log("hello")

    const designer = await Designer.find({})
        .sort({ totalNoOfOrders: -1 })
        .limit(3)

    return designer
})

const topRatedDesigners = asyncHandler(async (req, res) => {
    try {
        const maxRatingDesigner = await highestRating()
        const maxSalesDesigner = await highestSales()
        const maxProductSalesDesigner = await highestProducts()

        res.json({
            maxRatingDesigner: maxRatingDesigner,
            maxSalesDesigner: maxSalesDesigner,
            maxProductSalesDesigner: maxProductSalesDesigner,
        })
    } catch (err) {
        res.status(400).json({ message: err })
    }
})

//AllProducts
const allProductofDesigners = asyncHandler(async (req, res) => {
    const id = req.params.id
    const shop = await Shop.find({ designer: id })
    if (shop) {
        const allProducts = shop.products

        res.json({
            allProducts,
        })
    } else {
        res.status(400).json({ message: "Unable to get the products" })
    }
})

const designerMonthlyData = asyncHandler(async (req, res) => {
    const designerID = req.query.id
    const month = req.query.month // Month provided by the user (1-12)
    const year = req.query.year // Year provided by the user

    const designer = await Designer.findById(designerID)

    const startDate = new Date(year, month - 1, 2) // Set the start date to the first day of the provided month and year
    const endDate = new Date(year, month, 1) // Set the end date to the last day of the provided month and year
    //console.log(startDate)
    //console.log(endDate)

    const filter = {}
    filter.createdAt = { $gte: startDate }
    filter.createdAt = { ...filter.createdAt, $lte: endDate }

    const orders = await Order.find(filter)
    //console.log(orders)
    var acc = {}
    let totalSales = 0
    let totalNoOfProductsSales = 0
    if (orders) {
        for (var order of orders) {
            for (var data of order.designerProducts) {
                if (data.designerID === designerID) {
                    for (var product of data.products) {
                        if (acc[product.productName]) {
                            acc[product.productName] = {
                                productName:
                                    acc[product.productName].productName,
                                count: acc[product.productName].count + 1,
                            }
                        } else {
                            acc[product.productName] = {
                                productName: product.productName,
                                count: 1,
                            }
                        }

                        totalSales =
                            totalSales + product.price * product.quantity
                        totalNoOfProductsSales =
                            totalNoOfProductsSales + product.quantity
                    }
                }
            }
        }

        const productsCount = acc

        res.json({
            designer: {
                _id: designer._id,
                myName: designer.myName,
                totalNoOfProductsSales: totalNoOfProductsSales,
                totalSales: totalSales,
                productsCount: productsCount,
            },
        })
    } else {
        res.status(400).json({ message: "Unable to get the orders" })
    }
})

module.exports = {
    registerDesigner,
    loginDesigner,
    getDesignerDetails,
    allProductofDesigners,
    topRatedDesigners,
    designerMonthlyData,
    getDesignerDetailsById,
    updateDesigner,
}
