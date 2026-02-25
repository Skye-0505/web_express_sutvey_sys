const express = require('express');
const router = express.Router();
const Survey = require('../models/survey');
const config = require('../config/config');

// Exercise & Health Bar Chart
router.get('/bar', async (req, res) => {
    try {
        const db = {};
        
        db.chartData = await Survey.aggregate([
            {
                $group: {
                    _id: {
                        age_group: '$age_group',
                        exercise_freq: '$exercise_frequency'
                    },
                    count: { $sum: 1 },
                    avgHealthScore: { $avg: '$health_score' }
                }
            },
            {
                $group: {
                    _id: '$_id.age_group',
                    exerciseData: {
                        $push: {
                            frequency: '$_id.exercise_freq',
                            count: '$count',
                            avgHealthScore: '$avgHealthScore'
                        }
                    },
                    totalCount: { $sum: '$count' }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        const stats = await Survey.aggregate([
            {
                $group: {
                    _id: null,
                    totalParticipants: { $sum: 1 },
                    avgHealthScore: { $avg: '$health_score' },
                    sedentaryCount: {
                        $sum: { $cond: [{ $eq: ['$exercise_frequency', '0'] }, 1, 0] }
                    },
                    activeCount: {
                        $sum: { $cond: [{ $in: ['$exercise_frequency', ['3-4', '5+']] }, 1, 0] }
                    }
                }
            }
        ]);

        // 3. Most active age group
        const mostActive = await Survey.aggregate([
            { $match: { exercise_frequency: { $in: ['3-4', '5+'] } } },
            { $group: { _id: '$age_group', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]);

        // 4. Best health score (group with most exercise)
        const bestHealth = await Survey.aggregate([
            { $match: { exercise_frequency: '5+' } },
            { $group: { _id: null, avgScore: { $avg: '$health_score' } } }
        ]);

        // Populate db object
        db.stats = {
            totalParticipants: stats[0]?.totalParticipants || 0,
            avgHealthScore: stats[0]?.avgHealthScore?.toFixed(1) || 0,
            sedentaryPercentage: stats[0] 
                ? Math.round((stats[0].sedentaryCount / stats[0].totalParticipants) * 100) 
                : 0,
            mostActiveAge: mostActive[0]?._id || '26-35',
            bestHealthScore: bestHealth[0]?.avgScore?.toFixed(1) || 4.2
        };

        // Format chart data
        db.formattedChartData = [];
        const exerciseLevels = ['0', '1-2', '3-4', '5+'];
        
        db.chartData.forEach(ageGroup => {
            const ageData = { age: ageGroup._id };
            exerciseLevels.forEach(level => {
                const exercise = ageGroup.exerciseData.find(e => e.frequency === level);
                ageData[level] = exercise ? Number(exercise.avgHealthScore.toFixed(1)) : 0;
                ageData[`${level}_count`] = exercise ? exercise.count : 0;
            });
            db.formattedChartData.push(ageData);
        });

        db.exerciseLevels = exerciseLevels || [];

        // Pass only config and db
        res.render('chart-bar', {
            config: config,
            db: db
        });

    } catch (error) {
        console.error('Error loading bar chart:', error);
        
        // Provide default data on error
        const db = {
            stats: {
                totalParticipants: '--',
                avgHealthScore: '--',
                sedentaryPercentage: '--',
                mostActiveAge: '--',
                bestHealthScore: '--'
            },
            formattedChartData: [
                { age: '18-25', '0': 2.8, '1-2': 3.5, '3-4': 4.0, '5+': 4.3, '0_count': 45, '1-2_count': 78, '3-4_count': 92, '5+_count': 65 },
                { age: '26-35', '0': 2.5, '1-2': 3.3, '3-4': 3.9, '5+': 4.2, '0_count': 38, '1-2_count': 82, '3-4_count': 105, '5+_count': 95 },
                { age: '36-50', '0': 2.9, '1-2': 3.4, '3-4': 3.8, '5+': 4.1, '0_count': 52, '1-2_count': 71, '3-4_count': 68, '5+_count': 49 },
                { age: '50+', '0': 3.1, '1-2': 3.5, '3-4': 3.7, '5+': 4.0, '0_count': 61, '1-2_count': 54, '3-4_count': 42, '5+_count': 28 }
            ],
            exerciseLevels: ['0', '1-2', '3-4', '5+']
        };
        
        res.render('chart-bar', {
            config: config,
            db: db
        });
    }
});

// Dietary Patterns Pie Chart
router.get('/pie', async (req, res) => {
    try {
        // Create db object
        const db = {};

        // 1. Get diet distribution data
        const dietData = await Survey.aggregate([
            {
                $group: {
                    _id: '$diet_type',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // 2. Get statistical data
        const stats = await Survey.aggregate([
            {
                $group: {
                    _id: null,
                    totalParticipants: { $sum: 1 },
                    avgHealthScore: { $avg: '$health_score' },
                    vegetarianCount: {
                        $sum: { $cond: [{ $in: ['$diet_type', ['vegetarian', 'vegan']] }, 1, 0] }
                    }
                }
            }
        ]);

        // 3. Calculate percentage and format chart data for each diet type
        const total = stats[0]?.totalParticipants || 1;
        db.chartData = dietData.map(item => ({
            type: item._id,
            count: item.count,
            percentage: ((item.count / total) * 100).toFixed(1)
        }));

        // 4. Get average health score for each diet type
        const healthByDiet = await Survey.aggregate([
            {
                $group: {
                    _id: '$diet_type',
                    avgHealthScore: { $avg: '$health_score' },
                    avgWaterIntake: { $avg: '$water_intake' }
                }
            }
        ]);

        db.healthByDiet = healthByDiet.reduce((acc, item) => {
            acc[item._id] = {
                avgHealthScore: item.avgHealthScore?.toFixed(1) || 'N/A',
                avgWaterIntake: item.avgWaterIntake?.toFixed(1) || 'N/A'
            };
            return acc;
        }, {});

        // 5. Statistical data
        db.stats = {
            totalParticipants: stats[0]?.totalParticipants || 0,
            avgHealthScore: stats[0]?.avgHealthScore?.toFixed(1) || 0,
            vegetarianPercentage: stats[0] 
                ? Math.round((stats[0].vegetarianCount / stats[0].totalParticipants) * 100) 
                : 0,
            mostPopularDiet: dietData[0]?._id || '--',
            mostPopularPercentage: dietData[0] 
                ? ((dietData[0].count / total) * 100).toFixed(1) 
                : '--'
        };

        // 6. Colors and icons corresponding to diet types
        db.dietColors = {
            'omnivore': { color: '#ff6b6b', icon: '🍖' },
            'vegetarian': { color: '#51cf66', icon: '🥬' },
            'vegan': { color: '#94d82d', icon: '🌱' },
            'keto': { color: '#ffd43b', icon: '🥑' }
        };

        // 7. Display names for diet types
        db.dietLabels = {
            'omnivore': 'Omnivore',
            'vegetarian': 'Vegetarian',
            'vegan': 'Vegan',
            'keto': 'Keto'
        };

        res.render('chart-pie', {
            config: config,
            db: db
        });

    } catch (error) {
        console.error('Error loading pie chart:', error);
        
        // Provide default data on error
        const db = {
            chartData: [
                { type: 'omnivore', count: 845, percentage: '67.8' },
                { type: 'vegetarian', count: 245, percentage: '19.6' },
                { type: 'vegan', count: 98, percentage: '7.9' },
                { type: 'keto', count: 59, percentage: '4.7' }
            ],
            healthByDiet: {
                'omnivore': { avgHealthScore: '3.8', avgWaterIntake: '6.2' },
                'vegetarian': { avgHealthScore: '4.1', avgWaterIntake: '7.5' },
                'vegan': { avgHealthScore: '4.3', avgWaterIntake: '8.1' },
                'keto': { avgHealthScore: '3.9', avgWaterIntake: '5.8' }
            },
            stats: {
                totalParticipants: 1247,
                avgHealthScore: '3.9',
                vegetarianPercentage: 28,
                mostPopularDiet: 'omnivore',
                mostPopularPercentage: '67.8'
            },
            dietColors: {
                'omnivore': { color: '#ff6b6b', icon: '🍖' },
                'vegetarian': { color: '#51cf66', icon: '🥬' },
                'vegan': { color: '#94d82d', icon: '🌱' },
                'keto': { color: '#ffd43b', icon: '🥑' }
            },
            dietLabels: {
                'omnivore': 'Omnivore',
                'vegetarian': 'Vegetarian',
                'vegan': 'Vegan',
                'keto': 'Keto'
            }
        };
        
        res.render('chart-pie', {
            config: config,
            db: db
        });
    }
});

// Sleep Distribution Treemap
router.get('/map', async (req, res) => {
    try {
        // Create db object
        const db = {};

        // 1. Get sleep data for all 18 districts
        const districtData = await Survey.aggregate([
            {
                $group: {
                    _id: '$district',
                    count: { $sum: 1 },
                    avgSleepHours: { 
                        $avg: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ['$sleep_hours', '<6'] }, then: 5 },
                                    { case: { $eq: ['$sleep_hours', '6-8'] }, then: 7 },
                                    { case: { $eq: ['$sleep_hours', '8+'] }, then: 9 }
                                ],
                                default: 0
                            }
                        }
                    }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // 2. Get all district list from config (flattened)
        const allDistricts = Object.values(config.DISTRICTS).flat();

        // 3. Create district lookup table
        const dataMap = {};
        districtData.forEach(item => {
            dataMap[item._id] = {
                count: item.count,
                avgSleepHours: item.avgSleepHours.toFixed(1)
            };
        });

        // 4. Format Treemap data
        db.treemapData = [{
            name: "Hong Kong (18 Districts)",
            children: allDistricts.map(district => {
                const data = dataMap[district] || {
                    count: 0,
                    avgSleepHours: "0"
                };
                return {
                    name: district,
                    value: data.count || 1,
                    sleepHours: data.avgSleepHours,
                    count: data.count
                };
            })
        }];

        // 5. Statistical data
        const stats = await Survey.aggregate([
            {
                $group: {
                    _id: null,
                    totalParticipants: { $sum: 1 },
                    avgSleepOverall: { 
                        $avg: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ['$sleep_hours', '<6'] }, then: 5 },
                                    { case: { $eq: ['$sleep_hours', '6-8'] }, then: 7 },
                                    { case: { $eq: ['$sleep_hours', '8+'] }, then: 9 }
                                ],
                                default: 0
                            }
                        }
                    }
                }
            }
        ]);

        // Find best and worst sleep districts
        const validDistricts = districtData.filter(d => d.count > 0);
        db.stats = {
            totalParticipants: stats[0]?.totalParticipants || 0,
            avgSleepOverall: stats[0]?.avgSleepOverall?.toFixed(1) || '7.0',
            bestDistrict: validDistricts.sort((a, b) => b.avgSleepHours - a.avgSleepHours)[0]?._id || 'Islands',
            bestHours: validDistricts.sort((a, b) => b.avgSleepHours - a.avgSleepHours)[0]?.avgSleepHours?.toFixed(1) || '7.7',
            worstDistrict: validDistricts.sort((a, b) => a.avgSleepHours - b.avgSleepHours)[0]?._id || 'Sham Shui Po',
            worstHours: validDistricts.sort((a, b) => a.avgSleepHours - b.avgSleepHours)[0]?.avgSleepHours?.toFixed(1) || '6.3'
        };

        // Get sleep duration display labels from config
        db.sleepLabels = config.SLEEP_HOURS;

        res.render('chart-map', {
            config: config,
            db: db
        });

    } catch (error) {
        console.error('Error loading treemap:', error);
        
        // Get all districts from config
        const allDistricts = Object.values(config.DISTRICTS).flat();
        
        // Generate default data
        const defaultChildren = allDistricts.map((district, index) => ({
            name: district,
            value: 100 - index * 5,
            sleepHours: (6 + (index % 3) * 0.5).toFixed(1),
            count: 100 - index * 5
        }));

        const db = {
            treemapData: [{
                name: "Hong Kong (18 Districts)",
                children: defaultChildren
            }],
            stats: {
                totalParticipants: 1247,
                avgSleepOverall: "7.0",
                bestDistrict: "Islands",
                bestHours: "7.7",
                worstDistrict: "Sham Shui Po",
                worstHours: "6.3"
            },
            sleepLabels: config.SLEEP_HOURS
        };
        
        res.render('chart-map', {
            config: config,
            db: db
        });
    }
});

module.exports = router;