const express = require('express');
const router = express.Router();
const { listImagesAction, viewImageAction, insertImageAction, updateImageAction, removeImageAction } = require('./image.controller');
router.get('/', listImagesAction);
router.get('/:iid', viewImageAction);
router.post('/', insertImageAction);
router.put('/', updateImageAction);
router.delete('/:iid', removeImageAction);
module.exports = router;