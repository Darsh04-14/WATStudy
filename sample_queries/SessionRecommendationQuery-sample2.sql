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
    s.creator_fk = 77
GROUP BY 
    s.subject, u.name, us.session_date, us.title, us.location
ORDER BY 
    total_hours DESC;
