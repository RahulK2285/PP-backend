"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dsaService = void 0;
const constants_1 = require("../../config/constants");
const problem_model_1 = require("./problem.model");
// ─── Topic detection from LeetCode problem titles ───
const TOPIC_KEYWORDS = {
    'Arrays': ['array', 'subarray', 'two sum', 'three sum', 'matrix', 'rotate', 'spiral', 'product', 'duplicate', 'missing', 'majority', 'merge intervals', 'insert interval', 'container with most water', 'trapping rain water', 'next permutation', 'set matrix'],
    'Strings': ['string', 'substring', 'palindrom', 'anagram', 'parenthes', 'bracket', 'roman', 'atoi', 'longest common prefix', 'zigzag', 'group anagram', 'valid parenthes'],
    'Linked List': ['linked list', 'listnode', 'merge two sorted', 'reverse linked', 'cycle', 'remove nth', 'add two numbers', 'intersection of two'],
    'Trees': ['tree', 'binary tree', 'bst', 'inorder', 'preorder', 'postorder', 'level order', 'depth', 'height', 'balanced', 'subtree', 'lowest common ancestor', 'serialize', 'flatten'],
    'Graphs': ['graph', 'island', 'course schedule', 'topological', 'clone graph', 'network delay', 'shortest path', 'pacific atlantic', 'surrounded region', 'alien dictionary'],
    'DP': ['dynamic programming', 'climbing stairs', 'coin change', 'house robber', 'longest increasing', 'knapsack', 'edit distance', 'decode ways', 'unique paths', 'jump game', 'word break', 'maximum subarray', 'best time to buy', 'longest palindromic sub', 'minimum path sum'],
    'Binary Search': ['binary search', 'search insert', 'search in rotated', 'find minimum in rotated', 'median of two', 'koko eating', 'split array largest'],
    'Backtracking': ['backtrack', 'permutation', 'combination', 'subset', 'n-queens', 'sudoku', 'word search', 'letter combinations', 'palindrome partitioning', 'generate parentheses'],
    'Stack': ['stack', 'valid parentheses', 'min stack', 'daily temperatures', 'largest rectangle', 'evaluate reverse polish', 'asteroid collision'],
    'Queue': ['queue', 'bfs', 'sliding window maximum', 'implement queue'],
    'Heap': ['heap', 'priority queue', 'kth largest', 'top k frequent', 'find median', 'merge k sorted'],
    'Greedy': ['greedy', 'jump game', 'gas station', 'candy', 'task scheduler', 'non-overlapping', 'meeting room'],
    'Two Pointers': ['two pointer', 'three sum', 'container with most', 'sort colors', 'remove duplicates from sorted', 'move zeroes'],
    'Sliding Window': ['sliding window', 'minimum window', 'longest without repeating', 'longest substring', 'minimum size subarray', 'fruit into baskets'],
    'Trie': ['trie', 'prefix tree', 'word search ii', 'implement trie'],
    'Hash Table': ['hash', 'two sum', 'group anagram', 'top k frequent', 'valid anagram', 'contains duplicate'],
    'Bit Manipulation': ['bit', 'single number', 'hamming', 'power of two', 'counting bits', 'reverse bits'],
    'Math': ['math', 'power', 'sqrt', 'factorial', 'fibonacci', 'happy number', 'plus one', 'excel sheet'],
    'Sorting': ['sort', 'merge sort', 'quick sort', 'kth largest', 'sort colors'],
};
function detectTopic(title) {
    const lowerTitle = title.toLowerCase();
    let bestMatch = 'Other';
    let bestScore = 0;
    for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
        for (const keyword of keywords) {
            if (lowerTitle.includes(keyword) && keyword.length > bestScore) {
                bestMatch = topic;
                bestScore = keyword.length;
            }
        }
    }
    return bestMatch;
}
// ─── Difficulty detection from title patterns ───
function detectDifficulty(_title) {
    return 'Medium'; // Default — LeetCode API doesn't expose difficulty in recent submissions
}
exports.dsaService = {
    // Get all problems for a user
    async getProblems(userId, filters) {
        const query = { userId };
        if (filters?.topic)
            query.topic = filters.topic;
        if (filters?.difficulty)
            query.difficulty = filters.difficulty;
        if (filters?.status)
            query.status = filters.status;
        return problem_model_1.Problem.find(query).sort({ updatedAt: -1 });
    },
    // Create a problem manually
    async createProblem(userId, data) {
        return problem_model_1.Problem.create({ ...data, userId, source: 'manual' });
    },
    // Update a problem
    async updateProblem(userId, problemId, data) {
        const problem = await problem_model_1.Problem.findOneAndUpdate({ _id: problemId, userId }, data, { new: true, runValidators: true });
        if (!problem)
            throw new Error('Problem not found');
        return problem;
    },
    // Delete a problem
    async deleteProblem(userId, problemId) {
        const problem = await problem_model_1.Problem.findOneAndDelete({ _id: problemId, userId });
        if (!problem)
            throw new Error('Problem not found');
        return problem;
    },
    // Sync from LeetCode — the flagship feature
    async syncLeetCode(userId, username, limit = 500) {
        // Fetch recent AC submissions from LeetCode
        const response = await fetch(constants_1.CONFIG.LEETCODE_GQL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Referer': 'https://leetcode.com',
            },
            body: JSON.stringify({
                query: `query recentAcSubmissionList($username: String!, $limit: Int!) {
          recentAcSubmissionList(username: $username, limit: $limit) {
            id
            title
            titleSlug
            timestamp
          }
        }`,
                variables: { username, limit },
            }),
        });
        const data = await response.json();
        if (data.errors) {
            throw new Error('LeetCode user not found or API error');
        }
        const submissions = data.data?.recentAcSubmissionList || [];
        const synced = [];
        const skipped = [];
        for (const sub of submissions) {
            // Check if already exists
            const existing = await problem_model_1.Problem.findOne({ userId, titleSlug: sub.titleSlug });
            if (existing) {
                // Update status to Solved if it wasn't
                if (existing.status !== 'Solved') {
                    existing.status = 'Solved';
                    existing.solvedAt = new Date(parseInt(sub.timestamp) * 1000);
                    await existing.save();
                    synced.push(existing);
                }
                else {
                    skipped.push(sub.title);
                }
                continue;
            }
            // Create new problem
            const topic = detectTopic(sub.title);
            const difficulty = detectDifficulty(sub.title);
            try {
                const problem = await problem_model_1.Problem.create({
                    userId,
                    title: sub.title,
                    titleSlug: sub.titleSlug,
                    topic,
                    difficulty,
                    status: 'Solved',
                    source: 'leetcode',
                    leetcodeId: sub.id,
                    url: `https://leetcode.com/problems/${sub.titleSlug}/`,
                    solvedAt: new Date(parseInt(sub.timestamp) * 1000),
                });
                synced.push(problem);
            }
            catch (err) {
                // Skip duplicates
                if (err.code !== 11000)
                    throw err;
                skipped.push(sub.title);
            }
        }
        return { synced: synced.length, skipped: skipped.length, total: submissions.length, submissions };
    },
    // Fetch LeetCode profile stats
    async getLeetCodeProfile(username) {
        const response = await fetch(constants_1.CONFIG.LEETCODE_GQL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Referer': 'https://leetcode.com',
            },
            body: JSON.stringify({
                query: `query userProfile($username: String!) {
          matchedUser(username: $username) {
            username
            submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
            }
          }
        }`,
                variables: { username },
            }),
        });
        const data = await response.json();
        if (data.errors || !data.data?.matchedUser) {
            throw new Error('LeetCode user not found');
        }
        return data.data.matchedUser;
    },
    // Get analytics data
    async getAnalytics(userId) {
        const problems = await problem_model_1.Problem.find({ userId });
        // Topic distribution
        const topicCounts = {};
        const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
        const statusCounts = { Solved: 0, Attempted: 0, Todo: 0 };
        // Weekly progress (last 8 weeks)
        const weeklyData = [];
        const now = new Date();
        for (let i = 7; i >= 0; i--) {
            const weekStart = new Date(now);
            weekStart.setDate(weekStart.getDate() - (i * 7));
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 7);
            const weekLabel = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
            const count = problems.filter(p => p.solvedAt && p.solvedAt >= weekStart && p.solvedAt < weekEnd).length;
            weeklyData.push({ week: weekLabel, count });
        }
        // Activity heatmap (last 365 days)
        const heatmapData = {};
        const yearAgo = new Date();
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        for (const problem of problems) {
            // Topic counts
            if (!topicCounts[problem.topic]) {
                topicCounts[problem.topic] = { solved: 0, attempted: 0, todo: 0 };
            }
            if (problem.status === 'Solved')
                topicCounts[problem.topic].solved++;
            else if (problem.status === 'Attempted')
                topicCounts[problem.topic].attempted++;
            else
                topicCounts[problem.topic].todo++;
            // Difficulty counts
            if (problem.status === 'Solved') {
                difficultyCounts[problem.difficulty]++;
            }
            // Status counts
            statusCounts[problem.status]++;
            // Heatmap
            const solveDate = problem.solvedAt || problem.createdAt;
            if (solveDate && solveDate >= yearAgo) {
                const dateKey = solveDate.toISOString().split('T')[0];
                heatmapData[dateKey] = (heatmapData[dateKey] || 0) + 1;
            }
        }
        // Streak calculation
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        for (let i = 0; i < 365; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split('T')[0];
            if (heatmapData[key]) {
                tempStreak++;
                if (i === 0 || (i === 1 && currentStreak === 0)) {
                    currentStreak = tempStreak;
                }
            }
            else {
                longestStreak = Math.max(longestStreak, tempStreak);
                tempStreak = 0;
                if (i > 1 && currentStreak === 0)
                    break;
            }
        }
        longestStreak = Math.max(longestStreak, tempStreak);
        const totalActiveDays = Object.keys(heatmapData).length;
        return {
            topicCounts,
            difficultyCounts,
            statusCounts,
            weeklyData,
            heatmapData,
            streak: { current: currentStreak, longest: longestStreak, totalActiveDays },
            totalProblems: problems.length,
        };
    },
};
//# sourceMappingURL=dsa.service.js.map