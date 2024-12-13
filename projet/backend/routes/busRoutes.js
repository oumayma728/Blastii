const express = require('express');
const { getBusById, createBus, updateBus, deleteBus,getAvailableBuses } = require('../controllers/busController');
const router = express.Router();

//Route to get all buses

// Route to get a specific bus by ID
router.get('/:id', getBusById);  // GET /api/buses/:id

// Route to create a new bus
router.post('/', createBus);  // POST /api/buses

// Route to update a bus by ID
router.put('/:id', updateBus);  // PUT /api/buses/:id

// Route to delete a bus by ID
router.delete('/:id', deleteBus);  // DELETE /api/buses/:id
router.get('/available', getAvailableBuses);


module.exports = router;