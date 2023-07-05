const Admin = require("../models/admin")
const Designer = require("../models/designer")
const User = require("../models/users")
const jwt = require("jsonwebtoken")

const asyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt")
const { generateToken } = require("../utilities/jwt.js")

const registerAdmin = asyncHandler(async (req, res) => {
    const { myName, email, password } = req.body
    const adminExists = await Admin.findOne({ email })
    const saltRounds = 10
    if (adminExists) {
        res.status(400).json({
            message: "Admin already exist",
        })
    } else {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(password, salt, function (err, password) {
                // Store hash in your password DB.

                const admin = new Admin({
                    myName,
                    email,
                    password,
                })

                admin
                    .save()
                    .then((result) => {
                        res.json({
                            myName: myName,
                            email: email,
                            id: result.id,
                            userType: "Admin",
                            token: generateToken(result.id),
                        })
                    })
                    .catch((err) => {
                        console.log(err)
                        res.status(400).json({
                            message: err,
                        })
                    })
            })
        })
    }
})

const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const admin = await Admin.findOne({ email })
    flag = false
    if (admin) {
        const flag = await bcrypt.compare(password, admin.password)

        if (flag) {
            res.json({
                myName: admin.myName,
                email: admin.email,
                id: admin.id,
                userType: "Admin",
                token: generateToken(admin.id),
            })
        } else {
            res.status(400).json({
                message: "Invalid Password",
            })
        }
    } else {
        res.status(400).json({ message: "Invalid Email" })
    }
})

const updateAdmin = asyncHandler(async (req, res) => {
    const { myName } = req.body
    const id = req.query.id
    const admin = await Admin.findById(id)

    if (admin) {
        if (myName) {
            admin.myName = myName
        }

        try {
            await admin.save()
            res.status(200).json({
                message: "Admin successfully uodated",
                admin: admin,
            })
        } catch (err) {
            res.status(400).json({
                message: err,
            })
        }
    } else {
        res.status(400).json({
            message: "Admin not found",
        })
    }
})

const resetPassword = asyncHandler(async (req, res) => {
    const id = req.query.id
    const admin = await Admin.findById(id)
    flag = true
    if (admin) {
        const { oldPassword, newPassword } = req.body
        //console.log(oldPassword, newPassword)

        const flag = await bcrypt.compare(oldPassword, admin.password)
        if (flag) {
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(newPassword, salt, function (err, password) {
                    admin.password = password
                })
            })

            try {
                await admin.save()
                res.status(200).json({
                    message: "Password Updated successfully",
                    admin: admin,
                })
            } catch (err) {
                res.status(400).json({
                    message: err,
                })
            }
        } else {
            res.status(400).json({
                message: "Wronge old password",
            })
        }
    } else {
        res.status(400).json({
            message: "Admin not found",
        })
    }
})

//deleteAdmin
const deleteAdmin = asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.params.id)
    if (admin) {
        await admin.remove()
        res.json({ message: "Admin removed." })
    } else {
        res.status(400).json({ message: "Admin not found" })
    }
})

const getAdminDetails = asyncHandler(async (req, res) => {
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            var token = req.headers.authorization.split(" ")[1]
            var decoded = jwt.verify(token, process.env.SECRETKEY)

            const admin = await Admin.findOne({ _id: decoded.id })

            res.status(200).json({ ...admin._doc, userType: "Admin" })
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

//deleteadmin
const deleteDesigner = asyncHandler(async (req, res) => {
    const designer = await Designer.findById(req.params.id)
    if (designer) {
        await designer.remove()
        res.json({ message: "Designer removed." })
    } else {
        res.status(400).json({ message: "Designer not found" })
    }
})

//deleteUser
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
        await user.remove()
        res.status(201).json({ message: "User removed." })
    } else {
        res.status(400).json({ message: "User not found" })
    }
})

//All admins
const getAllAdmins = asyncHandler(async (req, res) => {
    const limit = Number(req.query.limit) || 10
    const page = Number(req.query.page) || 1

    var skip = (page - 1) * limit

    await Admin.find({})
        .limit(limit)
        .skip(skip)
        .then(function (admins) {
            res.send(admins)
        })
})

//All users
const getAllUsers = asyncHandler(async (req, res) => {
    const limit = Number(req.query.limit) || 10
    const page = Number(req.query.page) || 1

    var skip = (page - 1) * limit

    await User.find({})
        .limit(limit)
        .skip(skip)
        .then(function (users) {
            res.send(users)
        })
})

//All Designers
const getAllDesigners = asyncHandler(async (req, res) => {
    const limit = Number(req.query.limit) || 10
    const page = Number(req.query.page) || 1

    var skip = (page - 1) * limit

    await Designer.find({})
        .limit(limit)
        .skip(skip)
        .then(function (designers) {
            res.send(designers)
        })
})

const userToAdmin = asyncHandler(async (req, res) => {
    try {
        const id = req.query.id
        const user = await User.findById(id)

        const admin = new Admin({
            myName: user.myName,
            email: user.email,
            password: user.password,
        })

        await admin.save()
        res.status(200).json({
            admin,
        })
    } catch (err) {
        res.status(400).json({
            message: err,
        })
    }
})

module.exports = {
    registerAdmin,
    loginAdmin,
    deleteAdmin,
    updateAdmin,
    resetPassword,
    deleteDesigner,
    deleteUser,
    getAllAdmins,
    getAllUsers,
    getAllDesigners,
    userToAdmin,
    getAdminDetails,
}
