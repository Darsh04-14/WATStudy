SELECT * FROM session_table 
WHERE subject = 'CS106'
AND group_size >= 1
AND group_size <= 30
AND duration >= 0
AND duration <= 180
AND (
title LIKE '%%' 
OR description LIKE '%improve%' 
OR location LIKE '%STC%'
);

