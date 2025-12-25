const mongoose = require('mongoose');

const chargingStationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  powerOutput: {
    type: Number,
    required: true
  },
  connectorType: {
    type: String,
    required: true,
    enum: ['Type 1', 'Type 2', 'CCS', 'CHAdeMO', 'Tesla Supercharger']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ChargingStation', chargingStationSchema);