const ChargingStation = require('../models/ChargingStation');

exports.getAllStations = async (req, res) => {
  try {
    const { status, powerOutput, connectorType } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (powerOutput) filter.powerOutput = { $gte: parseInt(powerOutput) };
    if (connectorType) filter.connectorType = connectorType;
    
    const stations = await ChargingStation.find(filter).populate('owner', 'name email');
    res.json(stations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStation = async (req, res) => {
  try {
    const station = await ChargingStation.findById(req.params.id).populate('owner', 'name email');
    if (!station) {
      return res.status(404).json({ message: 'Station not found' });
    }
    res.json(station);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createStation = async (req, res) => {
  try {
    const station = new ChargingStation({
      ...req.body,
      owner: req.userId
    });
    await station.save();
    res.status(201).json(station);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateStation = async (req, res) => {
  try {
    const station = await ChargingStation.findById(req.params.id);
    if (!station) {
      return res.status(404).json({ message: 'Station not found' });
    }
    
    // Check if user owns the station
    if (station.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this station' });
    }
    
    Object.assign(station, req.body);
    await station.save();
    res.json(station);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteStation = async (req, res) => {
  try {
    const station = await ChargingStation.findById(req.params.id);
    if (!station) {
      return res.status(404).json({ message: 'Station not found' });
    }
    
    // Check if user owns the station
    if (station.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this station' });
    }
    
    await station.deleteOne();
    res.json({ message: 'Station deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};