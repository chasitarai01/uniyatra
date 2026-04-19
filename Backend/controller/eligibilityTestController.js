import University from '../model/UniModel.js';
import TestResult from '../model/EligibilityTest.js';
import asyncHandler from 'express-async-handler';

// ─────────────────────────────────────────────
//  Constants — single source of truth
// ─────────────────────────────────────────────
const THRESHOLDS = {
  MIN_IELTS:  6.0,
  MIN_GRADE:  50,
  MAX_IELTS:  9.0,
  MAX_GRADE:  100,
};

/**
 * Determine university rank tier and eligibility tier label
 * based on IELTS and Grade scores.
 *
 * Tiers (ascending quality):
 *  1 — Entry Tier     : IELTS 6.0–6.4 | Grade 50–59
 *  2 — Standard Tier  : IELTS 6.5–6.9 | Grade 60–69
 *  3 — Merit Tier     : IELTS 7.0–7.4 | Grade 70–79
 *  4 — Excellence Tier: IELTS 7.5–7.9 | Grade 80–89
 *  5 — Elite Tier     : IELTS 8.0+    | Grade 90+
 */
const getTier = (ielts, grade) => {
  if (ielts >= 8.0 && grade >= 90) {
    return {
      label: 'Elite',
      rank: 'Top 5 globally',
      rankFilter: { CountryRank: { $lte: 5 } },
      color: 'gold',
      limit: 10,
    };
  }
  if (ielts >= 7.5 && grade >= 80) {
    return {
      label: 'Excellence',
      rank: 'Top 10 globally',
      rankFilter: { CountryRank: { $lte: 10 } },
      color: 'purple',
      limit: 12,
    };
  }
  if (ielts >= 7.0 && grade >= 70) {
    return {
      label: 'Merit',
      rank: 'Top 20 globally',
      rankFilter: { CountryRank: { $lte: 20 } },
      color: 'blue',
      limit: 15,
    };
  }
  if (ielts >= 6.5 && grade >= 60) {
    return {
      label: 'Standard',
      rank: 'Top 50 globally',
      rankFilter: { CountryRank: { $lte: 50 } },
      color: 'green',
      limit: 18,
    };
  }
  // Base tier — IELTS 6.0–6.4 and Grade 50–59
  return {
    label: 'Entry',
    rank: 'Top 100 globally',
    rankFilter: { CountryRank: { $lte: 100 } },
    color: 'teal',
    limit: 20,
  };
};

// ─────────────────────────────────────────────
//  POST /api/eligibility/test
// ─────────────────────────────────────────────
export const takeEligibilityTest = asyncHandler(async (req, res) => {
  const { ieltsScore, gradeScore } = req.body;
  const userId = req.user._id;

  // ── 1. Input validation ─────────────────────
  const ielts = parseFloat(ieltsScore);
  const grade = parseFloat(gradeScore);

  if (
    isNaN(ielts) || isNaN(grade) ||
    ielts < 0 || ielts > THRESHOLDS.MAX_IELTS ||
    grade < 0 || grade > THRESHOLDS.MAX_GRADE
  ) {
    res.status(400);
    throw new Error('Invalid score range. IELTS must be 0–9 and Grade must be 0–100.');
  }

  // ── 2. Minimum threshold checks ─────────────
  const failReasons = [];

  if (ielts < THRESHOLDS.MIN_IELTS) {
    failReasons.push(
      `Your IELTS score of ${ielts} is below the minimum required score of ${THRESHOLDS.MIN_IELTS}. ` +
      `Consider enrolling in an IELTS preparation course to improve your score.`
    );
  }

  if (grade < THRESHOLDS.MIN_GRADE) {
    failReasons.push(
      `Your academic grade of ${grade}% is below the minimum required grade of ${THRESHOLDS.MIN_GRADE}%. ` +
      `Focus on improving your academic performance.`
    );
  }

  if (failReasons.length > 0) {
    return res.status(200).json({
      eligible: false,
      status: 'ineligible',
      message: 'You do not currently meet the minimum eligibility requirements.',
      reasons: failReasons,
      minRequirements: {
        ielts: THRESHOLDS.MIN_IELTS,
        grade: THRESHOLDS.MIN_GRADE,
      },
      submittedScores: { ielts, grade },
      results: [],
    });
  }

  // ── 3. Determine tier & fetch matching universities ──
  const tier = getTier(ielts, grade);
  const query = { status: 1, ...tier.rankFilter };

  const eligibleUniversities = await University.find(query)
    .sort({ QSWorldRank: 1, CountryRank: 1 })
    .limit(tier.limit);

  // ── 4. Save test results ─────────────────────
  await Promise.all(
    eligibleUniversities.map((university) =>
      new TestResult({
        userId,
        ieltsScore: ielts,
        gradeScore: grade,
        universityId: university._id,
      }).save()
    )
  );

  // ── 5. Format university results ─────────────
  const results = eligibleUniversities.map((university) => ({
    name: university.University,
    city: university.City,
    country: university.Country,
    logo: university.Logo,
    internationalStudentLink: university.InternationalStudentLink,
    qsWorldRank: university.QSWorldRank,
    countryRank: university.CountryRank,
  }));

  // ── 6. Respond ───────────────────────────────
  return res.status(200).json({
    eligible: true,
    status: 'eligible',
    tier: tier.label,
    tierColor: tier.color,
    rankRange: tier.rank,
    message:
      `Congratulations! With an IELTS of ${ielts} and an academic grade of ${grade}%, ` +
      `you qualify for the ${tier.label} Tier (${tier.rank}). ` +
      `Here are your recommended universities:`,
    submittedScores: { ielts, grade },
    minRequirements: {
      ielts: THRESHOLDS.MIN_IELTS,
      grade: THRESHOLDS.MIN_GRADE,
    },
    totalMatches: results.length,
    results,
  });
});

// ─────────────────────────────────────────────
//  GET /api/eligibility/history   (Admin only)
// ─────────────────────────────────────────────
export const getTestHistory = asyncHandler(async (req, res) => {
  const history = await TestResult.find()
    .sort({ createdAt: -1 })
    .populate({
      path: 'universityId',
      select: 'University City Country CountryRank QSWorldRank Logo Description',
      options: { sort: { QSWorldRank: 1 } },
    })
    .populate({
      path: 'userId',
      select: 'name email',
    });

  res.status(200).json(history);
});