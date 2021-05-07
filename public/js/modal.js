$(document).ready(function() {
       
    const overlay = document.querySelector('.modal-overlay')
    overlay.addEventListener('click', toggleModal)
    
    var closemodal = document.querySelectorAll('.modal-close')
    for (var i = 0; i < closemodal.length; i++) {
      closemodal[i].addEventListener('click', toggleModal)
    }
    
    document.onkeydown = function(evt) {
      evt = evt || window.event
      var isEscape = false
      if ("key" in evt) {
    	isEscape = (evt.key === "Escape" || evt.key === "Esc")
      } else {
    	isEscape = (evt.keyCode === 27)
      }
      if (isEscape && document.body.classList.contains('modal-active')) {
    	toggleModal()
      }
    };
    
    
    function toggleModal () {
      const body = document.querySelector('body')
      const modal = document.querySelector('.modal')
      modal.classList.toggle('opacity-0')
      modal.classList.toggle('pointer-events-none')
      body.classList.toggle('modal-active')
    }
    $(".modal-open").click(function(event) {
      window.currentItem = $(event.target).parent();
      // console.log("clicked", currentItem);
      toggleModal();
      var mod = document.querySelector(".modal");
      if (!$(mod).hasClass("mod--show")) {
        let eventID = $(currentItem).attr("data-id")
        mod.eventID = eventID;
        let coverURL = $(currentItem).attr("data-image");
        let title = $(currentItem).attr("data-title");
        let desc = $(currentItem).attr('data-desc');
        let date_time = $(currentItem).attr('data-date_time');

        $("#mod__form_desc").hide();
      
        $("#mod__cover").attr("src", "/image/scout.png");
  
        // Check if the user is already registered for the event
        // and set the function of the button as required
        fetch(`/getregister/${eventID}`).then(function(res) {
          if (res.ok) {
          return res.text();
          } else {
            return "E";
          }
        }).then(function(message) {
          let buttonText;
          if (message == "T") {
  
            // Make the button into a Unregister button
            buttonText = "Unregister";
            $("#regbtn")
              .removeClass("btn-success")
              .addClass("btn-danger")
              .text(buttonText)
              .removeClass("hide");
              if(form_link === "#"){
                $("#mod__form_desc").hide();
              }else{
                $("#mod__form_desc").show();
              }
           
          } else {
  
            // Make the button into a Register button
            buttonText = "Register";
            $("#regbtn")
              .removeClass("btn-danger")
              .addClass("btn-success")
              .text(buttonText)
              .removeClass("hide");
              $("#mod__form_desc").hide();
          }
        });
  
  
        // Add a cover image, title and description to the modal
        $("#mod__cover").attr("src", coverURL);
        $("#mod__title").text(title);
        $("#mod__desc").text(desc);
        $("#mod__date_time_venue").html(`<strong>Time :</strong> ${date_time}`);
  
        if(rule_link === '#'){
          $("#mod__rule_desc").hide();
        }else{
          $("#mod__rule_desc").show();
          $("#mod__rule_link").attr("target","_blank");
        } 
        if(form_link === '#'){
          $("#mod__form_desc").hide();
        }else{
          $("#mod__form_link").attr("target","_blank");
        }
        $('#downloadbtn').click(function(){
          if(rule_link === '#'){
            Toast.fire({
              icon: "info",
              title: "Sorry, Rules are not available yet."
            });
          }
        });
        $('#formbtn').click(function(){
          if(rule_link === '#'){
            Toast.fire({
              icon: "info",
              title: "Sorry, Forms are not available yet."
            });
          }
        });
      } else {
        // When the modal closes, remove both classes and hide the button
        $("#regbtn").removeClass("btn-success").removeClass("btn-danger").addClass("hide");
  
        // Empty the title and description
        $("#mod__title").text("Loading...");
        $("#mod__desc").text("");
        $("#mod__date_time_venue").html("<strong>Slot :</strong> Loading...  <strong>Venue :</strong> Loading..." );
      }
  
      // Show the modal
      $(mod).toggleClass("mod--show");
      $("body").toggleClass("hide-overflow");
    });
  
    $(".overlay").click(function() {
      $(mod).toggleClass("mod--show");
      $("body").toggleClass("hide-overflow");
      $("#regbtn").addClass("hide");
  
  
      $("#regbtn").removeClass("btn-success").removeClass("btn-danger");
      $("#mod__title").text("Loading...");
      $("#mod__desc").text("");
      $("#mod__date_time_venue").html("<strong>Slot :</strong> Loading...  " );
    });
  
    $(".mod__close").click(function() {
      $(mod).toggleClass("mod--show");
      $("body").toggleClass("hide-overflow");
      $("#regbtn").addClass("hide");
  
  
      $("#regbtn").removeClass("btn-success").removeClass("btn-danger").addClass("hide");
  
        $("#mod__title").text("Loading...");
        $("#mod__desc").text("");
        $("#mod__date_time_venue").text("<strong>Slot :</strong> Loading... " );
    });
  
    $("#regbtn").click(function() {
  
      // Disable the button after it is clicked
      // $("#regbtn").attr("disabled", true);
      $("#regbtn")
        .addClass("hide")
        .removeClass("btn-success")
        .removeClass("btn-danger");
      $("#mod__form_desc").hide();
      if ($("#regbtn").text() == "Register") {
  
        // If the button says Register
        // make a GET request to the register route
        fetch(`/register/${mod.eventID}`).then(function(res) {
          if (res.ok) {
            return res.text();
            } else {
              return "E";
            }
        })
        .then(function(data) {
  
          if (data == "T") { // If Registered successfully
  
            let form_link = $(currentItem).attr('data-form_link');
            // Change text to Unregister
            $("#regbtn").text("Unregister");
            $("#regbtn").addClass("btn-danger");
            if(form_link === "#"){
              $("#mod__form_desc").hide();
            }else{
              $("#mod__form_desc").show();
            }
            
          } else {
            // Change text back to Register
            $("#regbtn").text("Register");
            $("#regbtn").addClass("btn-success");
            $("#mod__form_desc").hide();
          }
  
          if (data == "E") {
            // Close the modal
            $(mod).toggleClass("mod--show");
            $("body").toggleClass("hide-overflow");
            // Notify errors
            Toast.fire({
              icon: "info",
              title: "Sorry, we couldn't do that. Please reload the page."
            });
  
          }
  
          // Enable the button
          $("#regbtn").attr("disabled", false);
          $("#regbtn").removeClass("hide");
  
        })
      } else if ($("#regbtn").text() == "Unregister") {
  
        // If the button says Unregister
        // make a GET request to the unregister route
        fetch(`/unregister/${mod.eventID}`).then(function(res) {
  
          if (res.ok) {
            return res.text();
            } else {
              return "E";
            }
        }).then(function(data) {
  
          if (data == "T") { // If Unregistered successfully
  
            // Change text to Register
            $("#regbtn").text("Register");
            $("#regbtn").addClass("btn-success");
            $("#mod__form_desc").hide();
          } else {
            // Change text back to Unregister
            $("#regbtn").text("Unregister");
            $("#regbtn").addClass("btn-danger");
            $("#mod__form_desc").hide();
          }
  
          if (data == "E") {
            // Close the modal
            $(mod).toggleClass("mod--show");
            $("body").toggleClass("hide-overflow");
            // Notify errors
            Toast.fire({
              icon: "info",
              title: "Sorry, we couldn't do that. Please reload the page."
            });
          }
  
          // Enable the button
          $("#regbtn").attr("disabled", false);
          $("#regbtn").removeClass("hide");
        })
      }
    });
  });