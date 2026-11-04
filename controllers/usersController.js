// controllers/usersController.js
const usersStorage = require("../storages/usersStorage");
const { body, validationResult, matchedData } = require("express-validator");


const minLength = 1
const maxLength = 10
const alphaErr = "must only contain letters.";
const lengthErr = `must be between ${minLength} and ${maxLength} characters.`;

const validateUser = [
  body("firstName").trim().isAlpha().withMessage("First name must only contain letters.").isLength({ min: minLength, max: maxLength }).withMessage(lengthErr),
  body("lastName").trim().isAlpha().withMessage("Last name must only contain letters.").isLength({ min: minLength, max: maxLength }).withMessage(lengthErr),
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
    title: "Create user"
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

exports.usersSearchGet = (req, res) => {
  const name = typeof req.query.name === "string" ? req.query.name.trim() : "";
  const email = typeof req.query.email === "string" ? req.query.email.trim() : "";
  const users = usersStorage.searchUser(name, email);

  res.render("search", {
    title: "Search page",
    users,
    name,
    email,
  });
};
