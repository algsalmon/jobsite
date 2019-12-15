// import  {fetchJobs} from "..data/jobs.js";
// fetchJobs ('Sales_Executive');

//push notifications 
const bodyParser = require('body-parser');
const webpush = require('web-push');
const path = require('path');

var express = require('express');
var router = express.Router();
const axios = require('axios');
var request = require("request");
const querystring = require('querystring');
const mongoose = require('mongoose');
//var dateFormat = require('dateformat');
var clientSubscriptions = [];


//const mongoURL = 'mongodb://uwom5limrhsqdg5x1ttu:BdVRE2DVoCUtAsQBr7eF@babj45inn3ueei2-mongodb.services.clever-cloud.com:27017/babj45inn3ueei2'
// const mongoURL = 'mongodb+srv://jobgrabba:supersecretpassw0rd@cluster0-8txdz.mongodb.net/babj45inn3ueei2?retryWrites=true&w=majority'
// console.log(`db_url: ${mongoURL}`)
const options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true
}
// mongoose.connect(mongoURL,
//   options,
//   function (err) {
//     if (err) {
//       console.log(`Connection Error occured: ${err}`);
//       process.exit(-1)
//     }
//   }
// );

const app = express();

app.use(express.static(path.join(__dirname, "clients")))
//push notification
app.use(bodyParser.json());
//subscrine route 
app.set('clientSubscriptions', clientSubscriptions);


const publicVapidKey = 'BFY-_UWXlRRDPkSiBqTQuP1L9hT5L0s2t4VEESG0dCkeAIFzxEfkoMH5iEsVx8QEgXvxKX5io6UMo5W1QACK7eI';
const privateVapidKey = '2b-NI0-lcQv4kWxgVKP5SMZlQXF-jCNj_MW7fLRns2o'

webpush.setVapidDetails('mailto: almondcampaigns@gmail.com', publicVapidKey, privateVapidKey);

setInterval(function () {
//   console.log("timeout. running ");
//   console.log("subscription count:" + clientSubscriptions.length);
//   for (var index = 0; index < clientSubscriptions.length; index++) {
//     var subscription = clientSubscriptions[index];
//     console.log("sending notification to:" + subscription.keys.auth);
//     // create payload
//     const payload = JSON.stringify({ title: 'Push Test ' });
//     // pass object into sendNotification
//     webpush.sendNotification(subscription, payload).catch(err => console.log("error:"+err));

//   }

}, 15000);



router.post('/subscribe', function (req, res) {
  //get subscription object
  const subscription = req.body;
  console.log("Client subscribed3:" + subscription.keys.auth);
  var subscriptions = app.get("clientSubscriptions");
  subscriptions.push(subscription);
  console.log('subscription count:' + subscriptions.length);
  // send 201 status to say resource created succesfully 
  res.status(201).json({});

  // create payload
  /*const payload = JSON.stringify({ title: 'Push Test' });

  // pass object into sendNotification
  webpush.sendNotification(subscription, payload).catch(err => console.error(err));*/
});

