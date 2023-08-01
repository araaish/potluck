
// Function to hide video information
function hideVideoInformation() {
    // hide categories toolbar at top of page (e.g. "All", "Music", "Sports", etc.)
    const category_toolbar = document.querySelector('#header.ytd-rich-grid-renderer');
    category_toolbar.style.display = 'none';
    category_toolbar.style.pointerEvents = 'none';

    // hide all video information
    const contents = document.querySelector('#contents.ytd-rich-grid-renderer');
    contents.style.display = 'none';
    contents.style.pointerEvents = 'none';

}

// Function to inject a container for Potluck UI
function injectPotluckElement() {
  //const pageTitle = "Youtube Recommends"; // Replace this with your desired title text

  // Create a new div element
  const potluck_element = document.createElement("div");

  // Add an id to the new div element
  potluck_element.setAttribute("id", "potluck-element");

  // Style the div element
  potluck_element.style.width = "100%";
  potluck_element.style.paddingTop = "24px";
  potluck_element.style.display = "flex";
  potluck_element.style.flexWrap = "wrap";
  potluck_element.style.justifyContent = "flex-start";



  // Find the parent element where you want to inject the title (e.g., the header or any suitable container)
  const parentElement = document.querySelector("ytd-rich-grid-renderer"); // Replace "#header" with the appropriate selector

  const nthChildIndex = 4; // the desired nth child index (0-based)
  const nthChildElement = parentElement.children[nthChildIndex];

  // Check if the parent element exists before injecting the potluck element
  if (parentElement) {
    // Add the potluck element as the nth child of the parent element
    parentElement.insertBefore(potluck_element, nthChildElement);
  }
}

// Function to inject potluck recommendation title
function injectPotluckRecTitleElement() {
    const potluck_title_element = document.createElement("h1");
    potluck_title_element.setAttribute("id", "potluck-title-element");
    potluck_title_element.textContent = "Your Potluck Recommends";
    const parentElement = document.querySelector("#potluck-element");
    if (parentElement) {
        parentElement.insertBefore(potluck_title_element, parentElement.firstChild);
    }
}

// Function to inject potluck recommendation videos
function injectPotluckRecContents() {

    // Create a new div element
    const potluck_rec_contents = document.createElement("div");
    potluck_rec_contents.setAttribute("id", "potluck-rec-contents");

    // Style the div element
    potluck_rec_contents.style.width = "100%";
    potluck_rec_contents.style.paddingTop = "24px";
    potluck_rec_contents.style.display = "flex";
    potluck_rec_contents.style.flexWrap = "wrap";
    potluck_rec_contents.style.justifyContent = "flex-start";

    const grandparentElement = document.querySelector("#potluck-element");
    if (grandparentElement) {
        grandparentElement.insertBefore(potluck_rec_contents, grandparentElement.children[1]);
    }

    // Get list of video urls from background script
    chrome.runtime.sendMessage({command: "getRecommendations"}, function(response) {
        response.recommendations.forEach(function(urls) {
            console.log("URLS: ", urls);
        });
    });

}

// Function to inject youtube recommendation title
function injectYoutubeRecTitleElement() {
    const youtube_title_element = document.createElement("h1");
    youtube_title_element.setAttribute("id", "youtube-title-element");
    youtube_title_element.textContent = "Youtube Recommends";
    const parentElement = document.querySelector("#potluck-element");
    if (parentElement) {
        parentElement.insertBefore(youtube_title_element, parentElement.children[2]);
    }
}

// Function to inject youtube recommendation videos
function injectYoutubeRecContents() {
    const youtube_rec_contents = document.createElement("div");
    youtube_rec_contents.setAttribute("id", "youtube-rec-contents");

    // Style the div element
    youtube_rec_contents.style.width = "100%";
    youtube_rec_contents.style.paddingTop = "24px";
    youtube_rec_contents.style.display = "flex";
    youtube_rec_contents.style.flexWrap = "wrap";
    youtube_rec_contents.style.justifyContent = "flex-start";

    const grandparentElement = document.querySelector("#potluck-element");
    if (grandparentElement) {
        grandparentElement.insertBefore(youtube_rec_contents, grandparentElement.children[3]);
    }

    // display ROW_LIMIT number of rows
    // TODO: add dynamic LIMIT option to settings
    const ROW_LIMIT = 3;
    const parentElement = document.querySelector("#youtube-rec-contents");
    const row_elements = document.querySelectorAll("ytd-rich-grid-row")
    for (let i = 0; i < ROW_LIMIT; i++) {
        if (parentElement) {
            parentElement.insertBefore(row_elements[i], parentElement.children[i]);
        }
    }
}


window.addEventListener("load", () => {
    hideVideoInformation();
    injectPotluckElement();
    injectPotluckRecTitleElement();
    injectPotluckRecContents();
    injectYoutubeRecTitleElement();
    injectYoutubeRecContents();
});