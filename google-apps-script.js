// Google Apps Script Code
// Copy this entire code to your Google Apps Script project

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