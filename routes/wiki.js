var express = require('express');
var models = require('../models');
var Promise = require('bluebird');
var router = express.Router();

router.get('/', function(req, res, next) {
  models.Page.findAll({}).then(function(jsonArr) {
    var pages = jsonArr.map(function(json) {
      return json.dataValues;
    });
    res.render('index', {pages: pages});
  });

});

router.post('/', function(req, res, next) {
  var jsonInput = req.body;

  models.User
    .findOrCreate({where: {name: jsonInput.author_name, email: jsonInput.author_email}})
    .then(function(values){
      var user = values[0];
      var page = models.Page.build({
        title: jsonInput.title,
        content: jsonInput.content,
        status: jsonInput.status
      });

      return page.save().then(function (pageJson){
        return page.setAuthor(user);
      });

    }).then(function (page){
      res.redirect(page.urlTitle);
    }).catch(next);
});




router.get('/add', function(req, res, next) {
  res.render('addpage');
});

router.get('/users', function(req, res, next){
  models.User.findAll({}).then(function(jsonArr) {
    var users = jsonArr.map(function(json) {
      return json.dataValues;
    });
    res.render('users', {users: users});
  });
});

router.get('/users/:username', function(req, res, next){

});

router.post('/users', function(req, res, next){



});

router.put('/users/:username', function(req, res, next){

});

router.delete('/users/:username', function(req, res, next){

});


router.get('/:pageurl', function(req, res, next) {
  var pageUrl = req.params.pageurl;
  models.Page.findOne({
    where: {urlTitle: pageUrl}
  }).then(function (newPage) {
    res.render('wikipage', newPage.dataValues);
  }).catch(next);
});

module.exports = router;


