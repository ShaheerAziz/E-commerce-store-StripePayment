const Product = require("../models/products")
const asyncHandler = require("express-async-handler")
const multiparty = require("multiparty")
const path = require("path")
const { createCheckoutSession } = require("../controllers/stripeController")

const createProduct = asyncHandler(async (req, res) => {
    //console.log("Creating product")
    //console.log(process.env.IMAGE_UPLOAD_DIR)
    const path_ = path.join(path.resolve(), process.env.IMAGE_UPLOAD_DIR)
    console.log("Path :", path_)
    let form = new multiparty.Form({
        autoFiles: true,
        uploadDir: path_,
    })

    form.parse(req, async function (err, fields, files) {
        if (err) return res.send({ error: err.message })

        console.log("fields = " + JSON.stringify(fields, null, 2))
        console.log("files = " + JSON.stringify(files, null, 2))

        var img_ = []
        if (files.image) {
            for (var img of files.image) {
                const imagePath = img.path
                const fileName = imagePath.slice(imagePath.lastIndexOf("/") + 1)
                img_.push(
                    process.env.NODE_ENV === "production"
                        ? "https://storeapis.onrender.com/images/" + fileName
                        : "http://localhost:5000/images/" + fileName
                )
            }
        }

        const product = new Product({
            designerID: fields.designerID[0],
            productName: fields.productName[0],
            image: img_,
            category: fields.category[0],
            price: fields.price[0],
            description: fields.description[0],
            quantity: fields.quantity,
            size: fields.size,
            avgRating: 0,
            noOfReviews: 0,
            noOfSales: 0,
        })

        await product
            .save()
            .then((result) => {
                res.json({
                    product: result,
                })
            })
            .catch((err) => {
                console.log(err)
                res.status(400).json({ message: err })
            })
    })
    // console.log(req.body)
    // const {designerID, productName, image, category, price, description, quantity, size} = req.body
})

const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
        await product.remove()
        res.status(200).json({ message: "Product removed." })
    } else {
        res.status(400).json({ message: "Product not found" })
    }
})

const updateProduct = asyncHandler(async (req, res) => {
    //const {designerID, productName, image, category, price, description, quantity, size} = req.body
    console.log(req.params.id)
    const product = await Product.findById(req.params.id)

    //console.log(product)
    const path_ = path.join(path.resolve(), process.env.IMAGE_UPLOAD_DIR)
    console.log("Path :", path_)
    let form = new multiparty.Form({
        autoFiles: true,
        uploadDir: path_,
    })

    form.parse(req, async function (err, fields, files) {
        if (err) return res.send({ error: err.message })

        console.log("fields = " + JSON.stringify(fields, null, 2))
        console.log("files = " + JSON.stringify(files, null, 2))

        var img_ = []

        if (files.image) {
            for (var img of files.image) {
                const imagePath = img.path
                const fileName = imagePath.slice(imagePath.lastIndexOf("/") + 1)
                img_.push(
                    process.env.NODE_ENV === "production"
                        ? "https://storeapis.onrender.com/images/" + fileName
                        : "http://localhost:5000/images/" + fileName
                )
            }
        }

        if (product) {
            ;(product.productName = fields.productName[0]),
                (product.image = img_.length === 0 ? product.image : img_),
                (product.category = fields.category[0]),
                (product.price = fields.price[0]),
                (product.description = fields.description[0]),
                (product.quantity = fields.quantity),
                (product.size = fields.size)

            try {
                await product.save()
                res.json({
                    product: product,
                })
            } catch (err) {
                res.status(400).json({ message: err })
            }
        } else {
            res.status(400).json({ message: "Product not found" })
        }
    })
})

const getProductsByDesignerID = asyncHandler(async (req, res) => {
    const id = req.params.id
    const products = await Product.find({ designerID: id })
    //console.log(id)
    //console.log(products)

    if (products) {
        res.json({
            products,
        })
    } else {
        res.status(400).json({ message: "Unable to get the products" })
    }
})

const getProductById = asyncHandler(async (req, res) => {
    const id = req.params.id
    //console.log(id)
    const product = await Product.findById(id)
    //console.log(product)
    if (product) {
        res.json({
            product,
        })
    } else {
        res.status(400).json({ message: "Unable to get the products" })
    }
})

