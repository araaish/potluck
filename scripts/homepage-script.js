// Entry point for homepage script
async function homepageScript() {
    if (!["https://www.youtube.com/", "https://www.youtube.com/?bp=wgUCEAE%3D"].includes(document.location.href)) {
        return;
    }
    const potluck_element = document.querySelector("#potluck-element");
    if (potluck_element) {
        console.log("potluck element already exists");
        return;
    }
    console.log("potluck element does not exist");
    const options = await loadOptions();
    potluckLimit = options.potluckLimit;
    youtubeLimit = options.youtubeLimit;
    textColor = options.textColor;
    hideVideoInformation();
    injectPotluckElement();
    injectPotluckRecTitleElement();
    injectPotluckRecContents();
    injectYoutubeRecTitleElement();
    injectYoutubeRecContents();
}

// Run homepage script on page load
window.addEventListener("load", () => {
    homepageScript();
});

// Run homepage script on page navigation
document.addEventListener("yt-navigate-finish", () => {
    homepageScript();
});

// variables for potluck options
const POTLUCK_DEFAULT_LIMIT = 5;
const YOUTUBE_DEFAULT_LIMIT = 2; 
const DEFAULT_TEXT_COLOR = "black";
var potluckLimit = POTLUCK_DEFAULT_LIMIT;
var youtubeLimit = YOUTUBE_DEFAULT_LIMIT;
var textColor = DEFAULT_TEXT_COLOR;

// Load options variables from storage
async function loadOptions() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(["potluckLimit", "youtubeLimit", "isDarkMode"], function (result) {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                const potluck = result.potluckLimit || POTLUCK_DEFAULT_LIMIT;
                const youtube = result.youtubeLimit || YOUTUBE_DEFAULT_LIMIT;
                const color = result.isDarkMode ? "white" : DEFAULT_TEXT_COLOR;
                resolve({ potluckLimit: potluck, youtubeLimit: youtube, textColor: color });
            }
        });
    });
}

// Hide all original video content on homepage
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

// Inject a container for Potluck UI
function injectPotluckElement() {
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
  const parentElement = document.querySelector("ytd-rich-grid-renderer");
  const nthChildIndex = 4; // the desired nth child index (0-based)
  const nthChildElement = parentElement.children[nthChildIndex];
  // Check if the parent element exists before injecting the potluck element
  if (parentElement) {
    // Add the potluck element as the nth child of the parent element
    parentElement.insertBefore(potluck_element, nthChildElement);
  }
}

// Inject potluck recommendation title
function injectPotluckRecTitleElement() {
    const potluck_title_element = document.createElement("h1");
    potluck_title_element.setAttribute("id", "potluck-title-element");
    potluck_title_element.style.color = textColor;
    potluck_title_element.textContent = "Your Potluck Recommends";
    const parentElement = document.querySelector("#potluck-element");
    if (parentElement) {
        parentElement.insertBefore(potluck_title_element, parentElement.firstChild);
    }
}

// Inject potluck recommendation videos
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
    // Get list of video metadata from background script
    chrome.runtime.sendMessage({command: "getRecommendations"}, function(response) {
        if (response) {
            var thumbnailPromises = response.data.thumbnails;
            var titlePromises = response.data.titles;
            var recs = response.data.recs;
            Promise.all([Promise.all(thumbnailPromises), Promise.all(titlePromises)])
                .then(([thumbnails, titles]) => {
                    const video_metadata = [];
                    // collect at most potluckLimit number of videos
                    for (let i = 0; i < Math.min(potluckLimit, recs.length); i++) {
                        video_metadata.push({
                            thumbnail: thumbnails[i],
                            title: titles[i],
                            contact: recs[i].contact.split("@")[0],
                            url: recs[i].url
                        });
                    }
                    // Display video metadata
                    video_metadata.forEach(function(metadata) {
                        // create thumbnail element
                        const thumbnail_element = document.createElement("img");
                        thumbnail_element.setAttribute("src", metadata.thumbnail);
                        thumbnail_element.setAttribute("alt", metadata.title);
                        thumbnail_element.setAttribute("width", "200");
                        thumbnail_element.setAttribute("height", "120");
                        thumbnail_element.style.borderRadius = "8px";
                        thumbnail_element.style.boxShadow = "0px 2px 4px rgba(0, 0, 0, 0.1)";
                        thumbnail_element.style.objectFit = "cover"; // crop top and bottom borders

                        // create title element
                        const title_element = document.createElement("h3");
                        title_element.textContent = metadata.title;
                        title_element.style.fontSize = "14px";
                        title_element.style.fontFamily = "Roboto, sans-serif";
                        title_element.style.color = textColor;
                        // shorten title if necessary
                        if (title_element.textContent.length > 30) {
                            title_element.textContent = title_element.textContent.substring(0, 30) + "...";
                        };

                        // create contact element
                        const contact_element = document.createElement("h4");
                        contact_element.textContent = "Recommended by: " + metadata.contact;
                        contact_element.style.fontSize = "12px";
                        contact_element.style.fontFamily = "Roboto, sans-serif";
                        contact_element.style.color = textColor;

                        // create container element
                        const container_element = document.createElement("div");
                        container_element.setAttribute("class", "potluck-rec-container");
                        container_element.style.width = "200px";
                        container_element.style.height = "200px";
                        container_element.style.margin = "10px";
                        container_element.style.display = "flex";
                        container_element.style.flexDirection = "column";
                        container_element.style.justifyContent = "space-between";
                        container_element.style.alignItems = "center";

                        // add elements to container
                        container_element.appendChild(thumbnail_element);
                        container_element.appendChild(title_element);
                        container_element.appendChild(contact_element);

                        // add hover effect to container
                        container_element.addEventListener("mouseover", () => {
                            container_element.style.cursor = "pointer";
                            thumbnail_element.style.boxShadow = "0px 2px 4px rgba(0, 0, 0, 0.25)";
                        });
                        container_element.addEventListener("mouseout", () => {
                            container_element.style.cursor = "default";
                            thumbnail_element.style.boxShadow = "0px 2px 4px rgba(0, 0, 0, 0.1)";
                        });

                        // navigate to video on click
                        container_element.addEventListener("click", () => {
                            window.open(metadata.url, "_blank");
                        });

                        // add container to potluck rec contents                        
                        potluck_rec_contents.appendChild(container_element);
                    });
                });
        } else {
            console.error("No response from background script");
        }
    });
}

// Inject youtube recommendation title
function injectYoutubeRecTitleElement() {
    const youtube_title_element = document.createElement("h1");
    youtube_title_element.setAttribute("id", "youtube-title-element");
    youtube_title_element.style.color = textColor;
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

    // Display youtubeLimit number of videos
    const parentElement = document.querySelector("#youtube-rec-contents");
    const row_elements = document.querySelectorAll("ytd-rich-grid-row")
    for (let i = 0; i < youtubeLimit; i++) {
        if (parentElement) {
            parentElement.insertBefore(row_elements[i], parentElement.children[i]);
        }
    }
}