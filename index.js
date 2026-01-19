// @ts-check
import ReportList from "./reports.json" with { type: "json" };

window.onloadstart = () => {
    var modal = document.getElementById("loadingModal");
    if (modal) modal.style.display = "block";
}
window.onload = () => {
    var modal = document.getElementById("loadingModal");
    if (modal) modal.style.display = "none";
}
if (window.location.href.endsWith("pages") || window.location.href.endsWith("pages/")) {
    var urlString = window.location.href.endsWith("/") ? `index.html?subpage=0` : `/index.html?subpage=0`;
    window.location.assign(urlString);
}
class Nav {
    static subPages = ["homePage", "rulesPage", "calendarPage"];
    static mainPages = ["index.html", "rw_reports.html"];
    static navBtns = ["homePageBtn", "rulesPageBtn", "calendarPageBtn", "repPageBtn"];
    constructor() {return this;}
/**
* @param {string} urlSearch
*/
    static catchUrlParams(urlSearch) {
        var urlParams = new URLSearchParams(urlSearch);
        for (var paramKey of urlParams.keys()) {
            switch(paramKey) {

                case'subpage':
                var pageParam = urlParams.get('subpage');
                if (pageParam) {
                    var pageIndex = parseInt(pageParam);
                    if (!isNaN(pageIndex) && pageIndex >= 0 && pageIndex < this.subPages.length) {
                        var btn = /** @type {HTMLButtonElement} */(document.getElementById(this.navBtns[pageIndex]));
                        this.navToSubPage(btn, pageIndex); 
                    }
                }
                break;
            }
        }
    }
/**
* @param {string} id
*/
    static toggleCollapse(id) {
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
    static navToSubPage(btn, pageIndex) {
        for (var sub of this.subPages) {
            var subElem = document.getElementById(sub);
            if (!subElem) {
                console.log(`Page not found: ${sub}`);
                return;
            }
            subElem.style.display = "none";
        }
        var page = document.getElementById(this.subPages[pageIndex]);
        if (!page) {
            console.log(`Page not found: ${this.subPages[pageIndex]}`);
            return;
        }
        page.style.display = "block";
        this.setSubPageBtnActive(btn);
}
/**
* @param {HTMLButtonElement} btn
*/
    static setSubPageBtnActive(btn) {
        btn.classList.replace("w3-2025-orangeade", "w3-orange");
        btn.classList.add("w3-text-white");
        btn.classList.add("w3-hover-text-white");
        for (var navBtn of this.navBtns) {
            var b = document.getElementById(navBtn);
            if (b && b.classList.contains("w3-orange")) {
                b.classList.replace("w3-orange", "w3-2025-orangeade");
                b.classList.remove("w3-text-white");
                b.classList.remove("w3-hover-text-white");
            }
        }
    }
}
Nav.catchUrlParams(window.location.search);
class ReportController {
    static years = [2025, 2026]
/**
* @param {string} year
*/
    static switchToYear(year) {
        var yearElem = document.getElementById(year);
        if (!yearElem) return;
        yearElem.style.display = "block";
    }
    static loadReportList() {
    }
}