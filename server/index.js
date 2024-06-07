var express = require("express");
var mysql = require("mysql");
var cors = require("cors");
require('dotenv').config()

var app = express();

app.use(express.json());
app.use(cors());

const con = mysql.createConnection({
    host: process.env.GOOGLE_SQL_HOST,
    user: 'root',
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
                console.log("Inserting Error");
            } else {
                res.send("POSTED");
            }
        }
    );
});

// GET Endpoint - studysession
app.get("/studysession", (req, res) => {
    const query = "SELECT * FROM session_table";
    con.query(query, (err, result) => {
        if (err) {
            console.log("Error");
        } else {
            res.send(result);
        }
    });
});

// GET Endpoint - email
app.get("/email", (req, res) => { // session id = ? depends on the session you want to search for
    const query = "SELECT user_table.email, session_table.subject, session_table.title, session_table.description, session_table.session_date, session_table.duration, session_table.group_size, session_table.location FROM user_table JOIN participants ON user_table.uid = participants.userId JOIN session_table ON participants.sessionId = session_table.id WHERE participants.sessionId = 1;";
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


///////////////////////// GET Endpoint - Data Page

// Query for total hours studied by user
app.get("/data", (req, res) => {
    const userId = req.query.userId;
    if (!userId) {
        return res.status(400).send('User query parameter is required');
    }
    const query = `
    select sum(duration)/60 as total_hours 
    from session_table 
    where creator_fk = ?;
    `;

    con.query(query, [userId], (err, result) => {
        if (err) {
            console.log("Error:", err);
            res.status(500).send('Server error');
        } else {
            if (result.length === 0) {
                res.status(404).send('User does not exist');
            } else {
                res.send(result[0]);
            }
        }
    });
});

//Query for top study spot and total hours spent at study spot
app.get("/topstudyspot", (req, res) => {
    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).send('User query parameter is required');
    }

    const query = `
        select location, max(duration) as max_duration 
        from session_table 
        where creator_fk = ? 
        group by location 
        order by max_duration desc 
        limit 1;
    `;

    con.query(query, [userId], (err, result) => {
        if (err) {
            console.error("Error:", err);
            return res.status(500).send('Server error');
        }

        if (result.length === 0) {
            return res.status(404).send('No study spots found for this user');
        }

        res.send(result[0]);
    });
});
///////////////////////////// END for GET Endpoint Datapage



/////////////////////////////
app.listen(3800, (err) => {
    // open port
    if (err) {
        console.log(err);
    } else {
        console.log("connected!");
    }
});
/////////////////////////////
