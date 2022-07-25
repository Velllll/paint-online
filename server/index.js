const express = require('express')
const app = express()
const WSserver = require('express-ws')(app)
const aWss = WSserver.getWss()
const wsController = require('./wsController')
const wsControll = new wsController(aWss)
const PORT = process.env.PORT || 5000

app.use(express.json())

app.ws('/', wsControll.controll)

app.listen(PORT, () => console.log('SERVER STARTED ON PORT: ', PORT))




