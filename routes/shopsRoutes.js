const express = require("express")
const router = express.Router()
const { createShop, getShopDetails, updateShop } = require("../controllers/shopsController")

router.post("/createShop", createShop)
router.put("/updateShop", updateShop)
router.get("/", getShopDetails)

module.exports = router