const getProductByCategory = asyncHandler(async (req, res) => {
    const category = req.params.category
    const products = await Product.find({ category: category })
    if (products) {
        res.json({
            products,
        })
    } else {
        res.status(400).json({ message: "Unable to get the products" })
    }
})

const getAllProducts = asyncHandler(async (req, res) => {
    const pageSize = 10
    const limit = Number(req.query.limit) || 10
    const page = Number(req.query.page) || 1
    const { minPrice, maxPrice, avgRating, category, featured } = req.query
    const hasFilters = minPrice || maxPrice || avgRating || category
    console.log(hasFilters)

    // Construct the filter object based on the provided query parameters
    const filter = {}
    if (minPrice) {
        filter.price = { $gte: parseFloat(minPrice) }
    }
    if (maxPrice) {
        filter.price = { ...filter.price, $lte: parseFloat(maxPrice) }
    }
    if (avgRating) {
        filter.avgRating = { $gte: parseFloat(avgRating) }
    }
    if (category) {
        filter.category = category
    }
    if (featured) {
        filter.featured = featured
    }

    const keyword = req.query.keyword
        ? {
              productName: {
                  $regex: req.query.keyword,
                  $options: "i",
              },
          }
        : {}

    if (hasFilters || keyword != {}) {
        const query = { ...filter, ...keyword }
        const count = await Product.countDocuments(query)
        const products = await Product.find(query)
            .limit(limit)
            .skip(pageSize * (page - 1))
        res.json({ products, page, pages: Math.ceil(count / pageSize) })
    } else {
        const count = await Product.countDocuments()
        const products = await Product.find()
            .limit(limit)
            .skip(pageSize * (page - 1))
        res.json({ products, page, pages: Math.ceil(count / pageSize) })
    }
})

const searchProducts = asyncHandler(async (req, res) => {
    const page = Number(req.query.pageNumber) || 1

    const count = await Product.countDocuments({ ...keyword })
    const products = await Product.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1))
    res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

const placeRating = asyncHandler(async (req, res) => {
    const { avgRating, noOfReviews } = req.body
    console.log(req.params.id)
    const product = await Product.findById(req.params.id)
    console.log(product)

    if (product) {
        product.noOfReviews = noOfReviews + 1
        product.avgRating =
            (avgRating * noOfReviews + req.params.rating) / (noOfReviews + 1)

        try {
            await product.save()
            res.json({
                product: product,
            })
        } catch (err) {
            res.status(400).json({ message: err })
        }
    } else {
        res.status(400).json({ message: "Unable to get the products" })
    }
})

const topProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find({ avgRating: { $gt: 3 } })
            .sort({ avgRating: -1 })
            .limit(20)

        res.json({
            products: products,
        })
    } catch (err) {
        res.status(400).json({ message: err })
    }
})

const featureProduct = asyncHandler(async (req, res) => {
    const id = req.query.id
    const product = await Product.findById(id)
    console.log(product)
    const cartItems = [
        {
            productName: "Featured Products",
            description:
                "Featured products, this feature will give your product more reach result in more sale and profits",
            _id: id,
            price: 1000,
            quantity: 1,
        },
    ]

    req.body.cartItems = cartItems

    if (product) {
        product.featured = true
        await product.save()
        req.product = product
        createCheckoutSession(req, res)
    }
})

const getAllFeatureProduct = asyncHandler(async (req, res) => {
    try {
        const pageSize = 10
        const limit = Number(req.query.limit) || 10
        const page = Number(req.query.page) || 1
        const count = await Product.countDocuments({ featured: true })
        const products = await Product.find({ featured: true })
            .limit(limit)
            .skip(pageSize * (page - 1))
        res.json({ products, page, pages: Math.ceil(count / pageSize) })
    } catch (err) {
        res.json({
            message: err,
        })
    }
})

module.exports = {
    createProduct,
    deleteProduct,
    getProductById,
    updateProduct,
    getProductsByDesignerID,
    getProductByCategory,
    getAllProducts,
    placeRating,
    searchProducts,
    topProducts,
    featureProduct,
    getAllFeatureProduct,
}
