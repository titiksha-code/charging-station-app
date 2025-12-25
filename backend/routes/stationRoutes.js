const express = require('express');
const router = express.Router();
const stationController = require('../controllers/stationController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', stationController.getAllStations);
router.get('/:id', stationController.getStation);
router.post('/', stationController.createStation);
router.put('/:id', stationController.updateStation);
router.delete('/:id', stationController.deleteStation);

module.exports = router;