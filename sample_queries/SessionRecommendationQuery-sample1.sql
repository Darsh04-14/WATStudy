SELECT 
    s.subject, 
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
    s.creator_fk = 4
GROUP BY 
    s.subject, u.name, us.session_date, us.title, us.location
ORDER BY 
    total_hours DESC;
