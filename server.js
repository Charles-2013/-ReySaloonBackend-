
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Booking model
const Booking = require("./models/Booking");

// Home route
app.get("/", (req, res) => {
    res.send("REY SOON SALUNI BACKEND INAFANYA KAZI!");
});

// Status route
app.get("/api/status", (req, res) => {
    res.json({
        success: true,
        message: "Rey Soon Saluni Backend iko online",
        server: "running",
        database:
            mongoose.connection.readyState === 1
                ? "connected"
                : "disconnected"
    });
});

// Create booking
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
        } = req.body || {};

        if (
            typeof name !== "string" ||
            !name.trim() ||
            typeof phone !== "string" ||
            !phone.trim() ||
            typeof service !== "string" ||
            !service.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Jina, simu na huduma vinahitajika."
            });
        }

        const bookingData = {
            name: name.trim(),
            phone: phone.trim(),
            service: service.trim(),
            status: "pending"
        };

        if (date) bookingData.date = date;
        if (time) bookingData.time = time;

        if (message !== undefined) {
            bookingData.message = String(message).trim();
        }

        if (price !== undefined && price !== "") {
            const numericPrice = Number(price);

            if (
                !Number.isFinite(numericPrice) ||
                numericPrice < 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Bei si sahihi."
                });
            }

            bookingData.price = numericPrice;
        }

        const booking = await Booking.create(bookingData);

        return res.status(201).json({
            success: true,
            message: "Booking imehifadhiwa vizuri.",
            booking: booking
        });
    } catch (error) {
        console.error("Create booking error:", error);

        return res.status(500).json({
            success: false,
            message: "Imeshindikana kuhifadhi booking.",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined
        });
    }
});

// Get all bookings
app.get("/api/bookings", async (req, res) => {
    try {
        const bookings = await Booking.find().sort({
            createdAt: -1
        });

        return res.json({
            success: true,
            count: bookings.length,
            bookings: bookings
        });
    } catch (error) {
        console.error("Get bookings error:", error);

        return res.status(500).json({
            success: false,
            message: "Imeshindikana kupata bookings."
        });
    }
});

// Start server after connecting to MongoDB
async function startServer() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error(
                "MONGO_URI haipo kwenye faili la .env"
            );
        }

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB imeunganishwa vizuri!");

        app.listen(PORT, () => {
            console.log("================================");
            console.log("REY SOON SALUNI BACKEND");
            console.log(
                `Server imeanza kwenye port ${PORT}`
            );
            console.log(
                `Fungua: http://localhost:${PORT}`
            );
            console.log("================================");
        });
    } catch (error) {
        console.error(
            "Imeshindikana kuanzisha backend:",
            error.message
        );
        process.exit(1);
    }
}

startServer();
