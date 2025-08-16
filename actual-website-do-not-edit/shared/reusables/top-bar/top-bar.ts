
// Define variables for each page
var onAboutUsPage = false;
var onContactPage = false;
var onGalleryPage = false;
var onGetInvolvedPage = false;
var onIndexPage = false;
var onMeetTheTeamPage = false;
var onNewslettersPage = false;
var onWhySocialCircusPage = false;

// Function to update page status variables based on the current URL
function updatePageStatus() {
	console.log("updating the page status")
  // Reset all page variables to false
  onAboutUsPage = onContactPage = onGalleryPage = onGetInvolvedPage = false;
  onIndexPage = onMeetTheTeamPage = onNewslettersPage = onWhySocialCircusPage = false;

  // Get the current URL path
  var path = window.location.pathname;
	console.log("got the path")

  // Set the variable for the current page to true
  if (path.includes('/about-us')) {
	console.log("on the about us page")
    onAboutUsPage = true;
  } else if (path.includes('/contact')) {
    onContactPage = true;
  } else if (path.includes('/gallery')) {
    onGalleryPage = true;
  } else if (path.includes('/get-involved')) {
    onGetInvolvedPage = true;
  } else if (path.includes('/index') || path === '/') {
    onIndexPage = true;
	console.log("on the index page")
  } else if (path.includes('/meet-the-team')) {
    onMeetTheTeamPage = true;
  } else if (path.includes('/newsletters')) {
    onNewslettersPage = true;
  } else if (path.includes('/why-social-circus')) {
    onWhySocialCircusPage = true;
  }
}

// Call the function to set the correct page variable
updatePageStatus();
