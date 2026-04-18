import University from '../model/UniModel.js';
import  TestResult  from '../model/EligibilityTest.js';
import asyncHandler from 'express-async-handler';

//ADD test
export const takeEligibilityTest = asyncHandler(async (req, res) => {
  const { ieltsScore, gradeScore } = req.body;
  const userId = req.user._id;

  console.log("User ID:", userId);

  if (ieltsScore < 0 || ieltsScore > 9 || gradeScore < 0 || gradeScore > 100) {
    res.status(400);
    throw new Error('Invalid score range');
  }

  let query = { status: 1 };
  let rankFilter = {};

  if (ieltsScore < 6) {
    return res.status(400).json({
      message: 'IELTS eligibility did not meet. Please improve your IELTS score.'
    });
  }

  if (ieltsScore >= 6 && ieltsScore <= 6.5 && gradeScore >= 60 && gradeScore <= 65) {
    rankFilter = { CountryRank: { $gte: 30, $lte: 40 } };
  } else if (ieltsScore > 6.5 && ieltsScore <= 7 && gradeScore >= 65 && gradeScore <= 70) {
    rankFilter = { CountryRank: { $gte: 20, $lte: 29 } };
  } else if (ieltsScore > 7 && ieltsScore <= 7.5 && gradeScore >= 65 && gradeScore <= 70) {
    rankFilter = { CountryRank: { $gte: 10, $lte: 19 } };
  } else if (ieltsScore > 8 && gradeScore > 75) {
    rankFilter = { CountryRank: { $lt: 10 } };
  }

  query = { ...query, ...rankFilter };

  const eligibleUniversities = await University.find(query)
    .sort({ QSWorldRank: 1, CountryRank: 1 })
    .limit(20);

  const savedResults = await Promise.all(
    eligibleUniversities.map(async (university) => {
      const result = new TestResult({
        userId,
        ieltsScore,
        gradeScore,
        universityId: university._id,
      });
      await result.save();

      return {
        name: university.University,
        city: university.City,
        logo: university.Logo,
        internationalStudentLink: university.InternationalStudentLink,
        qsWorldRank: university.QSWorldRank,
        countryRank: university.CountryRank,
      };
    })
  );

  res.status(200).json({
    message: 'Congratulations you have met your criteria and your eligibility test has been completed successfully. We recommend the following universities:',
    results: savedResults,
  });
});


  
//Get Test
export const getTestHistory = asyncHandler(async (req, res) => {
    const history = await TestResult.find()
      .sort({ createdAt: -1 })
      .populate({
        path: 'universityId',
        select: 'University  City Country CountryRank QSWorldRank Logo  Description',
        options: { sort: { QSWorldRank: 1 } }
      })
      .populate({
        path: 'userId',
        select: 'name email' // Add other fields if needed
      });
  
    res.status(200).json(history);
  });