const db = require("../models");
const cloudinary = require('cloudinary');
const keys = require("../config/keys");

module.exports = {

  findAllUserAlbums: function(req, res) {
    db.Albums
      .find({ owner: req.params.id })
      .sort({ _id: -1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },

  createAlbum: function(req, res) {
    console.log('createAlbum req.body: ', req.body)
    db.Albums
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },

  addPhototoAlbum: function(req, res) {
    // console.log('addPhototoAlbum req.body.photo: ', req.body.photo)
    db.Albums
      .findOneAndUpdate({ _id: req.params.album }, {$push: { photos: req.body.photo }}, { new: true })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },

  createPhoto: function(req, res) {
    // console.log('createPhoto req.body.data_uri: ', req.body.data_uri);
    cloudinary.uploader.upload(req.body.data_uri, function(result) { 
        console.log('result: ', result);
      imageUploadId = result.public_id;
        // console.log('imageUploadId: ', imageUploadId);
      newObj = req.body;
      delete newObj['data_uri'];
        // console.log(newObj);
      newObj.imageUploadId = result.public_id;
        // console.log(newObj);
      db.Photos
        .create(newObj)
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    }, 
      { upload_preset: "cali-cool-ucb" });
  },

  likePhoto: function(req, res) {
    console.log(req.params.id, req.params.photoId)
    db.Users
    .findById(req.params.id)
    .then( user => {
      return db.Photos.findOneAndUpdate({"_id": req.params.photoId}, 
      { $addToSet: { likes: user._id }}, { new: true });
    })
    .then(function(photo){
      res.json(photo);
    })
    .catch(function(error){
      res.json(error);
    });
  },
  unlikePhoto: function(req, res){
    console.log(req.params.id, req.params.photoId)
    db.Users
    .findById(req.params.id)
    .then( user => {
      console.log(user);
      return db.Photos.findOneAndUpdate({"_id": req.params.photoId}, 
      { $pull: { likes: user._id }}, { new: true });
    })
    .then(function(photo){
      console.log(photo)
      res.json(photo);
    })
    .catch(function(error){
      res.json(error);
    });
  },

  likeAlbum: function(req, res) {
    console.log(req.params.id, req.params.albumId)
    db.Users
    .findById(req.params.id)
    .then( user => {
      return db.Albums.findOneAndUpdate({"_id": req.params.albumId}, 
      { $addToSet: { likes: user._id }}, { new: true });
    })
    .then(function(album){
      res.json(album);
    })
    .catch(function(error){
      res.json(error);
    });
  },

  unlikeAlbum: function(req, res){
    console.log(req.params.id, req.params.albumId)
    db.Users
    .findById(req.params.id)
    .then( user => {
      console.log(user);
      return db.Albums.findOneAndUpdate({"_id": req.params.albumId}, 
      { $pull: { likes: user._id }}, { new: true });
    })
    .then(function(album){
      console.log(album)
      res.json(album);
    })
    .catch(function(error){
      res.json(error);
    });
  },

  findUsersAlbums: function(req, res) {
  console.log(req.params.id);
  db.Albums
    .find({"owner": req.params.id})
    .populate({
      path: "photos",
      options: 
      { limit: 5 ,
        sort: {
          dateUpdated: -1
        }
      }
    })
    .populate("owner")
    .then(dbModel => res.json(dbModel))
    .catch(err => res.status(422).json(err));

  },

  createComment: function(req, res) {
    db.Comments
    .create({
      comment: req.body.comment,
      user: req.params.id
    })
    .then(dbModel => res.json(dbModel))
    .catch(err => res.status(422).json(err));
  },

  updateProfilePhoto: function(req, res) {
    console.log("user Id", req.params.id)
    console.log("photo url", req.body.imageUploadId)
    db.Users
    .findOneAndUpdate({ _id: req.params.id }, { profilePicture: req.body.imageUploadId }, { new: true })
    .then(dbModel => res.json(dbModel))
    .catch(err => res.status(422).json(err));
  },

  getUserProfile: function(req, res) {
    db.Users
    .findById(req.params.id)
    .then(dbModel => res.json(dbModel))
    .catch(err => res.status(422).json(err));
  }

};