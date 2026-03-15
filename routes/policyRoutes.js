const express = require('express');
const policyController = require('../controllers/policyController');

const router = express.Router();

// POST - Create a new policy
router.post('/', policyController.createPolicy);

// GET - Get all policies with filtering and pagination
router.get('/', policyController.getAllPolicies);

// GET - Get a policy by ID
router.get('/:id', policyController.getPolicyById);

// PUT - Update a policy by ID
router.put('/:id', policyController.updatePolicy);

// DELETE - Delete a policy by ID
router.delete('/:id', policyController.deletePolicy);

module.exports = router;
