const root = document.querySelector(":root");

let btnToggleMobileMenu = document.querySelector("#btnToggleMobileMenu");
let menuBlock = document.querySelector("#menuBlock");
let body = document.querySelector("body");
let backdrop = document.querySelector("#backdrop");

let formShortenLink = document.querySelector("#formShortenLink");
let inputContainer = document.querySelector(".inputContainer");
let inputFieldDomain = document.querySelector("#inputFieldDomain");
let linkHistory = document.querySelector("#linkHistory");

let arrayMyLinks = [];
let btnActiveCopy;

function handleFormSubmit(event) {
  event.preventDefault();
  let regexDomain =
    /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/;
  let myUrl;
  let myShortenedUrl;
  let tmpDoubleEntry = false;

  if (inputFieldDomain.value == "") {
    return;
  }

  arrayMyLinks.forEach((element) => {
    if (element.originalLink == inputFieldDomain.value) {
      tmpDoubleEntry = true;
      return;
    }
  });

  if (tmpDoubleEntry) {
    return;
  }

  if (inputFieldDomain.value.match(regexDomain)) {
    inputContainer.classList.remove("error");
    myUrl = inputFieldDomain.value;
  } else {
    root.style.setProperty("--errorText", `"Please add a link"`);

    inputContainer.classList.add("error");
    return;
  }

  let linkToFetch = "https://api.shrtco.de/v2/shorten?url=" + myUrl;
  axios
    .get(linkToFetch)
    .then((response) => {
      myShortenedUrl = response.data.result.full_short_link;
      saveLinkToArray(myUrl, myShortenedUrl);
      saveLinkArrayInLocalStorage();
      addLinkElement(myUrl, myShortenedUrl);
      inputFieldDomain.value == "";
    })
    .catch((error) => {
      root.style.setProperty(
        "--errorText",
        `"${error.response.data.disallowed_reason}"`
      );
      inputContainer.classList.add("error");
    });
}

function addLinkElement(originalUrl, shortUrl) {
  let tmpElement = createLinkElement(originalUrl, shortUrl);
  linkHistory.insertBefore(tmpElement, linkHistory.childNodes[0]);
}

function createLinkElement(originalUrl, shortUrl) {
  let linkBox = document.createElement("div");
  linkBox.classList.add("linkBox");

  let linkFull = document.createElement("p");
  linkFull.classList.add("linkFull");
  linkFull.innerText = originalUrl;

  let linkBoxBottom = document.createElement("div");
  linkBoxBottom.classList.add("linkBoxBottom");

  let linkShort = document.createElement("p");
  linkShort.classList.add("linkShort");
  linkShort.innerText = shortUrl;

  let btnCopy = document.createElement("button");
  btnCopy.classList.add("btnCopy");
  btnCopy.innerText = "Copy";
  btnCopy.addEventListener("click", copyToClipboard);

  linkBoxBottom.appendChild(linkShort);
  linkBoxBottom.appendChild(btnCopy);

  linkBox.appendChild(linkFull);
  linkBox.appendChild(linkBoxBottom);

  return linkBox;
}

function copyToClipboard(event) {
  if (btnActiveCopy) {
    btnActiveCopy.classList.remove("currentlyCopied");
    btnActiveCopy.innerText = "Copy";
  }
  navigator.clipboard.writeText(event.target.previousSibling.textContent);
  btnActiveCopy = event.target;
  event.target.classList.add("currentlyCopied");
  event.target.innerText = "Copied!";
}

function saveLinkToArray(originalUrl, shortUrl) {
  arrayMyLinks.push({ originalLink: originalUrl, shortenedLink: shortUrl });
}

function saveLinkArrayInLocalStorage() {
  let jsonObject = JSON.stringify(arrayMyLinks);
  localStorage.setItem("shortenedUrls", jsonObject);
}

function loadLinksFromLocalStorage() {
  if (localStorage.getItem("shortenedUrls")) {
    arrayMyLinks = JSON.parse(localStorage.getItem("shortenedUrls"));
    arrayMyLinks.forEach((element) => {
      addLinkElement(element.originalLink, element.shortenedLink);
    });
  }
}

function toggleMobileMenu() {
  if (menuBlock.classList.contains("open")) {
    setTimeout(() => {
      menuBlock.classList.toggle("displayBlock");
    }, 500);
    menuBlock.classList.toggle("open");
  } else {
    menuBlock.classList.toggle("displayBlock");
    setTimeout(() => {
      menuBlock.classList.toggle("open");
    }, 100);
  }

  btnToggleMobileMenu.classList.toggle("menuOpen");
  body.classList.toggle("backdropActive");
  backdrop.classList.toggle("active");
}

function closeMobileMenuOnResize() {
  if (menuBlock.classList.contains("open") && window.innerWidth >= 800) {
    toggleMobileMenu();
  }
}

function init() {
  btnToggleMobileMenu.addEventListener("click", toggleMobileMenu);
  formShortenLink.addEventListener("submit", handleFormSubmit);
  loadLinksFromLocalStorage();
  window.addEventListener("resize", closeMobileMenuOnResize);
}

window.onload = init();
