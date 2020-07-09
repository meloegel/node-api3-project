const express = require('express');

const server = express();

const postRouter = require('./posts/postRouter')
const userRouter = require('./users/userRouter')

server.use(express.json())

server.use('/api/posts', logger, postRouter)
server.use('/api/users', logger, userRouter)

server.get('/', (req, res) => {
  const message = process.env.MESSAGE
  res.status(200).json({ message });
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
