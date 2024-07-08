	SELECT * FROM session_table 
WHERE group_size >= 10
AND group_size <= 20
AND duration >= 0
AND duration <= 50
AND (
title LIKE '%%' 
OR description LIKE '%%' 
OR location LIKE '%%'
);
