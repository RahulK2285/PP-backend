"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post('/register', auth_controller_1.authController.register);
router.post('/login', auth_controller_1.authController.login);
router.get('/me', auth_middleware_1.protect, auth_controller_1.authController.getMe);
router.put('/me', auth_middleware_1.protect, auth_controller_1.authController.updateMe);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map