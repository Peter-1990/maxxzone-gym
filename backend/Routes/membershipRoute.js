const express = require('express');
const router = express.Router();
const MembershipController = require('../Controllers/membershipController.js')
const auth = require('../Auth/auth.js');

router.post('/add-membership', auth, MembershipController.addMembership);
router.get('/get-membership', auth, MembershipController.getMembership);

module.exports = router;