var express = require('express');
var router = express.Router();
const config = require('../config/config');
const Survey = require('../models/survey');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Express',
    config: config
  });
});

router.post('/submit', async (req, res) => {
  try {
        const survey = new Survey({
            age_group: req.body.age_group,
            gender: req.body.gender,
            district: req.body.district,
            exercise_frequency: req.body.exercise_frequency,
            exercise_type: req.body.exercise_type || [],
            sleep_hours: req.body.sleep_hours,
            sleep_quality: req.body.sleep_quality,
            diet_type: req.body.diet_type,
            water_intake: req.body.water_intake,
            fastfood_frequency: req.body.fastfood_frequency,
            health_score: req.body.health_score,
            regular_checkup: req.body.regular_checkup,
            submittedAt: new Date()
        });

        // save data
        const savedSurvey = await survey.save();
        console.log('✅ Survey saved with ID:', savedSurvey._id);

        // redirect to GET router
        res.redirect('/results');
    } catch (error) {
      console.error('❌ error:', error);
      console.error('❌ error.name:', error.name);
      console.error('❌ error.message:', error.message);
      if (error.name === 'ValidationError') {
          console.error('❌ error.errors:', error.errors);
      }
      
      res.status(500).send('Submission failed, please try again later.');
    }
});

router.get('/results', async (req, res) => {
  try {
    const db = {};
    
    db.totalCount = await Survey.countDocuments();
    
    const mostActive = await Survey.aggregate([
      { $match: { exercise_frequency: { $in: ['3-4', '5+'] } } },
      { $group: { _id: '$age_group', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    db.mostActiveAge = mostActive[0]?._id || '26-35';
    
    const dietDist = await Survey.aggregate([
      { $group: { _id: '$diet_type', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    db.topDiet = dietDist[0]?._id || 'omnivore';
    db.topDietPercentage = db.totalCount > 0 
      ? Math.round((dietDist[0]?.count / db.totalCount) * 100) 
      : 0;
    
    const sleepStats = await Survey.aggregate([
      { $group: { _id: '$sleep_hours', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    
    const sleepDisplay = {
      '<6': 'Less than 6 hours',
      '6-8': '6-8 hours',
      '8+': 'More than 8 hours'
    };
    
    db.mostCommonSleep = sleepStats[0]?._id 
      ? sleepDisplay[sleepStats[0]._id] 
      : '6-8 hours';
    
    res.render('results', { 
      config: config,
      db: db
    });
    
  } catch (error) {
    console.error('Error loading results:', error);
    res.render('results', { 
      config: config,
      db: {
        totalCount: '--',
        mostActiveAge: '--',
        topDiet: '--',
        topDietPercentage: '--',
        mostCommonSleep: '--'
      }
    });
  }
});

module.exports = router;
