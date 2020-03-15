// import  {fetchJobs} from "..data/jobs.js";
// fetchJobs ('Sales_Executive');

//push notifications 
const bodyParser = require('body-parser');
const webpush = require('web-push');
const path = require('path');
const fetch = require('node-fetch');
var express = require('express');
var router = express.Router();
const axios = require('axios');
var request = require("request");
const querystring = require('querystring');
const mongoose = require('mongoose');
const multer = require("multer");
const fs = require("fs");
const upload = multer({dest: "cvuploads/"});
//var dateFormat = require('dateformat');
var clientSubscriptions = [];

const mongoURL = 'mongodb://uwom5limrhsqdg5x1ttu:BdVRE2DVoCUtAsQBr7eF@babj45inn3ueei2-mongodb.services.clever-cloud.com:27017/babj45inn3ueei2';
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

const subscriptionDataSchema = mongoose.Schema({
     jobCategories : [String],
     subscription : Object,
     location : String

});

var SubscriptionsDataModel = mongoose.model('subscriptions', subscriptionDataSchema);
const app = express();
SubscriptionsDataModel.find(function (err, subscriptionData) {
    if (subscriptionData){
      clientSubscriptions = subscriptionData;
      app.set('clientSubscriptions',clientSubscriptions);
    }
   // console.log("Data from DB:"+JSON.stringify(subscriptionData));
  }
)



app.use(express.static(path.join(__dirname, "clients")))
//push notification
app.use(bodyParser.json());
//subscrine route 
app.set('clientSubscriptions', clientSubscriptions);


const publicVapidKey = 'BFY-_UWXlRRDPkSiBqTQuP1L9hT5L0s2t4VEESG0dCkeAIFzxEfkoMH5iEsVx8QEgXvxKX5io6UMo5W1QACK7eI';
const privateVapidKey = '2b-NI0-lcQv4kWxgVKP5SMZlQXF-jCNj_MW7fLRns2o'

webpush.setVapidDetails('mailto: almondcampaigns@gmail.com', publicVapidKey, privateVapidKey);


function checkNewPostsForJobCategory(jobCategory,location){
  var promise = new Promise(function(resolve,reject){    
    const searchUrl = "https://api.ziprecruiter.com/jobs/v1?search="+jobCategory+"%20Jobs&location="+location+"&radius_miles=25&days_ago=1&jobs_per_page=10&page=1&api_key=mprhzcufvfyqvnuqezdqrryira9eusdu&geo=&distance=15&posted=14&date=";
    console.log("search url:"+searchUrl);
    fetch(searchUrl)
      .then(response => response.json())
      .then((jobsResponse) => {
        const jobs = jobsResponse.jobs;
        resolve(jobs);
      })
  }
  );
  return promise;  
}
const everyXHours = 6*6; 
var notificationsInterval = 60000 * everyXHours;


setInterval(function () {
   console.log("timeout. running ");
   console.log("subscription count:" + clientSubscriptions.length);
   for (var index = 0; index < clientSubscriptions.length; index++) {
    var subscriptionData = clientSubscriptions[index]; 
    var subscription = subscriptionData.subscription;
    var jobCategories = subscriptionData.jobCategories;
    var location = subscriptionData.location;
    var notificationsInfo = subscriptionData.notificationsInfo;
    const jobCategoriesArray = jobCategories.toString().split(",");
    function notificationAlreadySent(jobCategory){
      //console.log("nots info:"+JSON.stringify(notificationsInfo));
      if (!notificationsInfo){
        return false;
      }

      for(var i =0;i< notificationsInfo.length;i++){        
        const notificationInfo = notificationsInfo[i];
        //console.log("not info:"+JSON.stringify(notificationInfo));        
        if (notificationInfo.jobCategory == jobCategory){
        //  console.log("checking dates");        
          var notDate = notificationInfo.dateSent;
          var dayAgo = new Date();
          dayAgo.setDate(dayAgo.getDate()-1);             
         // console.log("not date:"+notDate+" day ago:"+dayAgo);
          return notDate > dayAgo;
        }
      } 
      return false;

    }
    for (var i=0;i < jobCategoriesArray.length;i++){      
      const jobCategory = jobCategoriesArray[i];
      const timeout = i*15000;
      if (!notificationAlreadySent(jobCategory)){
      checkNewPostsForJobCategory(jobCategory,location).then((jobs) => {
        console.log("new jobs found for "+jobCategory+":"+jobs.length);
        if (jobs.length > 0){
          const notificationInfo ={};
          notificationInfo.jobCategory = jobCategory;
          notificationInfo.dateSent = new Date();
          if (!notificationsInfo){
            notificationsInfo = [];
            subscriptionData.notificationsInfo=notificationsInfo;
          }
          notificationsInfo.push(notificationInfo);
          
          // pass object into sendNotification
          setTimeout(function(){
            console.log("222 sending notification to:" + subscription.keys.auth);
            // create payload
            const payload = JSON.stringify({ title: 'New jobs found near '+location+' for: '+jobCategory ,                                            
                                              jobCategory: jobCategory,
                                              location: location});
            webpush.sendNotification(subscription, payload).catch(err => console.log("error:"+err));
          },timeout);          
        }
      })      
      }else{
        console.log("notification already sent for "+jobCategory+" to:"+subscription.keys.auth);

      }
    }          
   }
}, notificationsInterval);



