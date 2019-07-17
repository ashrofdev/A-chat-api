const express = require('express')
const knex = require('knex')
const bodyParser = require('body-parser')
const cors = require('cors')

const db = knex({
    client: 'pg',
    connection: {
      connectionString : process.env.DATABASE_URL,
      ssl: true
    }
})


const app = express()
app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res)=>{
        res.json('..............')
})

app.get('/messages', (req, res)=>{
    db.select('*').from('message').then (data=>{
        res.json(data)
    })
})
app.get('/users', (req, res)=>{
    db.select('*').from('users').then (data=>{
        res.json(data)
    })
})

app.post('/register', (req, res)=>{
    db('users')
    .returning('*')
    .insert({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        joined: new Date()
    })
    .then(user=>{
        res.json(user)
    }).catch(err=> res.json('unable to register'))
})
let d = new Date()
let date = d.getHours()

let time = ()=>{
    if(date>12){
       return `${date-12}:${d.getMinutes()}PM`

    }if(date===12){
        return `${date}:${d.getMinutes()}PM`
 
    }else{
        return `${date}:${d.getMinutes()}AM`
    }
}



app.post('/send-message', (req, res)=>{
    db('message')
    .returning('*')
    .insert({
        name: req.body.name,
        message: req.body.message,
        mtime: time()
    })
    .then(message=>{
        res.json(message)
    }).catch(err=> res.json('unable to send'))
})

app.listen(process.env.PORT)