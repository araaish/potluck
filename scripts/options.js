document.addEventListener("DOMContentLoaded", function () {
    // Get references to the HTML elements
    const potluckLimitSelect = document.getElementById("potluck-limit");
    const youtubeLimitSelect = document.getElementById("youtube-limit");

    // Load the stored limit values if available
    chrome.storage.sync.get(["potluckLimit", "youtubeLimit"], function (data) {
        if (data.potluckLimit) {
            potluckLimitSelect.value = data.potluckLimit;
        }
        if (data.youtubeLimit) {
            youtubeLimitSelect.value = data.youtubeLimit;
        }
    });

    // Save the selected limit values when the dropdowns change
    potluckLimitSelect.addEventListener("change", function () {
        const potluckLimit = potluckLimitSelect.value;
        chrome.storage.sync.set({ potluckLimit });
    });
    youtubeLimitSelect.addEventListener("change", function () {
        const youtubeLimit = youtubeLimitSelect.value;
        chrome.storage.sync.set({ youtubeLimit });
    });
});
