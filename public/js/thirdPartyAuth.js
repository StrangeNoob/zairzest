// Auth popup
const request = window.location.href.split("#")[1];

if (request === "signup") {
  request_message = "signed up";
} else {
  request_message = "signed in";
}

