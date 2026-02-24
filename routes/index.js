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
        // 保存数据...
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

        // 保存到数据库
        const savedSurvey = await survey.save();
        console.log('✅ Survey saved with ID:', savedSurvey._id);

        // ✅ 重定向到 GET 路由
        res.redirect('/results');
    } catch (error) {
      // 打印完整错误
      console.error('❌ 完整错误:', error);
      console.error('❌ 错误名称:', error.name);
      console.error('❌ 错误消息:', error.message);
      
      // 如果是验证错误，打印具体字段
      if (error.name === 'ValidationError') {
          console.error('❌ 验证错误详情:', error.errors);
      }
      
      res.status(500).send('Error: ' + error.message);
    }
});

router.get('/results', function(req, res, next) {
  res.render('results', { 
    title: 'test',
    config: config
  });
});

module.exports = router;
