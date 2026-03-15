const mongoose = require('mongoose');

const policySchema = new mongoose.Schema(
  {
    policyNumber: {
      type: String,
      required: [true, 'Policy number is required'],
      unique: true,
      trim: true,
      minlength: [1, 'Policy number cannot be empty']
    },
    policyHolderName: {
      type: String,
      required: [true, 'Policy holder name is required'],
      trim: true,
      minlength: [1, 'Policy holder name cannot be empty']
    },
    policyType: {
      type: String,
      required: [true, 'Policy type is required'],
      enum: {
        values: ['Health', 'Life', 'Vehicle', 'Home', 'Travel'],
        message: 'Policy type must be one of: Health, Life, Vehicle, Home, Travel'
      }
    },
    premiumAmount: {
      type: Number,
      required: [true, 'Premium amount is required'],
      validate: {
        validator: function (value) {
          return value > 0;
        },
        message: 'Premium amount must be a positive number'
      }
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: 'End date must be after start date'
      }
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Policy', policySchema);
