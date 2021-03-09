// implement your posts router here

const express = require('express');

const router = express.Router();

const Post = require('./posts-model');

// GET Request -> All Posts
router.get('/', (req, res) => {
    Post.find()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(err => {
            res.status(500).json({ message: "The posts information could not be retrieved" })
        })
})

// GET Request -> Posts By ID
router.get('/:id', (req, res) => {
    const id = req.params.id;

    Post.findById(id)
        .then(post => {
            if(!post){
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            } else {
                res.status(200).json(post);
            }
        })
        .catch(err => {
            res.status(500).json({ message: "The post information could not be retrieved" })
        })
})

// POST Request -> Add a Post Via Req Body
router.post('/', (req, res) => {
    const newPost = req.body;

    if (!newPost.title || !newPost.contents) {
        res.status(400).json({ message: "Please provide title and contents for the post" });
    } else {
        Post.insert(newPost)
            .then(post => {
                Post.findById(post.id)
                    .then(addedPost => {
                        res.status(201).json(addedPost);
                    })
            })
            .catch(err => {
                res.status(500).json({ message: "There was an error while saving the post to the database" });
            });
    }
});

// PUT Request -> Update Post By ID
router.put('/:id', (req, res) => {
    const id = req.params.id;

    const updatedPost = req.body;

    if (!updatedPost.title || !updatedPost.contents) {
        res.status(400).json({ message: "Please provide title and contents for the post" });
    } else {
        Post.update(id, updatedPost)
            .then(post => {
                if(post){
                    Post.findById(id)
                        .then(newPost => {
                            res.status(200).json(newPost);
                        })
                } else {
                    res.status(404).json({ message: "The post with the specified ID does not exist" });
                }
            })
            .catch(err => {
                res.status(500).json({ message: "The post information could not be modified" })
            })
    }

})

// DELETE Request -> Delete Post By ID
router.delete('/:id', (req, res) => {
    const id = req.params.id;

    Post.remove(id)
        .then(deleted => {
            if (deleted) {
                res.status(200).json(deleted)
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            }
        })
        .catch(err => {
            res.status(500).json({ message: "The post could not be removed" })
        })
})

// GET Request -> Get All Comments on Post By ID
router.get('/:id/comments', (req, res) => {
    const id = req.params.id;

    Post.findPostComments(id)
        .then(comments => {
            if (comments) {
                res.status(200).json(comments);
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            }
        })
        .catch(err => {
            res.status(500).json({ message: "The comments information could not be retrieved" })
        })
})

module.exports = router;