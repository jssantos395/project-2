//___________________
//Dependencies
//___________________
const express = require('express');
const methodOverride  = require('method-override');
const mongoose = require ('mongoose');
const app = express ();
const db = mongoose.connection;
const NFT = require('./models/nfts.js')
require('dotenv').config()
//___________________
//Port
//___________________
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT || 3003;

//___________________
//Database
//___________________
// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to Mongo &
// Fix Depreciation Warnings from Mongoose
// May or may not need these depending on your Mongoose version
mongoose.connect(MONGODB_URI);
// mongoose.connect('mongodb://localhost:27017/NFTCrud', () => {
//   console.log('The connection with mongo is established');
// })

// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

//___________________
//Middleware
//___________________

//use public folder for static assets
app.use(express.static('public'));
app.use(express.static(__dirname + '/public'));

// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project

//use method override
app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form


//___________________
// Routes
//___________________
//localhost:3000
app.get('/', (req, res)=>{
    NFT.find({}, (error, allNFTs)=>{
        res.render('index.ejs', {
            nfts: allNFTs
        });
    });
});

app.get('/nfts', (req, res)=>{
    NFT.find({}, (error, allNFTs)=>{
        res.render('index.ejs', {
            nfts: allNFTs
        });
    });
});

// app.get('/nfts/:id', (req, res) => {
//   NFT.findById(req.params.id, (error, foundFruit) => {
//     res.send(foundFruit)
//   })
// })

app.get('/nfts/new', (req, res)=>{
    res.render('new.ejs');
});

app.get('/nfts/:id', (req, res)=>{
    NFT.findById(req.params.id, (err, foundNft)=>{
        res.render('show.ejs', {
            nfts: foundNft
        });
    });
});

app.get('/nfts/:id/edit', (req, res)=>{
    NFT.findById(req.params.id, (err, foundNft)=>{ //find the fruit
        res.render(
    		'edit.ejs',
    		{
    			nfts: foundNft //pass in found fruit
    		}
    	);
    });
});

app.post('/nfts', (req, res)=>{
    NFT.create(req.body, (error, createdNFTs ) => {
      // res.send(createdNFTs)
        res.redirect('/nfts');
    })
});

app.put('/nfts/:id', (req, res)=>{
    NFT.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedModel) => {
        res.redirect('/nfts');
    })
});

app.delete('/nfts/:id', (req, res)=>{
    NFT.findByIdAndRemove(req.params.id, (err, data)=>{
        res.redirect('/nfts');//redirect back to fruits index
    });
});




//___________________
//Listener
//___________________
app.listen(PORT, () => console.log( 'Listening on port:', PORT));
