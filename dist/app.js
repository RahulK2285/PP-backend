"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const constants_1 = require("./config/constants");
const db_1 = require("./config/db");
const error_middleware_1 = require("./middleware/error.middleware");
// Route imports
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const dsa_routes_1 = __importDefault(require("./modules/dsa/dsa.routes"));
const resume_routes_1 = __importDefault(require("./modules/resume/resume.routes"));
const referral_routes_1 = __importDefault(require("./modules/referrals/referral.routes"));
const recommendations_routes_1 = __importDefault(require("./modules/recommendations/recommendations.routes"));
const app = (0, express_1.default)();
// ─── Middleware ───
// Support multiple CLIENT_URL origins (comma-separated) for production
const allowedOrigins = constants_1.CONFIG.CLIENT_URL.split(',').map(u => u.trim());
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, health checks)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(null, false);
        }
    },
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Serve uploaded files
app.use('/uploads', express_1.default.static(constants_1.CONFIG.UPLOAD_DIR));
// ─── Routes ───
app.use('/api/auth', auth_routes_1.default);
app.use('/api/problems', dsa_routes_1.default);
app.use('/api/resumes', resume_routes_1.default);
app.use('/api/referrals', referral_routes_1.default);
app.use('/api/recommendations', recommendations_routes_1.default);
// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// ─── Error Handler ───
app.use(error_middleware_1.errorHandler);
// ─── Start Server ───
async function start() {
  await connectDB();

    const PORT = process.env.PORT || CONFIG.PORT || 5000;

  // Bind to 0.0.0.0 — required by Render and other cloud hosts
  app.listen(CONFIG.PORT, '0.0.0.0', () => {
    console.log(`\n  🚀 PrepForge API running on port ${CONFIG.PORT}`);
    console.log(`  📊 MongoDB: ${CONFIG.MONGODB_URI}\n`);
  });
}
start().catch(console.error);
//# sourceMappingURL=app.js.map
