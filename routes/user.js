const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const bcrypt = require('bcryptjs');

router.get('/signup', async (req, res) => {
    res.render('signup')
});

router.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    if (username === "" || password === "") {
      res.render("signup", {
        errorMessage: "Indicate username and password",
      }) ; 
      return
    } //check if user already exists
    const user = await User.findOne({username: username})
    if (user !==null) {
    res.render('signup',{ errorMessage: "User already exists" });
    return;
    }
    //create user on DB
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    try {
      await User.create({
        username,
        password: hashedPassword
      }); 
      res.redirect('/');
    } catch(e) {
      res.render('signup', 
      {errorMessage: 'Error occured'})
      return
    }
  });

module.exports = router;