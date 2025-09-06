const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'uuids.json');
const MAX_IPS = 1; // maximum simultaneous IPs per UUID
const TWENTY_MINUTES = 20 * 60 * 1000; // 20 minutes for everything
const ONE_MONTH = 30 * 24 * 60 * 60 * 1000; // 1 month

const allowedUUIDs = [
  "dcc17923-ff5e-4fbf-8dcd-0cc65b48934f",
  "a7d2f4aa-8d89-485f-985a-aa3248d39154",
  "42e84991-78a7-4bb1-aa9f-84fdcd14c205",
  "b7e63a55-2e44-45cf-bd9d-c5486e317d01",
  "c1f8d6d4-bcc9-4a48-8b67-2a02d6b1d9aa",
  "fa2d04fb-04c3-47a6-9bfb-9489d8f59d31",
  "5a7e3f67-5b9e-4bdf-9313-fd57b846a5e9",
  "8e3a4fd8-d91e-4bc1-a463-2a4ed99d5acb",
  "ef02b73a-0d42-4ef1-90d3-7a0e2fbc6f11",
  "3f8c2b99-3a5f-445c-8c8e-67a4e6b0fcd2",

  "7b2f9a01-52c3-4d0a-8b90-1a23f6b7c9e8",
  "91a3d6c5-849f-4768-92c7-b54a2f7d99af",
  "c8e59f1a-0fd2-44c9-92a4-6d7c5e9f8a12",
  "2f9a71e2-5a03-42b1-9b38-ef5a1c0d2f3b",
  "5e0a9c42-2c1e-46db-8e4c-71b8f2c1a6de",
  "0d3f4e1a-5e2c-41d7-9a8b-f9b0e6a7c5d2",
  "9a4b7d2e-83f2-4e5a-9d8c-1e3f6b7c8a9d",
  "af1d0b5c-3c9e-42f8-8b71-6d9e2f1a5c3b",
  "1c7e4f9a-52b6-4d8a-9c03-2b9f7e6d4c5a",
  "e9a2c5d1-47f3-45b8-91c6-8f1b2a3d5c7e",

  "6d7c8a9b-1e2f-4c3d-9a0b-2c4d5e6f7a8b",
  "0f1a2b3c-4d5e-678f-9012-3456789abcde",
  "abcdef12-3456-7890-abcd-ef1234567890",
  "12345678-90ab-cdef-1234-567890abcdef",
  "9abcdef0-1234-5678-90ab-cdef12345678",
  "56789abc-def0-1234-5678-90abcdef1234",
  "7890abcd-ef12-3456-7890-abcd123456ef",
  "90abcdef-1234-5678-90ab-cdef12345678",
  "23456789-0abc-def1-2345-67890abcdef1",
  "34567890-abcd-ef12-3456-7890abcdef12",

  "4567890a-bcde-f123-4567-890abcdef123",
  "567890ab-cdef-1234-5678-90abcdef1234",
  "67890abc-def1-2345-6789-0abcdef12345",
  "7890abcd-ef12-3456-7890-abcdef123456",
  "890abcde-f123-4567-890a-bcdef1234567",
  "90abcdef-1234-5678-90ab-cdef12345678",
  "abcdef01-2345-6789-0abc-def123456789",
  "bcdef123-4567-890a-bcde-f1234567890a",
  "cdef1234-5678-90ab-cdef-1234567890ab",
  "def12345-6789-0abc-def1-234567890abc",

  "ef123456-7890-abcd-ef12-34567890abcd",
  "f1234567-890a-bcde-f123-4567890abcde",
  "01234567-89ab-cdef-0123-456789abcdef",
  "12345678-9abc-def0-1234-56789abcdef0",
  "23456789-abcd-ef01-2345-6789abcdef01",
  "34567890-bcde-f123-4567-89abcdef0123",
  "4567890a-cdef-1234-5678-9abcdef01234",
  "567890ab-def0-1234-5678-abcdef012345",
  "67890abc-ef12-3456-7890-bcdef0123456",
  "7890abcd-f123-4567-890a-cdef01234567",

  "890abcde-0123-4567-89ab-def012345678",
  "90abcdef-1234-5678-90ab-ef0123456789",
  "abcdef01-2345-6789-0abc-f0123456789a",
  "bcdef123-4567-890a-bcde-0123456789ab",
  "cdef1234-5678-90ab-cdef-1234567890ac",
  "def12345-6789-0abc-def1-234567890adf",
  "ef123456-7890-abcd-ef12-34567890ae12",
  "f1234567-890a-bcde-f123-4567890aef13",
  "01234567-89ab-cdef-0123-4567890aef14",
  "12345678-9abc-def0-1234-567890aef015",

  "23456789-abcd-ef01-2345-67890aef0167",
  "34567890-bcde-f123-4567-890aef01789a",
  "4567890a-cdef-1234-5678-90aef0189abc",
  "567890ab-def0-1234-5678-aef0190abcd1",
  "67890abc-ef12-3456-7890-aef0201bcdef",
  "7890abcd-f123-4567-890a-ef0212345678",
  "890abcde-0123-4567-89ab-ef0223456789",
  "90abcdef-1234-5678-90ab-ef023456789a",
  "abcdef01-2345-6789-0abc-ef02456789ab",
  "bcdef123-4567-890a-bcde-f0256789abcd",

  "cdef1234-5678-90ab-cdef-026789abcdea",
  "def12345-6789-0abc-def1-02789abcdef1",
  "ef123456-7890-abcd-ef12-0289abcdef12",
  "f1234567-890a-bcde-f123-029abcdef123",
  "01234567-89ab-cdef-0123-02abcdef1234",
  "12345678-9abc-def0-1234-03abcdef1235",
  "23456789-abcd-ef01-2345-04abcdef1236",
  "34567890-bcde-f123-4567-05abcdef1237",
  "4567890a-cdef-1234-5678-06abcdef1238",
  "567890ab-def0-1234-5678-07abcdef1239"
];

