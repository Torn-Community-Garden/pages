import Functions from "./functions.js";
const currentPage = document.body.dataset.page;
const subPageMappings = [
  { id: "homePage", buttons: ["homePage-Btn"] },
  { id: "rulesPage", buttons: ["rulesPage-Btn", "rulesPage-CBtn"] },
  { id: "calendarPage", buttons: ["calendarPage-Btn", "calendarPage-CBtn"] },
];
const mainPageMappings = [
  { file: "home.html", buttons: ["homePage-Btn"] },
  { file: "rw_reports.html", buttons: ["repPage-Btn", "repPage-CBtn"] },
];
const homeState = {
  _activeSub: 0,
  set activeSub(value) {
    if (this._activeSub === value) return;
    this._activeSub = value;

    syncPageUI(value);

    const newUrl = `?sub=${value}`;
    window.history.pushState({ sub: value }, "", newUrl);
  },
  get activeSub() {
    return this._activeSub;
  },
};

try {
  document.addEventListener("DOMContentLoaded", () => {
    const collapseBtn = document.getElementById("navCollapse-Btn");
    collapseBtn.addEventListener("click", () => {
      Functions.toggleCollapse("navCollapse");
    });
    subPageMappings.forEach((mapping, index) => {
      mapping.buttons.forEach((btnId) => {
        const btn = document.getElementById(btnId);
        if (btn) {
          btn.addEventListener("click", () => {
            homeState.activeSub = index;
          });
        }
      });
    });
    mainPageMappings.forEach((mapping) => {
      mapping.buttons.forEach((btnId) => {
        const btn = document.getElementById(btnId);
        if (btn)
          btn.addEventListener("click", () => {
            window.location.assign(mapping.file);
          });
      });
    });

    switch (currentPage) {
      case "home":
        window.addEventListener("popstate", (ev) => {
          const index = ev.state.sub ?? 0;
          homeState._activeSub = index;
          syncHomePageUI(index);
        });
        const urlParams = new URLSearchParams(window.location.search);
        const initialPage = parseInt(urlParams.get("sub")) || 0;
        homeState._activeSub = initialPage;
        syncHomePageUI(initialPage);
        homeState._activeSub =
          Functions.catchUrlParams(
            window.location.search,
            subPageMappings.length,
          ) ?? 0;
        break;
      case "rw_reports":
        const reports = Functions.getReports(2026);
        for (const report of reports) {
          const btn = document.createElement("button");
          btn.textContent = `${report.name} (${report.war_date.month}/${report.war_date.day})`;
          btn.classList.add("w3-button");
          const resultColor =
            report.result === 1
              ? "w3-red"
              : report.result === 2
                ? "w3-green"
                : report.result === 3
                  ? "w3-blue"
                  : null;
          if (resultColor) btn.classList.add(resultColor);
          btn.style.width = "100%";
          btn.addEventListener("click", () => {
            try {
              const frame = document.getElementById("repFrame");
              if (frame) frame.setAttribute("src", report.file_name);
              const buttons = document
                .getElementById("reportMenu")
                .getElementsByTagName("button");
              for (const b of buttons) {
                b.classList.remove("w3-gray");
              }
              btn.classList.add("w3-gray");
            } catch (err) {
              Functions.LogError(`Error handling button click: ${err}`);
            }
          });
          document.getElementById("reportMenu").appendChild(btn);
        }
        break;
    }
  });
  Functions.onLoadComplete();
} catch (err) {
  Functions.LogError(`Error initializing page: ${err.message}`);
}
