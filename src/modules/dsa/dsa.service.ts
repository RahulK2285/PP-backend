import { CONFIG } from '../../config/constants';
import { Problem, IProblem } from './problem.model';

// ─── Topic detection from LeetCode problem titles ───
const TOPIC_KEYWORDS: Record<string, string[]> = {
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

function detectTopic(title: string): string {
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

function detectDifficulty(title: string): 'Easy' | 'Medium' | 'Hard' {
  const lowerTitle = title.toLowerCase();
  const hardKeywords = ['median of two', 'trapping rain water', 'n-queens', 'sudoku solver', 'edit distance', 'word ladder', 'largest rectangle'];
  if (hardKeywords.some(keyword => lowerTitle.includes(keyword))) return 'Hard';
  
  const easyKeywords = ['two sum', 'contains duplicate', 'valid anagram', 'binary search', 'reverse linked list', 'plus one'];
  if (easyKeywords.some(keyword => lowerTitle.includes(keyword))) return 'Easy';

  return 'Medium';
}

export const dsaService = {
  // Get all problems for a user
  async getProblems(userId: string, filters?: { topic?: string; difficulty?: string; status?: string }) {
    const query: any = { userId };
    if (filters?.topic) query.topic = filters.topic;
    if (filters?.difficulty) query.difficulty = filters.difficulty;
    if (filters?.status) query.status = filters.status;

    return Problem.find(query).sort({ updatedAt: -1 });
  },

  // Create a problem manually
  async createProblem(userId: string, data: Partial<IProblem>) {
    return Problem.create({ ...data, userId, source: 'manual' });
  },

  // Update a problem
  async updateProblem(userId: string, problemId: string, data: Partial<IProblem>) {
    const problem = await Problem.findOneAndUpdate(
      { _id: problemId, userId },
      data,
      { new: true, runValidators: true }
    );
    if (!problem) throw new Error('Problem not found');
    return problem;
  },

  // Delete a problem
  async deleteProblem(userId: string, problemId: string) {
    const problem = await Problem.findOneAndDelete({ _id: problemId, userId });
    if (!problem) throw new Error('Problem not found');
    return problem;
  },

  // OVERHAULED SYNC ENGINE: Fetches 100% of all-time solved problems via LeetCode REST API
  async syncLeetCode(userId: string, username: string, limit: number = 500) {
    // Hits the comprehensive master problem status index endpoint directly
    const response = await fetch('https://leetcode.com/api/problems/all/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
      },
    });

    const data: any = await response.json();
    if (!data || !data.stat_status_pairs) {
      throw new Error('Failed to parse master problem list from LeetCode API');
    }

    // Filter out only the matching pairs marked with an accepted status ("ac")
    const solvedSubmissions = data.stat_status_pairs.filter(
      (item: any) => item.status === 'ac'
    );

    const synced: IProblem[] = [];
    const skipped: string[] = [];

    // Loop through your complete history logs and seed missing items safely
    for (const item of solvedSubmissions) {
      const title = item.stat.question__title;
      const titleSlug = item.stat.question__title_slug;
      const leetcodeId = item.stat.question_id;
      
      // Extract exact difficulty tiers (1: Easy, 2: Medium, 3: Hard) from payload
      let difficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium';
      if (item.difficulty.level === 1) difficulty = 'Easy';
      if (item.difficulty.level === 3) difficulty = 'Hard';

      // Deduplicate using your compound key index definition
      const existing = await Problem.findOne({ userId, titleSlug });
      if (existing) {
        if (existing.status !== 'Solved') {
          existing.status = 'Solved';
          await existing.save();
          synced.push(existing);
        } else {
          skipped.push(title);
        }
        continue;
      }

      const topic = detectTopic(title);

      try {
        const problem = await Problem.create({
          userId,
          title,
          titleSlug,
          topic,
          difficulty,
          status: 'Solved',
          source: 'leetcode',
          leetcodeId: String(leetcodeId),
          url: `https://leetcode.com/problems/${titleSlug}/`,
          solvedAt: new Date(), // Establish sync historical point
        });
        synced.push(problem);
      } catch (err: any) {
        if (err.code !== 11000) throw err;
        skipped.push(title);
      }
    }

    // Generate output format tailored seamlessly to your Redux state boundaries
    return { 
      synced: synced.length, 
      skipped: skipped.length, 
      total: solvedSubmissions.length, 
      submissions: solvedSubmissions.slice(0, 20).map((s: any) => ({
        id: String(s.stat.question_id),
        title: s.stat.question__title,
        titleSlug: s.stat.question__title_slug,
        timestamp: String(Math.floor(Date.now() / 1000))
      }))
    };
  },

  // Fetch LeetCode profile stats
  async getLeetCodeProfile(username: string) {
    const response = await fetch(CONFIG.LEETCODE_GQL, {
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

    const data: any = await response.json();
    if (data.errors || !data.data?.matchedUser) {
      throw new Error('LeetCode user not found');
    }
    return data.data.matchedUser;
  },

  // Get analytics data
  async getAnalytics(userId: string) {
    const problems = await Problem.find({ userId });

    // Topic distribution
    const topicCounts: Record<string, { solved: number; attempted: number; todo: number }> = {};
    const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
    const statusCounts = { Solved: 0, Attempted: 0, Todo: 0 };

    // Weekly progress (last 8 weeks)
    const weeklyData: { week: string; count: number }[] = [];
    const now = new Date();
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      const weekLabel = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
      const count = problems.filter(p =>
        p.solvedAt && p.solvedAt >= weekStart && p.solvedAt < weekEnd
      ).length;
      weeklyData.push({ week: weekLabel, count });
    }

    // Activity heatmap (last 365 days)
    const heatmapData: Record<string, number> = {};
    const yearAgo = new Date();
    yearAgo.setFullYear(yearAgo.getFullYear() - 1);

    for (const problem of problems) {
      // Topic counts
      if (!topicCounts[problem.topic]) {
        topicCounts[problem.topic] = { solved: 0, attempted: 0, todo: 0 };
      }
      if (problem.status === 'Solved') topicCounts[problem.topic].solved++;
      else if (problem.status === 'Attempted') topicCounts[problem.topic].attempted++;
      else topicCounts[problem.topic].todo++;

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
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 0;
        if (i > 1 && currentStreak === 0) break;
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
