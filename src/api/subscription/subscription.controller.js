const fs = require("fs");
const moment = require("moment");
const path = require("path");

const mysql = require("../../config/mysql");

const getUserSql = fs
  .readFileSync(path.resolve(__dirname, "../user/sql/getUser.sql"))
  .toString();
const getPlanSql = fs
  .readFileSync(path.resolve(__dirname, "./sql/getPlan.sql"))
  .toString();
const getSubscriptionSql = fs
  .readFileSync(path.resolve(__dirname, "./sql/getSubscription.sql"))
  .toString();
const getAllSubscriptionSql = fs
  .readFileSync(path.resolve(__dirname, "./sql/getAllSubscription.sql"))
  .toString();
const createSubscriptionSql = fs
  .readFileSync(path.resolve(__dirname, "./sql/createSubscription.sql"))
  .toString();

const MAX_DATE = "2099-12-31";

exports.getSubscription = async (req, res) => {
  const { username, date } = req.params;
  if (!username) {
    return res.status(400).json("No username provided!");
  }
  try {
    // check if the user exists
    const [[user]] = await mysql.promise().query(getUserSql, [username]);
    if (!user) {
      return res.status(422).json(`User ${username} does not exist!`);
    }

    if (date) {
      // check if valid date
      if (!moment(date, "YYYY-MM-DD", true).isValid()) {
        return res.status(422).json(`Invalid start date ${startDate}`);
      }
      const [[subscription]] = await mysql
        .promise()
        .query(getSubscriptionSql, [date, user.user_id, date]);
      if (!subscription) {
        return res
          .status(200)
          .json(`No subscription found for user ${username} at date ${date}!`);
      }
      return res.status(200).json(subscription);
    }

    const [subscriptions] = await mysql
      .promise()
      .query(getAllSubscriptionSql, [user.user_id]);
    if (subscriptions.length === 0) {
      return res
        .status(200)
        .json(`No subscriptions found for user ${username}!`);
    }
    return res.status(200).json(subscriptions);
  } catch (err) {
    return res.status(500).json(`Internal Server Error: ${err}`);
  }
};

exports.createSubscription = async (req, res) => {
  const { username, planId, startDate } = req.body;
  if (!username || !planId || !startDate) {
    return res.status(400).json("username/planId/startDate not provided!");
  }

  try {
    let status = "FAILURE";
    // check if the user exists
    const [[user]] = await mysql.promise().query(getUserSql, [username]);
    if (!user) {
      return res.status(422).json({
        status,
        error: `User ${username} does not exist!`,
      });
    }
    // check if the plan exists
    const [[plan]] = await mysql.promise().query(getPlanSql, [planId]);
    if (!plan) {
      return res.status(422).json({
        status,
        error: `Plan ${planId} does not exist!`,
      });
    }
    // check if valid date
    if (!moment(startDate, "YYYY-MM-DD", true).isValid()) {
      return res.status(422).json({
        status,
        error: `Invalid start date ${startDate}`,
      });
    }
    const validTill =
      plan.validity >= 0
        ? moment(startDate).add(plan.validity, "days").toDate()
        : new Date(MAX_DATE);

    await mysql
      .promise()
      .query(createSubscriptionSql, [
        [user.user_id, planId, startDate, validTill],
      ]);
    status = "SUCCESS";
    return res.status(200).json({ status, amount: `-${plan.cost}` });
  } catch (err) {
    return res.status(500).json({
      status,
      error: `Internal Server Error: ${err}`,
    });
  }
};
