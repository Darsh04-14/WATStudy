SELECT * FROM session_table 
WHERE 
group_size >= 2 AND group_size <= 5 
AND ( 
    title LIKE "%ideas%" 
    OR description LIKE "%ideas%" 
    OR location LIKE "%ideas%" 
);

