const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
//Post model
const Post = require('../../models/Post');
//Profile
const Profile = require('../../models/Profile');
//validation
const validatePostInput = require('../../validations/post');

//@route   GET api/posts/test
//@desc    Tests posts route
//@access  public
//outputs json
router.get('/test', (req, res) => res.json({ msg: 'Posts works' }));

//@route   Get api/posts
//@desc    get posts
//@access  public
router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostsfound: 'No posts found' }));
});

//@route   Get api/posts/:id
//@desc    Find single post
//@access  public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ nopostfound: 'No post found with that id' })
    );
});

//@route   POST api/posts
//@desc    Create  posts
//@access  private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    //check validation
    if (!isValid) {
      //if any errors, send 400 with errors object
      return res.status(400).json(errors);
    }
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });
    newPost.save().then(post => res.json(post));
  }
);

//@route   Delete api/posts/:id
//@desc    Delete single post
//@access  private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          //check post owner. post user is not a string, req.user.id is a string.
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: 'User not Authorized' });
          }
          //Delete
          post.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
    });
  }
);

//@route   Post api/posts/like/:id
//@desc    Like a post
//@access  private
router.post(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          //filters to see if the user has already liked it or not.
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: 'User already liked.' });
          }
          //Add user id to likes array
          post.likes.unshift({ user: req.user.id });
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
    });
  }
);

//@route   Post api/posts/unlike/:id
//@desc    Unlike a post
//@access  private
router.post(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          //filters to see if the user has already liked it or not.
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: 'You have not liked yet.' });
          }
          //Get remove index
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);
          //splice out of array
          post.likes.splice(removeIndex, 1);
          //Save
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
    });
  }
);

//@route   Post api/posts/comment/:id
//@desc    Add comment to post
//@access  private
router.post(
  '/comment/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    //check validation
    if (!isValid) {
      //if any errors, send 400 with errors object
      return res.status(400).json(errors);
    }
    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };
        //Add to comments array
        post.comments.unshift(newComment);
        //Save
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: 'Post not found' }));
  }
);

//@route   DELETE api/posts/comment/:id/:comment_id
//@desc    remove comment from post
//@access  private
router.delete(
  '/comment/:id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        //Check to see if comment exists
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: 'Comment does not exist' });
        }
        //Get remove index
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);
        //splice comment out of array
        post.comments.splice(removeIndex, 1);
        //save
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(400).json({ postnotfound }));
  }
);

module.exports = router;
