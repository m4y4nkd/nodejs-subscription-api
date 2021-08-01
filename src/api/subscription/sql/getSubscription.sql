SELECT plan_id, datediff(valid_till, ?) AS days_left
FROM SUBSCRIPTIONS
WHERE user_id = ?
  AND ? BETWEEN start_date AND valid_till;