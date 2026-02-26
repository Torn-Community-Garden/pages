import { Functions } from "./functions.js";
const f = new Functions();
const currentPage = document.body.dataset.page;
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
const state = {
  _activeSub: 0,
  _isLoading: false,
  _loadingTimeout: 0,
  set activeSub(value) {
    try {
      if (this._activeSub === value) return;
      this.isLoading = true;
      this._activeSub = value;
      const pageMap = () => {
        switch (currentPage) {
          case "index":
            return pageMappings.sub.home;
          default:
            return [];
        }
      };
      f.syncPageUI(value, pageMap);

      const newUrl =
        window.location.href.endsWith("pages") ||
        window.location.href.endsWith("pages/")
          ? `${currentPage}.html?sub=${value}`
          : `?sub=${value}`;
      window.history.pushState({ sub: value }, "", newUrl);
      this.isLoading = false;
    } catch (err) {
      f.LogError(`Error setting active subpage: ${err.message}`);
    }
  },
  get activeSub() {
    return this._activeSub;
  },
  set isLoading(value) {
    if (value === this._isLoading) return;
    this._isLoading = value;

    if (this.isLoading) {
      f.onLoad();
      this.loadingTimeout = setTimeout(() => {
        throw new Error("Loading timed out. Try again.");
      }, 120000);
    } else {
      if (this.loadingTimeout > 0) clearTimeout(this.loadingTimeout);
      f.onLoadComplete();
    }
  },
  get isLoading() {
    return this._isLoading;
  },
  set loadingTimeout(value) {
    this._loadingTimeout = value;
  },
  get loadingTimeout() {
    return this._loadingTimeout;
  },
};
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

try {
  document.addEventListener("DOMContentLoaded", () => {
    try {
      // Global pageloading
      state.isLoading = true;
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
              window.location.assign(`./${btn.dataset.main}`);
            });
        });
      });
    } catch (err) {
      f.LogError(`Error setting up main page buttons: ${err.message}`);
    }

    switch (
      currentPage // Per page loading
    ) {
      case "index":
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
            state.isLoading = true;
            const index = ev.state.sub ?? 0;
            state._activeSub = index;
            f.syncPageUI(index, pageMappings.sub.home);
            state.isLoading = false;
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
                  state.activeSub = index;
                });
              }
            });
          });
        } catch (err) {
          f.LogError(`Error setting up subpage buttons: ${err.message}`);
        }
        try {
          const s =
            f.catchUrlParams(
              window.location.search,
              pageMappings.sub.home.length,
            ) ?? 0;
          state._activeSub = s;
          f.syncPageUI(s);
        } catch (err) {
          f.LogError(`Error processing URL parameters: ${err.message}`);
        }
        break;
      case "war":
        try {
          window.addEventListener("popstate", (ev) => {
            state.isLoading = true;
            const index = ev.state.sub ?? 0;
            state._activeSub = index;
            f.syncPageUI(index);
            state.isLoading = false;
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
            btn.classList.add("w3-button", "w3-border", "w3-mobile");
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
              state.isLoading = true;
              try {
                const frame = document.getElementById("repFrame");
                if (frame)
                  frame.setAttribute("src", `./WarReports/${report.file_name}`);
                const buttons = document
                  .getElementById("reportMenu")
                  .getElementsByTagName("button");
                for (const b of buttons) {
                  b.classList.remove("w3-gray");
                }
                btn.classList.add("w3-gray");
                state.isLoading = false;
              } catch (err) {
                f.LogError(`Error handling button click: ${err}`);
              }
            });

            if (menu) menu.appendChild(btn);
            if (cMenu) cMenu.appendChild(btn.cloneNode(false));
          }
        } catch (err) {
          f.LogError(`Error loading war reports: ${err.message}`);
        }
        break;
      case "guides_tools":
        break;
      case "abtUs":
        break;
    }
    state.isLoading = false;
  });
} catch (err) {
  f.LogError(`Error initializing page: ${err.message}`);
}
