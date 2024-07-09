SELECT * FROM session_table 
WHERE subject = 'MATH239'
AND group_size >= 1
AND group_size <= 5
AND duration >= 0
AND duration <= 90
AND (
title LIKE '%%' 
OR description LIKE '%%' 
OR location LIKE '%%'
);
