import { Functions } from "./functions.js";
const f = new Functions();
const currentPage = document.body.dataset.page;
const subPageMappings = [
  { id: "homeMainPage", buttons: ["homeMainPage-Btn"] },
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
    try {
      if (this._activeSub === value) return;
      this._activeSub = value;

      f.syncHomePageUI(value);

      const newUrl = `?sub=${value}`;
      window.history.pushState({ sub: value }, "", newUrl);
    } catch (err) {
      f.LogError(`Error setting active subpage: ${err.message}`);
    }
  },
  get activeSub() {
    return this._activeSub;
  },
};

try {
  if (
    window.location.href.endsWith("pages") ||
    window.location.href.endsWith("pages/")
  ) {
    var queryString = window.location.href.endsWith("/")
      ? `home.html?sub=0`
      : `/home.html?sub=0`;
    window.location.assign(queryString);
  }
  document.addEventListener("DOMContentLoaded", () => {
    const collapseBtn = document.getElementById("navCollapse-Btn");
    collapseBtn.addEventListener("click", () => {
      f.toggleCollapse("navCollapse");
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
          f.syncHomePageUI(index);
        });
        const urlParams = new URLSearchParams(window.location.search);
        const initialPage = parseInt(urlParams.get("sub")) || 0;
        homeState._activeSub = initialPage;
        f.syncHomePageUI(initialPage);
        homeState._activeSub =
          f.catchUrlParams(window.location.search, subPageMappings.length) ?? 0;
        break;
      case "rw_reports":
        window.addEventListener("popstate", (ev) => {
          const index = ev.state.sub ?? 0;
          homeState._activeSub = index;
          f.syncHomePageUI(index);
        });
        const reports = f.getReports(2026);
        for (const report of reports) {
          const btn = document.createElement("button");
          btn.textContent = `${report.name} (${report.war_date.month}/${report.war_date.day})`;
          btn.classList.add("w3-button");
          const resultColor = () => {
            switch (report.result) {
              case 1:
                return "w3-red";
              case 2:
                return "w3-green";
              case 3:
                return "w3-blue";
            }
          };
          if (resultColor() != undefined) btn.classList.add(resultColor());
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
              f.LogError(`Error handling button click: ${err}`);
            }
          });
          document.getElementById("reportMenu").appendChild(btn);
        }
        break;
    }
  });
  f.onLoadComplete();
} catch (err) {
  f.LogError(`Error initializing page: ${err.message}`);
}
