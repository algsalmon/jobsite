// import  {fetchJobs} from "..data/jobs.js";
// fetchJobs ('Sales_Executive');

var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true
}
   mongoose.connect('mongodb://uwom5limrhsqdg5x1ttu:BdVRE2DVoCUtAsQBr7eF@babj45inn3ueei2-mongodb.services.clever-cloud.com:27017/babj45inn3ueei2',
   options,
   function(err) {
   console.log(err);
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

var UserModel = mongoose.model('users',userSchema);

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

UserModel.find(function(err, users)
 { 
   console.log(users)
   ;}  
   )

   router.post('/createuser',function(req,res, next){
    const aNewUser = new UserModel ({

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
       res.render('createuser' , {title: 'Welcome'});
     })
    });



// UserModel.find(
//   function (err,users) {
//    console.log(users);
//   }
// );
//console.log("user models:");
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('jobboard', { title: 'jobgrabba'});
});


router.get('/views/fetchjobs', function(req, res, next){
  res.render('fetchjobs', {title: 'jobgrabba'});
});

router.get('/views/jobs' , function(req, res, next){
  res.render('jobs', {title: 'jobs'});
});

router.get('/register',function(req,res, next){
res.render('register', {title: 'Registration'});
});

router.get('/privacy',function(req,res, next){
  res.render('privacy', {title: 'Privacy Policy'});
});

router.get('/tandc',function(req,res, next){
    res.render('tandc', {title: 'tandc'});
});

router.get('/aboutus',function(req,res, next){
      res.render('aboutus', {title: 'About Us'});
});   

router.get('/unsubscribe',function(req,res, next){
  res.render('unsubscribe', {title: 'Unsubscribe'});
});   

router.get('/australia',function(req,res, next){
  res.render('australia', {title: 'Aussie Jobs'});
});   


router.get('/registerAU',function(req,res, next){
  res.render('registerAU', {title: 'Aussie Jobs'});
});   

router.get('/registerlidl',function(req,res, next){
  res.render('registerlidl', {title: 'LIDL are hiring new staff now! By joining jabgrabba you are agreeing to our terms and conditions and privacy policy..'
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
