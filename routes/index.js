var express = require('express');
var router = express.Router();
const config = require('../config/config');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Express',
    config: config
  });
});

router.post('/submit', function(req, res, next) {
  try {
        // 保存数据...

        console.log('into submit')
        // ✅ 重定向到 GET 路由
        res.redirect('/results');
    } catch (error) {
        res.status(500).send('Error');
    }
});

router.get('/results', function(req, res, next) {
  res.render('results', { 
    title: 'test',
    config: config
  });
});

module.exports = router;
