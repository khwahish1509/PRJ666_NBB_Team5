/**
 * Progress Controller - Gamification and Progress Tracking
 * Calculates user progress, achievements, and skin improvement metrics
 */

import Scan from '../models/Scan.js';

// Risk score mapping
const RISK_SCORES = {
  benign: 1,
  suspicious: 5,
  malignant: 10
};

// Achievement milestones
const MILESTONES = [
  { scans: 1, xp: 10, title: 'First Scan', badge: '🎯' },
  { scans: 5, xp: 50, title: 'Consistent Tracker', badge: '📊' },
  { scans: 10, xp: 100, title: 'Health Warrior', badge: '💪' },
  { scans: 20, xp: 250, title: 'Skin Guardian', badge: '🛡️' },
  { scans: 50, xp: 500, title: 'Progress Master', badge: '🏆' },
  { scans: 100, xp: 1000, title: 'Legendary', badge: '👑' }
];

/**
 * Get comprehensive progress analytics
 * GET /api/progress/analytics
 */
export async function getProgressAnalytics(req, res) {
  try {
    const userId = req.user.id;
    
    // Fetch all user scans
    const scans = await Scan.find({ userId }).sort({ timestamp: 1 });
    
    if (scans.length === 0) {
      return res.json({
        success: true,
        data: {
          totalScans: 0,
          xp: 0,
          level: 1,
          nextMilestone: MILESTONES[0],
          riskTrend: [],
          improvementScore: 0,
          achievements: [],
          stats: {
            averageRisk: 0,
            improvementRate: 0,
            consistencyStreak: 0,
            last30DaysChange: 0
          }
        }
      });
    }

    // Calculate XP and level
    const totalScans = scans.length;
    const xp = calculateXP(totalScans);
    const level = calculateLevel(xp);
    const nextMilestone = MILESTONES.find(m => m.scans > totalScans) || MILESTONES[MILESTONES.length - 1];
    
    // Calculate achievements
    const achievements = MILESTONES.filter(m => m.scans <= totalScans);
    
    // Calculate risk trend (last 30 scans or all if less)
    const recentScans = scans.slice(-30);
    const riskTrend = recentScans.map(scan => ({
      date: scan.timestamp,
      risk: RISK_SCORES[scan.result],
      result: scan.result,
      confidence: scan.confidence
    }));
    
    // Calculate improvement metrics
    const stats = calculateImprovementStats(scans);
    
    // Calculate improvement score (0-100)
    const improvementScore = calculateImprovementScore(scans);
    
    res.json({
      success: true,
      data: {
        totalScans,
        xp,
        level,
        nextMilestone,
        riskTrend,
        improvementScore,
        achievements,
        stats
      }
    });
  } catch (error) {
    console.error('Error fetching progress analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching progress analytics'
    });
  }
}

/**
 * Get before/after comparison data
 * GET /api/progress/comparison?scanId1=xxx&scanId2=xxx
 */
export async function getComparison(req, res) {
  try {
    const { scanId1, scanId2 } = req.query;
    const userId = req.user.id;
    
    if (!scanId1 || !scanId2) {
      return res.status(400).json({
        success: false,
        message: 'Both scanId1 and scanId2 are required'
      });
    }
    
    // Fetch both scans
    const [scan1, scan2] = await Promise.all([
      Scan.findOne({ _id: scanId1, userId }),
      Scan.findOne({ _id: scanId2, userId })
    ]);
    
    if (!scan1 || !scan2) {
      return res.status(404).json({
        success: false,
        message: 'One or both scans not found'
      });
    }
    
    // Calculate comparison metrics
    const risk1 = RISK_SCORES[scan1.result];
    const risk2 = RISK_SCORES[scan2.result];
    const riskChange = risk2 - risk1;
    const riskChangePercent = ((riskChange / risk1) * 100).toFixed(1);
    
    const confidenceChange = ((scan2.confidence - scan1.confidence) * 100).toFixed(1);
    
    const daysBetween = Math.floor(
      (new Date(scan2.timestamp) - new Date(scan1.timestamp)) / (1000 * 60 * 60 * 24)
    );
    
    const improvement = riskChange < 0 ? 'improved' : riskChange > 0 ? 'worsened' : 'stable';
    
    res.json({
      success: true,
      data: {
        before: {
          id: scan1._id,
          result: scan1.result,
          confidence: scan1.confidence,
          risk: risk1,
          timestamp: scan1.timestamp,
          imageUrl: scan1.imageUrl
        },
        after: {
          id: scan2._id,
          result: scan2.result,
          confidence: scan2.confidence,
          risk: risk2,
          timestamp: scan2.timestamp,
          imageUrl: scan2.imageUrl
        },
        comparison: {
          riskChange,
          riskChangePercent,
          confidenceChange,
          daysBetween,
          improvement
        }
      }
    });
  } catch (error) {
    console.error('Error fetching comparison:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching comparison'
    });
  }
}

/**
 * Get streak and consistency data
 * GET /api/progress/streak
 */
