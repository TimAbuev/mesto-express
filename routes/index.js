const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
// router.get('/users', (req, res ) => {
//   res.send('test01')
// });

router.use('/', userRoutes);
router.use('/', cardRoutes);

module.exports = router;