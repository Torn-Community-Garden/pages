// @ts-check
const baseUrl = "torn-community-garden.github.io/pages/";
const homeSubPage = ["homePage", "rulesPage", "calendarPage"];
const result = { "win": 2, "loss": 1, "empty": 0 };
let activeScene = 0;

if (this.location.href.endsWith("pages") || this.location.href.endsWith("pages/") ||
    this.location.href.endsWith("github.io") || this.location.href.endsWith("github.io/")) {
    this.location.assign(`${baseUrl}index.html?page=0`);
}
var urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('page')) {
    var pageParam = urlParams.get('page');
    if (pageParam) {
        var pageIndex = parseInt(pageParam);
        if (!isNaN(pageIndex) && pageIndex >= 0 && pageIndex < homeSubPage.length) {
            navSubPage(pageIndex);
        }
    }
}
/**
 * @param {number} pageIndex
 */
function navSubPage(pageIndex) {
    for (var sub of homeSubPage) {
        var subElem = document.getElementById(sub);
        if (!subElem) throw new Error("Page not found: " + sub);
        subElem.style.display = "none";
    }
    var page = document.getElementById(homeSubPage[pageIndex]);
    if (!page) throw new Error("Page not found: " + homeSubPage[pageIndex]);
    page.style.display = "block";
    setSubPageBtnActive( /** @type {HTMLButtonElement} */ (document.getElementById(homeSubPage[pageIndex] + "Btn")));
}
/**
 * @param {string} id
 */
function toggleCollapse(id) {
    var x = document.getElementById(id);
    if (!x) return;
    if (x.className.indexOf("w3-show") == -1) {
      x.className += " w3-show";
    } else {
      x.className = x.className.replace(" w3-show", "");
    }
  }

/**
 * @param {HTMLButtonElement} btn
 * @param {number} pageIndex
 */
function subPageNavBtnClick(btn, pageIndex) {
    navSubPage(pageIndex);
    setSubPageBtnActive(btn);
}
/**
 * @param {string} urlPage
 */
function urlNavBtnClick(urlPage) {
    location.assign(`${baseUrl}${urlPage}.html`);
}
/**
 * @param {HTMLButtonElement} btn
 */
function setSubPageBtnActive(btn) {
    btn.classList.replace("w3-2025-orangeade", "w3-orange");
    btn.classList.add("w3-text-white");
    btn.classList.add("w3-hover-text-white");
    var btns = document.body.getElementsByTagName("nav")[0].children;
    for (var i = 0; i < btns.length; i++) {
        if (btns[i].id === btn.id) continue;
        btns[i].classList.replace("w3-orange", "w3-2025-orangeade");
    }
}
/**
 * @param {string} year
 */
function switchToYear(year) {
    var yearElem = document.getElementById(year);
    if (!yearElem) return;
    yearElem.style.display = "block";
}