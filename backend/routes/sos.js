const express = require('express');
const router = express.Router();

let clients = [];
// activeSOSMap stores multiple SOS events keyed by user phone or ID
let activeSOSMap = {};

const broadcastSync = () => {
  const currentEmergencies = Object.values(activeSOSMap);
  const syncEvent = {
    type: 'sync',
    emergencies: currentEmergencies
  };
  clients.forEach(client => {
    client.write(`data: ${JSON.stringify(syncEvent)}\n\n`);
  });
};

// SSE stream endpoint
router.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Add this client to our list
  clients.push(res);

  // Send the current list immediately upon connection
  const currentEmergencies = Object.values(activeSOSMap);
  res.write(`data: ${JSON.stringify({ type: 'sync', emergencies: currentEmergencies })}\n\n`);

  // Remove client on connection close
  req.on('close', () => {
    clients = clients.filter(client => client !== res);
  });
});

// Trigger SOS endpoint
router.post('/trigger', (req, res) => {
  const { user, coordinates, threatLevel, source, message } = req.body;
  
  if (!user || !user.phone) {
    return res.status(400).json({ message: 'User phone is required to identify the SOS' });
  }

  const sosData = {
    user,
    coordinates: coordinates || null,
    threatLevel: threatLevel || 'High',
    source: source || 'manual',
    message: message || '',
    timestamp: Date.now()
  };

  // Add or update this specific user's SOS in the map
  activeSOSMap[user.phone] = sosData;

  // Broadcast the new full list to all clients
  broadcastSync();

  res.status(200).json({ message: 'SOS Triggered Globally', activeSOS: sosData });
});

// Cancel SOS endpoint
router.post('/cancel', (req, res) => {
  const { phone } = req.body;
  
  if (!phone) {
    return res.status(400).json({ message: 'User phone is required to cancel specific SOS' });
  }

  // Remove this specific user's SOS
  if (activeSOSMap[phone]) {
    delete activeSOSMap[phone];
  }

  // Broadcast the updated list to all clients
  broadcastSync();

  res.status(200).json({ message: 'SOS Cancelled for user' });
});

module.exports = router;
