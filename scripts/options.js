document.addEventListener("DOMContentLoaded", function () {
    // Get references to the HTML elements
    const potluckLimitSelect = document.getElementById("potluck-limit");
    const youtubeLimitSelect = document.getElementById("youtube-limit");
    const themeToggle = document.getElementById('theme-toggle');

    // Load the stored options values if available
    chrome.storage.sync.get(["potluckLimit", "youtubeLimit", "isDarkMode"], function (data) {
        if (data.potluckLimit) {
            potluckLimitSelect.value = data.potluckLimit;
        }
        if (data.youtubeLimit) {
            youtubeLimitSelect.value = data.youtubeLimit;
        }
        if (data.isDarkMode) {
            themeToggle.checked = data.isDarkMode;
        }
    });

    // Save the selected option values when the selections change
    potluckLimitSelect.addEventListener("change", function () {
        const potluckLimit = potluckLimitSelect.value;
        chrome.storage.sync.set({ potluckLimit });
    });
    youtubeLimitSelect.addEventListener("change", function () {
        const youtubeLimit = youtubeLimitSelect.value;
        chrome.storage.sync.set({ youtubeLimit });
    });

    // Save respective color scheme when the toggle changes
    themeToggle.addEventListener('change', () => {
        const isDarkMode = themeToggle.checked;
        chrome.storage.sync.set({ isDarkMode });   
    });
});
