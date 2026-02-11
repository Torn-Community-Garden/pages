if (window.location.href.endsWith("pages") || window.location.href.endsWith("pages/")) {
    var queryString = window.location.href.endsWith("/") ? `main.html?sub=0` : `/main.html?sub=0`;
    window.location.assign(queryString);
}

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
        window.history.pushState({subpage:value}, "", newUrl);
    },
    get activeSub() {
        return this._activeSub;
    }
};

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

catchUrlParams(window.location.search);

function catchUrlParams(urlSearch) {
    const urlParams = new URLSearchParams(urlSearch);
    for (var paramKey of urlParams.keys()) {
        switch(paramKey) {

            case"sub":
                var pageParam = urlParams.get("sub");
                if (pageParam) {
                    const index = parseInt(pageParam);
                    if (index >= 0 && index < subPageMappings.length) {
                        state.activeSub = index;
                    }
                }
            break;
        }
    }
}
function toggleCollapse(id) {
    var collapse = document.getElementById(id);
    if (!collapse) return;
    if (collapse.className.indexOf("w3-show") == -1) {
        collapse.className += " w3-show";
    } else {
        collapse.className = collapse.className.replace(" w3-show", "");
    }
}
function syncPageUI(pageIndex) {
    subPageMappings.forEach((page, index) => {
        const pageElem = document.getElementById(page.id).firstChild;
        const isActive = index === pageIndex;

        if (pageElem) {
            pageElem.classList.toggle("w3-show", isActive);
            pageElem.classList.toggle("w3-hide", !isActive);
        }
        page.buttons.forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) updateActiveBtnStyle(btn, isActive);
        });
    });
    const nav = document.getElementById("navCollapse");
    if (nav) nav.classList.remove("w3-show");
}
function updateActiveBtnStyle(btn, isActive) {
    if (isActive) {
        btn.classList.replace("w3-2025-orangeade", "w3-orange");
        btn.classList.add("w3-text-white", "w3-hover-text-white", "bean-cornerfold-topright");
    } else {
        btn.classList.replace("w3-orange", "w3-2025-orangeade");
        btn.classList.remove("w3-text-white", "w3-hover-text-white", "bean-cornerfold-topright");
    }
}