SELECT S.plan_id, DATE_FORMAT(start_date, '%Y-%m-%d') AS start_date, DATE_FORMAT(valid_till, '%Y-%m-%d') AS valid_till
FROM SUBSCRIPTIONS S
WHERE user_id = ? ;