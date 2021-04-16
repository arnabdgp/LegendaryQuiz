require('dotenv').config()
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var nodemailer = require('nodemailer');
var User = require('./models/user')
var userAPI = require('./routes/user');
var ejs = require('ejs');
var engine = require('ejs-mate');
const { getMaxListeners } = require('./models/user');
var alert = require('alert');  
var app = express();

app.use(express.static(__dirname + "/public"))
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/',userAPI);
app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.get('/', function(req,res){
    res.sendFile(__dirname+'index.html');
});

const answers = ['Rajiv Lochan','NHPC','IISc','Bharti AXA General Insurance','1.63%','KEPCO','SABIC','NIIF','Orchestra Technology','Aceso Company Pte. Ltd.','Paytm','Reliance Industries Limited']

app.post('/',function(req,res,next){
    var user = new User();
    user.StudentName = req.body.name;
    user.StudentId = req.body.email;
    user.q1 = req.body.q3;
    user.q2 = req.body.q4;
    user.q3 = req.body.q5;
    user.q4 = req.body.q6;
    user.q5 = req.body.q7;
    user.q6 = req.body.q8;
    user.q7 = req.body.q9;
    user.q8 = req.body.q10;
    user.q9 = req.body.q11;
    user.q10 = req.body.q12;
    user.q11 = req.body.q13;
    user.q12 = req.body.q14;
    var curr = [];
    curr.push(user.q1);
    curr.push(user.q2);
    curr.push(user.q3);
    curr.push(user.q4);
    curr.push(user.q5);
    curr.push(user.q6);
    curr.push(user.q7);
    curr.push(user.q8);
    curr.push(user.q9);
    curr.push(user.q10);
    curr.push(user.q11);
    curr.push(user.q12);
    var count = 0;
    for(var i=0;i<12;i++){
        if(curr[i] == answers[i]){
            count++;
        }
    }
    user.marks = count;
    
    User.findOne({StudentId:req.body.email},function(err,existingUser){
        if(existingUser){
            console.log("Student with same emailid exists");
            alert("Someone with similar emailId already exists");
            return res.redirect('/');
        }else{
            user.save(function(err,user){
                if(err) return next(err);
                console.log("Successfully submited the quiz");
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        type: 'OAuth2',
                        user: process.env.MAIL_USERNAME,
                        pass: process.env.MAIL_PASSWORD,
                        clientId: process.env.OAUTH_CLIENTID,
                        clientSecret: process.env.OAUTH_CLIENT_SECRET,
                        refreshToken: process.env.OAUTH_REFRESH_TOKEN
                    }
                });

                var mailOptions = {
                    from: process.env.MAIL_USERNAME,
                    to:req.body.email,
                    subject:`Legendary Quiz results`,
                    text: `Hey, ${req.body.name} .Your scored ${count} out of 12. If you did well, congrats!! But in case you didn't score good send your friend Rs.1000. He would definitely help you out.`
                };

                transporter.sendMail(mailOptions,function(error,info){
                    if(error)
                        console.log(error);
                    else
                        console.log('Email sent: '+info.response);
                })

                res.render('result.ejs',{count: count});
            })
        }
    })
});

const port = process.env.port || 3000;

app.listen(port, function(err) {
    if (err) throw err;
    console.log("Server is Running on port 3000");
});
