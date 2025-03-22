## **📌 YouTube Video Downloader (Chrome Extension + Node.js Server)**  
This project provides a **Chrome Extension** and a **Node.js local server** that allows users to:  
✅ **Download YouTube videos** in the best quality  
✅ **Automatically detect the current YouTube video**  
✅ **View downloaded files inside the extension**  
✅ **Open downloaded videos or the download folder**  
✅ **Runs as a Windows service with a custom `.exe` icon**  

---

## **🚀 Features**  
🔹 **Chrome Extension** to detect YouTube videos and send requests to the local server  
🔹 **Node.js server** for handling downloads using `yt-dlp`  
🔹 **Download progress indicator** with a modern UI  
🔹 **View and manage downloaded videos directly from the extension**  
🔹 **Custom `.exe` with a branded icon**  

---

## **📂 Project Structure**  

```
/your-project
 ├── assets/                    # Folder for assets (e.g., logo.png)
 │    ├── logo.png
 ├── bin/                        # Compiled .exe output
 ├── lib/
 │    ├── yt-dlp.exe             # YouTube downloader executable
 ├── downloads/                  # Folder where videos are saved
 ├── extension/                   # Chrome extension files
 │    ├── popup.html              # Extension UI
 │    ├── popup.js                # Handles UI logic
 │    ├── popup.css               # Custom styles
 │    ├── manifest.json            # Extension configuration
 ├── package.json                 # Node.js project config
 ├── server.js                    # Main server file
 ├── icon.ico                     # Custom icon for the .exe file
 ├── tailwind.css                 # Tailwind input file (if used)
 ├── README.md                    # Project documentation
```

---

## **🛠 Installation & Setup**  

### **1️⃣ Install Node.js & Dependencies**  
Make sure **Node.js** is installed on your system. Then, run:  
```sh
npm install
```

### **2️⃣ Install `yt-dlp` (Required for Video Downloads)**  
- Download `yt-dlp.exe` manually from [yt-dlp GitHub Releases](https://github.com/yt-dlp/yt-dlp/releases).  
- Place it inside the `lib/` folder, or let the server download it automatically.  

---

## **🌐 Running the Local Server**  
Run the server using:  
```sh
node server.js
```
or to run in **background mode**:  
```sh
npm install -g pm2
pm2 start server.js --name youtube-downloader
```

---

## **🖥️ Running as a Windows Service**  
To install the `.exe` version as a **Windows service**:  
```sh
nssm install YouTubeDownloader "C:\Program Files\YouTubeDownloader\youtube-downloader.exe"
nssm start YouTubeDownloader
```

---

## **🛠 Building the `.exe` (Standalone Server)**
To package the Node.js server as a **standalone `.exe`** with a custom icon:  
```sh
pkg . --output bin/youtube-downloader.exe --icon icon.ico
```
Now, the server will run **without requiring Node.js**!

---

## **🛠 Chrome Extension Setup**
### **1️⃣ Load the Chrome Extension**
1. Open **Chrome** and go to `chrome://extensions/`
2. **Enable Developer Mode**
3. Click **Load Unpacked**
4. Select the `/extension` folder  

### **2️⃣ Using the Extension**
1. **Go to a YouTube video**
2. Click the **extension icon**
3. Click **"Download Video"**  
✅ The server will start downloading the best-quality video!

---

## **📌 API Endpoints (For Developers)**
| **Method** | **Endpoint**           | **Description** |
|------------|------------------------|----------------|
| `GET`      | `/`                    | Server status |
| `POST`     | `/download`             | Download a video |
| `GET`      | `/files`                | List downloaded files |
| `GET`      | `/open?file=FILENAME`   | Open a video file |
| `GET`      | `/open-folder`          | Open the download folder |

---

## **🛠 Troubleshooting**
### **❌ "yt-dlp.exe Not Found"**
If the server logs `yt-dlp.exe missing!`, manually place `yt-dlp.exe` in `lib/` and restart.

### **❌ "Access is denied"**
If `yt-dlp.exe` cannot run, grant permission:
```sh
icacls "C:\Users\Admin\YouTubeDownloader\lib\yt-dlp.exe" /grant Everyone:F
```

### **❌ Chrome Extension Not Working**
- Ensure the **server is running (`http://localhost:4545/`)**
- **Check console logs** (`Ctrl + Shift + J` in Chrome)

---

## **📌 Credits**
- Uses [`yt-dlp`](https://github.com/yt-dlp/yt-dlp) for video downloads  
- Built with **Node.js** and **Express.js**  
- Chrome extension powered by **JavaScript & Manifest v3**  

---

## **🎯 Future Enhancements**
✅ **Support multiple video qualities**  
✅ **Add a pause/resume button for downloads**  
✅ **Create a proper installer `.msi` for Windows**  

---

## **👨‍💻 Author**
Made by **[Your Name]** 🚀  
Let me know if you have any questions or improvements! 😊  

---

### 📢 **Now your project has a full README.md with clear instructions!** 🚀  
Let me know if you need any modifications! 😊