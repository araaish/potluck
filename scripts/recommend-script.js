// Create a recommend button on the video metadata menu

function injectRecommendButton() {
    const parentElement = document.querySelector("#menu > ytd-menu-renderer");

    // if the recommend button already exists, don't inject it again
    if (parentElement.querySelector("#recommend-button")) {
        return;
    }

    const recommendButton = parentElement.querySelector("#top-level-buttons-computed > ytd-button-renderer").cloneNode(true);

    // TODO: Style the reccomend button
    textElement = recommendButton.querySelector("#top-level-buttons-computed > ytd-button-renderer > yt-button-shape > button > div.cbox.yt-spec-button-shape-next__button-text-content > span");
    buttonElement = document.createElement("button");

    // Set the button properties (optional)
    buttonElement.textContent = "Recommend"; // Button text
    buttonElement.setAttribute("id", "recommend-button"); // Button id (optional)
    buttonElement.setAttribute("type", "button"); // Button type (optional)

    // Inject the recommend button
    if (parentElement) {
        parentElement.insertBefore(buttonElement, parentElement.firstChild);
    }

    // Listen for recommend button clicks
    buttonElement.addEventListener("click", recommendVideo());

}

function recommendVideo() {
    // Get video url
    const url = document.location.href;

    // Send message to background script
    chrome.runtime.sendMessage({command: "recommend", data: {url : url}}, 
    (response) => {
        console.log("MADE RECOMMENDATION: ", response);
    });
}


// Inject the recommend button
window.addEventListener("yt-page-data-updated", injectRecommendButton);