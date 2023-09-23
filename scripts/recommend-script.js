// Inject the recommend button upon page navigation
// Brute force method of spamming the DOM with event listeners
// Need to find a better way to do this
window.addEventListener("load", () => {
    injectRecommendButton();
});

window.addEventListener("yt-navigate-finish", () => {
    injectRecommendButton();
});

window.addEventListener("yt-navigate-start", () => {
    injectRecommendButton();
});

window.addEventListener("yt-page-data-updated", () => {
    injectRecommendButton();
});

// Create a recommend button on the video metadata menu
function injectRecommendButton() {
    if (document.location.href.match(/https:\/\/www\.youtube\.com\/watch\?v=.*/g) === null) {
        return;
    }
    const parentElement = document.querySelector("#menu > ytd-menu-renderer");
    if (parentElement === null) {
        return;
    }
    // if the recommend button already exists, don't inject it again
    recommend_element = parentElement.querySelector("#recommend-button");
    if (recommend_element) {
        return;
    }

    const cloneElement = parentElement.querySelector("#top-level-buttons-computed > ytd-button-renderer");
    if (cloneElement === null) {
        return;
    }
    const recommendButton = cloneElement.cloneNode(true);
    // Style the reccomend button
    textElement = recommendButton.querySelector("#top-level-buttons-computed > ytd-button-renderer > yt-button-shape > button > div.cbox.yt-spec-button-shape-next__button-text-content > span");
    buttonElement = document.createElement("button");
    buttonElement.textContent = "Recommend";
    buttonElement.setAttribute("id", "recommend-button");
    buttonElement.setAttribute("type", "button");
    BUTTON_COLOR = "#c3482b";
    buttonElement.style.backgroundColor = BUTTON_COLOR;
    buttonElement.style.border = "none";
    buttonElement.style.borderRadius = "18px";
    buttonElement.style.marginRight = "10px";
    buttonElement.style.height = "36px";
    buttonElement.style.color = "#fff";
    buttonElement.style.fontWeight = "bold";
    buttonElement.style.fontSize = "14px";
    buttonElement.style.fontFamily = "Roboto, sans-serif";
    buttonElement.style.padding = "0 16px";

    // Inject the recommend button
    if (parentElement) {
        parentElement.insertBefore(buttonElement, parentElement.firstChild);
    }

    // Listen for recommend button clicks
    buttonElement.addEventListener("click", () => {
        recommendVideo();
    });

    // hover effect
    buttonElement.addEventListener("mouseover", function() {
        buttonElement.style.backgroundColor = "#438d24";
        buttonElement.style.cursor = "pointer";
    });

    buttonElement.addEventListener("mouseout", function() {
        buttonElement.style.backgroundColor = BUTTON_COLOR;
        buttonElement.style.cursor = "default";
    });

}

function recommendVideo() {
    // Get video url
    const url = document.location.href;

    // Send message to background script
    chrome.runtime.sendMessage({command: "recommend", data: {url : url}}, 
    (response) => {
        if (response.status === "success") {
            alert("Recommendation sent!");
        }
        else {
            if (response.data === "empty email") {
                alert("Recommendation failed. Please turn on Chrome sync to use this feature.");
            }
            alert("Recommendation failed to send.");
        }
    });
}