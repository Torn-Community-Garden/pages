import reportsData from "./resources/reports.json" with { type: "json" };
import fs from "fs";
const currentPage = document.body.dataset.page;
const subPageMappings = [
  { id: "homePage", buttons: ["homePage-Btn"] },
  { id: "rulesPage", buttons: ["rulesPage-Btn", "rulesPage-CBtn"] },
  { id: "calendarPage", buttons: ["calendarPage-Btn", "calendarPage-CBtn"] },
];

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
    const reportsData = new RWReports(year);
    try {
      if (!reportsData || !reportsData.Reports)
        throw new Error("Reports data not found.");
      return reportsData;
    } catch (err) {
      this.LogError(`Error reading reports data: ${err.message}`);
    }
  }
  LogError(message) {
    console.error(message);
    if (typeof fs === "undefined") return;
    const stream = fs.createWriteStream("log.txt", { flags: "a" });
    try {
      const d = new Date(Date.now()).toISOString().split("T");
      const date = `${d[0]} ${d[1].split(".")[0]}`;
      const dateString = `${date} - ${message}\n`;
      stream.write(dateString);
    } catch (err) {
      console.warn("Error writing to log:", err);
    } finally {
      stream.end();
    }
  }
  syncHomePageUI(pageIndex) {
    this.onLoad();
    if (currentPage !== "home") return;
    try {
      subPageMappings.forEach((page, index) => {
        const pageElem = document.getElementById(page.id).children[0];
        const isActive = index === pageIndex;

        if (pageElem) {
          pageElem.classList.toggle("w3-hide", !isActive);
          if (pageIndex !== 0 && isActive)
            document.getElementById("homePageBanner").classList.add("w3-hide");
          else if (pageIndex === 0 && isActive)
            document
              .getElementById("homePageBanner")
              .classList.remove("w3-hide");
        }
        page.buttons.forEach((btnId) => {
          const btn = document.getElementById(btnId);
          if (btn) updateActiveBtnStyle(btn, isActive);
        });
      });
      document.getElementById("navCollapse").classList.remove("w3-show");
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
    const loadingModal = document.getElementById("loadingModal");
    if (loadingModal) {
      if (!loadingModal.classList.contains("w3-show")) {
        loadingModal.classList.add("w3-show");
      }
    }
  }
  onLoadComplete() {
    const loadingModal = document.getElementById("loadingModal");
    if (loadingModal) {
      if (loadingModal.classList.contains("w3-show")) {
        loadingModal.classList.remove("w3-show");
      }
    }
  }
}
export { Functions };
export default Functions;
class RWReports {
  #f = new Functions();
  Reports = [];
  constructor(year) {
    this.Reports = this.loadReports(year);
  }
  loadReports(year) {
    try {
      this.#f.onLoad();
      const data = JSON.parse(reportsData);
      const reports = data.reports[year];
      if (!reports) throw new Error(`No reports found for year ${year}`);
      let load = [];
      for (const report of reports) {
        load.push({
          file_name: report.file_name,
          result: report.result,
          opponent: {
            name: report.opponent.name,
            tag: report.opponent.tag,
          },
          war_date: {
            month: report.war_date.month,
            day: report.war_date.day,
          },
        });
      }
      return load;
    } catch (err) {
      this.#f.LogError(`Error loading reports: ${err.message}`);
      return [];
    } finally {
      this.#f.onLoadComplete();
    }
  }
}
