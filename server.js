const express = require('express')
const knex = require('knex')
const bodyParser = require('body-parser')
const cors = require('cors')

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : '',
      password : '',
      database : 'Group-chat'
    }
})


const app = express()
app.use(bodyParser.json())
app.use(cors())

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
        joined: new Date()
    })
    .then(user=>{
        res.json(user)
    }).catch(err=> res.json('unable to register'))
})
let d = new Date()
let date = d.getUTCHours()

let time = ()=>{
    if(date>12){
       return date-12 +1

    }else{
        return date
    }
}



app.post('/send-message', (req, res)=>{
    db('message')
    .returning('*')
    .insert({
        name: req.body.name,
        message: req.body.message,
        mtime: `${time()}:${d.getUTCMinutes()}`
    })
    .then(message=>{
        res.json(message)
    }).catch(err=> res.json('unable to send'))
})

app.listen(3000)