// @ts-check
import ReportList from "./resources/reports.json" with { type: "json" };

window.addEventListener("loadstart", () =>{if (loadingModal)loadingModal.style.display="block"});
window.addEventListener("load", () =>{if (loadingModal)loadingModal.style.display="none"});

catchUrlParams(window.location.search);
if (window.location.href.endsWith("pages") || window.location.href.endsWith("pages/")) {
    var queryString = window.location.href.endsWith("/") ? `index.html?subpage=0` : `/index.html?subpage=0`;
    window.location.assign(queryString);
    activeSub = 0;
}
if (window.location.href.endsWith("rw_reports.html")) {
    const menu = document.getElementById("reportMenu");
    if (menu) {
        for (var report of ReportList.reports[2026]) {
            var elem = document.createElement("li");
            elem.className = "w3-bar-item w3-button w3-hover-opacity";
            elem.textContent = 
            `${report.war_date.day}${report.war_date.month} - ${report.opponent.name} (${report.opponent.tag})`;
            menu.appendChild(elem);
            elem.addEventListener("click", () => {
                var frame = document.getElementById("repFrame");
                if (frame) frame.setAttribute("src", `${report.file_name}`);
            });
        }
    }
}
const nav = document.getElementsByTagName("nav").item(0);
const navBtns = nav ? nav.getElementsByTagName("button") : null;
const loadingModal = document.getElementById("loadingModal");
var activeSub = 0;
if (!navBtns || !loadingModal) throw "Elements missing.";

for (var btn of navBtns) {
    if (btn == null) throw `Button missing.`;
    if (btn.id.includes("repPage")) continue;
    if (btn.id.includes("Page")) btn.addEventListener("click", () => { navToSubPage(btn); });
    if (btn.id == "collapse-Btn") btn.addEventListener("click", () => { toggleCollapse("navCollapse"); });
}
/**
* @param {string} urlSearch
*/
function catchUrlParams(urlSearch) {
    var urlParams = new URLSearchParams(urlSearch);
    for (var paramKey of urlParams.keys()) {
        switch(paramKey) {

            case'subpage':
                var pageParam = urlParams.get('subpage');
                if (pageParam) {
                    var index = parseInt(pageParam);
                    if (!isNaN(index) && index >= 0 && index < 3 && navBtns) {
                        var btn = navBtns[index];
                        var page = btn.id.includes("Page") ?
                            document.getElementById(btn.id.split("-")[0]) : null;
                        if (btn && page) navToSubPage(btn); 
                        activeSub = index;
                    }
                }
                break;
            }
        }
}
/**
* @param {string} id
*/
function toggleCollapse(id) {
    var collapse = document.getElementById(id);
    if (!collapse) return;
    if (collapse.className.indexOf("w3-show") == -1) {
        collapse.className += " w3-show";
    } else {
        collapse.className = collapse.className.replace(" w3-show", "");
    }
}
/**
* @param {HTMLElement} btn
*/
function navToSubPage(btn) {
    if (!navBtns) return;
    for (var navBtn of navBtns) {
        if (navBtn.id.includes('Page')) {
            var page = document.getElementById(navBtn.id.split("-")[0]);
            if (page) page.style.display = "none";
        }
    }
    var show = document.getElementById(btn.id.split("-")[0]);
    if (show) show.style.display = "block";
    setSubPageBtnActive(btn);
}
/**
* @param {HTMLElement} btn
*/
function setSubPageBtnActive(btn) {
    btn.classList.replace("w3-2025-orangeade", "w3-orange");
    btn.classList.add("w3-text-white");
    btn.classList.add("w3-hover-text-white");
    if (!navBtns) throw "Missing element(s).";
    for (var navBtn of navBtns) {
        if (navBtn && navBtn.classList.contains("w3-orange")) {
            navBtn.classList.replace("w3-orange", "w3-2025-orangeade");
            navBtn.classList.remove("w3-text-white");
            navBtn.classList.remove("w3-hover-text-white");
        }
    }
}
