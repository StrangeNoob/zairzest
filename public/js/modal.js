$(document).ready(function () {
  function validate(id, res) {
    setTimeout(function () {
      $(`#${id}`).removeClass("onclic");
      // console.log(res);
      if (res.status == "success") {
        callback(id, res);
        // $(`#${id}`).addClass("validate-success", 450, callback(id, res));
      } else {
        callback(id, res);
        // $(`#${id}`).addClass("validate-fail", 450, callback(id, res));
      }
    }, 2250);
  }

  function clickDisable(id,value){
    $(`#${id}`).attr('disabled',value);
  }

  function callback(id, res) {
    clickDisable(id,false);
    if (res.status == "success") {
      if (id == "unreg-btn") {
        $("#unreg-btn").hide();
      } else {
        $("#join-team-form").hide();
        $("#create-team-form").hide();
        $("#create-singlereg-form").hide();
        $("#teamreg-btn").hide();
        $("#joinreg-btn").hide();
        $("#unreg-btn").show();
      }
      let msg =
        id == "create-team-btn"
          ? "Team Created Successfully"
          : id == "join-team-btn"
          ? "Team Joined Successfully"
          : id =="singlereg-btn"
          ? "Registered Successfully"
          : "Unregistred Successfully";
      showToast(200, msg);
      // $(`#${id}`).removeClass("validate-success");
      toggleModal();
      // console.log($(`#${$("#mod__desc").data("eventID")}`), "triiger it ");
      $(`#${$("#mod__desc").data("eventID")} > img`).get(0).click();
    } else {
      showToast(
        res.responseJSON.errorCode,
        res.responseJSON.message ||
          "Sorry, There seems to be a problem at our end"
      );
      // $(`#${id}`).removeClass("validate-fail");
    }
  }

  const overlay = document.querySelector(".modal-overlay");
  overlay.addEventListener("click", toggleModal);

  var closemodal = document.querySelectorAll(".modal-close");
  for (var i = 0; i < closemodal.length; i++) {
    closemodal[i].addEventListener("click", toggleModal);
  }

  document.onkeydown = function (evt) {
    evt = evt || window.event;
    var isEscape = false;
    if ("key" in evt) {
      isEscape = evt.key === "Escape" || evt.key === "Esc";
    } else {
      isEscape = evt.keyCode === 27;
    }
    if (isEscape && document.body.classList.contains("modal-active")) {
      toggleModal();
    }
  };

  function toggleModal() {
    const body = document.querySelector("body");
    const modal = document.querySelector(".modal");
    modal.classList.toggle("opacity-0");
    modal.classList.toggle("pointer-events-none");
    body.classList.toggle("modal-active");
    body.classList.toggle("overflow-hidden");
    modal.classList.toggle("mod--show");
    if (!$("body").hasClass("modal-active")) {
      window.location.hash = "";
      
      $("#teamreg-btn").hide();
      $("#joinreg-btn").hide();
      $("#unreg-btn").hide();
      $("#singlereg-btn").hide();
      $("#mod__title").text("Loading...");
      $("#mod__desc").text("");
      $("#mod__date_time_venue").html("<strong>Slot :</strong> Loading... ");
      $(`#mod_team-details`).text("");
      $("#join-team-form").hide();
      $("#create-team-form").hide();
      $(".modal-content").removeClass("valo-game");
    } else {
      window.location.hash = $("#mod__desc").data("eventID");
    }
  }

  $(".modal-open").off('click');
  $(".modal-open").click(function (event) {
    window.currentItem = $(event.target).parent();
    console.log("clicked", currentItem);
    toggleModal();
    var mod = document.querySelector(".modal");
    if ($("body").hasClass("modal-active")) {
      $("#spinner-id").show();
      let eventID = $(currentItem).attr("data-id");
      mod.eventID = eventID;
      let coverURL = $(currentItem).attr("data-image");
      let title = $(currentItem).attr("data-title");
      let desc = $(currentItem).attr("data-desc");
      let date_time = $(currentItem).attr("data-date_time");
      let max_participants = $(currentItem).attr("data-max_participants");
      let isListed = $(currentItem).attr("data-isListed");
      let extra_data = $(currentItem).attr("data-extra_data");
      let team_extra_data = $(currentItem).attr("data-team_extra_data");

      $("#mod__desc").data("eventID",eventID);
      $("#mod__form_desc").hide();

      $("#mod__cover").attr("src", "/image/eventcomingsoon.jpeg");

      // Check if the user is already registered for the event
      // and set the function of the button as required

      if (isListed == "true") {
        $("#loader").show();
        fetch(`/getRegistrationData/${eventID}`)
          .then(function (res) {
            if (res.ok) {
              return res.json();
            } else {
              return { registered: false };
            }
          })
          .then(function (message) {
            // console.log(message);
            $("#loader").hide();
            if (message.data.registered == true) {
              // Make the button into a Unregister button
              if (max_participants != 1) {
                var insertHTML =
                  "<h1 class='text-black-800 lg:text-xl text-lg'>Team Leader must share <b> Team Code/Id</b> with their respective Team members.Futher Information will be notified through Mail </h1>";
                insertHTML += `<h1 class='text-black-800 lg:text-xl text-lg' ><strong>Team Id : ${message.data.team_id}</strong><br>`;
                insertHTML += `<strong>Team Name : ${message.data.team_name}</strong><br><h1>`;
                insertHTML += `<ol><strong>Team Members :</strong>`;
                message.data.members.forEach((element) => {
                  insertHTML += `<li>${element} <li>`;
                });
                insertHTML += `</ol>`;
                if (
                  message.data.team_extra_data &&
                  message.data.team_extra_data.length != 0
                ) {
                  insertHTML += `<ol><strong>Extra Details : </strong>`;
                  Object.keys(message.data.team_extra_data).forEach(function (
                    key,
                    index
                  ) {
                    insertHTML += `<li>${key} : ${message.data.team_extra_data[key]} <li>`;
                  });
                  insertHTML += `</ol>`;
                }
                $(`#mod_team-details`).html(insertHTML);
              }
              $("#unreg-btn").show();
            } else {
              // console.log(max_participants);
              if (moment(Date.now()) < (moment(date_time, "DD-MM-YYYY hh:mm:ss"))) {
                if (max_participants == 1) {
                  showSingleRegForm();
                } else {
                  $("#teamreg-btn").show();
                  $("#joinreg-btn").show();
                }
              } else {
                var insertHTML =
                  "<h1 class='text-red-500 lg:text-xl text-lg mx-auto font-bold'>Registration is closed.</h1>";
                $(`#mod_team-details`).html(insertHTML);
              }
            }
          });
      } else {
          var insertHTML =
                  "<h1 class='text-red-500 lg:text-xl text-lg mx-auto font-bold'>Event registration will begin soon.</h1>";
                $(`#mod_team-details`).html(insertHTML);
      }

      // Add a cover image, title and description to the modal
      $("#mod__cover").attr("src", coverURL);
      $("#mod__title").text(title);
      $("#mod__desc").html(desc);
      $("#mod__date_time_venue").html(
        `<strong>Date & Time :</strong> ${date_time} IST`
      );
      
      function showSingleRegForm(){
        // console.log("hey");
        $("#create-singlereg-form").show();
        var insertHTML = `<div class="flex flex-col items-center">`;
        if(extra_data != ""){
          // console.log("havda-228");
          extra_data.split(',').forEach((element) => {
            ele=element.replaceAll(" ","-");
            // console.log(ele);
            insertHTML += `<input
                            class="w-full px-8 py-4 rounded-lg mt-4 font-medium bg-white border-none placeholder-gray-500 text-sm focus:outline-none bg-white focus:bg-white"
                            type="text"
                            id="create-single-${ele}"
                            placeholder="Enter your ${element}"
                            required
                          />`;
          });
        }
        insertHTML += `<button id="singlereg-btn" class="mt-5 tracking-wide font-semibold register-btn text-gray-100 hover:text-white w-full py-4 rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                              Register
                        </button>
                        </div>`;
        // console.log(insertHTML);
        $("#create-singlereg-form").html(insertHTML);

        $("#singlereg-btn").off('click');
        $("#singlereg-btn").click(function () {
          clickDisable("singlereg-btn",true);
          let post_extra_data = {};
          let post_extra_data_empty = false;
          if(extra_data != ""){
            // console.log("havda-228");
            post_extra_data_empty = true;
            extra_data.split(',').forEach((element)=>{
              ele=element.replaceAll(" ","-");
              if($(`#create-${ele}`).val() != ""){
                post_extra_data[`${element}`]=$(`#create-single-${ele}`).val()
              }else{
                showToast(400,`All ${element} is required.`);
                clickDisable("singlereg-btn",false);
                post_extra_data_empty = fasle;
                return;
              }    
            });
          }
          if(moment(Date.now()) > (moment(date_time, "DD-MM-YYYY hh:mm:ss"))){
            showToast(400, "Registration Time is Over.");
          } else if(extra_data != "" && !post_extra_data_empty){
              showToast(400, "All fields are required ");
          }  
         else {
            $("#singlereg-btn").addClass("onclic",50);
            const data = {
                eventID: eventID,
                extra_data: post_extra_data,
              };
  
              $.ajax({
                type: "POST",
                url: `/registerForEvent/${eventID}`,
                data: data,
                dataType: "json",
              })
                .done(function (data) {
                  validate("singlereg-btn", data);
                })
                .fail(function (err) {
                  validate("singlereg-btn", err);
                });
          }
        });

      }
     
      $("#teamreg-btn").off('click');
      $("#teamreg-btn").click(function () {
        $("#teamreg-btn").hide();
        $("#joinreg-btn").hide();
        let count =1;
        var insertHTML = `<div class="flex flex-col items-center">`;
        insertHTML += `<input
                              class="w-full px-8 py-4 rounded-lg font-medium bg-white border-none placeholder-gray-500 text-sm focus:outline-none bg-white focus:bg-white"
                              type="text"
                              id="create-team-name"
                              placeholder="Enter Team name"
                              required
                            />`;
        // console.log(extra_data);
        // console.log(team_extra_data);
        if(extra_data != ""){
          extra_data.split(',').forEach((element) => {
            ele=element.replaceAll(" ","-");
            // console.log(ele);
            insertHTML += `<input
                            class="w-full px-8 py-4 rounded-lg mt-4 font-medium bg-white border-none placeholder-gray-500 text-sm focus:outline-none bg-white focus:bg-white"
                            type="text"
                            id="create-${ele}"
                            placeholder="Enter your ${element}"
                            required
                          />`;
            count++;
          });
        }
        if(team_extra_data != ""){
          team_extra_data.split(',').forEach((element) => {
            ele=element.replaceAll(" ","-");
            // console.log(ele);
            insertHTML += `<input
                            class="w-full px-8 py-4 mt-4 rounded-lg font-medium bg-white border-none placeholder-gray-500 text-sm focus:outline-none bg-white focus:bg-white"
                            type="text"
                            id="create-${ele}"
                            placeholder="Enter Team's ${element}"
                            required
                          />`;
            count++;
          });
        }
        insertHTML += `<button
                            id="create-team-btn"
                            class="mt-5 tracking-wide font-semibold register-btn text-gray-100 hover:text-white w-full py-4 rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                            > Create Team</button>
                      </div>`;
          count++;
        if(count > 6){
          $(".modal-content").addClass("valo-game");
        }  
        $("#create-team-form").html(insertHTML);
        $("#create-team-form").show();

        $("#create-team-btn").off('click');
        $("#create-team-btn").click(function () {
          // console.log("-226");
          clickDisable("create-team-btn",true);
          if (moment(Date.now()) < (moment(date_time, "DD-MM-YYYY hh:mm:ss"))){
            var teamName = $("#create-team-name").val();
            var post_extra_data={};
            var post_team_extra_data={};
            let post_extra_data_empty = false;
            let post_team_extra_data_empty = false;
           
            if(extra_data != ""){
              post_extra_data_empty = true;  
              extra_data.split(',').forEach((element)=>{
                ele=element.replaceAll(" ","-");
                console.log($(`#create-${ele}`).val())
                if($(`#create-${ele}`).val() != ""){
                  post_extra_data[`${element}`]=$(`#create-${ele}`).val()
                }else{
                  showToast(400,`All ${element} is required.`);
                  clickDisable("create-team-btn",false);
                  post_extra_data_empty =false;
                  return;
                }    
              });
            }
            if(team_extra_data != ""){
              post_team_extra_data_empty = true;
              team_extra_data.split(',').forEach((element) => {
                ele=element.replaceAll(" ","-");
                console.log($(`#create-${ele}`).val())
                if($(`#create-${ele}`).val() != ""){
                  post_team_extra_data[`${element}`]=$(`#create-${ele}`).val();
                }else{
                  showToast(400,`All ${element} is required.`);
                  clickDisable("create-team-btn",false);
                  post_team_extra_data_empty =false;
                  return;
                }
              });
            }
            console.log(`post_extra_data_empty = ${post_extra_data_empty}`)
            console.log(`post_team_extra_data_empty = ${post_team_extra_data_empty}`)
            if (teamName === "") {
              showToast(400, "Team Name Should not be empty");
              clickDisable("create-team-btn",false);
            } else if (extra_data != "" && !post_extra_data_empty){
              showToast(400, "All fields are required ");
            }else if(team_extra_data != "" && !post_team_extra_data_empty){
              showToast(400, "All fields are required ");
            } else {
              $(`#create-team-btn`).addClass("onclic", 50);
              const data = {
                eventID: eventID,
                team_name: teamName,
                team_extra_data:post_team_extra_data,
                extra_data: post_extra_data,
              };
  
              $.ajax({
                type: "POST",
                url: `/registerForEvent/${eventID}`,
                data: data,
                dataType: "json",
              })
                .done(function (data) {
                  validate("create-team-btn", data);
                })
                .fail(function (err) {
                  validate("create-team-btn", err);
                });
            }
          } else {
            showToast(400, "Registration Time is Over.");
          }
        });
      });


      $("#joinreg-btn").off('click');
      $("#joinreg-btn").click(function () {
        $("#teamreg-btn").hide();
        $("#joinreg-btn").hide();
        var insertHTML = `<div class="flex flex-col items-center">`;
        insertHTML += `<input
                              class="w-full px-8 py-4 rounded-lg font-medium bg-white border-none placeholder-gray-500 text-sm focus:outline-none bg-white focus:bg-white"
                              type="text"
                              id="join-team-code"
                              placeholder="Enter Team ID"
                              required
                            />`;
        if(extra_data != ""){
          extra_data.split(',').forEach((element) => {
            ele=element.replaceAll(" ","-");
            insertHTML += `<input
                            class="w-full px-8 py-4 rounded-lg mt-4 font-medium bg-white border-none placeholder-gray-500 text-sm focus:outline-none bg-white focus:bg-white"
                            type="text"
                            id="join-${ele}"
                            placeholder="Enter ${element}"
                            required
                          />`;
          });
        }
        insertHTML += `<button
                        id="join-team-btn"
                        class="mt-5 tracking-wide font-semibold register-btn text-gray-100 hover:text-white w-full py-4 rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                        > Join Team</button>`;
        $("#join-team-form").html(insertHTML);
        $("#join-team-form").show();

        $("#join-team-btn").off('click');
        $("#join-team-btn").click(function () {
          var team_id = $("#join-team-code").val();
          var post_extra_data={};
          let post_extra_data_empty = false;
          if(extra_data != ""){
            post_extra_data_empty= true;
            extra_data.split(',').forEach((element)=>{
              ele=element.replaceAll(" ","-");
              if($(`#join-${ele}`).val() != ""){
                post_extra_data[`${element}`]=$(`#join-${ele}`).val()
              }else{
                showToast(400,`All ${element} is required.`);
                clickDisable("create-team-btn",false);
                post_extra_data_empty= false;
                return;
              }  
          });
          }
          if (moment(Date.now()) > (moment(date_time, "DD-MM-YYYY hh:mm:ss"))){
            showToast(400, "Registration Time is Over.");
          } else if (team_id === "") {
            showToast(400, "Team ID Should not be empty");
            clickDisable("create-team-btn",false);
          } else if(extra_data != "" && !post_extra_data_empty){
            showToast(400, "All fields are required ");
          } else {
            $(`#join-team-btn`).addClass("onclic", 50);
            const data = {
              eventID: eventID,
              team_id: team_id,
              extra_data: post_extra_data,
            };
            $.ajax({
              type: "POST",
              url: `/registerForEvent/${eventID}`,
              data: data,
              dataType: "json",
            })
              .done(function (data) {
                validate("join-team-btn", data);
              })
              .fail(function (err) {
                validate("join-team-btn", err);
              });
          } 
        });
      });

      $("#unreg-btn").off("click");
      $("#unreg-btn").click(function () {
        clickDisable("unreg-btn",true);
        $(`#unreg-btn`).addClass("onclic", 50);
        $.ajax({
          type: "POST",
          url: `/deregisterForEvent/${eventID}`,
          dataType: "json",
        })
          .done(function (data) {
            // console.log(data);
            validate("unreg-btn", data);
          })
          .fail(function (err) {
            validate("unreg-btn", err);
          });
      });
    } else {
      $("#mod__title").text("Loading...");
      $("#mod__desc").text("");
      $("#mod__date_time_venue").html("<strong>Slot :</strong> Loading... ");
    }
  });

  if(window.location.hash !== "" && window.location.hash !== "#"){
    $(`${window.location.hash} > img`).get(0).click();
  }

});
