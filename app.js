const express = require('express')
const app = express()
const authRouter = require('./router/authRoute.js')
const databaseconnect = require('./config/databaseConfig.js')
// convert Cookies to json
const cookieParser = require('cookie-parser')
databaseconnect()
const cors = require('cors');


app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:[process.env.CLIENT_URL],
    credentials:true
}))
app.use('/api/auth',authRouter)

app.use('/',(req,res)=>{
    res.status(200).json({
        data:'JSAuth Server'
    })
})

module.exports = app