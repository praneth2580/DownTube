const fs = require("fs");
const path = require("path");
const https = require("https");
const express = require("express");
const { exec } = require("child_process");

const app = express();
const port = 4545;

const libFolder = path.join(__dirname, "lib");
// const ytDlpPath = path.join(libFolder, "yt-dlp.exe");
const ytDlpPath = "lib/yt-dlp.exe";
const downloadsPath = path.join(__dirname, "downloads");
const ytDlpUrl = "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe";

app.use(express.json());
app.use(require("cors")());

// Ensure necessary directories exist
if (!fs.existsSync(libFolder)) fs.mkdirSync(libFolder, { recursive: true });
if (!fs.existsSync(downloadsPath)) fs.mkdirSync(downloadsPath, { recursive: true });

// Download yt-dlp if not present
if (!fs.existsSync(ytDlpPath)) {
    console.log("Downloading yt-dlp.exe...");
    const file = fs.createWriteStream(ytDlpPath);
    https.get(ytDlpUrl, (response) => {
        response.pipe(file);
        file.on("finish", () => file.close(() => console.log("yt-dlp.exe downloaded")));
    }).on("error", (err) => console.error("Failed to download yt-dlp:", err.message));
}

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
    const videoUrl = req.body.url;
    if (!videoUrl) return res.status(400).json({ error: "No URL provided" });

    const outputFilePath = path.join(downloadsPath, "%(title)s.%(ext)s");
    const command = `"${ytDlpPath}" -f bestvideo+bestaudio --merge-output-format mp4 -o "${outputFilePath}" ${videoUrl}`;

    exec(command, (error, stdout, stderr) => {
        if (error) return res.status(500).json({ error: "Download failed", details: stderr });
        res.json({ message: "Download started!" });
    });
});

// Start server
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
