/*********************************************************************************
* WEB322 – Assignment 06
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Mann Patel Student ID: 134633205 Date: 02/12/2021
*
* Online (Heroku) Link: 
*
********************************************************************************/

const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');


var userSchema = new Schema({
    "userName": {
        "type": String,
        "unique": true
    },
    "password": String,
    "email": String,
    "loginHistory": [{
        "dateTime": Date,
        "userAgent": String
    }]
})

let User;

module.exports = {

    initialize: function () {

        return new Promise(function (resolve, reject) {
            let db = mongoose.createConnection("mongodb+srv://mpatel394:Mann1802@senecaweb.20jvx.mongodb.net/LoginData?retryWrites=true&w=majority");

            db.on('error', (err) => {
                reject(err); // reject the promise with the provided error
            });
            db.once('open', () => {
                User = db.model("users", userSchema);
                console.log("MongoDB Connection established successfully.");
                resolve();
            });
        });

    },

    registerUser: function (userData) {

        return new Promise(function (resolve, reject) {

            if (userData.password != userData.password2)
            {
                reject("Passwords do not match.");
            }
            else
            {
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(userData.password, salt, function (err, hash) {
                        if (err) {
                            reject("There was an error encrypting the password")
                        }
                        else
                        {
                            userData.password = hash;
                            let newUser = new User(userData);
                            newUser.save(function (err) {

                                if (err) {
                                    if (err.code == 11000) {
                                        reject("User Name already taken");
                                    }
                                    else {
                                        reject("There was an error creating the user: " + err);
                                    }
                                }
                                else {
                                    resolve();
                                }
                            })
                        }
                    })
                })
            }
        })

    },

    checkUser: function (userData) {

        return new Promise(function (resolve, reject) {

            User.find({ userName: userData.userName })
                .exec().then(function (users) 
                {
                    bcrypt.compare(userData.password, users[0].password)
                        .then(function (result) 
                        {
                            if (result === true) 
                            {
                                users[0].loginHistory.push({ dateTime: (new Date()).toString(), userAgent: userData.userAgent })
                                User.update(
                                    { userName: users[0].userName },
                                    { $set: { loginHistory: users[0].loginHistory } },
                                    { multi: false }
                                ).exec()
                                    .then(function () 
                                    {
                                        resolve(users[0]);
                                    })
                                    .catch(function (err) 
                                    {
                                        reject("There was an error verifying the user: " + err);
                                    })
                            }
                            else 
                            {
                                reject("Incorrect Password for user: " + userData.userName);
                            }
                        })
                })
                .catch(function (err) 
                {
                    reject("Unable to find the user: " + userData.userName);
                })
        })
    }

}