SELECT 
s.subject, 
SUM(s.duration) AS total_hours, 
u.name AS creator_name, 
COUNT(p.userId) AS participant_count
FROM session_table s
JOIN user_table u ON s.creator_fk = u.uid
LEFT JOIN participants p ON s.id = p.sessionId
WHERE s.creator_fk = 103
GROUP BY s.subject, u.name
ORDER BY total_hours DESC
LIMIT 1;
