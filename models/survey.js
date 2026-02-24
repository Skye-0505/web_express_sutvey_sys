// models/Survey.js
const mongoose = require('mongoose');
const constants = require('../constants/surveyConstants');

// 从 constants 中提取枚举值
const ageGroups = Object.keys(constants.AGE_GROUPS);
const genders = Object.keys(constants.GENDERS);
const districts = Object.values(constants.DISTRICTS).flat();
const exerciseFrequencies = Object.keys(constants.EXERCISE_FREQUENCY);
const exerciseTypes = constants.EXERCISE_TYPES.map(t => t.value);
const sleepHours = Object.keys(constants.SLEEP_HOURS);
const sleepQualities = Object.keys(constants.SLEEP_QUALITY);
const dietTypes = Object.keys(constants.DIET_TYPES);
const fastfoodFrequencies = Object.keys(constants.FASTFOOD_FREQUENCY);
const healthScores = constants.HEALTH_SCORES.map(s => s.value);
const regularCheckup = Object.keys(constants.REGULAR_CHECKUP);

const surveySchema = new mongoose.Schema({
    // Part 1: Basic Information
    age_group: { 
        type: String, 
        required: [true, constants.LABELS.validation.select_age],
        enum: {
            values: ageGroups,
            message: '{VALUE} is not a valid age group'
        }
    },
    gender: { 
        type: String, 
        required: [true, constants.LABELS.validation.select_gender],
        enum: {
            values: genders,
            message: '{VALUE} is not a valid gender'
        }
    },
    district: { 
        type: String, 
        required: [true, constants.LABELS.validation.select_district],
        enum: {
            values: districts,
            message: '{VALUE} is not a valid Hong Kong district'
        }
    },

    // Part 2: Exercise Habits
    exercise_frequency: { 
        type: String, 
        required: [true, constants.LABELS.validation.select_exercise_frequency],
        enum: {
            values: exerciseFrequencies,
            message: '{VALUE} is not a valid exercise frequency'
        }
    },
    exercise_type: { 
        type: [String],  // Array for multiple selections
        default: [],
        validate: {
            validator: function(values) {
                // 验证每个值是否都是有效的运动类型
                return values.every(v => exerciseTypes.includes(v));
            },
            message: 'Invalid exercise type selected'
        }
    },

    // Part 3: Sleep Habits
    sleep_hours: { 
        type: String, 
        required: [true, constants.LABELS.validation.select_sleep_hours],
        enum: {
            values: sleepHours,
            message: '{VALUE} is not a valid sleep hours option'
        }
    },
    sleep_quality: { 
        type: String, 
        required: [true, constants.LABELS.validation.select_sleep_quality],
        enum: {
            values: sleepQualities,
            message: '{VALUE} is not a valid sleep quality rating'
        }
    },

    // Part 4: Dietary Habits
    diet_type: { 
        type: String, 
        required: [true, constants.LABELS.validation.select_diet_type],
        enum: {
            values: dietTypes,
            message: '{VALUE} is not a valid diet type'
        }
    },
    water_intake: { 
        type: Number, 
        required: [true, constants.LABELS.validation.water_range],
        min: [1, constants.LABELS.validation.water_range],
        max: [15, constants.LABELS.validation.water_range]
    },
    fastfood_frequency: { 
        type: String, 
        required: [true, constants.LABELS.validation.select_fastfood_frequency],
        enum: {
            values: fastfoodFrequencies,
            message: '{VALUE} is not a valid fast food frequency'
        }
    },

    // Part 5: Health Self-Assessment
    health_score: { 
        type: Number, 
        required: [true, constants.LABELS.validation.select_health_score],
        enum: {
            values: healthScores,
            message: '{VALUE} is not a valid health score'
        }
    },
    regular_checkup: { 
        type: String, 
        required: [true, constants.LABELS.validation.select_checkup],
        enum: {
            values: regularCheckup,
            message: '{VALUE} is not a valid checkup option'
        }
    },

    // Metadata
    isMock: { 
        type: Boolean, 
        default: false 
    },
    submittedAt: { 
        type: Date, 
        default: Date.now 
    },
    ipAddress: {
        type: String,
        default: null
    }
}, {
    timestamps: true,  // 自动添加 createdAt 和 updatedAt
    collection: 'surveys'  // 指定集合名称
});

// 添加索引以提高查询性能
surveySchema.index({ age_group: 1, gender: 1 });
surveySchema.index({ district: 1 });
surveySchema.index({ submittedAt: -1 });

// 实例方法：获取格式化的提交时间
surveySchema.methods.getFormattedDate = function() {
    return this.submittedAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// 静态方法：获取统计数据
surveySchema.statics.getStats = async function() {
    const stats = await this.aggregate([
        {
            $group: {
                _id: null,
                totalCount: { $sum: 1 },
                avgHealthScore: { $avg: '$health_score' },
                avgWaterIntake: { $avg: '$water_intake' }
            }
        }
    ]);
    return stats[0] || { totalCount: 0, avgHealthScore: 0, avgWaterIntake: 0 };
};

// 静态方法：按年龄组统计
surveySchema.statics.getAgeGroupStats = async function() {
    return await this.aggregate([
        {
            $group: {
                _id: '$age_group',
                count: { $sum: 1 },
                avgHealthScore: { $avg: '$health_score' }
            }
        },
        { $sort: { _id: 1 } }
    ]);
};

// 静态方法：按地区统计
surveySchema.statics.getDistrictStats = async function() {
    return await this.aggregate([
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
};

// 静态方法：获取饮食分布
surveySchema.statics.getDietDistribution = async function() {
    return await this.aggregate([
        {
            $group: {
                _id: '$diet_type',
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } }
    ]);
};

// 中间件：保存前日志
surveySchema.pre('save', function(next) {
    console.log(`Saving survey for age group: ${this.age_group}, gender: ${this.gender}`);
    next();
});

// 中间件：保存后日志
surveySchema.post('save', function(doc) {
    console.log(`Survey saved successfully with ID: ${doc._id}`);
});

const Survey = mongoose.model('Survey', surveySchema);

module.exports = Survey;