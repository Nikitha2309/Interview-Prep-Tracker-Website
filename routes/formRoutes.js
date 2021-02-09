const {Router} =require('express');
const formController= require('../controllers/formController');

const router=Router();

router.get('/formQuestion',formController.formQuestion_get);
router.post('/formQuestion',formController.formQuestion_post);

module.exports = router;