const express = require('express');

const router = express.Router();

const Users = require('./userDb')
const Posts = require('../posts/postDb')

router.post('/', validateUser, (req, res) => {
  Users.insert({ name: req.body.name })
    .then(user => {
      res.status(201).json(user)
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ error: 'Error creating new user' })
    })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  const newPost = req.body;
  if (!newPost.text) {
    res.status(400).json({ errorMessage: "Please provide text for the post." })
  } else {
    Posts.insert({ ...req.body, user_id: req.user.id })
      .then((post) => {
        if (post) {
          res.status(201).json(post)
        } else {
          res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
      }).catch(error => {
        console.log(error)
        res.status(500).json({ error: "There was an error while saving the comment to the database" })
      })
  }
})

router.get('/', (req, res) => {
  Users.get()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ error: 'Error getting users' })
    })
});

router.get('/:id', validateUserId, (req, res) => {
  Users.getById(req.params.id)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ error: 'Error finding that user' })
    })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  Users.getUserPosts(req.params.id)
    .then(post => {
      res.status(200).json(post)
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ error: 'Error finding posts for that user' })
    })
});

router.delete('/:id', validateUserId, (req, res) => {
  Users.remove(req.params.id)
    .then(() => {
      res.status(200).json({ message: "Deleted User" })
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ error: 'Error deleting that user' })
    })
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  const changes = req.body;
  !changes.name ?
    res.status(400).json({ errorMessage: "Please provide name for this user." })
    : Users.update(req.params.id, changes)
      .then((user) => {
        if (user) {
          res.status(200).json(user)
        } else {
          res.status(404).json({ message: "The user with the specified ID does not exist." })
        }
      }).catch(error => {
        console.log(error)
        res.status(500).json({ error: "The user information could not be modified." })
      })
})


//custom middleware

function validateUserId(req, res, next) {
  Users.getById(req.params.id)
    .then((users) => {
      if (users) {
        req.user = users;
        next();
      } else {
        res.status(400).json({ message: "invalid user id" })
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ errorMessage: 'There was a problem while finding the user id' })
    })
}

function validateUser(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: "missing user data" })
  } else if (!req.body.name) {
    res.status(400).json({ message: "missing required text field" })
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: "missing post data" })
  } else if (!req.body.text) {
    res.status(400).json({ message: "missing required text field" })
  } else {
    next();
  }
}

module.exports = router;
