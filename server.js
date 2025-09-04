const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors'); // ✅ Add CORS

const app = express();
app.use(bodyParser.json());
app.use(cors()); // ✅ Enable cross-origin requests
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
  "3b131c1f-6289-4489-865d-52f09cafdce8",
  "f4e2c4a0-4b9f-4e4c-bf38-2d5c2a28db36",
  "2b8c1d1e-14f3-4c56-a71e-d4d99513eb14",
  "9c8b2f3a-8a1d-4a1b-99e4-8f5b2d6c2c9e",
  "d1f3b6a4-3c4e-4e7a-8f2c-7a1b9f8e6d21",
  "5a4e1c9f-7b2d-4c3a-93f8-1d2c3b4e5f6a",
  "3d1a2f4b-6c5e-4f3d-8b9a-2c7e1f0d9a4b",
  "8e7b6c5a-4d3f-4b2a-9c1d-5f6a7b8c9d0e",
  "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
  "0f1e2d3c-4b5a-6c7d-8e9f-0a1b2c3d4e5f",
  "7d8c9b0a-1e2f-3c4d-5b6a-7e8f9d0c1b2a",
  "2e3d4c5b-6a7f-8b9c-0d1e-2f3a4b5c6d7e",
  "4f5e6d7c-8b9a-0c1d-2e3f-4a5b6c7d8e9f",
  "6a7b8c9d-0e1f-2d3c-4b5a-6c7d8e9f0a1b",
  "9f0e1d2c-3b4a-5c6d-7e8f-9a0b1c2d3e4f",
  "1c2d3e4f-5a6b-7c8d-9e0f-1a2b3c4d5e6f",
  "3e4f5a6b-7c8d-9e0f-1a2b-3c4d5e6f7a8b",
  "5f6a7b8c-9d0e-1f2c-3d4b-5e6f7a8b9c0d",
  "7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d",
  "0b1c2d3e-4f5a-6b7c-8d9e-0f1a2b3c4d5e",
  "2c3d4e5f-6a7b-8c9d-0e1f-2a3b4c5d6e7f",
  "a1f2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c",
  "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e",
  "c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f",
  "d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a",
  "e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b",
  "f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c",
  "a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d",
  "b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e",
  "c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f",
  "d0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a",
  "e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b",
  "f2a3b4c5-d6e7-4f8a-9b0c-1d2e3f4a5b6c",
  "a3b4c5d6-e7f8-4a9b-0c1d-2e3f4a5b6c7d",
  "b4c5d6e7-f8a9-4b0c-1d2e-3f4a5b6c7d8e",
  "c5d6e7f8-a9b0-4c1d-2e3f-4a5b6c7d8e9f",
  "d6e7f8a9-b0c1-4d2e-3f4a-5b6c7d8e9f0a",
  "e7f8a9b0-c1d2-4e3f-4a5b-6c7d8e9f0a1b",
  "f8a9b0c1-d2e3-4f4a-5b6c-7d8e9f0a1b2c",
  "a9b0c1d2-e3f4-4a5b-6c7d-8e9f0a1b2c3d",
  "b0c1d2e3-f4a5-4b6c-7d8e-9f0a1b2c3d4e",
  "c1d2e3f4-a5b6-4c7d-8e9f-0a1b2c3d4e5f",
  "d2e3f4a5-b6c7-4d8e-9f0a-1b2c3d4e5f6a",
  "e3f4a5b6-c7d8-4e9f-0a1b-2c3d4e5f6a7b",
  "f4a5b6c7-d8e9-4f0a-1b2c-3d4e5f6a7b8c",
  "a5b6c7d8-e9f0-4a1b-2c3d-4e5f6a7b8c9d",
  "b6c7d8e9-f0a1-4b2c-3d4e-5f6a7b8c9d0e",
  "c7d8e9f0-a1b2-4c3d-4e5f-6a7b8c9d0e1f",
  "d8e9f0a1-b2c3-4d4e-5f6a-7b8c9d0e1f2a",
  "e9f0a1b2-c3d4-4e5f-6a7b-8c9d0e1f2a3b",
  "f0a1b2c3-d4e5-4f6a-7b8c-9d0e1f2a3b4c",
  "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
  "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e",
  "c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f",
  "d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a",
  "e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b",
  "f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c",
  "a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d",
  "b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e",
  "c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f",
  "d0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a",
  "e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b",
  "f2a3b4c5-d6e7-4f8a-9b0c-1d2e3f4a5b6c",
  "a3b4c5d6-e7f8-4a9b-0c1d-2e3f4a5b6c7d",
  "b4c5d6e7-f8a9-4b0c-1d2e-3f4a5b6c7d8e",
  "c5d6e7f8-a9b0-4c1d-2e3f-4a5b6c7d8e9f",
  "d6e7f8a9-b0c1-4d2e-3f4a-5b6c7d8e9f0a",
  "e7f8a9b0-c1d2-4e3f-4a5b-6c7d8e9f0a1b",
  "f8a9b0c1-d2e3-4f4a-5b6c-7d8e9f0a1b2c",
  "a9b0c1d2-e3f4-4a5b-6c7d-8e9f0a1b2c3d",
  "b0c1d2e3-f4a5-4b6c-7d8e-9f0a1b2c3d4e",
  "c1d2e3f4-a5b6-4c7d-8e9f-0a1b2c3d4e5f",
  "d2e3f4a5-b6c7-4d8e-9f0a-1b2c3d4e5f6a"
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

app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));
