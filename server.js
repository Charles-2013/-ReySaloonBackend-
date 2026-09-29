const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Booking = require("./Booking");

const app = express();

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());
app.use(express.json());

// ===============================
// TEST ROUTE
// ===============================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Rey Soon Saluni Backend iko online"
    });
});

// ===============================
// HEALTH CHECK
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

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Imeshindikana kupata bookings"
        });

    }

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
            message
        } = req.body;

        // Check required information

        if (!name || !phone || !service || !date) {

            return res.status(400).json({

                success: false,

                message:
                    "Jina, simu, huduma na tarehe vinahitajika"

            });

        }

        // Create booking

        const booking = new Booking({

            name: name,

            phone: phone,

            service: service,

            price: price || 0,

            date: date,

            message: message || ""

        });

        // Save to MongoDB

        const savedBooking =
            await booking.save();

        res.status(201).json({

            success: true,

            message:
                "Booking imehifadhiwa vizuri",

            booking: savedBooking

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message:
                "Imeshindikana kuhifadhi booking"

        });

    }

});

// ===============================
// DELETE BOOKING
// ===============================

app.delete("/api/bookings/:id", async (req, res) => {

    try {

        const deletedBooking =
            await Booking.findByIdAndDelete(
                req.params.id
            );

        if (!deletedBooking) {

            return res.status(404).json({

                success: false,

                message:
                    "Booking haijapatikana"

            });

        }

        res.json({

            success: true,

            message:
                "Booking imefutwa vizuri"

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message:
                "Imeshindikana kufuta booking"

        });

    }

});

// ===============================
// MONGODB CONNECTION
// ===============================

const MONGODB_URI =
    process.env.MONGODB_URI;

if (!MONGODB_URI) {

    console.error(
        "MONGODB_URI haipo kwenye .env"
    );

    process.exit(1);

}

mongoose
    .connect(MONGODB_URI)
    .then(() => {

        console.log(
            "MongoDB imeunganishwa vizuri!"
        );

    })
    .catch((error) => {

        console.error(
            "MongoDB connection error:"
        );

        console.error(error.message);

    });

// ===============================
// START SERVER
// ===============================

const PORT =
    process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        "--------------------------------"
    );

    console.log(
        "REY SOON SALUNI BACKEND"
    );

    console.log(
        "--------------------------------"
    );

    console.log(
        `Server: http://localhost:${PORT}`
    );

    console.log(
        "Server imeanza kufanya kazi!"
    );

});
