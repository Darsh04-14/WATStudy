SELECT u.email, s.subject, s.title, s.description, s.session_date, s.duration, s.group_size, s.location
FROM user_table AS u 
JOIN participants AS p ON u.uid = p.userId 
JOIN session_table AS s ON p.sessionId = s.id 
WHERE s.id = ( 
    SELECT p.sessionId 
    FROM participants AS p 
    JOIN session_table AS s ON p.sessionId = s.id 
    WHERE p.userId = 103 
    ORDER BY s.session_date
    ASC LIMIT 1 
);
