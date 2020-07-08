const express = require('express');

const router = express.Router();

const Posts = require('./postDb')

router.get('/', (req, res) => {
  Posts.get()
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ error: "Could not load posts" })
    })
});

router.get('/:id', validatePostId, (req, res) => {
  Posts.getById(req.params.id)
    .then(post => {
      res.status(200).json(post)
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ error: 'Error finding that post' })
    })
});

router.delete('/:id', validatePostId, (req, res) => {
  Posts.remove(req.params.id)
    .then(() => {
      res.status(200).json({ message: "Deleted Post" })
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ error: 'Error deleting that post' })
    })
});

router.put('/:id', validatePostId, (req, res) => {
  const changes = req.body;
  !changes.text ?
    res.status(400).json({ errorMessage: "Please provide text for this post." })
    : Posts.update(req.params.id, changes)
      .then((post) => {
        if (post) {
          res.status(200).json(post)
        } else {
          res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
      }).catch(error => {
        console.log(error)
        res.status(500).json({ error: "The post information could not be modified." })
      })
});

// custom middleware

function validatePostId(req, res, next) {
  Posts.getById(req.params.id)
    .then((posts) => {
      if (posts) {
        req.post = posts;
        next();
      } else {
        res.status(400).json({ message: "invalid post id" })
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ errorMessage: 'There was a problem while finding the post' })
    })
}

module.exports = router;
