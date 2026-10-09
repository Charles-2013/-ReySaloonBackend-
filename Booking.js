
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Jina la mteja linahitajika"],
            trim: true
        },

        phone: {
            type: String,
            required: [true, "Namba ya simu inahitajika"],
            trim: true
        },

        service: {
            type: String,
            required: [true, "Huduma inayochaguliwa inahitajika"],
            trim: true
        },

        price: {
            type: Number,
            default: 0,
            min: 0
        },

        date: {
            type: String,
            required: [true, "Tarehe ya booking inahitajika"]
        },

        time: {
            type: String,
            default: ""
        },

        message: {
            type: String,
            default: "",
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
