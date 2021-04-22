const express = require('express');
const router = express.Router();

function requireLogin(req, res, next) {
    if (req.session.currentUser) { //if logged in can continue
      next();
    } else {
      res.redirect('/login') //otherwise redirect to login page
    }
  }




/* GET home page */
router.get('/', async (req, res, next) => {
    res.render('index', {user: req.session.currentUser})
});



router.get('/private', requireLogin, async (req, res) => {
    res.render('private')
})

router.get('/main', requireLogin, async (req, res) => {
    res.render('main')
})

module.exports = router;
