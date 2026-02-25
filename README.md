## 📖 **README.md**

# Health & Lifestyle Survey System

A simple survey system with data visualization.

## 🚀 Quick Start

```bash
npm install

npm start
```

**Visit** http://localhost:3000

## 🛠️ Tech Stack
- Express.js
- EJS
- MongoDB (local)
- Bootstrap
- amCharts

## 📊 Pages
- `/` - Survey form
- `/results` - Chart links
- `/chart/bar` - Exercise chart
- `/chart/pie` - Diet chart
- `/chart/treemap` - Sleep chart

## 📁 Importing Mock Data to MongoDB Compass
Test data is in `public/mock/MOCK_DATA.json` (1000 responses)
1.  **Open MongoDB Compass**
    -   Connect to your local MongoDB instance at `mongodb://localhost:27017`.
    -   Select the `health_survey` database.
    -   Navigate to the `surveys` collection.

2.  **Import the JSON file**
    -   Click the **`ADD DATA`** button.
    -   Choose **`Import JSON or CSV file`** from the dropdown.
    -   Select the `public/mock/MOCK_DATA.json` file from your project.
    -   Confirm the target is `health_survey.surveys` and click **`Import`**.

3.  **Verify the import**
    -   Check that 1000 documents are now visible in the `surveys` collection.