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

const Sequelize = require('sequelize');

var sequelize = new Sequelize('d6tcgmk89g3nir', 'ohzibqqftopnie', '27d077fb29b3630d889f9149441f5d81d79c773174f97b870305f9569d986d99', {
    host: 'ec2-34-194-158-176.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});


sequelize.authenticate()
    .then(function () {
        console.log('Connection has been established successfully.');
    })
    .catch(function (err) {
        console.log('Unable to connect to the database:', err);
    });


// Employee Model
const Employee = sequelize.define('Employee', {

    employeeNum:
    {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    hireDate: Sequelize.STRING,
    department: Sequelize.INTEGER
});

// Department Model
const Department = sequelize.define('Department', {

    departmentId:
    {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    departmentName: Sequelize.STRING
});

// Relationship between employees and departments.
Department.hasMany(Employee, { foreignKey: 'department' });

module.exports = {

    initialize: function () {
        return new Promise(function (resolve, reject) {

            sequelize.sync()
                .then(function () {
                    resolve("Database is successfully synced.")
                })
                .catch(function () {
                    reject("Unable to sync the database");
                });
        })

    },

    getAllEmployees: function () {

        return new Promise(function (resolve, reject) {

            Employee.findAll()

                .then(function (data) {
                    resolve(data)
                })
                .catch(function (err) {
                    reject("No results returned");
                });
        });
    },

    getEmployeesByStatus: function (status) {

        return new Promise(function (resolve, reject) {

            Employee.findAll({
                where:
                {
                    status: status
                }
            })
                .then(function (data) {
                    resolve(data);
                })
                .catch(function (err) {
                    reject("No results returned");
                })
        });
    },


    getEmployeesByDepartment: function (department) {

        return new Promise(function (resolve, reject) {

            Employee.findAll({
                where:
                {
                    department: department
                }
            })
                .then(function (data) {
                    resolve(data);
                })
                .catch(function (err) {
                    reject("No results returned");
                })
        });
    },

    getEmployeesByManager: function (manager) {

        return new Promise(function (resolve, reject) {

            Employee.findAll({
                where:
                {
                    employeeManagerNum: manager
                }
            })
                .then(function (data) {
                    resolve(data);
                })
                .catch(function (err) {
                    reject("No results returned");
                })
        });
    },

    getEmployeeByNum: function (num) {

        return new Promise(function (resolve, reject) {

            Employee.findAll({
                where:
                {
                    employeeNum: num
                }
            })
                .then(function (data) {
                    resolve(data[0]);
                })
                .catch(function (err) {
                    reject("No results returned");
                })
        });
    },

    getDepartments: function () {

        return new Promise(function (resolve, reject) {

            Department.findAll()

                .then(function (data) {
                    resolve(data)
                })
                .catch(function (err) {
                    reject("No results returned.");
                });
        });
    },

    addEmployee: function (employeeData) {

        return new Promise(function (resolve, reject) {

            employeeData.isManager = (employeeData.isManager) ? true : false;

            for (var i in employeeData) {
                if (employeeData[i] == "") {
                    employeeData[i] = null;
                }
            }

            Employee.create(employeeData)

                .then(function (data) {
                    resolve(data);
                })
                .catch(function (err) {
                    reject("Unable to create employee");
                })
        });
    },

    updateEmployee: function (employeeData) {

        return new Promise(function (resolve, reject) {

            employeeData.isManager = (employeeData.isManager) ? true : false;

            for (var i in employeeData) {
                if (employeeData[i] == "") {
                    employeeData[i] = null;
                }
            }

            Employee.update(employeeData,
                {
                    where:
                    {
                        employeeNum: employeeData.employeeNum
                    }
                })
                .then(function (data) {
                    resolve(data)
                })
                .catch(function (err) {
                    reject("Unable to update employee.");
                })
        });

    },

    addDepartment: function (departmentData) {

        return new Promise(function (resolve, reject) {

            for (var i in departmentData) {
                if (departmentData[i] == "") {
                    departmentData[i] = null;
                }
            }

            Department.create(departmentData)

                .then(function (data) {
                    resolve(data);
                })
                .catch(function (err) {
                    reject("Unable to create department");
                });

        });
    },

    updateDepartment: function (departmentData) {

        return new Promise(function (resolve, reject) {

            for (var i in departmentData) {
                if (departmentData[i] == "") {
                    departmentData[i] = null;
                }
            }

            Department.update(departmentData,
                {
                    where:
                    {
                        departmentId: departmentData.departmentId
                    }
                })
                .then(function (data) {
                    resolve(data)
                })
                .catch(function (err) {
                    reject("Unable to update department.");
                })
        })
    },

    getDepartmentById: function (id) {

        return new Promise(function (resolve, reject) {

            Department.findAll(
                {
                    where:
                    {
                        departmentId: id
                    }
                })
                .then(function (data) {

                    resolve(data);
                })
                .catch(function (err) {
                    reject("No results");
                })
        });
    },

    deleteDepartmentById: function (id) {

        return new Promise(function (resolve, reject) {

            Department.destroy(
                {
                    where:
                    {
                        departmentId: id
                    }
                })
                .then(function (data) {
                    resolve(data)
                })
                .catch(function (err) {
                    reject("Unable to delete department.")
                })
        })
    },

    deleteEmployeeByNum: function (empNum) {

        return new Promise(function (resolve, reject) {

            Employee.destroy(
                {
                    where:
                    {
                        employeeNum: empNum
                    }
                })
                .then(function (data) {
                    resolve(data)
                })
                .catch(function (err) {
                    reject("Unable to delete employee.")
                })
        })
    },

}
