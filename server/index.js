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

// GET Endpoint - studysession all details
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

// GET Endpoint - email optional sender, queries earliest event
app.get("/email", (req, res) => {
    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).send('User ID is required');
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
    con.query(query, [userId], (err, result) => {
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

// DELETE Endpoint - to remove posts
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
    SELECT sum(duration)/60 as total_hours 
    FROM session_table 
    WHERE creator_fk = ?;
    `;

    con.query(query, [userId], (err, result) => {
        if (err) {
            console.log("Error:", err);
            res.status(500).send('Server error');
        } else {
            res.send(result[0]);

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
        SELECT location, max(duration) AS max_duration 
        FROM session_table 
        WHERE creator_fk = ? 
        GROUP BY location 
        ORDER BY max_duration desc 
        LIMIT 1;
    `;

    con.query(query, [userId], (err, result) => {
        if (err) {
            console.error("Error:", err);
            return res.status(500).send('Server error');
        }
        res.send(result[0]);
    });
});

//Query for top course and total hours on a top course
app.get("/topcourse", (req, res) => {
    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).send('User query parameter is required');
    }

    const query = `      
        SELECT subject, sum(duration) as total_hours
        FROM session_table
        WHERE creator_fk = ?
        GROUP BY subject
        ORDER BY total_hours desc
        LIMIT 1;
    `;

    con.query(query, [userId], (err, result) => {
        if (err) {
            console.error("Error:", err);
            return res.status(500).send('Server error');
        }
        res.send(result[0]);
    });
});
// Query to return the top 5 users with the highest study preformance a user has had with
app.get("/top5users", (req, res) => {
    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).send('User query parameter is required');
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

    con.query(query, [userId, userId, userId], (err, result) => {
        if (err) {
            console.error("Error:", err);
            return res.status(500).send('Server error');
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
