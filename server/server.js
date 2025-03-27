const fs = require("fs");
const path = require("path");
const { https } = require("follow-redirects"); // Use follow-redirects package
const express = require("express");
const { exec } = require("child_process");
const os = require("os");
const cors = require('cors');

const app = express();
const port = 4545;

app.use(cors());
app.options("*", cors());

const baseDir = path.join(os.homedir(), "YouTubeDownloader");
const libFolder = path.join(baseDir, "lib");
const downloadsPath = path.join(baseDir, "downloads");
// const ytDlpPath = path.join(libFolder, "yt-dlp.exe");
const ytDlpPath = "./lib/yt-dlp.exe";
const ytDlpUrl = "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe"; // Use latest stable version

// Ensure directories exist
if (!fs.existsSync(libFolder)) fs.mkdirSync(libFolder, { recursive: true });
if (!fs.existsSync(downloadsPath)) fs.mkdirSync(downloadsPath, { recursive: true });

// Function to download yt-dlp.exe with redirect support
function downloadYtDlp(callback) {
    console.log("🔍 Checking for yt-dlp.exe...");

    if (fs.existsSync(ytDlpPath)) {
        console.log("✅ yt-dlp.exe is already downloaded.");
        return callback();
    }

    console.log("⬇️ Downloading yt-dlp.exe...");
    const file = fs.createWriteStream(ytDlpPath);

    https.get(ytDlpUrl, (response) => {
        if (response.statusCode !== 200) {
            console.error(`❌ Failed to download yt-dlp.exe. Status Code: ${response.statusCode}`);
            return;
        }

        response.pipe(file);
        file.on("finish", () => {
            file.close(() => {
                fs.chmodSync(ytDlpPath, 0o755); // Make it executable
                console.log("✅ yt-dlp.exe downloaded successfully!");
                callback();
            });
        });
    }).on("error", (err) => {
        console.error("❌ Error downloading yt-dlp.exe:", err.message);
    });
}

// Start Express server after downloading yt-dlp.exe
downloadYtDlp(() => {
    app.use(express.json());

    app.get("/", (req, res) => {
        res.send("YouTube Downloader Server is running!");
    });
    
    // API to get list of downloaded videos
    app.get("/files", (req, res) => {
        fs.readdir(downloadsPath, (err, files) => {
            if (err) return res.status(500).json({ error: "Failed to read downloads" });
            res.json(files);
        });
    });
    
    // API to open a video file
    app.get("/open", (req, res) => {
        const fileName = req.query.file;
        if (!fileName) return res.status(400).json({ error: "No file specified" });
    
        const filePath = path.join(downloadsPath, fileName);
        if (!fs.existsSync(filePath)) return res.status(404).json({ error: "File not found" });
    
        exec(`start "" "${filePath}"`);
        res.json({ message: "Opened file" });
    });
    
    // API to open the download folder
    app.get("/open-folder", (req, res) => {
        exec(`start "" "${downloadsPath}"`);
        res.json({ message: "Opened folder" });
    });
    
    // API to download a YouTube video
    app.post("/download", async (req, res) => {
        console.log("Download Request Hit")

        const videoUrl = req.body.url;
        if (!videoUrl) return res.status(400).json({ error: "No URL provided" });
    
        const outputFilePath = path.join(downloadsPath, "%(title)s.%(ext)s");
        const command = `"${ytDlpPath}" -f bestvideo+bestaudio --merge-output-format mp4 -o "${outputFilePath}" ${videoUrl}`;
        console.log(command)
    
        exec(command, (error, stdout, stderr) => {
            if (error) return res.status(500).json({ error: "Download failed", details: stderr });
            res.json({ message: "Download started!" });
        });
    });

    app.listen(port, () => {
        console.log(`🚀 Server running on http://localhost:${port}`);
    });
});
