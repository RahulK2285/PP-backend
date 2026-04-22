"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const referral_controller_1 = require("./referral.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect);
router.post('/', referral_controller_1.referralController.create);
router.get('/', referral_controller_1.referralController.getAll);
router.put('/:id/status', referral_controller_1.referralController.updateStatus);
router.delete('/:id', referral_controller_1.referralController.delete);
exports.default = router;
//# sourceMappingURL=referral.routes.js.map