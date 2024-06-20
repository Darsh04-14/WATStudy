SELECT * FROM session_table 
WHERE duration >= 30 
AND duration <= 60 
AND session_date >= "2024-08-01 00:00:00" 
AND session_date <= "2024-08-03 23:59:59";

