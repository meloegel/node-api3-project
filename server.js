const express = require('express');

const server = express();

const postRouter = require('./posts/postRouter')
const userRouter = require('./users/userRouter')

server.use(express.json())

server.use('/api/posts', logger, postRouter)
server.use('/api/users', logger, userRouter)

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url} ${req.get(
      'Origin'
    )}`
  )
  next();
}

server.use(logger)

module.exports = server;
