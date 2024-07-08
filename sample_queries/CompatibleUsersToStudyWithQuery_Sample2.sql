select * from courses;
select * from user_table;
select * from session_review;
select * from session_table;
select * from participants;
select * from friends;



INSERT INTO session_review (sessionId, userId, review) VALUES (43, 13, 10);
INSERT INTO session_review (sessionId, userId, review) VALUES (43, 32, 9);
INSERT INTO session_review (sessionId, userId, review) VALUES (43, 41, 8);
INSERT INTO session_review (sessionId, userId, review) VALUES (43, 51, 7);
INSERT INTO session_review (sessionId, userId, review) VALUES (43, 113, 6);


INSERT INTO participants (sessionId, userId) VALUES (43, 23);
INSERT INTO participants (sessionId, userId) VALUES (43, 32);
INSERT INTO participants (sessionId, userId) VALUES (43, 41);
INSERT INTO participants (sessionId, userId) VALUES (43, 7);
INSERT INTO participants (sessionId, userId) VALUES (43, 113);




WITH usersessions AS ( 
SELECT sessionid 
FROM participants 
WHERE userid = 13
),
commonsessions as (
SELECT p.userid, p.sessionid 
FROM participants p
JOIN usersessions us ON p.sessionid = us.sessionid
WHERE p.userid != 13
),
userratings as (
SELECT cs.userid, cs.sessionid, sr.review AS userreview
FROM commonsessions cs
JOIN session_review sr ON cs.sessionid = sr.sessionid
WHERE sr.userid = 13
),
otheruserratings as (
SELECT cs.userid, cs.sessionid, sr.review AS otheruserreview
FROM commonsessions cs
JOIN session_review sr 
ON cs.sessionid = sr.sessionid AND sr.userid = cs.userid
),
combinedratings as (
SELECT ur.userid, 
(ur.userreview + our.otheruserreview) / 2.0 as avgrating
FROM userratings ur
JOIN otheruserratings our 
ON ur.userid = our.userid AND ur.sessionid = our.sessionid
),
averageratings as (
SELECT userid, AVG(avgrating) AS avgrating
FROM combinedratings
GROUP BY userid
)
SELECT u.name, ar.avgrating
FROM averageratings ar
JOIN user_table u ON ar.userid = u.uid
ORDER BY ar.avgrating DESC
LIMIT 5;


