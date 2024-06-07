var express = require("express");
var cors = require("cors");
const crypto = require("crypto");
var { format, addMinutes, compareDesc, compareAsc } = require("date-fns");
require("dotenv").config();

var db = require("./db");
var mailer = require("./sendmail");

var app = express();

app.use(express.json());
app.use(cors());

//Verification Endpoints
app.post("/signup", async (req, res) => {
    const { email } = req.body;

    const userQuery = "SELECT * FROM user_table WHERE email = ?";
    const userRecord = await db.getOne(userQuery, [email]);

    if (userRecord) res.status(404).send("User with email already exists");

    const query = "SELECT * FROM verification_table WHERE email = ?";
    const record = await db.getOne(query, [email]);

    if (record === null) {
        const token = crypto.randomUUID();
        const expiry_date = format(
            addMinutes(new Date(), 15),
            "yyyy-MM-dd HH:mm:ss"
        );

        const query =
            "INSERT INTO verification_table (email, token, expiry_date) VALUES (?,?,?)";

        db.query(query, [email, token, expiry_date], (error, result) => {
            if (error) res.status(400).send("Server error");
            else {
                mailer.send(
                    "d36patel@uwaterloo.ca",
                    "Watstudy Verification",
                    "verify",
                    token
                );
                res.send("Link sent");
            }
        });
    } else {
        if (compareDesc(new Date(record.expiry_date), new Date()) === 1) {
            const token = crypto.randomUUID();
            const expiry_date = format(
                addMinutes(new Date(), 15),
                "yyyy-MM-dd HH:mm:ss"
            );
            const query =
                "UPDATE verification_table SET token = ?, expiry_date = ? WHERE email = ?";
            db.query(query, [token, expiry_date, email], (error, result) => {
                if (error) res.status(400).send("Server error");
                else {
                    mailer.send(
                        record.email,
                        "Watstudy Verification",
                        "verify",
                        token
                    );
                    res.send("Link sent");
                }
            });
        } else {
            res.send("Link already sent");
        }
    }
});

app.post("/verify", async (req, res) => {
    const { name, token, password } = req.body;
    console.log(name, token, password);
    const query = `SELECT * FROM verification_table WHERE token = ?`;

    const verifyRecord = await db.getOne(query, [token]);

    if (verifyRecord) {
        if (compareAsc(new Date(verifyRecord.expiry_date), new Date()) === -1) {
            res.send("Link expired");
        } else {
            const query =
                "INSERT INTO user_table (name, email, password) VALUES (?, ? ,?)";
            const hash = crypto
                .createHash("sha256")
                .update(password)
                .digest("base64");
            db.query(query, [name, verifyRecord.email, hash]);
            res.send("User profile created");
        }
    }

    res.send("Invalid token.");
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

    db.query(query, [
        subject,
        title,
        description,
        session_date,
        duration,
        group_size,
        creator_fk,
        location,
    ]);
});

// GET Endpoint - studysession
app.get("/studysession", (req, res) => {
    const query = "SELECT * FROM session_table";
    db.query(query, (err, result) => {
        if (err) {
            console.log("Error");
        } else {
            res.send(result);
        }
    });
});

// GET Endpoint - email
app.get("/email", (req, res) => {
    // session id = ? depends on the session you want to search for
    const query =
        "SELECT user_table.email, session_table.subject, session_table.title, session_table.description, session_table.session_date, session_table.duration, session_table.group_size, session_table.location FROM user_table JOIN participants ON user_table.uid = participants.userId JOIN session_table ON participants.sessionId = session_table.id WHERE participants.sessionId = 1;";
    db.query(query, (err, result) => {
        if (err) {
            console.log("Error");
        } else {
            res.send(result);
        }
    });
});

//////////////////////////////////////// - GET Endpoint for data page
app.get("/data", (req, res) => {
    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).send("user query parameter is required");
    }
    const query = `select uid, password from user_table where uid = ?;`;

    db.query(query, [userId], (err, result) => {
        if (err) {
            console.log("Error:", err);
            res.status(500).send("server had a error");
        } else {
            if (result.length === 0) {
                res.status(404).send("user does not exist");
            } else {
                res.send(result[0]);
            }
        }
    });
});

////////////////////////////// - end

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

    db.query(
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

    db.query(query, [id], (err, result) => {
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
