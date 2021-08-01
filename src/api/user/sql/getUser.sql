SELECT user_id, username, DATE_FORMAT(created_date, '%m/%d/%Y %H:%i:%s') AS created_at 
FROM USERS WHERE username = ?