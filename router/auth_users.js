const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = []; // filled by /register in public routes

// ---------- helpers ----------
const isValid = (username) => {
  // true if username already exists
  return users.some(u => u.username === username);
};

const authenticatedUser = (username, password) => {
  // true if username/password pair matches a stored user
  return users.some(u => u.username === username && u.password === password);
};

// ---------- Task 7: login ----------
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // sign JWT (keep the secret consistent with index.js if used there)
  const accessToken = jwt.sign({ username }, 'access', { expiresIn: '1h' });

  // save in session for later review routes
  req.session.authorization = { accessToken, username };

  return res.status(200).json({ message: 'Login successful', token: accessToken });
});

// ---------- Task 8: add/modify a review ----------
regd_users.put('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review; // lab spec uses query ?review=...
  const session = req.session.authorization;

  if (!session || !session.username) {
    return res.status(401).json({ message: 'Login required' });
  }
  if (!review) {
    return res.status(400).json({ message: 'Review text is required (use ?review=...)' });
  }
  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found' });
  }

  const username = session.username;
  if (!books[isbn].reviews) books[isbn].reviews = {};

  // add or update
  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: 'Review added/updated', reviews: books[isbn].reviews });
});

// ---------- Task 9: delete own review ----------
regd_users.delete('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const session = req.session.authorization;

  if (!session || !session.username) {
    return res.status(401).json({ message: 'Login required' });
  }
  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found' });
  }

  const username = session.username;
  if (books[isbn].reviews && books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: 'Review deleted', reviews: books[isbn].reviews });
  }

  return res.status(404).json({ message: 'No review by this user for this book' });
});

module.exports.authenticated = isValid; // lab expects this export name
module.exports.users = users;
module.exports.regd_users = regd_users;
