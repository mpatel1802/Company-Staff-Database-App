/*********************************************************************************
* WEB322 – Assignment 06
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Mann Patel Student ID: 134633205 Date: 02/12/2021
*
* Online (Heroku) Link: https://salty-refuge-15050.herokuapp.com/
*
********************************************************************************/

const express = require("express");
const multer = require("multer");
const exphbs = require("express-handlebars");
const fs = require("fs");
const app = express();
const path = require("path");
const clientSessions = require("client-sessions");

const dataService = require(__dirname + "/data-service.js");
const dataServiceAuth = require(__dirname + "/data-service-auth.js");
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(function (req, res, next) {
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});


app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        navLink: function (url, options) {
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }

}));

app.set('view engine', '.hbs');

app.use(clientSessions({
    cookieName: "session",
    secret: "web322_assignment06",
    duration: 3 * 60 * 1000,
    activeDuration: 1000 * 60
}));

app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});

function ensureLogin(req, res, next) {
    if (!req.session.user) {
        res.redirect("/login");
    } else {
        next();
    }
}

function onHttpStart() {

    console.log("Express http server listening on: " + HTTP_PORT);
}

app.get("/", function (req, res) {

    res.render('home');
});

app.get("/about", function (req, res) {

    res.render('about');
});

app.get("/login", function (req, res) {
    
    res.render('login');
});

app.get("/register", function (req, res) {
    
    res.render('register');
});

app.get("/employees/add", ensureLogin, function (req, res) {

    dataService.getDepartments().then(function (data) {
        res.render("addEmployee", { departments: data })
    }).catch(function (err) {
        res.render("addEmployee", { departments: [] })
    })
});


app.get("/departments/add", ensureLogin, function (req, res) {

    res.render('addDepartment');
});


app.get("/images/add", ensureLogin, function (req, res) {

    res.render('addImage');
});


app.get("/employees", ensureLogin, function (req, res) {

    if (req.query.status) {

        dataService.getEmployeesByStatus(req.query.status).then(function (data) {
            if (data.length > 0) {
                res.render("employees", { employees: data });
            }
            else {
                res.render("employees", { message: "no results" });
            }
        })
            .catch(function (err) {

                res.render("employees", { message: "no results" });

            });
    }
    else if (req.query.department) {

        dataService.getEmployeesByDepartment(req.query.department).then(function (data) {

            if (data.length > 0) {
                res.render("employees", { employees: data });
            }
            else {
                res.render("employees", { message: "no results" });
            }
        })
            .catch(function (err) {

                res.render("employees", { message: "no results" });

            });
    }
    else if (req.query.manager) {

        dataService.getEmployeesByManager(req.query.manager).then(function (data) {

            if (data.length > 0) {
                res.render("employees", { employees: data });
            }
            else {
                res.render("employees", { message: "no results" });
            }
        })
            .catch(function (err) {

                res.render("employees", { message: "no results" });

            });
    }
    else {
        dataService.getAllEmployees().then(function (data) {
            if (data.length > 0) {
                res.render("employees", { employees: data });
            }
            else {
                res.render("employees", { message: "no results" });
            }
        })
            .catch(function (err) {

                res.render("employees", { message: "no results" });

            })
    }
});

app.get("/departments", ensureLogin, function (req, res) {

    dataService.getDepartments().then(function (data) {
        if (data.length > 0) {
            res.render("departments", { departments: data });
        }
        else {
            res.render("departments", { message: "no results" });
        }
    })
        .catch(function (err) {

            res.render("departments", { message: "no results" });
        });
});


app.get("/employee/:empNum", ensureLogin, (req, res) => {
    // initialize an empty object to store the values
    let viewData = {};
    dataService.getEmployeeByNum(req.params.empNum).then((data) => {
        if (data) {
            viewData.employee = data; //store employee data in the "viewData" object as "employee"
        } else {
            viewData.employee = null; // set employee to null if none were returned
        }
    }).catch(() => {
        viewData.employee = null; // set employee to null if there was an error 
    }).then(dataService.getDepartments)
        .then((data) => {
            viewData.departments = data; // store department data in the "viewData" object as "departments"
            // loop through viewData.departments and once we have found the departmentId that matches
            // the employee's "department" value, add a "selected" property to the matching 
            // viewData.departments object
            for (let i = 0; i < viewData.departments.length; i++) {
                if (viewData.departments[i].departmentId == viewData.employee.department) {
                    viewData.departments[i].selected = true;
                }
            }
        }).catch(() => {
            viewData.departments = []; // set departments to empty if there was an error
        }).then(() => {
            if (viewData.employee == null) { // if no employee - return an error
                res.status(404).send("Employee Not Found");
            } else {
                res.render("employee", { viewData: viewData }); // render the "employee" view
            }
        });
});

