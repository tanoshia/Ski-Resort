const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const ejs = require("ejs");

const { pool } = require("../db-connector.js");

const title = "Customers";

// Object containing display and form data
const obj = {
    customerID: {
        display: "ID",
        form: false,
    },
    firstName: {
        display: "First Name",
        filter: true,
        form: true,
        input: {
            type: "text",
            required: "true",
            placeholder: "First Name",
        },
        fromTable: undefined,
    },
    lastName: {
        display: "Last Name",
        filter: true,
        form: true,
        input: {
            type: "text",
            required: "true",
            placeholder: "Last Name",
        },
        fromTable: undefined,
    },
    email: {
        display: "Email",
        filter: true,
        form: true,
        input: {
            type: "text",
            required: "true",
            placeholder: "Email",
        },
        fromTable: undefined,
    },
    phoneNumber: {
        display: "Last Name",
        filter: true,
        form: true,
        input: {
            type: "number",
            required: "false",
            placeholder: "Phone Number (Optional)",
            min: "0",
            max: "9999999999",
        },
        // input: "table"
        fromTable: undefined,
    },
};

// Name of the table column containing the ID
const idField = "customerID";

// Order for columns to appear, must correlate to keys in obj
const order = ["customerID", "firstName", "lastName", "email", "phoneNumber"];

router.use(bodyParser.json());

router.get("/", async (req, res) => {
    // res.sendFile("customers.html", { root: "./public" });

    pool.query("select * from Customers", async (err, result) => {
        if (err != null) {
            console.log("Error:", err);
            res.sendStatus(500);
        } else {
            console.log("Retrieved:", result);

            // Get sql table data
            // let entries = [
            //     {
            //         // Sample entry data
            //         customerID: 2,
            //         firstName: "Foo",
            //         lastName: "Bar",
            //         email: "email@email.com",
            //         phoneNumber: "1231231234",
            //     },
            // ];

            let header = [];
            for (const title of order) {
                header.push(obj[title].display);
            }

            let table = await ejs.renderFile("views/table.ejs", {
                data: {
                    header: header,
                    entries: result,
                    order: order,
                    idField: idField,
                },
            });

            let filter = await ejs.renderFile("views/filter.ejs", {
                data: {
                    header: header,
                    form: obj,
                    order: order,
                },
            });

            let formAdd = await ejs.renderFile("views/form-add.ejs", {
                data: {
                    title: title,
                    header: header,
                    form: obj,
                    order: order,
                },
            });

            let formUpdate = await ejs.renderFile("views/form-edit.ejs", {
                data: {
                    title: title,
                    header: header,
                    form: obj,
                    order: order,
                },
            });
            
            let page = await ejs.renderFile("views/view-table.ejs", {
                data: {
                    title: title,
                    html: {
                        table: table,
                        filter: filter,
                        formAdd: formAdd,
                        formUpdate: formUpdate,
                    },
                },
            });

            res.send(page);
        }
    });
});

// Get table
// router.get("/table", (req, res) => {
// pool.query("select * from Customers", (err, result) => {
//     if (err != null) {
//         res.sendStatus(500);
//         console.log("Error:", err);
//     } else {
//         console.log("Retrieved:", result);
//         res.render("customers-table", { customers: result });
//     }
// });
// });

// Create
router.post("/create", (req, res) => {
    console.log("Received", req.body);
    pool.query(
        `INSERT INTO Customers (firstName, lastName, email, phoneNumber) VALUES
    ("${req.body.firstName}", "${req.body.lastName}", "${req.body.email}", "${req.body.phoneNumber}");
    `,
        (err, result) => {
            if (err != null) {
                console.log("Could not create entry with:", req.body);
                console.log(err);
                res.sendStatus(500);
            } else {
                console.log("Created entry:", result);
                res.redirect(".");
            }
        }
    );
});

// Read
router.get("/get/:id", (req, res) => {
    pool.query(
        `SELECT * FROM Customers WHERE customerID = ${req.params.id};`,
        (err, result) => {
            if (err != null) {
                console.log("Could not get customer:", req.params.id);
                console.log(err);
                res.sendStatus(500);
            } else {
                console.log("Retreived Customer:", req.params.id);
                console.log(result);
                res.send(result);
            }
        }
    );
});

// Update
router.post("/getEdit/:id", (req, res) => {});
router.post("/edit/:id", (req, res) => {});
// router.post("/update/:id", (req, res) => {
//     pool.query(
//         `
//         UPDATE Customers
//         SET firstName = "${req.body.first}",
//         lastName = "${req.body.last}",
//         email = "${req.body.email}",
//         phoneNumber = "${req.body.phone != "0" ? req.body.phone : ""}"
//         WHERE customerID = ${req.params.id};`,
//         (err, result) => {
//             if (err != null) {
//                 console.log(
//                     `Could not update customer ${req.params.id} with:`,
//                     req.body
//                 );
//                 console.log(err);
//             } else {
//                 console.log("Updated Customer:", req.params.id);
//                 console.log(result);
//                 res.sendStatus(200);
//             }
//         }
//     );
// });

// Delete
router.post("/delete/:id", (req, res) => {
    pool.query(
        `DELETE FROM Customers WHERE customerID = ${req.params.id};`,
        (err, result) => {
            if (err != null) {
                res.sendStatus(500);
                console.log("Error:", err);
            } else {
                console.log(result);
                res.sendStatus(200);
            }
        }
    );
});

module.exports = router;