export async function getStreak(req, res) {
  try {
    const userId = req.user.id;
    
    const scans = await Scan.find({ userId }).sort({ timestamp: -1 });
    
    if (scans.length === 0) {
      return res.json({
        success: true,
        data: {
          currentStreak: 0,
          longestStreak: 0,
          lastScanDate: null,
          scanFrequency: 0
        }
      });
    }
    
    // Calculate current streak (consecutive days with scans)
    const currentStreak = calculateCurrentStreak(scans);
    const longestStreak = calculateLongestStreak(scans);
    
    // Calculate scan frequency (scans per week)
    const firstScan = scans[scans.length - 1];
    const daysSinceFirst = Math.floor(
      (Date.now() - new Date(firstScan.timestamp).getTime()) / (1000 * 60 * 60 * 24)
    );
    const scanFrequency = daysSinceFirst > 0 
      ? ((scans.length / daysSinceFirst) * 7).toFixed(1)
      : 0;
    
    res.json({
      success: true,
      data: {
        currentStreak,
        longestStreak,
        lastScanDate: scans[0].timestamp,
        scanFrequency: parseFloat(scanFrequency)
      }
    });
  } catch (error) {
    console.error('Error fetching streak:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching streak data'
    });
  }
}

// Helper functions

function calculateXP(totalScans) {
  let xp = 0;
  MILESTONES.forEach(milestone => {
    if (totalScans >= milestone.scans) {
      xp += milestone.xp;
    }
  });
  // Add bonus XP for scans beyond milestones
  const extraScans = totalScans - (MILESTONES[MILESTONES.length - 1]?.scans || 0);
  if (extraScans > 0) {
    xp += extraScans * 10;
  }
  return xp;
}

function calculateLevel(xp) {
  return Math.floor(xp / 100) + 1;
}

function calculateImprovementStats(scans) {
  if (scans.length < 2) {
    return {
      averageRisk: RISK_SCORES[scans[0]?.result] || 0,
      improvementRate: 0,
      consistencyStreak: scans.length,
      last30DaysChange: 0
    };
  }
  
  // Average risk score
  const totalRisk = scans.reduce((sum, scan) => sum + RISK_SCORES[scan.result], 0);
  const averageRisk = (totalRisk / scans.length).toFixed(2);
  
  // Improvement rate (change per 30 days)
  const firstScan = scans[0];
  const lastScan = scans[scans.length - 1];
  const daysBetween = Math.floor(
    (new Date(lastScan.timestamp) - new Date(firstScan.timestamp)) / (1000 * 60 * 60 * 24)
  );
  
  const riskChange = RISK_SCORES[lastScan.result] - RISK_SCORES[firstScan.result];
  const improvementRate = daysBetween > 0 
    ? ((riskChange / daysBetween) * 30).toFixed(2)
    : 0;
  
  // Last 30 days change
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recentScans = scans.filter(scan => new Date(scan.timestamp) >= thirtyDaysAgo);
  
  let last30DaysChange = 0;
  if (recentScans.length >= 2) {
    const oldestRecent = recentScans[0];
    const newestRecent = recentScans[recentScans.length - 1];
    last30DaysChange = RISK_SCORES[newestRecent.result] - RISK_SCORES[oldestRecent.result];
  }
  
  // Consistency streak
  const consistencyStreak = calculateCurrentStreak(scans);
  
  return {
    averageRisk: parseFloat(averageRisk),
    improvementRate: parseFloat(improvementRate),
    consistencyStreak,
    last30DaysChange
  };
}

function calculateImprovementScore(scans) {
  if (scans.length < 2) return 50; // Neutral score
  
  const firstScan = scans[0];
  const lastScan = scans[scans.length - 1];
  
  const initialRisk = RISK_SCORES[firstScan.result];
  const currentRisk = RISK_SCORES[lastScan.result];
  
  // Calculate improvement percentage
  const improvement = ((initialRisk - currentRisk) / initialRisk) * 100;
  
  // Convert to 0-100 score (50 is neutral, >50 is improvement, <50 is worsening)
  const score = 50 + (improvement * 0.5);
  
  // Clamp between 0 and 100
  return Math.max(0, Math.min(100, Math.round(score)));
}

function calculateCurrentStreak(scans) {
  if (scans.length === 0) return 0;
  
  let streak = 1;
  const sortedScans = [...scans].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  for (let i = 0; i < sortedScans.length - 1; i++) {
    const current = new Date(sortedScans[i].timestamp);
    const next = new Date(sortedScans[i + 1].timestamp);
    const daysDiff = Math.floor((current - next) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 7) { // Within a week
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

function calculateLongestStreak(scans) {
  if (scans.length === 0) return 0;
  
  let longestStreak = 1;
  let currentStreak = 1;
  
  const sortedScans = [...scans].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  for (let i = 0; i < sortedScans.length - 1; i++) {
    const current = new Date(sortedScans[i].timestamp);
    const next = new Date(sortedScans[i + 1].timestamp);
    const daysDiff = Math.floor((next - current) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 7) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }
  
  return longestStreak;
}
