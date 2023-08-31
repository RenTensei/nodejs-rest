const { Router } = require('express');
const { validIdMiddleware } = require('../middlewares');
const controller = require('../controllers/contacts');
const { authMiddleware } = require('../middlewares');

const router = Router();

router.get('/', authMiddleware, controller.getAll);

router.get('/:contactId', authMiddleware, validIdMiddleware, controller.getById);

router.post('/', authMiddleware, controller.post);

router.put('/:contactId', authMiddleware, validIdMiddleware, controller.putById);

router.patch('/:contactId', authMiddleware, validIdMiddleware, controller.patchById);

router.delete('/:contactId', authMiddleware, validIdMiddleware, controller.deleteById);

module.exports = router;
