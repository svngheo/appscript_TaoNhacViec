function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('Nhắc việc');
}

function addReminder(reminderData) {
  // Lấy dữ liệu từ Google Sheets
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Reminders');
  sheet.appendRow([reminderData.title, reminderData.description, reminderData.date, reminderData.time, reminderData.emails]);

  // Chuyển định dạng ngày từ dd/MM/yyyy sang yyyy-MM-dd để tạo sự kiện trên Google Calendar
  const [day, month, year] = reminderData.date.split('/');
  const formattedDate = `${year}-${month}-${day}`;
  const startTime = new Date(`${formattedDate}T${reminderData.time}:00`);

  // Tạo sự kiện trên Google Calendar
  const calendar = CalendarApp.getDefaultCalendar();
  calendar.createEvent(reminderData.title, startTime, startTime, {
    description: reminderData.description,
  });

  // Gửi email thông báo
  const emailList = reminderData.emails.split(',');
  const subject = 'Nhắc việc: ' + reminderData.title;
  const body = 'Nhắc việc: ' + reminderData.title + '\n\n' + reminderData.description + '\nThời gian: ' + reminderData.date + ' ' + reminderData.time;
  
  emailList.forEach(email => {
    MailApp.sendEmail(email.trim(), subject, body);
  });

  return 'Tạo nhắc việc thành công!';
}
