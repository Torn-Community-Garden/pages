import reportsData from "./resources/reports.json" with { type: "json" };
const currentPage = document.body.dataset.page;
const pageMappings = {
  main: [
    { file: "index.html", buttons: ["homePage-Btn"] },
    { file: "war.html", buttons: ["warPage-Btn", "warPage-CBtn"] },
    { file: "guides_tools.html", buttons: ["gntPage-Btn", "gntPage-CBtn"] },
    { file: "aboutus.html", buttons: ["abtUsPage-Btn", "abtUsPage-CBtn"] },
  ],
  sub: {
    home: [
      { id: "homeMainPage", buttons: ["homeMainPage-Btn"] },
      { id: "newspaperPage", buttons: ["newspaperPage-Btn"] },
      { id: "rulesPage", buttons: ["rulesPage-Btn"] },
      {
        id: "calendarPage",
        buttons: ["calendarPage-Btn"],
      },
    ],
  },
};

class Functions {
  catchUrlParams(urlSearch, pageLength) {
    try {
      const urlParams = new URLSearchParams(urlSearch);
      for (const paramKey of urlParams.keys()) {
        switch (paramKey) {
          case "sub":
            const pageParam = urlParams.get("sub");
            if (pageParam) {
              const index = parseInt(pageParam);
              if (index >= 0 && index < pageLength) {
                return index;
              }
            }
            return 0;
          default:
            console.warn(`Unknown URL parameter: ${paramKey}`);
            break;
        }
      }
      return null;
    } catch (err) {
      this.LogError(`Error parsing URL parameters: ${err.message}`);
      return null;
    }
  }
  toggleCollapse(id) {
    try {
      const collapse = document.getElementById(id);
      if (!collapse) return;
      if (!collapse.classList.contains("w3-show")) {
        collapse.classList.add("w3-show");
      } else {
        collapse.classList.remove("w3-show");
      }
    } catch (err) {
      this.LogError(`Error toggling collapse: ${err.message}`);
    }
  }
  getReports(year) {
    try {
      const data = year === 2026 ? reportsData.reports.y2026 : reportsData.reports.y2025;
      if (!data) console.warn("Reports data not found.");
      return data;
    } catch (err) {
      this.LogError(`Error reading reports data: ${err.message}`);
    }
  }
  LogError(message) {
    console.error(message);
    //window.location.assign(`oops.html`);
  }
  syncPageUI(pageIndex) {
    this.onLoad();
    try {
      switch (currentPage) {
        case "home":
          pageMappings.sub.home.forEach((page, index) => {
            const pageElem = document.getElementById(page.id).children[0];
            const isActive = index === pageIndex;

            if (pageElem) {
              pageElem.classList.toggle("w3-show", isActive);
              pageElem.classList.toggle("w3-hide", !isActive);
              if (pageIndex !== 0)
                document
                  .getElementById("homePageBanner")
                  .classList.add("w3-hide");
              else
                document
                  .getElementById("homePageBanner")
                  .classList.remove("w3-hide");
            }
            page.buttons.forEach((btnId) => {
              const btn = document.getElementById(btnId);
              if (btn) this.updateActiveBtnStyle(btn, isActive);
            });
          });
          break;
      }
    } catch (err) {
      this.LogError(`Error syncing UI: ${err.message}`);
    } finally {
      this.onLoadComplete();
    }
  }
  /**
   * @param btn {HTMLButtonElement}
   * @param isActive {boolean}
   */
  updateActiveBtnStyle(btn, isActive) {
    try {
      if (isActive) {
        btn.classList.add(
          "w3-text-white",
          "w3-hover-text-white",
          "bean-cornerfold-topright",
          "w3-orange",
        );
      } else {
        btn.classList.remove(
          "w3-text-white",
          "w3-hover-text-white",
          "bean-cornerfold-topright",
          "w3-orange",
        );
      }
    } catch (err) {
      this.LogError(`Error updating button style: ${err.message}`);
    }
  }
  onLoad() {
    try {
      const loadingModal = document.getElementById("loadingModal");
      if (loadingModal) {
        if (!loadingModal.classList.contains("w3-show")) {
          loadingModal.classList.add("w3-show");
        }
      }
    } catch (err) {
      this.LogError(`Error showing loading modal: ${err.message}`);
    }
  }
  onLoadComplete() {
    try {
      const loadingModal = document.getElementById("loadingModal");
      if (loadingModal) {
        if (loadingModal.classList.contains("w3-show")) {
          loadingModal.classList.remove("w3-show");
        }
      }
    } catch (err) {
      this.LogError(`Error hiding loading modal: ${err.message}`);
    }
  }
}
export { Functions };
export default Functions;
