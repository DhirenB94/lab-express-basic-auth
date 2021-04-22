const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const bcrypt = require('bcryptjs');

//Sign in 
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




//Login
router.get('/login', async (req, res) => {
  res.render('login')
})

router.post('/login', async (req, res) => {
  const {username, password} = req.body
  if (username === "" || password === "") {
    res.render("login", {
      errorMessage: "Indicate username and password",
    }) ; 
    return
  }

  const user = await User.findOne({username:username})
  if(user === null) {
    res.render("login", {
    errorMessage: "Invalid Login",
  }) ; 
  return
  }
  if(bcrypt.compareSync(password, user.password)) {
    req.session.currentUser = user;
    res.redirect('/')
  } else {
    res.render("login", {
      errorMessage: "Either the username or the password is incorrect",
    }) ; 
    return
  }
})



//logout
router.post('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
});


module.exports = router;