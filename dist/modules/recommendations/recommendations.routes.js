"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const recommendations_controller_1 = require("./recommendations.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect);
router.get('/', recommendations_controller_1.recommendationsController.getRecommendations);
exports.default = router;
//# sourceMappingURL=recommendations.routes.js.map