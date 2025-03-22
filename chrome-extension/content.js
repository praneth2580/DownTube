function getYouTubeVideo() {
    return { url: window.location.href };
}

// Send detected video to background
chrome.runtime.sendMessage({ action: "videoDetected", video: getYouTubeVideo() });
