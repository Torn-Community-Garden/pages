import { Functions } from "./functions.js";
const f = new Functions();
const currentPage = document.body.dataset.page;
const authState = {
  _user: {
    key: "",
    identity: {
      username: "",
      id: 0,
    },
  },
  _isLoggedIn: false,

  set user(value) {
    this._user = value;

    if (this._user.identity.id != 0) this.isLoggedIn = true;
  },
  get user() {
    return this._user;
  },
  set isLoggedIn(value) {
    this._isLoggedIn = value;
  },
  get isLoggedIn() {
    return this._isLoggedIn;
  },
};
const pageMappings = {
  main: [
    { buttons: ["homePage-Btn"] },
    { buttons: ["warPage-Btn", "warPage-CBtn"] },
    { buttons: ["gntPage-Btn", "gntPage-CBtn"] },
    { buttons: ["abtUsPage-Btn", "abtUsPage-CBtn"] },
  ],
  sub: {
    home: [
      { buttons: ["homeMainPage-Btn"] },
      { buttons: ["newspaperPage-Btn"] },
      { buttons: ["rulesPage-Btn"] },
      { buttons: ["calendarPage-Btn"] },
    ],
  },
};
const collapseBtns = {
  main: ["navCollapse-Btn", "logInCollapse-Btn", "logInClose-Btn"],
  sub: {
    home: ["subCollapse", "subCollapse-Btn"],
    war: ["rmCollapse-Btn", "subCollapse-Btn"],
  },
};
const homeState = {
  _activeSub: 0,
  set activeSub(value) {
    try {
      if (this._activeSub === value) return;
      this._activeSub = value;

      f.syncPageUI(value);

      const newUrl =
        window.location.href.endsWith("pages") ||
        window.location.href.endsWith("pages/")
          ? `index.html?sub=${value}`
          : `?sub=${value}`;
      window.history.pushState({ sub: value, page: currentPage }, "", newUrl);
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
      // Global pageloading
      f.onLoad();
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
              window.location.assign(btn.dataset.main);
            });
        });
      });
    } catch (err) {
      f.LogError(`Error setting up main page buttons: ${err.message}`);
    }

    switch (
      currentPage // Per page loading
    ) {
      case "home":
        try {
          collapseBtns.sub.home.forEach((btnId) => {
            const btn = document.getElementById(btnId);
            if (btn) {
              btn.addEventListener("click", () => {
                f.toggleCollapse(btn.dataset.collapse);
              });
            }
          });
        } catch (err) {
          f.LogError(
            `Error setting up collapse button listener for home: ${err.message}`,
          );
        }
        try {
          window.addEventListener("popstate", (ev) => {
            const index = ev.state.sub ?? 0;
            homeState._activeSub = index;
            f.syncPageUI(index);
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
          homeState._activeSub =
            f.catchUrlParams(
              window.location.search,
              pageMappings.sub.home.length,
            ) ?? 0;
          f.syncPageUI(initialPage);
        } catch (err) {
          f.LogError(`Error processing URL parameters: ${err.message}`);
        } finally {
          f.onLoadComplete();
        }
        break;
      case "war":
        try {
          window.addEventListener("popstate", (ev) => {
            const index = ev.state.sub ?? 0;
            homeState._activeSub = index;
            f.syncPageUI(index);
          });
        } catch (err) {
          f.LogError(`Error setting up war page popstate: ${err.message}`);
        }
        try {
          collapseBtns.sub.war.forEach((btnId) => {
            const btn = document.getElementById(btnId);
            if (btn) {
              btn.addEventListener("click", () => {
                f.toggleCollapse(btn.dataset.collapse);
              });
            }
          });
        } catch (err) {
          f.LogError(`Error setting up war page collapseBtns: ${err.message}`);
        }
        try {
          const reports = f.getReports(2026);
          if (reports === undefined) {
            console.warn("Reports data not found.");
            return;
          }
          const menu = document.getElementById("reportMenu");
          const cMenu = document.getElementById("reportMenuCollapse");
          for (const report of reports) {
            const btn = document.createElement("button");
            btn.textContent = `${report.opponent.name} (${report.war_date.month}/${report.war_date.day})`;
            btn.classList.add("w3-button", "w3-border", "w3-mobile", "");
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
                if (frame)
                  frame.setAttribute("src", `/WarReports/${report.file_name}`);
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

            if (menu) menu.appendChild(btn);
            if (cMenu) cMenu.appendChild(btn.cloneNode(false));
          }
        } catch (err) {
          f.LogError(`Error loading war reports: ${err.message}`);
        } finally {
          f.onLoadComplete();
        }
        break;
      case "guides_tools":
        break;
      case "abtUs":
        break;
    }
  });
} catch (err) {
  f.LogError(`Error initializing page: ${err.message}`);
} finally {
  f.onLoadComplete();
}
