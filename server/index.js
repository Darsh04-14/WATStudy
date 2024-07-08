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
    console.log("email", email);

    const userQuery = "SELECT * FROM user_table WHERE email = ?";
    const userRecord = await db.getOne(userQuery, [email]);

    if (userRecord) res.status(404).send("User with email already exists");

    const query = "SELECT * FROM verification_table WHERE email = ?";
    const record = await db.getOne(query, [email]);

    console.log("the record", record);
    if (record === null) {
        const token = crypto.randomUUID();
        const expiry_date = format(
            addMinutes(new Date(), 15),
            "yyyy-MM-dd HH:mm:ss"
        );

        const query =
            "INSERT INTO verification_table (email, token, expiry_date) VALUES (?,?,?)";

        db.query(query, [email, token, expiry_date], (error, result) => {
            if (error) {
                console.log("db error", error);
                res.status(400).send("Server error");
            } else {
                mailer.send(email, "Watstudy Verification", "verify", token);
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
            db.query(query, [name, verifyRecord.email, hash], (err, result) => {
                if (!err) {
                    const query2 =
                        "DELETE FROM verification_table WHERE email = 'd36patel@uwaterloo.ca'";
                    db.query(query2, (err2, result2) => {
                        if (!err2) {
                            res.send("User profile created");
                        } else {
                            res.send("Server error");
                        }
                    });
                } else {
                    res.send("Server error");
                }
            });
        }
    } else {
        res.send("Invalid token.");
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const hash = crypto.createHash("sha256").update(password).digest("base64");
    const query = "SELECT * FROM user_table WHERE email = ? AND password = ?";
    const userRecord = await db.getOne(query, [email, hash]);
    console.log("found user", userRecord);
    if (userRecord != null) {
        res.send(
            JSON.stringify({ name: userRecord.name, uid: userRecord.uid })
        );
    } else {
        res.status(404).send("Invalid credentials");
    }
});

// POST Endpoint - for creating events
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
          INSERT INTO session_table (
          subject, 
          title, 
          description, 
          session_date, 
          duration, 
          group_size, 
          creator_fk, 
          location)
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
app.get("/courses", (req, res) => {
    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).send("User ID is required");
    }

    const query = `
     SELECT 
    s.subject, 
    SUM(s.duration) AS total_hours,
    COUNT(s.id) AS total_sessions,
    AVG(s.duration) AS avg_duration,
    MAX(s.session_date) AS last_session_date,
    COUNT(DISTINCT p.userId) AS total_participants,
    u.name AS creator_name,
    us.session_date AS upcoming_session_date,
    us.title AS upcoming_session_title,
    us.location AS upcoming_session_location
FROM 
    session_table s
JOIN 
    user_table u ON s.creator_fk = u.uid
LEFT JOIN 
    participants p ON s.id = p.sessionId
LEFT JOIN (
    SELECT 
        subject,
        session_date,
        title,
        location
    FROM 
        session_table
    WHERE 
        session_date > NOW()
) us ON s.subject = us.subject
WHERE 
    s.creator_fk = ?
GROUP BY 
    s.subject, u.name, us.session_date, us.title, us.location
ORDER BY 
    total_hours DESC;



    `;

    db.query(query, [userId], (err, result) => {
        if (err) {
            console.error("Error fetching courses:", err);
            res.status(500).send("Server error");
        } else {
            res.json(result);
        }
    });
});

// GET Endpoint - fetch all courses a user has studied
// GET Endpoint - fetch all courses a user has studied
// GET Endpoint - fetch all courses a user has studied
// Add this endpoint to your server code
app.get("/suggestions", (req, res) => {
    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).send("User ID is required");
    }

    const query = `
        SELECT s.subject
FROM session_table s
JOIN user_table u ON s.creator_fk = u.uid
LEFT JOIN participants p ON s.id = p.sessionId
LEFT JOIN (
SELECT subject, session_date, title, location
FROM session_table
WHERE session_date > NOW()
) us ON s.subject = us.subject
WHERE s.creator_fk = ?
GROUP BY s.subject
ORDER BY SUM(s.duration) DESC;

    `;

    db.query(query, [userId], (err, result) => {
        if (err) {
            console.error("Error fetching suggestions:", err);
            res.status(500).send("Server error");
        } else {
            res.json(result);
        }
    });
});



// GET Endpoint - studysession all details
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

    db.query(query, (err, result) => {
        if (err) {
            console.log("Error");
        } else {
            res.send(result);
        }
    });
});

