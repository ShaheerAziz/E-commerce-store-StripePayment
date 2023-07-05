const Designer = require("../models/designer")
const Shop = require("../models/shop")
const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")

//createShop
const createShop = asyncHandler(async (req, res) => {
    const { shopName, description } = req.body
    const designerID = req.query.designerID

    const designer = await Designer.findById(designerID)
    //
    if (designer._id) {
        const _shop = Shop.findOne({ shopName })
        if (_shop?.shopName) {
            res.status(400).json({ message: "Shop name already exists" })
        } else {
            const shop = new Shop({
                designerID: designerID,
                shopName: shopName,
                description: description,
            })

            try {
                await shop.save()
                res.json({
                    Shop: shop,
                })
            } catch (err) {
                res.status(400).json({ message: err })
            }
        }
    } else {
        res.status(400).json({ message: "Designer not found" })
    }
})

//get shop details
const getShopDetails = asyncHandler(async (req, res) => {
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            var token = req.headers.authorization.split(" ")[1]
            var decoded = jwt.verify(token, process.env.SECRETKEY)

            const designer = await Designer.findOne({ _id: decoded.id })
            console.log(designer)

            if (!designer) {
                res.status(402).json({
                    message: "Designer does'nt exist.",
                })
            } else {
                const shop = await Shop.findOne({ designerID: designer._id })

                res.status(200).json(shop)
            }
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

const updateShop = asyncHandler(async (req, res) => {
    const { shopName, description } = req.body
    const id = req.query.id

    const shop = await Shop.findById(id)
    if (shop) {
        if(shopName){
            const _shop = await Shop.findOne({ shopName })
            //console.log(shop)
            if (_shop) {
                res.status(400).json({ message: "Shop name already exists" })
            } else {
                shop.shopName = shopName
            }
        }
        if(description){
            shop.description = description
        }

        try {
            await shop.save()
            res.json({
                message: "Shop successfully Updated",
                Shop: shop,
            })
        } catch (err) {
            res.status(400).json({ message: err })
        }

    } else {
        res.status(400).json({ message: "Shop not found" })
    }
})

module.exports = { createShop, getShopDetails, updateShop}
