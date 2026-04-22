"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const resume_controller_1 = require("./resume.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const upload_middleware_1 = require("../../middleware/upload.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect);
router.post('/upload', upload_middleware_1.uploadResume.single('resume'), resume_controller_1.resumeController.upload);
router.get('/', resume_controller_1.resumeController.getAll);
router.delete('/:id', resume_controller_1.resumeController.delete);
router.get('/:id/download', resume_controller_1.resumeController.download);
router.get('/:id/preview', resume_controller_1.resumeController.preview);
router.post('/:id/rescore', resume_controller_1.resumeController.rescore);
exports.default = router;
//# sourceMappingURL=resume.routes.js.map