// GET Endpoint - email optional sender, queries earliest event
app.get("/email", (req, res) => {
    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).send("User ID is required");
    }

    const query = `
        SELECT 
        u.email,
        s.subject,
        s.title,
        s.description,
        s.session_date,
        s.duration,
        s.group_size,
        s.location
        FROM 
            user_table AS u
        JOIN 
            participants AS p ON u.uid = p.userId
        JOIN 
            session_table AS s ON p.sessionId = s.id
        WHERE 
            s.id = (
                SELECT 
                    p.sessionId
                FROM 
                    participants AS p
                JOIN 
                    session_table AS s ON p.sessionId = s.id
                WHERE 
                    p.userId = ?
                ORDER BY 
                    s.session_date ASC
                LIMIT 1
            );

    `;

    db.query(query, [userId], (err, result) => {
        if (err) {
            console.error("Error executing query:", err);
            res.status(500).send("Error fetching email data");
        } else if (result.length === 0) {
            res.status(404).send("No data found for the given user ID");
        } else {
            res.send(result);
        }
    });
});

// PUT Endpoint - for updating events
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
      SET subject = ?, 
      title = ?, 
      description = ?, 
      session_date = ?, 
      duration = ?, 
      group_size = ?, 
      creator_fk = ?, 
      location = ?
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

// DELETE Endpoint - to remove posts
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

///////////////////////// GET Endpoint - Data Page

// Query for total hours studied by user
app.get("/data", (req, res) => {
    const userId = req.query.userId;
    if (!userId) {
        return res.status(400).send("User query parameter is required");
    }
    const query = `
    SELECT sum(duration)/60 as total_hours 
    FROM session_table 
    WHERE creator_fk = ?;
    `;

    db.query(query, [userId], (err, result) => {
        if (err) {
            console.log("Error:", err);
            res.status(500).send("Server error");
        } else {
            res.send(result[0]);
        }
    });
});



//Query for top study spot and total hours spent at study spot
app.get("/topstudyspot", (req, res) => {
    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).send("User query parameter is required");
    }

    const query = `
        SELECT location, max(duration) AS max_duration 
        FROM session_table 
        WHERE creator_fk = ? 
        GROUP BY location 
        ORDER BY max_duration desc 
        LIMIT 1;
    `;

    db.query(query, [userId], (err, result) => {
        if (err) {
            console.error("Error:", err);
            return res.status(500).send("Server error");
        }
        res.send(result[0]);
    });
});

//Query for top course and total hours on a top course
app.get("/topcourse", (req, res) => {
    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).send("User query parameter is required");
    }

    const query = `      
       SELECT 
    s.subject, 
    SUM(s.duration) AS total_hours, 
    u.name AS creator_name, 
    COUNT(p.userId) AS participant_count
FROM 
    session_table s
JOIN 
    user_table u ON s.creator_fk = u.uid
LEFT JOIN 
    participants p ON s.id = p.sessionId
WHERE 
    s.creator_fk = ?
GROUP BY 
    s.subject, u.name
ORDER BY 
    total_hours DESC
LIMIT 1;

    `;

    db.query(query, [userId], (err, result) => {
        if (err) {
            console.error("Error:", err);
            return res.status(500).send("Server error");
        }
        res.send(result[0]);
    });
});
// Query to return the top 5 users with the highest study preformance a user has had with
app.get("/top5users", (req, res) => {
    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).send("User query parameter is required");
    }

    const query = `      
    WITH usersessions as (
        select sessionid
        from participants
        where userid = ?
    ),
    commonsessions as (
        select p.userid, p.sessionid
        from participants as p
        join usersessions as us on p.sessionid = us.sessionid
        where p.userid != ?
    ),
    userratings as (
        select cs.userid, cs.sessionid, sr.review as userreview
        from commonsessions as cs
        join session_review as sr on cs.sessionid = sr.sessionid
        where sr.userid = ?
    ),
    otheruserratings as (
        select cs.userid, cs.sessionid, sr.review as otheruserreview
        from commonsessions as cs
        join session_review as sr on cs.sessionid = sr.sessionid and sr.userid = cs.userid
    ),
    combinedratings as (
        select ur.userid, 
               (ur.userreview + our.otheruserreview) / 2.0 as avgrating
        from userratings as ur
        join otheruserratings as our on ur.userid = our.userid and ur.sessionid = our.sessionid
    ),
    averageratings as (
        select userid, avg(avgrating) as avgrating
        from combinedratings
        group by userid
    )
    SELECT u.name, ar.avgrating
    FROM averageratings as ar
    JOIN user_table as u on ar.userid = u.uid
    ORDER BY ar.avgrating desc
    LIMIT 5;    
    `;

    db.query(query, [userId, userId, userId], (err, result) => {
        if (err) {
            console.error("Error:", err);
            return res.status(500).send("Server error");
        }
        res.send(result);
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
