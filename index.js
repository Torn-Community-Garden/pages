import { Functions } from "./functions.js";
const f = new Functions();
const currentPage = document.body.dataset.page;
const pageMappings = {
  main: [
    { file: "home.html", buttons: ["homePage-Btn"] },
    { file: "rw_reports.html", buttons: ["repPage-Btn", "repPage-CBtn"] },
    { file: "guides_tools.html", buttons: ["gntPage-Btn", "gntPage-CBtn"] },
    { file: "aboutus.html", buttons: ["abtUsPage-Btn", "abtUsPage-CBtn"] },
  ],
  sub: {
    home: [
      { id: "homeMainPage", buttons: ["homeMainPage-Btn"] },
      { id: "newspaperPage", buttons: ["newspaperPage-Btn"] },
      { id: "rulesPage", buttons: ["rulesPage-Btn"] },
      { id: "calendarPage", buttons: ["calendarPage-Btn"] },
    ],
  },
};
const collapseBtns = {
  main: [
    "navCollapse-Btn",
    "logIn-Btn",
  ],
  sub: {
    war: [
      "rmCollapse-Btn",
    ]
  }
};
const homeState = {
  _activeSub: 0,
  set activeSub(value) {
    try {
      if (this._activeSub === value) return;
      this._activeSub = value;

      f.syncHomePageUI(value);

      const newUrl = window.location.href.endsWith("pages") 
        || window.location.href.endsWith("pages/")
        ? `index.html?sub=${value}` : `?sub=${value}`;
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
  document.addEventListener("DOMContentLoaded", () => {
    try {
      collapseBtns.main.forEach((btnId) => {
        const btn = document.getElementById(btnId);
        if (btn) {
          btn.addEventListener("click", () => {
            f.toggleCollapse(btn.dataset.collapse);
          });
        }
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
          collapseBtns.sub.war.forEach((btnId) => {
            const btn = document.getElementById(btnId);
            if (btn) {
              btn.addEventListener("click", () => {
                f.toggleCollapse(btn.dataset.collapse);
              });
            }
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
      case "guides_tools":
        break;
      case "abtUs":
        break;
    }
  });
  f.onLoadComplete();
} catch (err) {
  f.LogError(`Error initializing page: ${err.message}`);
}
