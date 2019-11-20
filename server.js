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

let joined = new Date
let year = joined.getFullYear()
let month = joined.getMonth()
let day = joined.getDate()

app.post('/register', (req, res)=>{
    
    db('users')
    .returning('*')
    .insert({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        joined: `${day}-${month}-${year}`
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

app.post('/a', (req, res)=>{
    const test = {
      name: req.body.name
    }
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      
      auth: {
        user: "ashsal2001@gmail.com",
        pass: "salmanashrafatmagul"
      },
      tls: {
        
        rejectUnauthorized: false
      }
    });
    
    
    let info = transporter.sendMail({
        from: 'ashsal2001@gmail.com', 
        to: 'ashsall115@gmail.com', 
        subject: 'PRODUCT REQUEST ✔', 
        text: 'Hello world?', 
        html: '<b>A client requested your product</b> <p>Wow, finally youve got a customer</p>' // html body
    })
    
    console.log('Message sent: %s', info.messageId,);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
  })
  

app.listen(process.env.PORT || 3001)