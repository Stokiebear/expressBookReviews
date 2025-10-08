const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const users = require('/auth_users.js');

// Register a new user
public_users.post('/register', (req, res) => {
    const { username, password } = req.body;
  
    // 1) both fields required
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
  
    // 2) must be unique
    const exists = users.some(u => u.username === username);
    if (exists) {
      return res.status(409).json({ message: 'User already exists' });
    }
  
    // 3) save user (plain text per assignment; in real apps hash the password)
    users.push({ username, password });
  
    // 4) done
    return res.status(201).json({ message: 'User successfully registered. Now you can login.' });
  });


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  Promise
  .resolve(books);
    .then (data => res.json.(data));
    .catch(err ,return res.status(500).json({message: "Failed to load books", error: String (err)});
  res.send(JSON.stringify(books, null, 4));
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async (req, res) {
  try{
  const isbn  = req.params.isbn;
  const book = await Promise.resolve(books[isbn]);
  if (!book) {
    return res.status(404).json({message: "No book found with this ISBN"});
  }
  ({return :res.json(book)
  catch (err); 
  ,return :res.send(JSON.stringify(book, null, 4));
 });
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    try {
      const author = req.params.author;
      const matches = await Promise.resolve(
        Object.values(books).filter(b => b.author === author)
      );
      if (matches.length === 0) {
        return res.status(404).json({ message: "No books found for this author" });
      }
      return res.json(matches);
    } catch (err) {
      return res.status(500).json({ message: 'Failed to get books by author', error: String(err) });
    }
  });
  

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    try {
      const title = req.params.title;
      const matches = await Promise.resolve(
        Object.values(books).filter(b => b.title === title)
      );
      if (matches.length === 0) {
        return res.status(404).json({ message: "No books found with this title" });
      }
      return res.json(matches);
    } catch (err) {
      return res.status(500).json({ message: 'Failed to get books by title', error: String(err) });
    }
  });
  

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const review =req.params;
  const matches =Object.values ()
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
