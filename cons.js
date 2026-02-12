if (window.location.href.endsWith("pages") || window.location.href.endsWith("pages/")) {
    var queryString = window.location.href.endsWith("/") ? `main.html?sub=0` : `/main.html?sub=0`;
    window.location.assign(queryString);
}