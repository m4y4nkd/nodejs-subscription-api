const { Router } = require("express");
const { getUser, createUser } = require("./user/user.controller");
const {
  getSubscription,
  createSubscription,
} = require("./subscription/subscription.controller");

const router = Router();

router.get("/user/:username?", getUser);
router.put("/user", createUser); // should ideally be using POST

router.post("/subscription", createSubscription);
router.get("/subscription/:username/:date?", getSubscription);

module.exports = router;
