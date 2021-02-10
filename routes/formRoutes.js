const {Router} =require('express');
const formController= require('../controllers/formController');
const {requireAuth} = require('../middleware/authMiddleware');

const router=Router();

router.get('/formQuestion',requireAuth,formController.formQuestion_get);
router.post('/formQuestion',requireAuth,formController.formQuestion_post);

module.exports = router;