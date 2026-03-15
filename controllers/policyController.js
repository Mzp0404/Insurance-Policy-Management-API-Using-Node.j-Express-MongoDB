const Policy = require('../models/Policy');

// Create a new policy
exports.createPolicy = async (req, res) => {
  try {
    const { policyNumber, policyHolderName, policyType, premiumAmount, startDate, endDate, isActive } = req.body;

    // Validate required fields
    if (!policyNumber || !policyHolderName || !policyType || !premiumAmount || !startDate || !endDate) {
      return res.status(400).json({
        status: 'error',
        message: 'All required fields must be provided'
      });
    }

    // Check for duplicate policy number
    const existingPolicy = await Policy.findOne({ policyNumber });
    if (existingPolicy) {
      return res.status(409).json({
        status: 'error',
        message: 'Policy number already exists'
      });
    }

    // Create new policy
    const newPolicy = await Policy.create({
      policyNumber,
      policyHolderName,
      policyType,
      premiumAmount,
      startDate,
      endDate,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({
      status: 'success',
      message: 'Policy created successfully',
      data: newPolicy
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Get all policies with filtering and pagination
exports.getAllPolicies = async (req, res) => {
  try {
    const { policyType, isActive, page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter = {};
    if (policyType) {
      filter.policyType = policyType;
    }
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    // Calculate pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    // Fetch policies with filtering and pagination
    const policies = await Policy.find(filter)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    // Get total count for pagination metadata
    const totalPolicies = await Policy.countDocuments(filter);
    const totalPages = Math.ceil(totalPolicies / limitNum);

    res.status(200).json({
      status: 'success',
      data: policies,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalPolicies,
        limit: limitNum
      }
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Get a single policy by ID
exports.getPolicyById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid policy ID format'
      });
    }

    const policy = await Policy.findById(id);

    if (!policy) {
      return res.status(404).json({
        status: 'error',
        message: 'Policy not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: policy
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Update a policy by ID
exports.updatePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid policy ID format'
      });
    }

    // Validate premium amount if provided
    if (updateData.premiumAmount !== undefined && updateData.premiumAmount <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Premium amount must be a positive number'
      });
    }

    // Validate dates if both provided
    if (updateData.startDate && updateData.endDate) {
      if (new Date(updateData.endDate) <= new Date(updateData.startDate)) {
        return res.status(400).json({
          status: 'error',
          message: 'End date must be after start date'
        });
      }
    }

    // Check for duplicate policy number if being updated
    if (updateData.policyNumber) {
      const existingPolicy = await Policy.findOne({
        policyNumber: updateData.policyNumber,
        _id: { $ne: id }
      });
      if (existingPolicy) {
        return res.status(409).json({
          status: 'error',
          message: 'Policy number already exists'
        });
      }
    }

    const updatedPolicy = await Policy.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!updatedPolicy) {
      return res.status(404).json({
        status: 'error',
        message: 'Policy not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Policy updated successfully',
      data: updatedPolicy
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Delete a policy by ID
exports.deletePolicy = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid policy ID format'
      });
    }

    const deletedPolicy = await Policy.findByIdAndDelete(id);

    if (!deletedPolicy) {
      return res.status(404).json({
        status: 'error',
        message: 'Policy not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Policy deleted successfully',
      data: deletedPolicy
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Helper function to handle errors
function handleError(res, error) {
  console.error('Error:', error);

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({
      status: 'error',
      message: 'Validation error',
      details: messages
    });
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    return res.status(409).json({
      status: 'error',
      message: `${field} already exists`
    });
  }

  // Mongoose cast error
  if (error.name === 'CastError') {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid ID format'
    });
  }

  // Default error
  res.status(500).json({
    status: 'error',
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
}
