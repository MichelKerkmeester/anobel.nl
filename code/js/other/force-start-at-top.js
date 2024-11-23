// Start at the top of the page on page refresh
history.scrollRestoration = "manual";

window.addEventListener("beforeunload", function () {
  window.scrollTo(0, 0);
});
