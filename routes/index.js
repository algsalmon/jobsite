import { fetchJobs } from "..data/jobs.js";
fetchJobs ('Sales_Executive');

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const jobs = fetchjobs;
  res.render('jobboard', { title: 'jobgrabba',jobs: jobs });
});

router.get('/views/fetchjobs', function(req, res, next){
  res.render('fetchjobs', {title: 'jobgrabba'});
});

router.get('/views/jobs.js'), function(req, res, next){
  res.render('jobs', {title: 'jobs'});
}

module.exports = router;