router.post('/subscribe', function (req, res) {
  //get subscription object
  const data = req.body;
  const location = data.location;
  const subscription = data.subscription;
  const jobCategories = data.jobCategories;
  console.log("Client subscribed3:" + subscription.keys.auth);
  console.log("Job categories:"+jobCategories);
  console.log("location:"+location);
  var subscriptions = app.get("clientSubscriptions");   
  subscriptions.push(data);
// console.log("subscriptions to save:"+JSON.stringify(subscriptions));
  var subscriptionsData = new SubscriptionsDataModel(data);
  subscriptionsData.save(function (err) {
    if (err) {
      console.log(JSON.stringify(err));
    }else{
      console.log("subscriptions save correctly");
    }
  });
  console.log('subscription count:' + subscriptions.length);
  // send 201 status to say resource created succesfully 
  res.status(201).json({});

});





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
  res.render('homepage', { title: 'jobgrabba' });
});

router.get('/jobboard2', function (req, res, next) {
  res.render('jobboard2', { title: 'jobgrabba' });
});

router.get('/jobcards', function (req, res, next) {
  res.render('jobcards', { title: 'jobgrabba' });
});

router.get('/registerCV', function (req, res, next) {
  res.render('registerCV', { title: 'jobgrabba' });
});

router.get('/freecreditreport', function (req, res, next) {
  res.render('freecreditreport', { title: 'Free Credit Report' });
});

router.get('/createuser', function (req, res, next) {
  res.render('createuser', { title: 'Welcome to jobgrabba' });
});

router.get('/previews', function (req, res, next) {
  res.render('previews', { title: 'Welcome to jobgrabba' });
});

router.get('/employmentstats', function (req, res, next) {
  res.render('employmentstats', { title: 'Employment Stats' });
});

router.get('/jobgrabbacourses', function (req, res, next) {
  res.render('jobgrabbacourses', { title: 'Employment Stats' });
});

router.get('/homepage', function (req, res, next) {
  res.render('homepage', { title: 'Employment Stats' });
});

router.get('/cvhelp', function (req, res, next) {
  res.render('cvhelp', { title: 'Employment Stats' });
});

router.get('/interviewprocess', function (req, res, next) {
  res.render('interviewprocess', { title: 'Interview Process' });
});

router.get('/learning', function (req, res, next) {
  res.render('learning', { title: 'Learning and Personal Development' });
});

router.get('/cvtips', function (req, res, next) {
  res.render('cvtips', { title: 'Learning and Personal Development' });
});


router.get('/fulltimejobs', function (req, res, next) {
  res.render('fulltimejobs', { title: 'From Part-time to Full-time jobs' });
});

