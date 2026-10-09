
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Booking = require("./Booking");

const app = express();

// =====================================
// MIDDLEWARE
// =====================================

app.use(cors());
app.use(express.json());

// =====================================
// HOME ROUTE
// =====================================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Rey Soon Saluni Backend iko online"
    });
});

// =====================================
// HEALTH CHECK
// =====================================

app.get("/api/health", (req, res) => {
    res.json({
        server: "online",
        database:
            mongoose.connection.readyState === 1
                ? "connected"
                : "disconnected"
    });
});

// =====================================
// GET ALL BOOKINGS
// =====================================

app.get("/api/bookings", async (req, res) => {
    try {
        const bookings = await Booking
            .find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });

    } catch (error) {
        console.error("Get bookings error:", error);

        res.status(500).json({
            success: false,
            message: "Imeshindikana kupata booking"
        });
    }
});

// =====================================
// CREATE BOOKING
// =====================================

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

        // Hakikisha taarifa muhimu zimejazwa
        if (
            !name?.trim() ||
            !phone?.trim() ||
            !service?.trim() ||
            !date
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Jina, simu, huduma na tarehe vinahitajika"
            });
        }

        // Zuia kuhifadhi booking kama database haijaunganishwa
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                success: false,
                message:
                    "Database haijaunganishwa. Jaribu tena baadaye."
            });
        }

        // Tengeneza booking mpya
        const booking = new Booking({
            name: name.trim(),
            phone: phone.trim(),
            service: service.trim(),
            price: Number(price) || 0,
            date,
            time: time || "",
            message: message?.trim() || ""
        });

        // Hifadhi kwenye MongoDB
        const savedBooking = await booking.save();

        return res.status(201).json({
            success: true,
            message: "Booking imehifadhiwa vizuri",
            booking: savedBooking
        });

    } catch (error) {
        console.error("Create booking error:", error);

        return res.status(500).json({
            success: false,
            message: "Imeshindikana kuhifadhi booking"
        });
    }
});

// =====================================
// DELETE BOOKING
// =====================================

app.delete("/api/bookings/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Hakikisha ID ni sahihi
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Kitambulisho cha booking si sahihi"
            });
        }

        const deletedBooking =
            await Booking.findByIdAndDelete(id);

        if (!deletedBooking) {
            return res.status(404).json({
                success: false,
                message: "Booking haijapatikana"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Booking imefutwa vizuri"
        });

    } catch (error) {
        console.error("Delete booking error:", error);

        return res.status(500).json({
            success: false,
            message: "Imeshindikana kufuta booking"
        });
    }
});

// =====================================
// MONGODB CONNECTION
// =====================================

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error(
        "Kosa: MONGODB_URI haijawekwa kwenye Environment Variables."
    );
    process.exit(1);
}

// =====================================
// START SERVER AFTER DATABASE CONNECTS
// =====================================

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await mongoose.connect(MONGODB_URI);

        console.log("MongoDB imeunganishwa vizuri!");

        app.listen(PORT, "0.0.0.0", () => {
            console.log("================================");
            console.log("REY SOON SALUNI BACKEND");
            console.log(`Server imeanza kwenye port ${PORT}`);
            console.log("================================");
        });

    } catch (error) {
        console.error(
            "MongoDB connection error:",
            error.message
        );

        process.exit(1);
    }
}

startServer();
