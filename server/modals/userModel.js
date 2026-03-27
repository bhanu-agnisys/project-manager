const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        maxlength: 12,
    },
    role: {
        type: String,
        enum: ["admin", "tl","manager","developer","qa","fsm"],
        default: "developer",
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    
}, { timestamps: true });


const User = mongoose.model("User", userSchema);


        