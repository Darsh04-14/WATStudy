SELECT * FROM session_table 
WHERE group_size >= 1
AND group_size <= 5
AND duration >= 0
AND duration <= 90
AND (
title LIKE '%Lab Review%' 
OR description LIKE '%help%' 
OR location LIKE '%STC%'
);
