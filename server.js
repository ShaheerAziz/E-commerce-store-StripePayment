const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
var cors = require("cors")


const app = express()
dotenv.config()

//cors
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use("/images", express.static("./uploads/images"))

const dbURL = process.env.DBCONNECTION
mongoose.set("strictQuery", false)
const db = "test"

mongoose
    .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        app.listen(5000)

        console.log("Listening to port 5000 and database is connected!")
    })
    .catch((err) => console.log(err))



app.use("/api/users", require("./routes/usersRoutes"))
app.use("/api/admins", require("./routes/adminRoutes"))
app.use("/api/designers", require("./routes/designerRoutes"))
app.use("/api/products", require("./routes/productsRoutes"))
app.use("/api/reviews", require("./routes/reviewsRoutes"))
app.use("/api/shops", require("./routes/shopsRoutes"))
app.use("/api/orders", require("./routes/ordersRoutes"))
app.use("/api/stripe", require("./routes/stripeRoutes"))
