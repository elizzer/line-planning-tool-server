const express = require("express")
const app= express()
const mongoose= require("mongoose")

require("dotenv").config()

const userRoutes = require("./routes/user")
const lineRoutes=require("./routes/lines")
const jobsRoutes=require("./routes/jobs")
const clientsRoutes = require("./routes/clients")
const factoryRoutes= require("./routes/factory")
const merchantRoutes = require("./routes/merchant")
const jobAssignmentRoutes = require("./routes/jobAssignments")

const isLoggedIn = require("./controller/middleware/isLoggedin")


const cors= require("cors")
const bodyParser=require("body-parser")

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use("/user",userRoutes)
app.use("/clients",isLoggedIn,clientsRoutes)
app.use("/factory",isLoggedIn,factoryRoutes)
app.use("/line",isLoggedIn,lineRoutes)
app.use("/jobs",isLoggedIn,jobsRoutes)
app.use("/jobAssignment",isLoggedIn,jobAssignmentRoutes)
app.use("/merchant",isLoggedIn,merchantRoutes)


app.listen(5000,()=>{
    console.log("[+]Server ready on port 5000",process.env.MONGODB_URI)
    mongoose.connect(process.env.MONGODB_URI).then(()=>{
        console.log('[+]DB connected')
    }).catch((e)=>{
        console.log('[+]Error in connecting to db',e)
    })
})