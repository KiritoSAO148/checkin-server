const { app, BrowserWindow } = require('electron');
const path = require('path');
const { ipcMain } = require('electron');
const PosPrinter = require('electron-pos-printer');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'), // Đảm bảo rằng đường dẫn đúng
    },
  });

  win.loadFile('addAuthor.html'); // Tạo file index.html sau
}

console.log('Loading preload script from:', path.join(__dirname, 'preload.js'));

ipcMain.on('print-author', async (event, author) => {
  console.log('Received author for printing:', author); // Thêm dòng này
  try {
    const printData = [
      {
        type: 'text',
        value: `Author Name: ${author.author_name}`,
        style: 'font-size: 20px; font-weight: bold;',
      },
      { type: 'text', value: `Affiliation: ${author.affiliation}` },
      { type: 'text', value: `Email: ${author.email}` },
      { type: 'text', value: `Role: ${author.author_role}` },
      { type: 'text', value: `Type: ${author.type}` },
      { type: 'text', value: `Position: ${author.position}` },
      { type: 'text', value: '-------------------' },
    ];

    const printer = new PosPrinter();
    await printer.print(printData);
    console.log('Printed author information successfully');
  } catch (error) {
    console.error('Printing error:', error);
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
