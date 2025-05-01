// Automatically change copyright year
document.querySelectorAll('.copyright--year').forEach((element) => {
  element.textContent = new Date().getFullYear(); // Update the text content of each element
});
