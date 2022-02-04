const Router = require('express');
const router = new Router();
const controller = require('./authController');
const {check} = require('express-validator');

router.post('/registration', [
  check('username', 'User\'s name can\'t be empty').notEmpty(),
  check('password', 'Password should be min 4 characters and max 12 characters').isLength({min: 4, max: 12})
], controller.registration);
router.post('/login', controller.login);
router.post('/passwords', controller.postPasswords);
router.get('/passwords', controller.getPasswords);

module.exports = router;
