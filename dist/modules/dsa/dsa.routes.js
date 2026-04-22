"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dsa_controller_1 = require("./dsa.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect);
router.get('/', dsa_controller_1.dsaController.getProblems);
router.post('/', dsa_controller_1.dsaController.createProblem);
router.put('/:id', dsa_controller_1.dsaController.updateProblem);
router.delete('/:id', dsa_controller_1.dsaController.deleteProblem);
router.post('/sync-leetcode', dsa_controller_1.dsaController.syncLeetCode);
router.get('/leetcode-profile', dsa_controller_1.dsaController.getLeetCodeProfile);
router.get('/analytics', dsa_controller_1.dsaController.getAnalytics);
exports.default = router;
//# sourceMappingURL=dsa.routes.js.map