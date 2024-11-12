const express = require('express')
const axios = require('axios')
const app = express()

app.use( (req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*')
    next()
})

//Setting a json response from the homepage
app.get('/', (req, res) => res.json({
    'message' : 'Hello World'
}))

app.listen(3000, ()=>{
    console.log('Listening on port 3000')
})