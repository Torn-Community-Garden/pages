import reportsData from "./resources/reports.json" with { type: "json" };
import TeApi from "./modules/teApi.js";
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
  },
};

class Functions {
  /**
   * @param {number | null} pageLength
   */
  catchUrlParams(urlSearch, pageLength = null) {
    try {
      const urlParams = new URLSearchParams(urlSearch);
      for (const paramKey of urlParams.keys()) {
        switch (paramKey) {
          case "sub":
            if (!pageLength) return;
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
      const data =
        year === 2026 ? reportsData.reports.y2026 : reportsData.reports.y2025;
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
    try {
      switch (currentPage) {
        case "index":
          pageMappings.sub.home.forEach((page, index) => {
            page.buttons.forEach((btnId) => {
              const btn = document.getElementById(btnId);
              if (btn) {
                const pageElem = document.getElementById(btn.dataset.sub)
                  .children[0];
                const isActive = index === pageIndex;

                if (pageElem) {
                  pageElem.classList.toggle("w3-show", isActive);
                  pageElem.classList.toggle("w3-hide", !isActive);
                }
                if (pageIndex === 0)
                  document
                    .getElementById("homePageBanner")
                    .classList.remove("w3-hide");
                else
                  document
                    .getElementById("homePageBanner")
                    .classList.add("w3-hide");
              }
              this.updateActiveBtnStyle(btn, isActive);
            });
          });
          break;

        default:
          break;
      }
    } catch (err) {
      this.LogError(`Error syncing UI: ${err.message}`);
    }
  }
  /**
   * @param {HTMLButtonElement} btn
   * @param {boolean} isActive
   */
  updateActiveBtnStyle(btn, isActive) {
    try {
      if (isActive) {
        btn.classList.add(
          "w3-text-white",
          "w3-hover-text-white",
          "bean-cornerfold-topright",
          "w3-light-blue",
        );
      } else {
        btn.classList.remove(
          "w3-text-white",
          "w3-hover-text-white",
          "bean-cornerfold-topright",
          "w3-light-blue",
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
  GetTEPrice(userId ,itemId) {
    const te = new TeApi(userId);
    const data = te.PullPrice(itemId);
    return data.data.price;
  }
}
export { Functions };
export default Functions;
