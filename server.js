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

const allowedUUIDs = [
  "dcc17923-ff5e-4fbf-8dcd-0cc65b48934f",
  "a7d2f4aa-8d89-485f-985a-aa3248d39154",
  "42e84991-78a7-4bb1-aa9f-84fdcd14c205",
  "46d44aef-7af-445e-833f-1149ef1f03e9",
  "24c1d0c9-890c-4d41-9a86-511da153a669",
  "b350401a-ca85-4bd9-8e1f-ec31d0ede738",
  "d9ced2b9-c2d7-4d7e-9e90-860a260e2f32",
  "5322363d-6f86-4949-a12e-0af98bf97124",
  "1e088978-e8fa-4bd8-b1e8-ca65fe71a19b",
  "b8636235-2336-464c-91cc-c843ddf37828",
  "dfe38d9e-979a-4df0-bd49-73a678a6882c",
  "c7566515-1bec-46e1-a8d2-99cf7b208c92",
  "f2035409-3e4f-4df2-a885-676f06bfe4c8",
  "9bd5c28b-8cb0-4b53-ac2c-ed908c308f8e",
  "5e19d5b8-8364-4a7d-b44a-94e34dfd5cdf",
  "9d7a7f33-623e-423f-9a8e-ef171fad5d97",
  "7ec32ab4-55d6-4d90-a530-bc1f218f3f48",
  "cd17b143-d0fa-403d-8ce8-c9d8191f5e49",
  "d16526cf-2f17-4330-8007-dc7a3fb2c449",
  "c3032eae-4404-4b91-bb15-cb460dc524b6",
  "c8ffdf8e-38ed-4f72-97da-5cddecba045c",
  "dd29536e-9245-4e96-9f2a-e1bc9a6ebc7b",
  "939c5ca1-9a3e-4d9e-904d-615afc6c5dc4",
  "6277ea55-7b98-45e1-a232-4d8cbfbc2793",
  "8f73e961-3299-404c-82af-ff03cb38f46e",
  "4da9e199-92ef-400c-9844-812adcbf1a02",
  "f0ea8b24-d6e5-483f-bc51-93a0841714a2",
  "c5c6645b-f5df-49be-ad68-648ef94ce72a",
  "c5ce1969-8e46-47be-8d7d-62f9b96a9540",
  "3b131c1f-6289-4489-865d-52f09cafdce8"
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

// Root route
app.get('/', (req, res) => {
  res.send('Server is alive ✅');
});

// Middleware for protected routes
app.use((req, res, next) => {
  if (req.path === '/validate-uuid') return next();
  const uuid = req.headers['x-uuid'];
  if (!uuid || !uuidData[uuid]) return res.status(401).json({ valid:false, message:'Login required' });

  const now = Date.now();
  const oneMonth = 30*24*60*60*1000;
  const firstLogin = uuidData[uuid].firstLogin;
  if (now - firstLogin > oneMonth) return res.status(403).json({ valid:false, message:'UUID expired' });

  next();
});

// Validate UUID endpoint
app.post('/validate-uuid', (req,res)=>{
  const {uuid} = req.body;
  if (!allowedUUIDs.includes(uuid)) return res.json({valid:false,message:'UUID NOT RECOGNIZED!'});

  const now = Date.now();
  const oneMonth = 30*24*60*60*1000;

  if (!uuidData[uuid]) {
    uuidData[uuid] = {firstLogin: now};
    saveData();
    return res.json({valid:true, firstLogin: now, message:'First login recorded'});
  } else {
    const firstLogin = uuidData[uuid].firstLogin;
    const expired = now - firstLogin > oneMonth;
    if (expired) return res.json({valid:false,message:'UUID expired. Please login again.'});
    else return res.json({valid:true, firstLogin, message:'UUID still valid'});
  }
});

// Example protected route
app.get('/secret-data',(req,res)=>{
  res.json({data:"💎 This is protected content!"});
});

// 🔥 Keep-alive ping every 5 minutes (Node 22+ has native fetch)
setInterval(() => {
  fetch(`https://server-validation-expiry.onrender.com/`)
    .then(res => console.log("Keep-alive ping:", res.status))
    .catch(err => console.error("Ping error:", err));
}, 5 * 60 * 1000);

// Start server
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));
