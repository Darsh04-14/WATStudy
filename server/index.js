var express = require("express");
var mysql = require("mysql");
var cors = require("cors");
require("dotenv").config();

var app = express();

app.use(express.json());
app.use(cors());

const con = mysql.createConnection({
    host: process.env.GOOGLE_SQL_HOST,
    user: "root",
    password: process.env.GOOGLE_SQL_PASSWORD,
    database: "watstudy",
});

con.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("connected!");
    }
});

// POST Endpoint
app.post("/studysession", (req, res) => {
    const {
        subject,
        title,
        description,
        session_date,
        group_size,
        creator_fk,
        duration,
        location,
    } = req.body;

    const query = `
          INSERT INTO session_table (subject, title, description, session_date, duration, group_size, creator_fk, location)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

    con.query(
        query,
        [
            subject,
            title,
            description,
            session_date,
            duration,
            group_size,
            creator_fk,
            location,
        ],
        (err, result) => {
            if (err) {
                console.log("Inserting Error", err);
            } else {
                res.send("POSTED");
            }
        }
    );
});

// GET Endpoint - studysession
app.get("/studysession", (req, res) => {
    const searchFilter = req.query.filter;
    let query = "SELECT * FROM session_table";
    if (searchFilter) {
        const params = JSON.parse(searchFilter);
        const { subject, group_size, duration, search } = params;
        let filterQuery = "";

        if (subject)
            filterQuery = filterQuery.concat(` subject = "${subject}" AND`);

        if (group_size)
            filterQuery = filterQuery.concat(` group_size >= ${group_size[0]} AND group_size <= ${group_size[1]} AND`);

        if (duration)
            filterQuery = filterQuery.concat(` duration >= ${duration[0]} AND duration <= ${duration[1]} AND`);

        if (search && search !== '') {
            filterQuery = filterQuery.concat(` (title LIKE "$%{search}%" OR description LIKE "%${search}%" OR location LIKE "%${search}%") AND`);
        }

        if (filterQuery !== "") {
            query = query + " WHERE" + filterQuery.substring(0, filterQuery.length - 3);
        }
    }

    con.query(query, (err, result) => {
        if (err) {
            console.log("Error");
        } else {
            res.send(result);
        }
    });
});

// GET Endpoin - email currently default
// GET Endpoint
app.get("/email", (req, res) => {
    // session id = ? depends on the session you want to search for
    const query =
        "SELECT user_table.email, session_table.subject, session_table.title, session_table.description, session_table.session_date, session_table.duration, session_table.group_size, session_table.location FROM user_table JOIN participants ON user_table.uid = participants.userId JOIN session_table ON participants.sessionId = session_table.id WHERE participants.sessionId = 6;";
    con.query(query, (err, result) => {
        if (err) {
            console.log("Error");
        } else {
            res.send(result);
        }
    });
});

// PUT Endpoint
app.put("/studysession", (req, res) => {
    const {
        id,
        subject,
        title,
        description,
        session_date,
        duration,
        group_size,
        creator_fk,
        location,
    } = req.body;

    //for testing
    //const id = 239;
    //const title = "lets do cs 240";

    const query = `
      UPDATE session_table
      SET subject = ?, title = ?, description = ?, session_date = ?, duration = ?, group_size = ?, creator_fk = ?, location = ?
      WHERE id = ?
    `;

    con.query(
        query,
        [
            subject,
            title,
            description,
            session_date,
            duration,
            group_size,
            creator_fk,
            location,
            id,
        ],
        (err, result) => {
            if (err) {
                console.log("Error Updating", err);
                res.status(500).send("Error updating data");
            } else {
                res.send("updated");
            }
        }
    );
});

// DELETE Endpoint
app.delete("/studysession", (req, res) => {
    const { id } = req.body;

    const query = `
      DELETE FROM session_table WHERE id = ?
    `;

    con.query(query, [id], (err, result) => {
        if (err) {
            console.log("Error Deleting", err);
            res.status(500).send("Error deleting data");
        } else {
            res.send("deleted");
        }
    });
});

app.listen(3800, (err) => {
    // open port
    if (err) {
        console.log(err);
    } else {
        console.log("connected!");
    }
});
