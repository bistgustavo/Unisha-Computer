function doPost(e) {
  try {
    // Get the spreadsheet and sheet
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getActiveSheet();

    // Parse the JSON data from the request
    var data = JSON.parse(e.postData.contents);

    // Get timestamp
    var timestamp = new Date();

    // Prepare the row data
    var rowData = [
      timestamp,
      data.name,
      data.email,
      data.phone,
      data.subject,
      data.message,
    ];

    // Append the row to the sheet
    sheet.appendRow(rowData);

    // Return success response
    return ContentService.createTextOutput(
      JSON.stringify({
        status: "success",
        message: "Data successfully saved",
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(
      JSON.stringify({
        status: "error",
        message: error.toString(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("The script is working!");
}
