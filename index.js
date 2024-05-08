const express = require("express")
const app= express()
const mongoose= require("mongoose")

require("dotenv").config()

const userRoutes = require("./routes/user")
const lineRoutes=require("./routes/lines")
const jobsRoutes=require("./routes/jobs")

const cors= require("cors")
const bodyParser=require("body-parser")

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use("/user",userRoutes)
app.use("/line",lineRoutes)
app.use("/jobs",jobsRoutes)

app.listen(5001,()=>{
    console.log("[+]Server ready on port 5000",process.env.MONGODB_URI)
    mongoose.connect(process.env.MONGODB_URI).then(()=>{
        console.log('[+]DB connected')
    }).catch((e)=>{
        console.log('[+]Error in connecting to db',e)
    })
})