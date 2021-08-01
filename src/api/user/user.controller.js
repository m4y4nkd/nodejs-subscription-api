const fs = require("fs");
const path = require("path");

const mysql = require("../../config/mysql");

const getUserSql = fs
  .readFileSync(path.resolve(__dirname, "./sql/getUser.sql"))
  .toString();
const createUserSql = fs
  .readFileSync(path.resolve(__dirname, "./sql/createUser.sql"))
  .toString();

exports.getUser = async (req, res) => {
  const { username } = req.params;
  if (!username) {
    return res.status(400).json("No username provided!");
  }
  try {
    const [[user]] = await mysql.promise().query(getUserSql, [username]);
    if (!user) {
      return res.status(200).json(`No user found with username ${username}`);
    }
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(`Internal Server Error: ${err}`);
  }
};

exports.createUser = async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json("No username provided!");
  }

  try {
    // check if the user already exists
    const [[existingUser]] = await mysql
      .promise()
      .query(getUserSql, [username]);
    if (existingUser) {
      return res.status(409).json(`User ${username} already exists!`);
    }

    await mysql.promise().query(createUserSql, [username]);
    return res.status(201).json(`User ${username} created successfully!`);
  } catch (err) {
    return res.status(500).json(`Internal Server Error: ${err}`);
  }
};
