function toggleMenu() {
  let menu = document.getElementById("mob-menu");
  if (menu.classList.contains("hidden")) {
    menu.classList.remove("hidden");
    menu.classList.add("block");
  } else {
    menu.classList.remove("block");
    menu.classList.add("hidden");
  }
}
function sendEmail() {
  window.location = "mailto:cet.sac.zairza@gmail.com";
}
const isHidden = [true, true, true];
const sections = [0, 1, 1, 2, 3, 3, 4, 4, 5, 6];

$(document).ready(function () {
  $("#mob-menu li").on("click", function () {
    if ($("#mob-menu").hasClass("hidden")) {
      $("#mob-menu").removeClass("hidden").addClass("block");
      $(".menu").toggleClass("opened");
    } else {
      $("#mob-menu").removeClass("block").addClass("hidden");
      $(".menu").toggleClass("opened");
    }
  });


  const navSectionMap = [1, 2, 4, 5, 7, 9, 10];
  $("#mob-menu li").each((index, element) => {
    $(element).click(() => fullpage_api.moveTo(navSectionMap[index]));
  });

    function updateTimer() {
      future  = Date.parse("May 14, 2021 10:30:00");
      now     = new Date();
      diff    = future - now;
      days  = Math.floor( diff / (1000*60*60*24) );
      hours = Math.floor( diff / (1000*60*60) );
      mins  = Math.floor( diff / (1000*60) );
      secs  = Math.floor( diff / 1000 );
      d = days;
      h = hours - days  * 24;
      m = mins  - hours * 60;
      s = secs  - mins  * 60;

      d = days;
      h = hours - days  * 24;
      m = mins  - hours * 60;
      s = secs  - mins  * 60;
      if(diff<0){
       d=0;
       h=0;
       m=0;
       s=0; 
      }
      document.getElementById("timer")
        .innerHTML =
          '<div>' + d + '<span class="px-4 sm:px-2">days</span></div>' +
          '<div>' + h + '<span class="px-4 sm:px-2">hours</span></div>' +
          '<div>' + m + '<span class="px-4 sm:px-2">minutes</span></div>' +
          '<div>' + s + '<span class="px-4 sm:px-2">seconds</span></div>' ;
    }   
    setInterval(updateTimer, 1000 );
});
