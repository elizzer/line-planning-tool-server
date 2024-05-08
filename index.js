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

app.listen(5000,()=>{
    console.log("[+]Server ready on port 5000")
    mongoose.connect("mongodb://127.0.0.1:27017/linePlanning").then(()=>{
        console.log("mongo connection done")
    }).catch((e)=>{
        console.log("[*]",e)
    })
})