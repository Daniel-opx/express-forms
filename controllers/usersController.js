// controllers/usersController.js
const usersStorage = require("../storages/usersStorage");
const { body, validationResult, matchedData } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";

const validateUser = [
  body("firstName").trim().isAlpha().withMessage("First name must only contain letters.").isLength({ min: 2, max: 10 }),
  body("lastName").trim().isAlpha().withMessage("Last name must only contain letters.").isLength({ min: 2, max: 10 }),
body("email")
  .trim()
  .notEmpty().withMessage("Email is required.") // <--- Added this
  .isEmail().withMessage("Must be a valid email address.")
  .normalizeEmail(),
  body("age").optional({ checkFalsy: true }).isInt({ min: 0, max: 120 }).withMessage("Age must be a valid number."),
  body("bio").optional({ checkFalsy: true }).trim().isLength({ max: 200 }).withMessage("Bio must be under 200 characters.")
];

exports.usersListGet = (req, res) => {
  res.render("index", {
    title: "User list",
    users: usersStorage.getUsers(),
  });
};

exports.usersCreateGet = (req, res) => {
  res.render("createUser", {
    title: "Create user",
  });
};

exports.usersUpdateGet = (req, res) => {
  const user = usersStorage.getUser(req.params.id);
  if (!user) {
    return res.status(404).send("User not found");
  }

  res.render("updateUser", {
    title: "Update user",
    user,
  });
};

exports.usersUpdatePost = [
  validateUser,
  (req, res) => {
    const user = usersStorage.getUser(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("updateUser", {
        title: "Update user",
        user,
        errors: errors.array(),
      });
    }
    const { firstName, lastName, email, age, bio } = matchedData(req);
    usersStorage.updateUser(req.params.id, { firstName, lastName, email, age, bio });
    res.redirect("/");
  }
];

exports.usersCreatePost = [
  validateUser,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("createUser", {
        title: "Create user",
        errors: errors.array(),
      });
    }
    // Inside your controller:
    const { firstName, lastName, email, age, bio } = matchedData(req);
    usersStorage.addUser({ firstName, lastName, email, age, bio });
    res.redirect("/");
  }
];

exports.usersDeletePost = (req, res) => {
  usersStorage.deleteUser(req.params.id);
  res.redirect("/");
};
