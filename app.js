// Project using Express.js and Mailchip API
// Udemy Course: The Complete 2023 Web Developement Bootcamp
// Acknowledgement: Angela Yu (App Brewery)
// By: sys-unknwn7645

const express = require("express")
const bodyParser = require("body-parser")
const https = require('https');
require("dotenv").config()

const API_KEY = process.env.apiKey
const LIST_ID = process.env.listId
const SERVER_NUM = process.env.server


const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}))

app.get("/", function(req, res){

    res.sendFile(__dirname+"/signup.html")
    
});

app.post("/", function (req, res){
    console.log("submit hit");
    var firstName = req.body.firstname
    var lastName = req.body.lastname
    var email = req.body.floatingemail

    const data = {

                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }

    const jsonData = JSON.stringify(data);
    const url = "https://"+SERVER_NUM+".api.mailchimp.com/3.0/lists/"+LIST_ID+"/members";

    const options = {
        method: "POST",
        auth: "bhuswtd:"+API_KEY

    }

    const request = https.request(url, options, function (response){
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }else {
            res.sendFile(__dirname + "/failure.html");
        }
 
        response.on("data", function(data){
            console.log(JSON.parse(data));
        });

    })

    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req,res){
    res.redirect("/")

});


app.listen(process.env.PORT || 3000,function (){
    console.log("server is running on port 3000")
})


