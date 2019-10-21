// import  {fetchJobs} from "..data/jobs.js";
// fetchJobs ('Sales_Executive');

var express = require('express');
var router = express.Router();
const axios = require('axios');
var request = require("request");
const querystring = require('querystring');
const mongoose = require('mongoose');
//const mongoURL = 'mongodb://uwom5limrhsqdg5x1ttu:BdVRE2DVoCUtAsQBr7eF@babj45inn3ueei2-mongodb.services.clever-cloud.com:27017/babj45inn3ueei2'
const mongoURL = 'mongodb+srv://jobgrabba:supersecretpassw0rd@cluster0-8txdz.mongodb.net/babj45inn3ueei2?retryWrites=true&w=majority'
console.log(`db_url: ${mongoURL}`)
const options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true
}
mongoose.connect(mongoURL,
  options,
  function (err) {
    if (err) {
      console.log(`Connection Error occured: ${err}`);
      process.exit(-1)
    }
  }
);

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  address1: String,
  address2: String,
  city: String,
  postCode: String,
  phone: String,
  tickYes: String,
  tickYes1: String,


});

var UserModel = mongoose.model('users', userSchema);

// var newUser = new UserModel ({
//         firstName: "",
//         lastName: "",
//         email: "",
//         address1: "",
//         address2: "",
//         city: "",
//         postCode: "",
//         phone: "",
// });

// newUser.save(function(error,user) {
//    console.log(newUser)      
// }
// );

UserModel.find(function (err, users) {
  console.log(users)
    ;
}
)

//http to https code snippet for node js 
router.get('*', function(req, res,next ) {
  console.log("protocol:"+req.protocol);
  console.log("forwarded protocol:"+req.get('X-Forwarded-Proto'));
  if (req.get('X-Forwarded-Proto') === 'http'){
      console.log('redirecting to https://' + req.headers.host + req.url)
      res.redirect('https://' + req.headers.host + req.url);
      return;
  }else{
    next();
  }
  // Or, if you don't want to automatically detect the domain name from the request header, you can hard code it:
  // res.redirect('https://example.com' + req.url);
  });

router.post('/createuser', function (req, res, next) {
  const aNewUser = new UserModel({

    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    address1: req.body.address1,
    address2: req.body.address2,
    city: req.body.city,
    postCode: req.body.postCode,
    phone: req.body.phone,
    tickYes: req.body.tickYes,
    tickYes1: req.body.tickYes1,


  });

  aNewUser.save(
    function (error, user) {
      console.log('new user created');
      // res.json({result: true});
      res.render('createuser', { title: 'Welcome' });
    })
});



// UserModel.find(
//   function (err,users) {
//    console.log(users);
//   }
// );
//console.log("user models:");
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('jobboard', { title: 'jobgrabba' });
});

router.get('/freecreditreport', function(req, res, next ) {
  res.render( 'freecreditreport', { title: 'Free Credit Report' });
});

router.get('/createuser', function (req, res, next) {
  res.render('createuser', { title: 'Welcome to jobgrabba' });
});


router.get('/views/fetchjobs', function (req, res, next) {
  res.render('fetchjobs', { title: 'jobgrabba' });
});

router.get('/views/jobs', function (req, res, next) {
  res.render('jobs', { title: 'jobs' });
});

router.get('/register', function (req, res, next) {
  res.render('register', { title: 'Registration' });
});

router.get('/privacy', function (req, res, next) {
  res.render('privacy', { title: 'Privacy Policy' });
});

router.get('/tandc', function (req, res, next) {
  res.render('tandc', { title: 'tandc' });
});

router.get('/aboutus', function (req, res, next) {
  res.render('aboutus', { title: 'About Us' });
});

router.get('/unsubscribe', function (req, res, next) {
  res.render('unsubscribe', { title: 'Unsubscribe' });
});

router.get('/australia', function (req, res, next) {
  res.render('australia', { title: 'Aussie Jobs' });
});


router.get('/registerAU', function (req, res, next) {
  res.render('registerAU', { title: 'Aussie Jobs' });
});

router.get('/registerlidl', function (req, res, next) {
  res.render('registerlidl', {
    title: 'LIDL are hiring new staff now! By joining jabgrabba you are agreeing to our terms and conditions and privacy policy..'
  });
});

router.get('/signupaus', function (req, res, next) {
  res.render('signupaus', { title: 'signup' });
});

router.get('/signup', function (req, res, next) {
  res.render('signup', { title: 'signup' });
});

router.get('/deals', function (req, res, next) {
  res.render('deals', { title: 'Jobgrabba deals and discounts for you' });
});

router.get('/previews', function (req, res, next) {
  res.render('previews', { title: 'Jobgrabba deals and discounts for you' });
});

router.get('/signupsendy', function (req, res, next) {
  res.render('signupsendy', { title: 'Jobgrabba deals and discounts for you' });
});

// signup for sendy email sending platform code below


router.post('/signupsendy', function (req, res, next) {
  console.log("sending data");
  const listId = 'A41rLc7GzY3qU265dQZG6w';
  const {
    name,
    email,
    lastName,
    address1,
    address2,
    city,
    postCode,
    phone,
    tickYes,
    tickYes1,
    tickYes2 } = req.body;

  var options = {
    method: 'POST',
    url: 'https://dealgrabba.online/sendy/subscribe',
    headers:
    {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    form:
    {
      name,
      email,
      lastName,
      address1,
      address2,
      city,
      postCode,
      phone,
      list: listId,
      tickYes,
      tickYes1,
      tickYes2
    }
  };

  request(options, function (error, response, body) {
    if (error) {
      console.log("request sent with error");
      //res.status(400).send(error);
    } else {
      //res.set('Content-Type', 'text/html');
      //res.send(new Buffer(body));
      console.log("request sent correctly");
      //res.send(body)
    }
  });

  if (tickYes2){
    console.log("lastname:"+lastName);
    // send request to other service
    var options2 = {
      method: 'GET',
      async: true,
      crossDomain: true,
      url: 'https://trk.m-t.io/action?_tec=0&_tep=6091614734909440',
      qs:
      {
        firstname : name,
        email : email,
        lastname : lastName,
        mobile : phone,
        subAffiliate : listId
       
      }
    };
  
    request(options2, function (error, response, body) {
      if (error) {
        console.log("request to amazon sent with error");
        console.log("body:"+body);
        //res.status(400).send(error);
      } else {
        //res.set('Content-Type', 'text/html');
        //res.send(new Buffer(body));
        console.log("request to amazon sent correctly");
        console.log("body:"+body);
        //res.send(body)
      }
    });
  }

  res.render('deals', { title: 'Welcome to jobgrabba', userInfo :{firstname : name,
  email : email,
  lastname : lastName,
  mobile : phone,
  subAffiliate : listId}});


});




// router.get('/createuser',function(req,res, next){
//   console.log("create user action")
//   new UserModel(
//     {
//       firstName: req.params.firstName,
//       lastName: req.params.lastName,
//       email: req.params.email,
//       phone: req.params.phone,
//     }).save(
//       function(err,user,count){
//          console.log("user saved correctly "+ err +" , "+count);
//          res.redirect('/'); 
//       })


// });


module.exports = router;
