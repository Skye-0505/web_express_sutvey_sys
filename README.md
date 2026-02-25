## 📖 **README.md**

# 健康与生活方式调查系统

一个带有数据可视化功能的简易调查系统。

## 🚀 快速入门

```bash

npm install

npm start

```

**访问** http://localhost:3000

## 🛠️ 技术栈

- Express.js

- EJS

- MongoDB（本地）

- Bootstrap

- amCharts

## 📊 页面

- `/` - 调查表单

- `/results` - 图表链接

- `/chart/bar` - 运动图表

- `/chart/pie` - 饮食图表

- `/chart/treemap` - 睡眠图表

## 📁 将模拟数据导入 MongoDB Compass

测试数据位于 `public/mock/MOCK_DATA.json`（1000 个响应）

1. **打开 MongoDB Compass**

- 连接到本地 MongoDB 实例，地址为 `mongodb://localhost:27017`。

- 选择 `health_survey` 数据库。

- 导航至 `surveys` 集合。

2. **导入 JSON 文件**

- 点击 **`添加数据`** 按钮。

- 从下拉菜单中选择 **`导入 JSON 或 CSV 文件`**。

- 从项目中选择 `public/mock/MOCK_DATA.json` 文件。

- 确认目标是 `health_survey.surveys`，然后点击 **导入`**。

3. **验证导入成功**

- 检查 `surveys` 集合中是否显示 1000 个文档。
