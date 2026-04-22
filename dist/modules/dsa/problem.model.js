"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Problem = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const problemSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    title: {
        type: String,
        required: [true, 'Problem title is required'],
        trim: true,
    },
    titleSlug: {
        type: String,
        trim: true,
    },
    topic: {
        type: String,
        required: [true, 'Topic is required'],
        enum: [
            'Arrays', 'Strings', 'Linked List', 'Trees', 'Graphs', 'DP',
            'Binary Search', 'Backtracking', 'Stack', 'Queue', 'Heap',
            'Greedy', 'Math', 'Bit Manipulation', 'Two Pointers',
            'Sliding Window', 'Trie', 'Hash Table', 'Sorting', 'Other',
        ],
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true,
    },
    status: {
        type: String,
        enum: ['Solved', 'Attempted', 'Todo'],
        default: 'Todo',
    },
    source: {
        type: String,
        enum: ['manual', 'leetcode'],
        default: 'manual',
    },
    leetcodeId: String,
    url: String,
    notes: String,
    solvedAt: Date,
}, { timestamps: true });
// Compound index for deduplication on LeetCode sync
problemSchema.index({ userId: 1, titleSlug: 1 }, { unique: true, sparse: true });
exports.Problem = mongoose_1.default.model('Problem', problemSchema);
//# sourceMappingURL=problem.model.js.map