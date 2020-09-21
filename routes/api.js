
/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
if (process.env.NODE_ENV !=='production') {
  require('dotenv').config()
}
var expect = require('chai').expect;
let mongodb = require('mongodb')
let mongoose = require('mongoose')
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {


	mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true }, ()=> console.log("connection"));

	let bookSchema = new mongoose.Schema({
		title: {type: String, required: true},
		comments: [String]
	})

	let Book = require("../models/books.js")

  app.route('/api/books')
  .get( async (req, res) => {
    try {
      let allBooks = await Book.find({})
      let arr = [];
      const bookObj = {};
        
       allBooks.forEach((oneBook) => {
        let book = oneBook.toJSON()
        book['commentcount'] = book.comments.length;
        arr.push(book)

       })
       res.json(arr)
    } catch (err) {
        res.json(err)
    }
  })
    
  .post( async (req, res) =>{
    var {title} = req.body;
    if (!title) return res.json("no title");
    try {
      let newBook =  await new Book({title});
      let savedBook = newBook.save();
      res.json(newBook)
    } catch (err) {
      res.json(err)
    }
  })
  
  .delete(async(req, res) =>{
    try {
      await Book.deleteMany()
      res.json("complete delete successful");

    } catch (err) {
      res.json(err);
    }
    //if successful response will be 'complete delete successful'
  });


  app.route('/api/books/:id')
  .get(async (req, res) =>{
    var bookid = req.params.id;
    try {
       let findBook = await Book.findById(bookid);
       res.json(findBook);
    } catch(err) {
     // console.log(err)
      res.json('no book exists');
    }
  })
  
  .post(async (req, res) => {
    var bookid = req.params.id;
    var {comment} = req.body;

    try {
      let editedBook = await Book.findByIdAndUpdate(bookid, {$push: {comments: comment}}, {new: true, useFindAndModify: false});
      res.json(editedBook);
   } catch(err) {
     console.log(err)
     res.json("no book exists");
     
   }
  })
  
  .delete(async(req, res) =>{
    var bookid = req.params.id;
    try {
     await Book.findByIdAndRemove(bookid, {useFindAndModify:false});
      res.json("delete successful");
    } catch (err) {
      console.log(err)
      res.json("no book exists");
    }
    var bookid = req.params.id;
  });

  
};
