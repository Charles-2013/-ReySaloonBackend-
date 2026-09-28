const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            required: true
        },

        service: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            default: 0
        },

        date: {
            type: String,
            required: true
        },

        time: {
            type: String,
            default: ""
        },

        message: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            default: "pending"
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model("Booking", bookingSchema);