"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resumeController = void 0;
const resume_model_1 = require("./resume.model");
const resume_service_1 = require("./resume.service");
const fs_1 = __importDefault(require("fs"));
exports.resumeController = {
    async upload(req, res) {
        try {
            if (!req.file) {
                res.status(400).json({ error: 'No file uploaded' });
                return;
            }
            // Analyze the resume and get score
            let score = null;
            try {
                score = await (0, resume_service_1.analyzeResume)(req.file.path, req.file.mimetype);
            }
            catch (err) {
                console.error('Resume scoring error:', err);
                // Non-fatal — still save the resume even if scoring fails
            }
            const resume = await resume_model_1.Resume.create({
                userId: req.user._id,
                fileName: req.file.filename,
                originalName: req.file.originalname,
                filePath: req.file.path,
                fileSize: req.file.size,
                mimeType: req.file.mimetype,
                score,
            });
            res.status(201).json(resume);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async getAll(req, res) {
        try {
            const resumes = await resume_model_1.Resume.find({ userId: req.user._id }).sort({ createdAt: -1 });
            res.json(resumes);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async delete(req, res) {
        try {
            const resume = await resume_model_1.Resume.findOneAndDelete({
                _id: req.params.id,
                userId: req.user._id,
            });
            if (!resume) {
                res.status(404).json({ error: 'Resume not found' });
                return;
            }
            // Delete file from disk
            if (fs_1.default.existsSync(resume.filePath)) {
                fs_1.default.unlinkSync(resume.filePath);
            }
            res.json({ message: 'Resume deleted' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async download(req, res) {
        try {
            const resume = await resume_model_1.Resume.findOne({
                _id: req.params.id,
                userId: req.user._id,
            });
            if (!resume) {
                res.status(404).json({ error: 'Resume not found' });
                return;
            }
            res.download(resume.filePath, resume.originalName);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    // Serve the file content for in-browser preview
    async preview(req, res) {
        try {
            const resume = await resume_model_1.Resume.findOne({
                _id: req.params.id,
                userId: req.user._id,
            });
            if (!resume) {
                res.status(404).json({ error: 'Resume not found' });
                return;
            }
            if (!fs_1.default.existsSync(resume.filePath)) {
                res.status(404).json({ error: 'File not found on disk' });
                return;
            }
            res.setHeader('Content-Type', resume.mimeType);
            res.setHeader('Content-Disposition', `inline; filename="${resume.originalName}"`);
            const stream = fs_1.default.createReadStream(resume.filePath);
            stream.pipe(res);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    // Re-score an existing resume
    async rescore(req, res) {
        try {
            const resume = await resume_model_1.Resume.findOne({
                _id: req.params.id,
                userId: req.user._id,
            });
            if (!resume) {
                res.status(404).json({ error: 'Resume not found' });
                return;
            }
            const score = await (0, resume_service_1.analyzeResume)(resume.filePath, resume.mimeType);
            resume.score = score;
            await resume.save();
            res.json(resume);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};
//# sourceMappingURL=resume.controller.js.map