app.get("/department/:departmentId", ensureLogin, function (req, res) {

    dataService.getDepartmentById(req.params.departmentId).then(function (data) {

        if (data.length > 0) {
            res.render("department", { department: data });
        }
        else {
            res.status(404).send("Department Not Found");
        }
    })
        .catch(function (err) {

            res.status(404).send("Department Not Found");
        })
});


app.get("/departments/delete/:departmentId", ensureLogin, function (req, res) {

    dataService.deleteDepartmentById(req.params.departmentId).then(function (data) {

        res.redirect("/departments");
    })
        .catch(function (err) {
            res.status(500).send("Unable to Remove Department / Department not found");

        })
})

app.get("/employees/delete/:empNum", ensureLogin, function (req, res) {

    dataService.deleteEmployeeByNum(req.params.empNum).then(function (data) {
        res.redirect("/employees");

    })
        .catch(function (err) {
            res.status(500).send("Unable to Remove Employee / Employee not found");
        })
});

app.get("/userHistory", ensureLogin, function (req, res) {
    res.render("userHistory");
})


const storage = multer.diskStorage({

    destination: "./public/images/uploaded",

    filename: function (req, file, cb) {

        cb(null, Date.now() + path.extname(file.originalname));
    },
});


const upload = multer({ storage: storage });

app.post("/images/add", upload.single("imageFile"), ensureLogin, function (req, res) {

    res.redirect("/images");
});



app.get("/images", ensureLogin, function (req, res) {

    fs.readdir("./public/images/uploaded", function (err, items) {

        res.render("images", { data: items });
    });
});

app.post("/register", function (req, res) {
    
    dataServiceAuth.registerUser(req.body)
        .then(function () {
            res.render("register", { successMessage: "User created" })
        })
        .catch(function (err) {
            res.render("register", { errorMessage: err, userName: req.body.userName });
        });
})

app.post("/login", function (req, res) {
    req.body.userAgent = req.get('User-Agent');
    dataServiceAuth.checkUser(req.body)
        .then(function (user) {
            req.session.user = {
                userName: user.userName,
                email: user.email,
                loginHistory: user.loginHistory
    }
            res.redirect('/employees');
        }).catch(function (err) {
            res.render("login", { errorMessage: err, userName: req.body.userName });
    })
})

app.post("/employees/add", ensureLogin, function (req, res) {

    dataService.addEmployee(req.body).then(function (data) {

        res.redirect("/employees");
    })
        .catch(function (err) {

            res.status(500).send("Unable to add Employee");
        });
});


app.post("/departments/add", ensureLogin, function (req, res) {

    dataService.addDepartment(req.body).then(function () {

        res.redirect("/departments");
    })
        .catch(function (err) {

            res.status(500).send("Unable to add Department");
        });
});


app.post("/employee/update", ensureLogin, function (req, res) {

    dataService.updateEmployee(req.body).then(function () {

        console.log(req.body);
        res.redirect("/employees");
    }).catch(function (err) {
        res.status(500).send("Unable to Update Employee");
    });
});


app.post("/department/update", ensureLogin, function (req, res) {

    dataService.updateDepartment(req.body).then(function () {

        console.log(req.body);
        res.redirect("/departments");
    }).catch(function (err) {
        res.status(500).send("Unable to Update Department");
    });
});

app.get("/logout", function (req, res) {
    req.session.reset();
    res.redirect("/");
})

app.use(function (req, res) {

    res.status(404).send("404! Page Not Found");
});


dataService.initialize()
    .then(dataServiceAuth.initialize)
    .then(function () {
        app.listen(HTTP_PORT, function () {
            console.log("App listening on: " + HTTP_PORT)
        });
    }).catch(function (err) {
        console.log("Unable to start server: " + err);
    });

