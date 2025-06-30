# Daily Ranking Quiz App

A simple daily quiz application where users rank items in different categories. Each day features a new category based on New York timezone, similar to Wordle. Rankings are collected anonymously for data science research.

## Features

- Daily rotating categories with items to rank
- Drag-and-drop interface for easy ranking
- Anonymous data collection via Google Sheets
- Prevents multiple submissions per day
- Mobile-responsive design
- No authentication required

## Setup Instructions

### 1. Create Google Sheet

1. Create a new Google Sheet
2. Name the first sheet "Rankings"
3. Add the following headers in row 1:
   - A1: Timestamp
   - B1: Day
   - C1: Category
   - D1: Item1
   - E1: Item2
   - F1: Item3
   - G1: Item4
   - H1: Item5
   - I1: Item6
   - J1: Item7
   - K1: Item8
   - L1: SessionID
   - M1: UserAgent

### 2. Create Google Apps Script

1. In your Google Sheet, go to Extensions → Apps Script
2. Delete any existing code and paste the following:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet and sheet
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Create row array with rankings
    const row = [
      new Date(data.timestamp),
      data.day,
      data.category,
      ...data.rankings,
      data.sessionId,
      data.userAgent
    ];
    
    // Append the row to the sheet
    sheet.appendRow(row);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput("This endpoint only accepts POST requests")
    .setMimeType(ContentService.MimeType.TEXT);
}
```

3. Save the project with a name like "Quiz Data Collector"

### 3. Deploy the Apps Script

1. Click "Deploy" → "New deployment"
2. Click the gear icon → "Web app"
3. Configure the deployment:
   - Description: "Quiz Data Collector"
   - Execute as: "Me"
   - Who has access: "Anyone"
4. Click "Deploy"
5. Copy the Web app URL (it will look like: `https://script.google.com/macros/s/.../exec`)

### 4. Update the App

1. Open `app.js`
2. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with your deployed web app URL
3. Save the file

### 5. Deploy the Frontend

You can host the quiz app on any static hosting service:

#### Option A: GitHub Pages
1. Push code to GitHub repository
2. Go to Settings → Pages
3. Select source branch and folder
4. Your app will be available at `https://[username].github.io/[repository-name]/`

#### Option B: Netlify
1. Drag and drop the project folder to Netlify
2. Your app will be instantly deployed

#### Option C: Local Testing
1. Use a local server (e.g., `python -m http.server 8000`)
2. Open `http://localhost:8000` in your browser

## How It Works

1. **Daily Categories**: The app calculates the current day (1-365) based on New York timezone
2. **Data Loading**: Quiz categories and items are loaded from `data.json`
3. **Ranking**: Users drag and drop items to rank them
4. **Submission**: Rankings are sent to Google Sheets via Apps Script
5. **Prevention**: LocalStorage prevents multiple submissions per day

## Data Structure

Rankings are stored in Google Sheets with:
- Timestamp of submission
- Day number (1-365)
- Category name
- Ranked items (Item1 = highest rank, Item8 = lowest rank)
- Anonymous session ID
- User agent for device analysis

## Customization

- **Styling**: Modify `styles.css` to change the appearance
- **Categories**: Update `data.json` to change quiz content
- **Submission Logic**: Modify `app.js` to change how data is collected

## Privacy

- No personal data is collected
- Session IDs are random and anonymous
- Data is used only for research purposes

## Troubleshooting

**"Error submitting rankings"**
- Check that the Google Apps Script URL is correct
- Ensure the Apps Script is deployed with "Anyone" access
- Check browser console for errors

**"Already submitted today"**
- Clear localStorage to reset: `localStorage.clear()` in browser console

**Items won't drag**
- Ensure JavaScript is enabled
- Try a different browser
- Check for console errors

## License

MIT







# NOTES

Deployment ID
AKfycbzLQQ3erU1evhSi6VeyVTbrT2F3e32-oqYe9UeSds73uHvLR4e1c_S1nspEc2qz-PQ9


https://script.google.com/macros/s/AKfycbzLQQ3erU1evhSi6VeyVTbrT2F3e32-oqYe9UeSds73uHvLR4e1c_S1nspEc2qz-PQ9/exec