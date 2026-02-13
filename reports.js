const { Functions } = require("./functions.js");
const subPageMappings = [
    { id: "homePage", buttons: ["homePage-Btn"] },
    { id: "rulesPage", buttons: ["rulesPage-Btn", "rulesPage-CBtn"] },
    { id: "calendarPage", buttons: ["calendarPage-Btn", "calendarPage-CBtn"] }
];

try {
    document.addEventListener("DOMContentLoaded", () =>{
        subPageMappings.forEach((mapping, index) => {
            mapping.buttons.forEach(btnId => {
                const btn = document.getElementById(btnId);
                if (btn) {
                    btn.addEventListener("click", () => {
                        window.location.assign("main.html?sub=" + index);
                    });
                }
            });
        });
        document.getElementById("repPage-Btn").addEventListener("click", () => window.location.assign("rw_reports.html"));
        document.getElementById("repPage-CBtn").addEventListener("click", () => window.location.assign("rw_reports.html"));
        document.getElementById("collapse-Btn").addEventListener("click", () => toggleCollapse("navCollapse"));
        
        
        try {
            const ReportsData = Functions.getReports();
            for (const report of ReportsData.reports[2026]) {
                const btn = document.createElement("button");
                btn.textContent = `${report.name} (${report.war_date.month}/${report.war_date.day})`;
                btn.classList.add("w3-button");
                const resultColor = report.result === 1 ? "w3-red" : report.result === 2 ? "w3-green" : report.result === 3 ? "w3-blue" : null;
                if (resultColor) btn.classList.add(resultColor);
                btn.style.width = "100%";
                btn.addEventListener("click", () => {
                    try {
                        const frame = document.getElementById("repFrame");
                        if (frame) frame.setAttribute("src", report.file_name);
                        const buttons = document.getElementById("reportMenu").getElementsByTagName("button");
                        for (const b of buttons) {
                            b.classList.remove("w3-gray");
                        }
                        btn.classList.add("w3-gray");
                    } catch (err) {
                        Functions.LogError(`Error handling button click: ${err}`);
                    }
                });
                document.getElementById("reportMenu").appendChild(btn);
            }
        } catch (err) {
            Functions.LogError(`Error loading reports data: ${err}`);
        }
    });
    window.addEventListener("load", () =>{document.getElementById("loadingModal").classList.remove("w3-show");});
} catch (err) {
    Functions.LogError("Error initializing reports page:", err);
}