const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const Booking = require("./models/Booking");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;


// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());
app.use(express.json());


// ===============================
// MONGODB CONNECTION
// ===============================

mongoose.connect(process.env.MONGODB_URI)

    .then(() => {

        console.log("MongoDB imeunganishwa vizuri!");

    })

    .catch((error) => {

        console.log("MongoDB connection error:");
        console.log(error.message);

    });


// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {

    res.json({

        success: true,

        message: "Karibu Rey Soon Saluni Backend",

        status: "online"

    });

});


// ===============================
// DATABASE TEST
// ===============================

app.get("/api/health", (req, res) => {

    res.json({

        server: "online",

        database:
            mongoose.connection.readyState === 1
                ? "connected"
                : "disconnected"

    });

});


// ===============================
// CREATE BOOKING
// ===============================

app.post("/api/bookings", async (req, res) => {

    try {

        const {

            name,
            phone,
            service,
            price,
            date,
            time,
            message

        } = req.body;


        // Check required information

        if (!name || !phone || !service || !date) {

            return res.status(400).json({

                success: false,

                message:
                    "Tafadhali jaza jina, namba ya simu, huduma na tarehe."

            });

        }


        // Create booking

        const booking = new Booking({

            name: name,

            phone: phone,

            service: service,

            price: price || 0,

            date: date,

            time: time || "",

            message: message || ""

        });


        // Save to MongoDB

        await booking.save();


        res.status(201).json({

            success: true,

            message:
                "Ombi lako la nafasi limehifadhiwa kikamilifu.",

            booking: booking

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message:
                "Kuna tatizo wakati wa kuhifadhi booking."

        });

    }

});


// ===============================
// GET ALL BOOKINGS
// ===============================

app.get("/api/bookings", async (req, res) => {

    try {

        const bookings = await Booking
            .find()
            .sort({ createdAt: -1 });


        res.json({

            success: true,

            count: bookings.length,

            bookings: bookings

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message:
                "Imeshindikana kupata bookings."

        });

    }

});


// ===============================
// DELETE BOOKING
// ===============================

app.delete("/api/bookings/:id", async (req, res) => {

    try {

        await Booking.findByIdAndDelete(
            req.params.id
        );


        res.json({

            success: true,

            message:
                "Booking imefutwa."

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message:
                "Imeshindikana kufuta booking."

        });

    }

});


// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {

    console.log("--------------------------------");
    console.log("REY SOON SALUNI BACKEND");
    console.log("--------------------------------");

    console.log(
        `Server: http://localhost:${PORT}`
    );

    console.log(
        "Server imeanza kufanya kazi!"
    );

});