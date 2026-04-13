import { Functions } from "./functions.js";
import { TornApi } from "./modules/tornApi.js";
const f = new Functions();
const tApi = new TornApi();
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
      { buttons: ["homeMainPage-Btn", "homeMainPage-CBtn"] },
      { buttons: ["newspaperPage-Btn", "newspaperPage-CBtn"] },
      { buttons: ["rulesPage-Btn", "rulesPage-CBtn"] },
      { buttons: ["calendarPage-Btn", "calendarPage-CBtn"] },
    ],
    war: [
      { buttons: ["warSPage-Btn", "warSPage-CBtn"] },
      { buttons: ["reportsPage-Btn", "reportsPage-CBtn"] },
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
      console.error(`Error setting active subpage: ${err.message}`);
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
      const hGrads = document.querySelectorAll(
        toDark ? ".h-grad-orange" : ".h-grad-blue",
      );
      if (hGrads)
        for (var hGrad of hGrads) {
          if (hGrad) {
            hGrad.classList.toggle("h-grad-orange", !toDark);
            hGrad.classList.toggle("h-grad-blue", toDark);
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
      // Theme loading
      const themeCache = localStorage.getItem("tcg_theme_cache");
      if (themeCache) state.theme = themeCache;
      else localStorage.setItem("tcg_theme_cache", state.theme);
      document.querySelector("#theme-Btn").addEventListener("click", () => {
        if (document.body.dataset.theme === "light") state.theme = "dark";
        else state.theme = "light";
      });
      // Auth loading
      const keyCache = localStorage.getItem("tcg_key_cache");
      if (keyCache && keyCache !== "") tApi.authenticateUser(keyCache, true);
      else {
        const sessionKeyCache = sessionStorage.getItem("tcg_key_cache");
        if (sessionKeyCache) tApi.authenticateUser(sessionKeyCache, false);
      }
      document.querySelector("#logIn-Btn").addEventListener("click", () => {
        const keyInput = document.querySelector("#keyInput");
        if (keyInput && keyInput.value != "") {
          const persistCheckbox = document.querySelector("#persistCheckbox");
          tApi.authenticateUser(keyInput.value, persistCheckbox.checked);
        } else {
          alert("Please enter a valid API key.");
        }
      });
      document
        .querySelector("#logOut-Btn")
        .addEventListener("click", () => tApi.logoutUser());
    } catch (err) {
      console.error(`Error initializing main UI elements: ${err.message}`);
    }

    switch (
      currentPage // Per page loading
    ) {
      case "index":
        try {
          // Collapses
          collapseBtns.sub.home.forEach((btnId) => {
            const btn = document.getElementById(btnId);
            if (btn) {
              btn.addEventListener("click", () => {
                f.toggleCollapse(btn.dataset.collapse);
              });
            }
          });
        } catch (err) {
          console.error(
            `Error setting up collapse button listener for home: ${err.message}`,
          );
        }
        try {
          // Popstate listener
          window.addEventListener("popstate", (ev) => {
            state.isLoading = true;
            const index = ev.state.sub ?? 0;
            state._activeSub = index;
            f.syncPageUI(index, pageMappings.sub.home);
            state.isLoading = false;
          });
        } catch (err) {
          console.error(`Error setting up popstate listener: ${err.message}`);
        }
        try {
          // Sub buttons
          pageMappings.sub.home.forEach((mapping, index) => {
            mapping.buttons.forEach((btnId) => {
              const btn = document.querySelector(`#${btnId}`);
              if (btn) {
                if (!btn.classList.contains("w3-disabled"))
                  btn.addEventListener("click", () => {
                    state.activeSub = index;
                  });
              }
            });
          });
        } catch (err) {
          console.error(`Error setting up subpage buttons: ${err.message}`);
        }
        try {
          // Query params
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
          console.error(`Error processing URL parameters: ${err.message}`);
        }
        try {
          // Price fetch
          if (tApi.isLoggedIn) {
            tApi.PullData("torn/206/items")
              .then((response) => {
                if (!response.ok) {
                  throw new Error(`API request failed with status ${response.status}`);
                }
                return response.json();
              })
              .then((data) => {
              if (data && !("error" in data)) {
                const priceElem = document.getElementById("price-Xanax");
                const total = Math.round(
                  (data.items[0].value.market_price * 0.97)
                );
                let price = total.toString();
                if (price.length < 7) {
                  for (let i = price.length - 3; i > 0; i -= 3) {
                    price = price.slice(0, i) + "," + price.slice(i); // Add commas for thousands
                  }
                } else {
                  price = (total / 1000000).toFixed(2) + "M"; // Convert to millions with 2 decimal places
                }
                if (priceElem) priceElem.textContent = "$" + price;
              } else {
                document.querySelector("#infoPgph").textContent =
                  "Log in to view current prices.";
                console.info(
                  "Could not fetch item data. Price will not be displayed.",
                );
              }
            });
          } else {
            const priceElem = document.getElementById("price-Xanax");
            if (priceElem) priceElem.textContent = "N/A";
          }
        } catch (err) {
          console.error(`Error updating item price: ${err.message}`);
        }
        break;
      case "war":
        try {
          // Collapses
          collapseBtns.sub.war.forEach((btnId) => {
            const btn = document.getElementById(btnId);
            if (btn) {
              btn.addEventListener("click", () => {
                f.toggleCollapse(btn.dataset.collapse);
              });
            }
          });
        } catch (err) {
          console.error(
            `Error setting up war page collapseBtns: ${err.message}`,
          );
        }
        try {
          // Popstate listener
          window.addEventListener("popstate", (ev) => {
            state.isLoading = true;
            const index = ev.state.sub ?? 0;
            state._activeSub = index;
            f.syncPageUI(index);
            state.isLoading = false;
          });
        } catch (err) {
          console.error(`Error setting up war page popstate: ${err.message}`);
        }
        try {
          // Reports loading
          const reports = f.getReports(2026);
          const menu = document.getElementById("reportMenu");
          const cMenu = document.getElementById("rmCollapse");
          for (const report of reports) {
            if (reports === undefined) {
              console.warn("Reports data not found.");
            }
            const btn = document.createElement("button");
            const p = document.createElement("p");
            const span = document.createElement("span");
            p.textContent = `(${report.opponent.tag}) ${report.opponent.name} (${report.war_date.month}/${report.war_date.day})`;
            span.classList.add(
              `color-${report.result === 1 ? "loss" : report.result === 2 ? "win" : "draw"}`,
              "w3-medium",
              "fa",
              `fa-${report.result < 3 ? "circle" : "adjust"}`,
            );
            p.appendChild(span);
            btn.appendChild(p);
            btn.classList.add("w3-bar-item", "w3-button", "w3-border-top");
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
                console.error(`Error handling button click: ${err}`);
              }
            });
            const cbtn = btn.cloneNode(false);
            cbtn.classList.add(
              `color-${report.result === 1 ? "loss" : report.result === 2 ? "win" : "draw"}`,
            );
            cbtn.textContent = btn.textContent;
            cbtn.addEventListener("click", () => {
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
                console.error(`Error handling button click: ${err}`);
              }
            });

            if (menu) menu.appendChild(btn);
            if (cMenu) cMenu.appendChild(cbtn);
          }
        } catch (err) {
          console.error(`Error loading war reports: ${err.message}`);
        }
        try { // Sub buttons
          pageMappings.sub.war.forEach((mapping, index) => {
            mapping.buttons.forEach((btnId) => {
              const btn = document.querySelector(`#${btnId}`);
              if (btn) {
                if (!btn.classList.contains("w3-disabled"))
                  btn.addEventListener("click", () => {
                    state.activeSub = index;
                  });
              }
            });
          });
        } catch (err) {
          console.error(`Error setting up war subpage buttons: ${err.message}`);
        }
        try {
          // Query params
          const s =
            f.catchUrlParams(
              window.location.search,
              pageMappings.sub.war.length,
            ) ?? 0;
          if (s && s != undefined) {
            state._activeSub = s;
            f.syncPageUI(s);
          }
        } catch (err) {
          console.error(`Error processing URL parameters: ${err.message}`);
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
  console.error(`Error initializing page: ${err.message}`);
}
