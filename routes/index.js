var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/jobboard', function(req, res, next){
  res.render('jobboard', {title: 'jobgrabba'});
});

router.get('/views/fetchjobs', function(req, res, next){
  res.render('fetchjobs', {title: 'jobgrabba'});
});


router.get('/search', function(req,res,next){
//import
var GO = require("goquery");
 
//use
var q = new GO.Query(data);
});
//...
module.exports = router;
