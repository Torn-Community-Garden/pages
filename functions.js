import LogFile from "./log.txt" assert { type: "txt" };
export function catchUrlParams(urlSearch, pageLength) {
    try {
    const urlParams = new URLSearchParams(urlSearch);
    for (var paramKey of urlParams.keys()) {
        switch(paramKey) {

            case"sub":
                var pageParam = urlParams.get("sub");
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
        LogError(`Error parsing URL parameters: ${err.message}`);
        return null;
    }
}
export function toggleCollapse(id) {
    try {
    var collapse = document.getElementById(id);
    if (!collapse) return;
    if (collapse.className.indexOf("w3-show") == -1) {
        collapse.className += " w3-show";
    } else {
        collapse.className = collapse.className.replace(" w3-show", "");
    }
    } catch (err) {
        console.error("Error toggling collapse:", err);
    }
}
export function LogError(message) {
    console.error(message);
    const append = `${new Date(Date.now()).toLocaleDateString()} - ${message}\n`;
    try {
        LogFile += append;
    } catch (err) {
        console.error("Error writing to log:", err);
    }
}