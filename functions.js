const fs = require("fs");
if (!fs) console.warn("File system module not available. Error logging to file will be disabled.");
export class Functions {
    catchUrlParams(urlSearch, pageLength) {
        try {
            const urlParams = new URLSearchParams(urlSearch);
            for (const paramKey of urlParams.keys()) {
            switch(paramKey) {

                case"sub":
                    const pageParam = urlParams.get("sub");
                    if (pageParam) {
                        const index = parseInt(pageParam);
                        if (index >= 0 && index < pageLength) {
                            return index;
                        }
                    }
                break;
                default:
                    console.warn(`Unknown URL parameter: ${paramKey}`);
                    break;
            }
        }
        return 0;
        } catch (err) {
            this.LogError(`Error parsing URL parameters: ${err.message}`);
            return null;
        }
    }
    toggleCollapse(id) {
        try {
        const collapse = document.getElementById(id);
        if (!collapse) return;
        if (collapse.classList.contains("w3-show")) {
            collapse.classList.add("w3-show");
        } else {
            collapse.classList.remove("w3-show");
        }
        } catch (err) {
            this.LogError(`Error toggling collapse: ${err.message}`);
        }
    }
    getReports() {
        try {
            if (typeof fs === "undefined") throw new Error("File system module not available. Couldn't read reports data.");
            const stream = fs.createReadStream("reports.json", { encoding: "utf-8"});
            const data = JSON.parse(stream.read());
            return data;
        } catch (err) {
            this.LogError(`Error reading reports data: ${err.message}`);
            return null;
        }
    }
    LogError(message) {
        console.error(message);
        if (typeof fs === "undefined") return;
        const stream = fs.createWriteStream("log.txt", { flags: "a"})
        const string = `${new Date(Date.now()).toISOString()} - ${message}\n`;
        try {
            stream.write(string);
        } catch (err) {
            console.warn("Error writing to log:", err);
        } finally {
            stream.end();
        }
    }
}