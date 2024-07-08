
WITH UpcomingSessions as (
	SELECT 
		s.id AS sessionId,
		s.subject,
		s.title,
		s.description,
		s.session_date,
		s.duration,
		s.group_size,
		s.location
	FROM
		watstudy.session_table s
		JOIN watstudy.participants p ON s.id = p.sessionId
	WHERE
		p.userId = 99
		AND s.session_date BETWEEN '2024-07-30 00:00:00' AND DATE_ADD('2024-07-30 00:00:00', INTERVAL 1 WEEK)
), SessionFriends AS (
	SELECT *
    FROM watstudy.participants
    WHERE sessionId IN (SELECT UpcomingSessions.sessionId FROM UpcomingSessions) 
    AND userId IN (
		SELECT uid2
		FROM watstudy.friends
		WHERE uid1 = 99
    )
) SELECT 
	s.*,
    IFNULL(GROUP_CONCAT(f.userId), '') AS friends_participating_names
FROM UpcomingSessions s
LEFT JOIN SessionFriends f on s.sessionId = f.sessionId
GROUP BY s.sessionId;
