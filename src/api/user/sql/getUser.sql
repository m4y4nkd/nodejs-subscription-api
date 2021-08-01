SELECT user_id, username, DATE_FORMAT(created_date, '%Y-%m-%d %H:%i:%s') AS created_at 
FROM USERS WHERE username = ?