router.get('/interviews', function (req, res, next) {
  res.render('interviews', { title: 'Interview Tips' });
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

router.get('/register2019', function (req, res, next) {
  res.render('register2019', { title: 'Registration' });
});

router.get('/regpreview', function (req, res, next) {
  res.render('regpreview', { title: 'Registration' });
});

router.get('/regpreview1', function (req, res, next) {
  res.render('regpreview1', { title: 'Registration' });
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

router.get('/registerandtrain', function (req, res, next) {
  res.render('registerandtrain', { title: 'register and train' });
});


router.get('/registerAU', function (req, res, next) {
  res.render('registerAU', { title: 'Aussie Jobs' });
});

router.get('/registerandlearn', function (req, res, next) {
  res.render('registerandlearn', {
    title: 'Hiring new staff now! By joining jabgrabba you are agreeing to our terms and conditions and privacy policy..'
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

router.get('/Reddeals', function (req, res, next) {
  res.render('Reddeals', { title: 'Jobgrabba deals and discounts for you' });
});

router.get('/dealgrabba', function (req, res, next) {
  res.render('dealgrabba', { title: 'Jobgrabba deals and discounts for you' });
});

router.get('/previews', function (req, res, next) {
  res.render('previews', { title: 'Jobgrabba deals and discounts for you' });
});

router.get('/c2version', function (req, res, next) {
  console.log("request object:"+JSON.stringify(req.query));
  res.render('c2version', { title: 'job search',jobCategoryQuery: req.query.jobCategory,locationQuery:req.query.jobLocation });
});

router.get('/zipform', function (req, res, next) {
  res.render('zipform', { title: 'Jobgrabba deals and discounts for you' });
});

router.get('/signupsendy', function (req, res, next) {
  res.render('signupsendy', { title: 'Jobgrabba deals and discounts for you' });
});

router.get('/signupsendy3', function (req, res, next) {
  res.render('signupsendy', { title: 'Jobgrabba deals and discounts for you' });
});
router.post('/redsubmission',function(req,res, next){  
  const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          
          return;
        }
        seen.add(value);
      }
      return value;
    };
    
  };

  
  console.log("red Submission 3:"+JSON.stringify(req.body));
  var redSubmissionRequestData = {
    method:"POST",
    url: 'https://dealgrabba.online/sendy/subscribe',
    form: req.body,
    headers:
    {
      'Content-Type': 'application/x-www-form-urlencoded'
    }        
  };
  request(redSubmissionRequestData, function (error, response, body) {
    if (error) {
        console.log("Red submission request sent with error" + error + " body." );
        //res.status(400).send(error);
    } else {
        //res.set('Content-Type', 'text/html');
        //res.send(new Buffer(body));
        res.render('c2version');
        console.log("Red submission sent correctly"  );
        //res.send(body)
    }
    
  });

});

// Generally speaking the req value in the function gets information (i.e. getting info from the post request below) and the res value in the function shows information
// signup for sendy email sending platform code below
router.post('/signupsendy', upload.single("cvContent"), function (req, res, next) {
  

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
    jobCategories,
    courseInterestYes,
    specificCourseInterest,
    Redlicence,
    currentJob,
    costAwareYes,
    penaltyPoints,
    DrivingBan,
    redcoursetickyes,
    CVlib
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
      ipaddress,
      jobCategories,
      courseInterestYes:courseInterestYes + currentTimestamp,
      specificCourseInterest,
      currentJob,
      costAwareYes,
      redcoursetickyes:redcoursetickyes + currentTimestamp,
      penaltyPoints,
      DrivingBan,
      Redlicence,
   //  CVLib:cvContent
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
      //console.log("gogroopieresponse:" + JSON.stringify(response));
      //console.log("request sent correctly");
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
    var o2Info = {
      method: 'GET',
      async: true,
      crossDomain: true,
      url: "https://lead365.leadbyte.co.uk/api/submit.php?campid=02-FREE-SIM&sid=SID492",
      qs: {
        email:email,
        firstname:name,
        lastname:lastName,
        street1:address1,
        towncity:city,
        postcode:postCode,
        phone1:phone,
        optinurl:"https://www.jobgrabba.com",
        optindate:currentTimestamp,
        prize:"Job Advert",
        trafficid:"10123"

     
      }

    };
    request(o2Info, function (error, response, body) {
      if (error) {
        console.log("request to o2 sent with error");
        console.log("body:" + body);
        //res.status(400).send(error);
      } else {
        //res.set('Content-Type', 'text/html');
        //res.send(new Buffer(body));
        console.log("request to o2 sent correctly");
        console.log("body:" + body);
        //res.send(body)
      }
    });
  }




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

  if (req.file){
    console.log("sending CV"+req.file.path);
  var CVLibrary = {
    url: 'http://www.cv-library.co.uk/cgi-bin/cvsubapi.pl',
    formData:
        {
          title: title,
          firstname: name,
          lastname: lastName,
          email: email,
          county: "501",
          town: city,
          postcode: postCode,
          telephone: phone,
          salary: "1",
          age: "16-19",
          affiliateID: 104125,
          industry: "Banking",
          affiliatepassword: "coregalm",
          industry: "Retail",
          currentjobtitle: "It",
          doc: {
            value: fs.createReadStream(req.file.path),
            options: {
              contentType: "application/msword",
              filename: "cv.docx"
            }
          }
        }
  };
  console.log("CV data:" + JSON.stringify(CVLibrary));
  request.post(CVLibrary, function (error, response, body) {
    if (error) {
      console.log("CV Library request sent with error" + error + " body." + body);
      //res.status(400).send(error);
    } else {
      //res.set('Content-Type', 'text/html');
      //res.send(new Buffer(body));
      console.log("request sent correctly CV Library:" + body);
      //res.send(body)
    }
  });
  }
  res.render('Reddeals', {

    title: 'Welcome to jobgrabba', userInfo: {
      title: title,
      name,
      firstname: name,
      lastname: lastName,
      email: email,
      mobile: phone,
      subAffiliate: listId,
      dob: dob_day + '/' + dob_month + '/' + dob_year,
      optindate: currentTimestamp,
      street1: address1,
      address2,
      towncity: city,
      postcode: postCode,
      source: "http://www.jobgrabba.com",
      reference: "http://www.jobgrabba.com",
      tickYes,
      tickYes1,
      ipaddress: ipaddress,
      courseInterestYes:"",
      specificCourseInterest:"",
      costAwareYes:"",
      currentJob,
      list: listId,
      currentTimestamp,
      redcoursetickyes:"",
      penaltyPoints:"",
      DrivingBan:"",
      Redlicence:""
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



