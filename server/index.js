var express = require("express");
var cors = require("cors");
const crypto = require("crypto");
var { format, addMinutes, compareDesc, compareAsc } = require("date-fns");
require("dotenv").config();

var db = require("./db");
var mailer = require("./sendmail");

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

var app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cors(corsOptions));

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

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["cookie"];
    const auth = authHeader?.split(" ")[0];
    const token = auth?.substring(6, auth.length - 1);
    if (!token) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(401);
        console.log("Authtenticated");
        next();
    });
};

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const hash = crypto.createHash("sha256").update(password).digest("hex");
    const query = "SELECT * FROM user_table WHERE email = ? AND password = ?";
    const userRecord = await db.getOne(query, [email, hash]);
    console.log("found user", userRecord);
    if (userRecord != null) {
        const user = {
            name: userRecord.name,
            uid: userRecord.uid,
            email: userRecord.email,
        };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: 3885500,
        });
        res.send(accessToken);
    } else {
        res.status(404).send("Invalid credentials");
    }
});

// POST Endpoint - for creating events
app.post("/studysession", authenticateToken, (req, res) => {
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
app.get("/suggestions", authenticateToken, (req, res) => {
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

// Endpoint to get session ID by course name
app.get("/api/sessionId", authenticateToken, (req, res) => {
    const { subject } = req.query;

    if (!subject) {
        console.log("No subject provided");
        return res.status(400).send("Course subject is required");
    }

    console.log(`Received request for subject: ${subject}`);

    const query = "SELECT id FROM session_table WHERE subject = ?";

    db.query(query, [subject], (err, result) => {
        if (err) {
            console.error("Error fetching session ID:", err);
            res.status(500).send("Server error");
        } else if (result.length === 0) {
            console.log(`No session found for subject: ${subject}`);
            res.status(404).send("Session not found");
        } else {
            console.log(`Session ID for subject ${subject}: ${result[0].id}`);
            res.json(result[0]);
        }
    });
});

// Endpoint to join a course
app.post("/api/participants", authenticateToken, (req, res) => {
    const { sessionId, userId } = req.body;

    if (!sessionId || !userId) {
        return res.status(400).send("Session ID and User ID are required");
    }

    console.log("Printing..........");
    console.log(`User ID: ${userId}, Session ID: ${sessionId}`);

    const query = "INSERT INTO participants (sessionId, userId) VALUES (?, ?)";

    db.query(query, [sessionId, userId], (err, result) => {
        if (err) {
            console.error("Error joining course:", err);
            res.status(500).send("Server error");
        } else {
            res.status(201).send("Successfully joined the course");
        }
    });
});

// GET Endpoint - studysession all details
app.get("/studysession", authenticateToken, (req, res) => {
    const searchFilter = req.query.filter;
    let query = "SELECT * FROM session_table";
    if (searchFilter) {
        const params = JSON.parse(searchFilter);
        const { subject, group_size, duration, search } = params;
        let filterQuery = "";

        if (subject)
            filterQuery = filterQuery.concat(` subject = "${subject}" AND`);

        if (group_size)
            filterQuery = filterQuery.concat(
                ` group_size >= ${group_size[0]} AND group_size <= ${group_size[1]} AND`
            );

        if (duration)
            filterQuery = filterQuery.concat(
                ` duration >= ${duration[0]} AND duration <= ${duration[1]} AND`
            );

        if (search && search !== "") {
            filterQuery = filterQuery.concat(
                ` (subject LIKE "%${search}%" OR title LIKE "%${search}%" OR description LIKE "%${search}%" OR location LIKE "%${search}%") AND`
            );
        }

        if (filterQuery !== "") {
            query =
                query +
                " WHERE" +
                filterQuery.substring(0, filterQuery.length - 3);
        }
    }

    query += " LIMIT 1000";

    db.query(query, (err, result) => {
        if (err) {
            console.log("Error", err);
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
app.put("/studysession", authenticateToken, (req, res) => {
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
app.delete("/studysession", authenticateToken, (req, res) => {
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
app.get("/data", authenticateToken, (req, res) => {
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
app.get("/topstudyspot", authenticateToken, (req, res) => {
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
app.get("/topcourse", authenticateToken, (req, res) => {
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
app.get("/top5users", authenticateToken, (req, res) => {
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

app.get("/upcomingsessions", authenticateToken, (req, res) => {
    const { userId } = req.query;
    const date = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    const query = `
    WITH UpcomingSessions AS (
	    SELECT 
	    	s.id AS sessionId,
	    	s.subject,
	    	s.title,
	    	s.description,
	    	s.session_date,
	    	s.duration,
	    	s.group_size,
	    	s.location
	    FROM watstudy.session_table s
	    JOIN watstudy.participants p ON s.id = p.sessionId
	    WHERE p.userId = ?
	    AND s.session_date BETWEEN ? AND DATE_ADD(?, INTERVAL 1 WEEK)
    ), SessionFriends AS (
        SELECT p.*, u.name
   	    FROM watstudy.participants p
    	JOIN watstudy.user_table u ON u.uid = p.userId
    	WHERE sessionId IN
        (SELECT UpcomingSessions.sessionId FROM UpcomingSessions) 
    		AND userId IN (
	            SELECT uid2
			    FROM watstudy.friends
	    WHERE uid1 = ?)
    ) 
    SELECT s.*,
    IFNULL(GROUP_CONCAT(f.name), '') AS friends_participating_names
    FROM UpcomingSessions s
    LEFT JOIN SessionFriends f ON s.sessionId = f.sessionId
    GROUP BY s.sessionId;
    `;
    db.query(query, [userId, date, date, userId], (err, result) => {
        if (err) {
            console.error("Error:", err);
            return res.status(500).send("Server error");
        }
        res.send(result);
    });

});

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
