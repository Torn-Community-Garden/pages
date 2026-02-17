if (
  window.location.href.endsWith("pages") ||
  window.location.href.endsWith("pages/")
) {
  var queryString = window.location.href.endsWith("/")
    ? `home.html?sub=0`
    : `/home.html?sub=0`;
  window.location.assign(queryString);
}