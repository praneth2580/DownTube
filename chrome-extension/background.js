let detectedVideo = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "videoDetected" && message.video) {
        detectedVideo = message.video;
    } else if (message.action === "getVideo") {
        sendResponse({ video: detectedVideo });
    }
});
