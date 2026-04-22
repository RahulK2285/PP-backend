"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const constants_1 = require("./constants");
async function connectDB() {
    try {
        await mongoose_1.default.connect(constants_1.CONFIG.MONGODB_URI);
        console.log('  ✅ MongoDB connected successfully');
    }
    catch (error) {
        console.error('  ❌ MongoDB connection error:', error);
        process.exit(1);
    }
}
//# sourceMappingURL=db.js.map