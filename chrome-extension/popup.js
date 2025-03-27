document.addEventListener("DOMContentLoaded", function () {
    const downloadBtn = document.getElementById("downloadBtn");
    const loader = document.getElementById("loader");
    const message = document.getElementById("message");
    const downloadsList = document.getElementById("downloadsList");

    // Function to show loader
    function showLoader() {
        loader.style.display = "block";
        message.textContent = "";
    }

    // Function to hide loader
    function hideLoader() {
        loader.style.display = "none";
    }

    // Function to update message
    function updateMessage(text, success = true) {
        message.textContent = text;
        message.style.color = success ? "lightgreen" : "red";
    }

    // Function to load downloaded files
    function loadDownloadedFiles() {
        fetch("http://localhost:4545/files")
            .then(response => response.json())
            .then(files => {
                downloadsList.innerHTML = ""; // Clear list
                files.forEach(file => {
                    let listItem = document.createElement("li");
                    listItem.innerHTML = `${file} <a href="http://localhost:4545/open/${file}" target="_blank">Open</a>`;
                    downloadsList.appendChild(listItem);
                });
            })
            .catch(error => console.error("Error loading downloads:", error));
    }

    // Download Button Click
    downloadBtn.addEventListener("click", function () {
        // const videoUrl = prompt("Enter YouTube URL:");
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            if (!tabs[0] || !tabs[0].url.includes("youtube.com/watch")) {
                loader.classList.add("hidden");
                message.classList.remove("hidden");
                message.innerText = "❌ Not a valid YouTube video!";
                return;
            }

            const videoUrl = tabs[0].url;

            if (!videoUrl) return updateMessage("Could not detect YOUTUBE URL!", false);

            showLoader();

            fetch("http://localhost:4545/download", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: videoUrl })
            })
                .then(response => response.json())
                .then(data => {
                    hideLoader();
                    if (data.error) {
                        updateMessage("Download Failed! " + data.error, false);
                    } else {
                        updateMessage("Download Successful!");
                        loadDownloadedFiles();
                    }
                })
                .catch(error => {
                    hideLoader();
                    updateMessage("Error: " + error.message, false);
                });
        });
    });

    // Load downloads on popup open
    loadDownloadedFiles();
});
