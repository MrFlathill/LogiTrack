const express = require('express');
const router = express.Router();
const { listCompanysAction, viewCompanyAction, insertCompanyAction, updateCompanyAction, removeCompanyAction } = require('./company.controller');
router.get('/', listCompanysAction);
router.get('/:cid', viewCompanyAction);
router.post('/', insertCompanyAction);
router.put('/', updateCompanyAction);
router.delete('/:cid', removeCompanyAction);
module.exports = router;