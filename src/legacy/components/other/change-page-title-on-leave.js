// Change Page Title on Leave
const documentTitleStore = document.title;
const documentTitleOnBlur = '🚢 Mis de boot niet';

// Set original title if user is on the site
window.addEventListener('focus', () => {
  document.title = documentTitleStore;
});

// If user leaves tab, set the alternative title
window.addEventListener('blur', () => {
  document.title = documentTitleOnBlur;
});
