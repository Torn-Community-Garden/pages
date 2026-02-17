import { Functions } from "./functions.js";
const f = new Functions();
const currentPage = document.body.dataset.page;
const pageMappings = {
  main: [
    { file: "home.html", buttons: ["homePage-Btn"] },
    { file: "rw_reports.html", buttons: ["repPage-Btn", "repPage-CBtn"] },
  ],
  sub: {
    home: [
      { id: "homeMainPage", buttons: ["homeMainPage-Btn"] },
      { id: "rulesPage", buttons: ["rulesPage-Btn", "rulesPage-CBtn"] },
      {
        id: "calendarPage",
        buttons: ["calendarPage-Btn", "calendarPage-CBtn"],
      },
    ],
  },
};
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
} catch (err) {
  f.LogError(`Error handling page redirection: ${err.message}`);
}

try {
  document.addEventListener("DOMContentLoaded", () => {
    const collapseBtn = document.getElementById("navCollapse-Btn");
    const rmCollapseBtn = document.getElementById("rmCollapse-Btn");
    try {
      collapseBtn.addEventListener("click", () => {
        f.toggleCollapse("navCollapse");
      });
      pageMappings.main.forEach((mapping) => {
        mapping.buttons.forEach((btnId) => {
          const btn = document.getElementById(btnId);
          if (btn)
            btn.addEventListener("click", () => {
              window.location.assign(mapping.file);
            });
        });
      });
    } catch (err) {
      f.LogError(`Error setting up main page buttons: ${err.message}`);
    }
    switch (currentPage) {
      case "home":
        try {
          window.addEventListener("popstate", (ev) => {
            const index = ev.state.sub ?? 0;
            homeState._activeSub = index;
            f.syncHomePageUI(index);
          });
        } catch (err) {
          f.LogError(`Error setting up popstate listener: ${err.message}`);
        }
        try {
          pageMappings.sub.home.forEach((mapping, index) => {
            mapping.buttons.forEach((btnId) => {
              const btn = document.getElementById(btnId);
              if (btn) {
                btn.addEventListener("click", () => {
                  homeState.activeSub = index;
                });
              }
            });
          });
        } catch (err) {
          f.LogError(`Error setting up subpage buttons: ${err.message}`);
        }
        try {
          const urlParams = new URLSearchParams(window.location.search);
          const initialPage = parseInt(urlParams.get("sub")) || 0;
          homeState._activeSub = initialPage;
          f.syncHomePageUI(initialPage);
          homeState._activeSub =
            f.catchUrlParams(
              window.location.search,
              pageMappings.sub.home.length,
            ) ?? 0;
        } catch (err) {
          f.LogError(`Error processing URL parameters: ${err.message}`);
        }
        break;
      case "war":
        try {
          window.addEventListener("popstate", (ev) => {
            const index = ev.state.sub ?? 0;
            homeState._activeSub = index;
            f.syncHomePageUI(index);
          });
          rmCollapseBtn.addEventListener("click", () => {
            f.toggleCollapse("reportMenuCollapse");
          });
        } catch (err) {
          f.LogError(`Error setting up rw_reports page: ${err.message}`);
        }
        try {
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
            document
              .getElementById("reportMenuCollapse")
              .appendChild(btn.cloneNode(true));
          }
        } catch (err) {
          f.LogError(`Error loading reports: ${err.message}`);
        }
        break;
    }
  });
  f.onLoadComplete();
} catch (err) {
  f.LogError(`Error initializing page: ${err.message}`);
}
