import { catchUrlParams, LogError } from "./functions.js";
const subPageMappings = [
    { id: "homePage", buttons: ["homePage-Btn"] },
    { id: "rulesPage", buttons: ["rulesPage-Btn", "rulesPage-CBtn"] },
    { id: "calendarPage", buttons: ["calendarPage-Btn", "calendarPage-CBtn"] }
];
const mainPageMappings = [
    { file: "rw_reports.html", buttons: ["repPage-Btn", "repPage-CBtn"]}
];
const state = {
    _activeSub: 0,
    set activeSub(value) {
        if (this._activeSub === value) return;
        this._activeSub = value;

        syncPageUI(value);

        const newUrl = `?sub=${value}`;
        window.history.pushState({sub:value}, "", newUrl);
    },
    get activeSub() {
        return this._activeSub;
    }
};

try {
document.addEventListener("DOMContentLoaded", () =>{
    window.addEventListener("popstate", (ev) => {
        const index = ev.state.sub ?? 0;
        state._activeSub = index;
        syncPageUI(index);
    });
    
    const urlParams = new URLSearchParams(window.location.search);
    const initialPage = parseInt(urlParams.get("sub")) || 0;
    state._activeSub = initialPage;
    syncPageUI(initialPage);

    const collapseBtn = document.getElementById("navCollapse-Btn");
    collapseBtn.addEventListener("click", () => {toggleCollapse("navCollapse");});
    subPageMappings.forEach((mapping, index) => {
        mapping.buttons.forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener("click", () => {
                    state.activeSub = index;
                });
            }
        });
    });
    mainPageMappings.forEach((mapping) => {
        mapping.buttons.forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) btn.addEventListener("click", () => { window.location.assign(mapping.file); });
        });
    });
    window.addEventListener("load", () =>{document.getElementById("loadingModal").classList.remove("w3-show");});
});

state._activeSub = catchUrlParams(window.location.search, subPageMappings.length) ?? 0;
} catch (err) {
    LogError("Error initializing page:", err);
    alert("An error occurred while loading the page. Please try again later.");
}
function syncPageUI(pageIndex) {
    try {
    subPageMappings.forEach((page, index) => {
        const pageElem = document.getElementById(page.id).children[0];
        const isActive = index === pageIndex;

        if (pageElem) {
            pageElem.classList.toggle("w3-hide", !isActive);
            if (pageIndex !== 0 && isActive) document.getElementById("homePageBanner").classList.add("w3-hide");
            else if (pageIndex === 0 && isActive) document.getElementById("homePageBanner").classList.remove("w3-hide");
        }
        page.buttons.forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) updateActiveBtnStyle(btn, isActive);
        });
    });
    const nav = document.getElementById("navCollapse");
    if (nav) nav.classList.remove("w3-show");
    } catch (err) {
        LogError(`Error syncing UI: ${err.message}`);
    }
}
/**
* @param btn {HTMLButtonElement}
* @param isActive {boolean}
*/
function updateActiveBtnStyle(btn, isActive) {
    try {
    if (isActive) {
        btn.classList.add("w3-text-white", "w3-hover-text-white", "bean-cornerfold-topright", "w3-orange");
    } else {
        btn.classList.remove("w3-text-white", "w3-hover-text-white", "bean-cornerfold-topright", "w3-orange");
    }
    } catch (err) {
        LogError(`Error updating button style: ${err.message}`);
    }
}