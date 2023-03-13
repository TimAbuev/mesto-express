const router = require('express').Router();
const userRoutes = require('./users');

// router.get('/users', (req, res ) => {
//   res.send('test01')
// });

router.use('/', userRoutes);

module.exports = router;