let uuidData = {};
if (fs.existsSync(DATA_FILE)) {
  uuidData = JSON.parse(fs.readFileSync(DATA_FILE));
} else {
  fs.writeFileSync(DATA_FILE, JSON.stringify(uuidData, null, 2));
}

function saveData() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(uuidData, null, 2));
}

function getClientIp(req) {
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || "";
  if (ip.includes("::ffff:")) {
    ip = ip.split("::ffff:")[1];
  }
  return ip;
}

// Root route
app.get('/', (req, res) => {
  res.send('Server is alive ✅');
});

// Middleware for protected routes
app.use((req, res, next) => {
  if (req.path === '/validate-uuid') return next();

  const uuid = req.headers['x-uuid'];
  const clientIp = getClientIp(req);

  if (!uuid || !uuidData[uuid]) {
    return res.status(401).json({ valid: false, message: 'Login required' });
  }

  const now = Date.now();
  const { firstLogin, ips } = uuidData[uuid];

  // UUID expiration
  if (now - firstLogin > ONE_MONTH) {
    return res.status(403).json({ valid: false, message: '⏳ UUID expired after 1 month' });
  }

  // Remove inactive IPs (>20 min)
  for (let ip in ips) {
    if (now - ips[ip] > TWENTY_MINUTES) delete ips[ip];
  }

  // If IP not in list, check limit
  if (!ips[clientIp]) {
    const sortedIps = Object.entries(ips).sort((a, b) => a[1] - b[1]);
    while (Object.keys(ips).length >= MAX_IPS) {
      const oldestIp = sortedIps.shift()[0];
      delete ips[oldestIp];
    }
    ips[clientIp] = now; // add new IP
  } else {
    ips[clientIp] = now; // refresh lastActivity for existing IP
  }

  uuidData[uuid].ips = ips;
  saveData();

  next();
});

// Validate UUID endpoint
app.post('/validate-uuid', (req, res) => {
  const { uuid } = req.body;
  const clientIp = getClientIp(req);

  if (!allowedUUIDs.includes(uuid)) {
    return res.json({ valid: false, message: '❌ UUID NOT RECOGNIZED!' });
  }

  const now = Date.now();

  if (!uuidData[uuid]) {
    uuidData[uuid] = { firstLogin: now, ips: { [clientIp]: now } };
    saveData();
    return res.json({ valid: true, message: '✅ First login recorded', ips: [clientIp], expiresInDays: 30 });
  } else {
    const { ips } = uuidData[uuid];

    // Remove inactive IPs (>20 min)
    for (let ip in ips) {
      if (now - ips[ip] > TWENTY_MINUTES) delete ips[ip];
    }

    // Enforce MAX_IPS limit
    if (!ips[clientIp]) {
      const sortedIps = Object.entries(ips).sort((a, b) => a[1] - b[1]);
      while (Object.keys(ips).length >= MAX_IPS) {
        const oldestIp = sortedIps.shift()[0];
        delete ips[oldestIp];
      }
      ips[clientIp] = now;
    } else {
      ips[clientIp] = now; // refresh activity
    }

    uuidData[uuid].ips = ips;
    saveData();

    return res.json({ valid: true, message: '🔄 UUID still valid (activity refreshed)', ips: Object.keys(ips) });
  }
});

// Endpoint to view active IPs
app.get('/active-ips/:uuid', (req, res) => {
  const { uuid } = req.params;
  if (!uuidData[uuid]) {
    return res.status(404).json({ message: 'UUID not found' });
  }

  const now = Date.now();
  const { ips } = uuidData[uuid];

  for (let ip in ips) {
    if (now - ips[ip] > TWENTY_MINUTES) delete ips[ip];
  }

  uuidData[uuid].ips = ips;
  saveData();

  res.json({
    uuid,
    activeIps: Object.keys(ips),
    lastActivity: Object.fromEntries(Object.entries(ips))
  });
});

// Example protected route
app.get('/secret-data', (req, res) => {
  res.json({ data: "💎 This is protected content!" });
});

// Keep-alive ping every 5 minutes (native fetch in Node 22+)
setInterval(() => {
  fetch(`https://server-validation-expiry.onrender.com/`)
    .then(res => console.log("Keep-alive ping:", res.status))
    .catch(err => console.error("Ping error:", err));
}, 5 * 60 * 1000);

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
