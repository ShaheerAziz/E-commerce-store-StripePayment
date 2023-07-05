const express = require("express")
const router = express.Router()
const {
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
} = require("../controllers/adminController")

router.post("/registerAdmin", registerAdmin)
router.post("/loginAdmin", loginAdmin)
router.delete("/deleteAdmin/:id", deleteAdmin)
router.delete("/deleteDesigner/:id", deleteDesigner)
router.delete("/deleteUser/:id", deleteUser)
router.get("/allAdmins", getAllAdmins)
router.get("/allUsers", getAllUsers)
router.get("/allDesigners", getAllDesigners)
router.post("/userToAdmin", userToAdmin)
router.put("/updateAdmin", updateAdmin)
router.put("/resetPassword", resetPassword)
router.get("/", getAdminDetails)

module.exports = router