const userSchema = mongoose.Schema({



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
router.get('*', function (req, res, next) {
  console.log("protocol:" + req.protocol);
  console.log("forwarded protocol:" + req.get('X-Forwarded-Proto'));
  if (req.get('X-Forwarded-Proto') === 'http') {
    console.log('redirecting to https://' + req.headers.host + req.url)
    res.redirect('https://' + req.headers.host + req.url);
    return;
  } else {
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

router.get('/main', function (req, res, next) {
  res.render('main', { title: 'jobgrabba' });
});

// UserModel.find(
//   function (err,users) {
//    console.log(users);
//   }
// );
//console.log("user models:");
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('jobboard2', { title: 'jobgrabba' });
});

router.get('/jobboard2', function (req, res, next) {
  res.render('jobboard2', { title: 'jobgrabba' });
});

router.get('/jobcards', function (req, res, next) {
  res.render('jobcards', { title: 'jobgrabba' });
});

router.get('/registerb&m', function (req, res, next) {
  res.render('registerb&m', { title: 'jobgrabba' });
});

router.get('/freecreditreport', function (req, res, next) {
  res.render('freecreditreport', { title: 'Free Credit Report' });
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

router.get('/c2version', function (req, res, next) {
  res.render('c2version', { title: 'Jobgrabba deals and discounts for you' });
});

router.get('/zipform', function (req, res, next) {
  res.render('zipform', { title: 'Jobgrabba deals and discounts for you' });
});

router.get('/signupsendy', function (req, res, next) {
  res.render('signupsendy', { title: 'Jobgrabba deals and discounts for you' });
});


// Generally speaking the req value in the function gets information (i.e. getting info from the post request below) and the res value in the function shows information
// signup for sendy email sending platform code below
router.post('/signupsendy', function (req, res, next) {
  console.log("sending data");
  const listId = 'A41rLc7GzY3qU265dQZG6w';
  const {
    title,
    name,
    email,
    lastName,
    address1,
    address2,
    city,
    postCode,
    phone,
    dob_day,
    dob_month,
    dob_year,
    tickYes,
    tickYes1,
    tickYes2,
    tickYes3,
    listname,
    source,
    reference, 
    ipaddress,
    jobCategories
  } = req.body;

  function twoDigitString(value){
      var result = "";
      if(value<10){
        result = "0"+value;
      }else{
        result = ""+value;
      }
      return result;
  }

  function getTimeStamp(){
    var d = new Date();
    var day = twoDigitString(d.getDate());
    var month = twoDigitString(d.getMonth()+1);
    var year = twoDigitString(d.getFullYear());
    var hours = twoDigitString(d.getHours());
    var mins = twoDigitString(d.getMinutes());
    var secs = twoDigitString(d.getSeconds());
    var datetime = day+"/"+ month+"/"+ year + " "+ hours+":"+mins+":"+secs;
    console.log(datetime);
    return datetime;  
    }
    

  var currentTimestamp = getTimeStamp();
  console.log("currentTimeStamp:"+currentTimestamp);
  var options = {
    method: 'POST',
    url: 'https://dealgrabba.online/sendy/subscribe',
    headers:
    {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    form:
    {
      title,
      name,
      email,
      lastName,
      address1,
      address2,
      city,
      postCode,
      phone,
      dob_day: dob_day + '/' + dob_month + '/' + dob_year,
      list: listId,
      tickYes,
      tickYes1,
      tickYes2,
      tickYes3,
      listname,
      source,
      reference,
      currentTimestamp,
      ipaddress
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
  var genderString;
  if (title == "Mr"){
    genderString = "Male";
  }else if (title == "Mrs" || title == "Ms"){
    genderString = "Female";
  }


  var queryString = {
    gender: genderString,
    firstname: name,
    email: email,
    lastname: lastName,
    optinurl: "http://www.jobgrabba.com/register",
    optindate: currentTimestamp,
    ipaddress: ipaddress,
    prize: "Job Advert",
    trafficid: "10123"
  }
  // (dob_day<10?"0":"")+dob_day + '/0' + (dob_month<10?"0":"")+dob_month + '/' + dob_year+ " 12:00:01"
  console.log("gogroopie query String:" + JSON.stringify(queryString));
  var gogroopie = {
    async: true,
    crossDomain: true,
    url: "https://lead365.leadbyte.co.uk/api/submit.php?campid=GOGROOPIECOPY&sid=SID492&returnjson=yes",
    method: "GET",
    qs: queryString
  }
  //\"response\":\"Gender is not an expected value\",
  //\"timestamp\":\"2019-12-08T09:21:35Z\",\"code\":-5,
  //\"info\":[\"IP Address is required\",
  //\"Validation for Optin Date failed. Date was not valid.\",
  //\"Opt-in URL is required\"],
  //\"leadId\":null,\"processTime\":0.07}
  request(gogroopie, function (error, response, body) {
    if (error) {
      console.log("request sent with error:" + JSON.stringify(error));
      //res.status(400).send(error);
    } else {
      //res.set('Content-Type', 'text/html');
      //res.send(new Buffer(body));
      console.log("gogroopieresponse:" + JSON.stringify(response));
      console.log("request sent correctly");
      //res.send(body)
    }
  });

  var qsZip = {
    name:name,
    email: email,
    search:"Customer Assistant",
    optinurl: "http://www.jobgrabba.com/register",
    ip_address: ipaddress,
    location:city
    
  }

  var zip = {
    async: true,
    crossDomain: true,
    url: "https://api.ziprecruiter.com/job-alerts/v2/subscriber",
    method: "POST",
    qs:qsZip,
    headers:
    {
      "Authorization": "Basic Nnptd2UyeTNoeHc2eGl4NzJrN3F4Z3g5NDR0dTZycDM6",
      "User-Agent": "PostmanRuntime/7.20.1",
      "Accept": "*/*",
      "Cache-Control": "no-cache",
      "Postman-Token": "80ff1cf7-4a44-4ad1-8371-29d2ee3791e1,a341a372-f147-487e-987d-c899e188a0dd",
      "Host": "api.ziprecruiter.com",
      "Accept-Encoding": "gzip, deflate",
      "Cookie": "__cfduid=df4f9f833b6aa10dc529158686e8018221572423330; zglobalid=6002c018-fda2-4a0c-ab26-3b0e0877cb82.da9e06fa9f7d.5df2df29; ziprecruiter_browser=37.152.39.64_1576265510_339142738; zva=100000000",
      "Content-Length": "0",
      "Connection": "keep-alive",
      "cache-control": "no-cache"
    },
  };

  request(zip, function (error, response, body) {
    if (error) {
      console.log("request sent with error:" + JSON.stringify(error));
      //res.status(400).send(error);
    } else {
      //res.set('Content-Type', 'text/html');
      //res.send(new Buffer(body));
      console.log("zipresponse:" + JSON.stringify(response));
      console.log("request sent correctly");
      //res.send(body)
    }
  });
  
  





  if (tickYes2) {
    console.log("lastname:" + lastName);
    // send request to other service
    var options2 = {
      method: 'GET',
      async: true,
      crossDomain: true,
      url: 'https://trk.m-t.io/action?_tec=0&_tep=6091614734909440',
      qs:
      {
        firstname: name,
        email: email,
        lastname: lastName,
        mobile: phone,
        subAffiliate: listId

      }
    };

    request(options2, function (error, response, body) {
      if (error) {
        console.log("request to amazon sent with error");
        console.log("body:" + body);
        //res.status(400).send(error);
      } else {
        //res.set('Content-Type', 'text/html');
        //res.send(new Buffer(body));
        console.log("request to amazon sent correctly");
        console.log("body:" + body);
        //res.send(body)
      }
    });
  }

  if (tickYes3) {
    console.log("lastname:" + lastName);
    // send request to other service
    var britSeniors = {
      method: 'GET',
      async: true,
      crossDomain: true,
      url: 'https://pp.leadbyte.co.uk/api/submit.php?campid=BSIACOREG&sid=74265&returnjson=yes',
      qs:
      {
        firstname: name,
        lastname: lastName,
        email: email,
        dob: dob_day + '/' + dob_month + '/' + dob_year,
        phone1: phone,
        mobile: phone,
        ipaddress: ipaddress,
        source: "http://www.jobgrabba.com",
        ssid: source,
        postcode: postCode
      }
    };

    request(britSeniors, function (error, response, body) {
      if (error) {
        console.log("request to brit seniors sent with error");
        console.log("body:" + body);
        //res.status(400).send(error);
      } else {
        //res.set('Content-Type', 'text/html');
        //res.send(new Buffer(body));
        console.log("request to brit seniors sent correctly");
        console.log("body:" + body);
        //res.send(body)
      }
    });
  }

  res.render('deals', {

   

    title: 'Welcome to jobgrabba', userInfo: {
      title: title,
      firstname: name,
      email: email,
      lastname: lastName,
      mobile: phone,
      subAffiliate: listId,
      dob: dob_day + '/' + dob_month + '/' + dob_year,
      optindate: currentTimestamp,
      street1: address1,
      towncity: city,
      postcode: postCode,
      source: "http://www.jobgrabba.com",
      reference: "http://www.jobgrabba.com",
      ipaddress: ipaddress
    }
  });

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
