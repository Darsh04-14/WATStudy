
WITH usersessions AS ( 
SELECT sessionid 
FROM participants 
WHERE userid = 3
),
commonsessions as (
SELECT p.userid, p.sessionid 
FROM participants p
JOIN usersessions us ON p.sessionid = us.sessionid
WHERE p.userid != 3
),
userratings as (
SELECT cs.userid, cs.sessionid, sr.review AS userreview
FROM commonsessions cs
JOIN session_review sr ON cs.sessionid = sr.sessionid
WHERE sr.userid = 3
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
