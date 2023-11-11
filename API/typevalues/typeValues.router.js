const express = require('express');
const router = express.Router();
const { listTypeValuesAction, insertTypeValuesAction, updateTypeValuesAction, removeTypeValuesAction } = require('./typeValues.controller');
router.get('/', listTypeValuesAction);
router.post('/', insertTypeValuesAction);
router.put('/', updateTypeValuesAction);
router.delete('/', removeTypeValuesAction);
module.exports = router;