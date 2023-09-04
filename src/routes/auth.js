const { Router } = require('express');
const controller = require('../controllers/auth');
const { authMiddleware, uploadMiddleware } = require('../middlewares');

const router = Router();

router.post('/register', controller.register);

router.post('/login', controller.login);

router.post('/logout', authMiddleware, controller.logout);

router.get('/current', authMiddleware, controller.current);

router.patch(
  '/avatars',
  authMiddleware,
  uploadMiddleware.single('avatar'),
  controller.updateAvatar
);

module.exports = router;
