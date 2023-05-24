const express = require('express')
const app = express()
require('dotenv/config')
const mongoose = require('mongoose')

app.get('/', (req, res) => {
    res.send('Hello World! 2')
})

mongoose.connect(process.env.DB_CONNECTION,{
    useNewUrlParser : true,
    useUnifiedTopology : true
})

let db = mongoose.connection

db.on('error', console.error.bind(console, 'Error Establishing a Database Connection?'))

db.once('open', ()=>{
    console.log('Database is connected')
})

app.listen(process.env.PORT, () => {
    console.log(`Server Running on port ${process.env.PORT}`)
})