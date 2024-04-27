require('dotenv').config();

const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express()



const connectionString = process.env.DB_STRING

//Connection to database
MongoClient.connect(connectionString)
.then(client => {
    console.log("connected to db")
    const db = client.db('star-war-quotes')
    const quotesCollection = db.collection('quotes')
    

    //Middlewares
    app.set('view engine', 'ejs')
    app.use(express.static('public'))
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())

    //Routes
    app.get('/', (req, res) => {
        quotesCollection.find().toArray()
        .then(results => {
            console.log(results)
            res.render('index.ejs', {quotes: results})
        })
        .catch(error => console.error(error))
    })

    app.post('/quotes', (req,res) => {
        quotesCollection.insertOne(req.body)
        .then(result => {
            console.log(result)
            res.redirect('/')
        })
        .catch(error => console.error(error))
    })

    app.put('/quotes', (req,res) => {
        quotesCollection.findOneAndUpdate(
            {
                name: 'Yoda'
            }, 
            {
                $set: {
                    name: req.body.name,
                    quote: req.body.quote
                }
            },
            {
                upsert: true
            }
        )
        .then(result => {
            console.log(result)
            res.json('Success')
        })
        .catch(error => console.error(err))
    })

    app.delete('/quotes', (req,res) => {
        quotesCollection.deleteOne(
            {name: req.body.name}
        )
        .then(result => {
            if (result.deletedCount === 0) {
                return res.json('No quote to delete')
            }
            res.json('Deleted Darth Vader quote')
        })
    })

    app.listen(4000, () => {
        console.log('listening 4000')
    })
})
.catch(error => console.log(error))


