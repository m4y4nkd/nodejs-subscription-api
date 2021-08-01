SELECT S.plan_id, S.start_date, S.valid_till
FROM SUBSCRIPTIONS S
WHERE user_id = ? AND valid_till >= ?;