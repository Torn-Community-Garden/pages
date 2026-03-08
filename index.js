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
const themes = {
  icon: { light: "fa-moon-o", dark: "fa-sun-o" },
  headerBanner: {
    light: "resources/Graphics/graphic_day.svg",
    dark: "resources/Graphics/graphic_night.svg",
  },
  body: { light: "body-light", dark: "body-dark" },
  main: {
    light: ["main-light", "main-light-hover"],
    dark: ["main-dark", "main-dark-hover"],
  },
  sub: { light: "sub-light", dark: "sub-dark" },
  page: { light: "page-light", dark: "page-dark" },
  bdrop: {
    light: "resources/Graphics/backdrop_day.jpg",
    dark: "resources/Graphics/backdrop_night.jpg",
  },
};
const state = {
  _activeSub: 0,
  _isLoading: false,
  _loadingTimeout: 0,
  _theme: "light",
  set activeSub(value) {
    try {
      if (this._activeSub === value) return;
      this.isLoading = true;
      this._activeSub = value;
      f.syncPageUI(value);

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
      }, 30000);
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
  set theme(value) {
    if (this._theme === value) return;
    try {
      this.isLoading = true;
      const toDark = value === "dark";

      if (currentPage === "index" && this.activeSub === 0) {
        const header = document.getElementById("homePageBanner");
        header.children[0].setAttribute(
          "src",
          toDark ? themes.headerBanner.dark : themes.headerBanner.light,
        );
        header.children[1].classList.toggle(themes.main.light[0], !toDark);
        header.children[1].classList.toggle(themes.main.dark[0], toDark);
        const news = document.getElementById("newsPanel");
        const newsC = document.getElementById("newsCPanel");
        news.style.background = news.style.background.replace(
          toDark ? themes.bdrop.light : themes.bdrop.dark,
          toDark ? themes.bdrop.dark : themes.bdrop.light,
        );
        newsC.style.background = newsC.style.background.replace(
          toDark ? themes.bdrop.light : themes.bdrop.dark,
          toDark ? themes.bdrop.dark : themes.bdrop.light,
        );
      }
      document
        .getElementById("theme-Btn")
        .classList.toggle(themes.icon.light, !toDark);
      document
        .getElementById("theme-Btn")
        .classList.toggle(themes.icon.dark, toDark);
      const mains = document.querySelectorAll(
        toDark ? `.${themes.main.light[0]}` : `.${themes.main.dark[0]}`,
      );
      if (mains)
        for (var main of mains) {
          if (main) {
            main.classList.toggle(themes.main.dark[0], toDark);
            main.classList.toggle(themes.main.light[0], !toDark);
          }
        }
      const mainsH = document.querySelectorAll(
        toDark ? `.${themes.main.light[1]}` : `.${themes.main.dark[1]}`,
      );
      if (mainsH)
        for (var mainH of mainsH) {
          if (mainH) {
            mainH.classList.toggle(themes.main.dark[1], toDark);
            mainH.classList.toggle(themes.main.light[1], !toDark);
          }
        }
      const subs = document.querySelectorAll(
        toDark ? `.${themes.sub.light}` : `.${themes.sub.dark}`,
      );
      if (subs)
        for (var sub of subs) {
          if (sub) {
            sub.classList.toggle(themes.sub.dark, toDark);
            sub.classList.toggle(themes.sub.light, !toDark);
          }
        }
      const pages = document.querySelectorAll(
        toDark ? `.${themes.page.light}` : `.${themes.page.dark}`,
      );
      if (pages)
        for (var page of pages) {
          if (page) {
            page.classList.toggle(themes.page.dark, toDark);
            page.classList.toggle(themes.page.light, !toDark);
          }
        }
      const botGrads = document.querySelectorAll(
        toDark ? ".bottom-grad-orange" : ".bottom-grad-blue",
      );
      if (botGrads)
        for (var botGrad of botGrads) {
          if (botGrad) {
            botGrad.classList.toggle("bottom-grad-orange", !toDark);
            botGrad.classList.toggle("bottom-grad-blue", toDark);
          }
        }
      document.body.classList.toggle(themes.body.dark, toDark);
      document.body.classList.toggle(themes.body.light, !toDark);
      document.body.dataset.theme = toDark ? "dark" : "light";
      this._theme = value;
      localStorage.setItem("tcg_theme_cache", value);
      this.isLoading = false;
    } catch (err) {
      console.error("Error loading theme:", err);
    }
  },
  get theme() {
    return this._theme;
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
          if (btn) {
            if (!btn.classList.contains("w3-disabled"))
              btn.addEventListener("click", () => {
                window.location.assign(`./${btn.dataset.main}`);
              });
          }
        });
      });
      const themeCache = localStorage.getItem("tcg_theme_cache");
      if (themeCache) state.theme = themeCache;
      else localStorage.setItem("tcg_theme_cache", state.theme);
      document.getElementById("theme-Btn").addEventListener("click", () => {
        if (document.body.dataset.theme === "light") state.theme = "dark";
        else state.theme = "light";
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
                if (!btn.classList.contains("w3-disabled"))
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
          if (s && s != undefined) {
            state._activeSub = s;
            f.syncPageUI(s);
          }
        } catch (err) {
          f.LogError(`Error processing URL parameters: ${err.message}`);
        }
        try {
          fetch(
            `https://tornexchange.com/api/price?user_id=1759387&item_id=206`,
            {
              headers: { "Content-Type": "application/json" },
            },
          )
            .then((r) => r.json())
            .then((d) => {
              document.getElementById("price-Xanax").innerHTML =
                `$${d.data.price}`;
            });
        } catch (err) {
          f.LogError(`Error updating item price: ${err.message}`);
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
          const cMenu = document.getElementById("rmCollapse");
          for (const report of reports) {
            const btn = document.createElement("button");
            btn.textContent = `(${report.opponent.tag}) ${report.opponent.name} (${report.war_date.month}/${report.war_date.day})`;
            btn.classList.add(
              "w3-button",
              "w3-border-top",
              "w3-border-bottom",
              "w3-mobile",
            );
            const resultColor = () => {
              switch (report.result) {
                case 1:
                  return "grad-loss";
                case 2:
                  return "grad-win";
                case 3:
                  return "grad-draw";
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
