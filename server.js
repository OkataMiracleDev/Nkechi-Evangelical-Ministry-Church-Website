// server.js

// === Dependencies ===
const express = require("express");
const cors = require('cors');
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config(); // This line loads your .env file

const app = express();

// === CORS Configuration ===
const allowedOrigins = ['https://nkechi-evangelical-ministry.netlify.app'];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

app.use(express.json());

// === Supabase Client Initialization ===
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// === Endpoints ===
// Newsletter Subscription Route
app.post("/subscribe", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    const { error } = await supabase.from("subscribe").insert([{ email }]);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json({ message: "Subscription successful!" });
});

// Paystack Public Key Route
app.get('/api/paystack-key', (req, res) => {
    // Access the public key from the environment variable
    const paystackPublicKey = process.env.PAYSTACK_PUBLIC_KEY;
    
    // Check if the public key is defined
    if (!paystackPublicKey) {
        return res.status(500).json({ error: 'Paystack public key is not configured.' });
    }

    res.json({ publicKey: paystackPublicKey });
});

// === Server Start ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// These logs can be helpful for debugging
console.log("Supabase URL:", process.env.SUPABASE_URL);
console.log("Supabase Key:", process.env.SUPABASE_ANON_KEY);
console.log("Paystack Public Key:", process.env.PAYSTACK_PUBLIC_KEY);