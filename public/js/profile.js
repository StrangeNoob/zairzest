// Read/Write Profile Field
function toggleFieldVisibility(ele) {
    $field = ele.parent().siblings();
    if ($field.is("[readonly]")) {
      $field.attr("readonly", false);
      ele.children().removeClass("bxs-lock").addClass("bxs-lock-open");
      $field.focus();
    } else {
      $field.attr("readonly", true);
      ele.children().removeClass("bxs-lock-open").addClass("bxs-lock");
    }
  }

  
  function validate(res) {
    setTimeout(function () {
      $("#update-btn").removeClass("onclic");
      if (res == "success") {
        $("#update-btn").addClass("validate-success", 450, callback(res));
      } else {
        $("#update-btn").addClass("validate-fail", 450, callback(res));
      }
    }, 2250);
  }
  
  function callback(res) {
    if (res === "success") {
      showToast(200, "Profile updated successfully 🙌");
    }  else {
      showToast(res.status, res.message);
    }
    setTimeout(function () {
      if (res === "success" || res == "restricted") {
        $("#update-btn").removeClass("validate-success");
      } else {
        $("#update-btn").removeClass("validate-fail");
      }
      $("#update-icon").show();
      $("#update-btn span").text("Update Profile");
    }, 1250);
  }
  
  // Email validate through regex
  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  
  //  Registration number validate
  function validateRegistrationNumber(reg_no) {
    const re = /^[0-9]{10}$/;
    const re2 = /^[0-9]{2}[A-Z]+[0-9]+$/; // For new registration numbers issued for 1st years
    return re.test(reg_no) || re2.test(reg_no);
  }
  
  $("input[type='email']").on("change", function () {
    $response = validateEmail($(this).val());
    if (!$response) {
      $(this).addClass("border-2 border-red-500");
      $("small.invalid_email").removeClass("hidden");
    } else {
      $(this).removeClass("border-2 border-red-500");
      $("small.invalid_email").addClass("hidden");
    }
  });
  
  // Update profile ajax request
  function updateProfile() {
    $email = $("#profile_form input[type='email']").val();
    $registration_no = $("#profile_form #regno").val();
    $branch = $("#profile_form #branch").val();
    $name = $("#profile_form #name").val();

    if ($name.length == 0) {
      showToast(401, "Please enter your name 🔐");
      return;
    }
    if (!validateEmail($email) || $email.length == 0) {
      showToast(401, "Please enter a valid email 🚫");
      return;
    }
    if (
      !validateRegistrationNumber($registration_no) ||
      $registration_no.length == 0
    ) {
      showToast(401, "Please enter a valid registration number 🔐");
      return;
    }
    if ($branch == null) {
      showToast(401, "Please select your branch");
      return;
    }
  
  
    $("#update-icon").hide();
    $("#update-btn span").text("");
    $("#update-btn").addClass("onclic", 50);
  
    let data = {
      email: $email,
      regNo: $registration_no,
      branch: $branch,
      name: $name,
    };
    console.table(data);
    $.ajax({
      type: "POST",
      url: "/profile",
      data: data,
      dataType: "json",
    })
      .done(function (data) {
          validate("success");
      })
      .fail(function (err) {
        validate(err);
      });
  }

  
  function setState(state, element) {
    // elApp.dataset.prevState = state;
    // current = state;
    // activate(state);
  
    $elApp = element;
    $elToggle = $elApp.find("input");
  
    $elApp.attr("data-state", state);
    element
      .find(`[data-active]`)
      .each((i, $el) => $($el).removeAttr("data-active"));
    element
      .find(`[data-for="${state}"]`)
      .each((i, $el) => $($el).attr("data-active", true));
  
    // elToggle = $elToggle.get(0);
    switch (state) {
      // case 'off':
      //   elToggle.indeterminate = false;
      //   elToggle.checked = false;
      //   elToggle.readOnly = false;
      //   break;
      // case 'pending':
      //   elToggle.readOnly = true;
      //   elToggle.indeterminate = true;
  
      //   break;
      // case 'on':
      //   elToggle.readOnly = false;
      //   elToggle.checked = true;
      //   elToggle.indeterminate = false;
      //   break;
      // default:
      //   break;
      case "off":
        $($elToggle).prop("indeterminate", false);
        $($elToggle).prop("checked", false);
        $($elToggle).prop("readonly ", false);
        break;
      case "pending":
        $($elToggle).prop("readonly", true);
        $($elToggle).prop("indeterminate ", true);
        break;
      case "on":
        $($elToggle).prop("readonly", false);
        $($elToggle).prop("checked", true);
        $($elToggle).prop("indeterminate", false);
        break;
      default:
        break;
    }
  }
  
  $(document).ready(function () {
    $(".connect").each(function (index, el) {
      setState($(el).attr("data-state"), $(el));
    });
  });
  
  // Subscribe to newsletter
  function subscribe_newsletter(ele, state) {
    $newsletter_subscription = state;
    let data = {
      newsletterSubscription: $newsletter_subscription,
    };
    setState("pending", ele);
    $.ajax({
      type: "POST",
      url: "/api/user/newsletter",
      data: JSON.stringify(data),
      contentType: "application/json",
      dataType: "json",
    })
      .done(function (data) {
        if (state) {
          setState("on", ele);
          showToast(200, "Newsletter subscribed 👍");
        } else {
          setState("off", ele);
          showToast(200, "Newsletter unsubscribed 🥺");
        }
      })
      .fail(function (err) {
        setState("off", ele);
        showToast(err.status, err.responseJSON.message);
      });
  }
  
  // Submit forms on click of 'ENTER' key
  $("input").keypress(function (e) {
    if (e.keyCode === 13) {
      $("#update-btn").click();
    }
  });
  
  // Check if user directly came by clicking the magic popup
  let params = window.location.href.split("#")[1];
  let newsletterSubscription = $("#newsletter_toggle").prop("checked");
  if (!newsletterSubscription && params) {
    $("#newsletter_toggle").click();
  }
  
  // fancy multiple selector
  $(document).ready(function () {
    var selectBranch = $("#branch");
    var optionsBranch = selectBranch.find("option");
  
    var divBranch = $("<div />").addClass("selectMultipleBranch");
    var activeBranch = $("<div />");
    var listBranch = $("<ul />");
    var placeholderBranch = selectBranch.data("placeholder");
  
    var spanBranch = $("<span />").text(placeholderBranch).appendTo(activeBranch);
  
    optionsBranch.each(function () {
      var text = $(this).text();
      if ($(this).is(":selected")) {
        activeBranch.append($("<a />").html("<em>" + text + "</em><i></i>"));
        spanBranch.addClass("hide");
      } else {
        listBranch.append($("<li />").html(text));
      }
    });
  
    activeBranch.append($("<div />").addClass("arrow"));
    divBranch.append(activeBranch).append(listBranch);
  
    selectBranch.wrap(divBranch);
  
    $(document).on("click", ".selectMultipleBranch ul li", function (e) {
      var select = $(this).parent().parent();
      var li = $(this);
      if (!select.hasClass("clicked")) {
        select.addClass("clicked");
        li.prev().addClass("beforeRemove");
        li.next().addClass("afterRemove");
        li.addClass("remove");
        if (select.children("div").has("a")) {
          select.children("div").children("a:first").remove();
          select
              .find("option:contains(" + select.children("div").children("a:first").text() + ")")
              .prop("selected", false);
        }
        var a = $("<a />")
          .addClass("notShown")
          .html("<em>" + li.text() + "</em><i></i>")
          .hide()
          .appendTo(select.children("div"));
        a.slideDown(400, function () {
          setTimeout(function () {
            a.addClass("shown");
            select.children("div").children("span").addClass("hide");
            select
              .find("option:contains(" + li.text() + ")")
              .prop("selected", true);
            select.toggleClass("open");
          }, 500);
        });
        setTimeout(function () {
          if (li.prev().is(":last-child")) {
            li.prev().removeClass("beforeRemove");
          }
          if (li.next().is(":first-child")) {
            li.next().removeClass("afterRemove");
          }
          setTimeout(function () {
            li.prev().removeClass("beforeRemove");
            li.next().removeClass("afterRemove");
          }, 200);
  
          li.slideUp(400, function () {
            li.remove();
            select.removeClass("clicked");
          });
        }, 600);
      }
    });
  
    $(document).on("click", ".selectMultipleBranch > div a", function (e) {
      var select = $(this).parent().parent();
      var self = $(this);
      self.removeClass().addClass("remove");
      select.addClass("open");
      setTimeout(function () {
        self.addClass("disappear");
        setTimeout(function () {
          self.animate(
            {
              width: 0,
              height: 0,
              padding: 0,
              margin: 0,
            },
            300,
            function () {
              var li = $("<li />")
                .text(self.children("em").text())
                .addClass("notShown")
                .appendTo(select.find("ul"));
              li.slideDown(400, function () {
                li.addClass("show");
                setTimeout(function () {
                  select
                    .find("option:contains(" + self.children("em").text() + ")")
                    .prop("selected", false);
                  if (!select.find("option:selected").length) {
                    select.children("div").children("span").removeClass("hide");
                  }
                  li.removeClass();
                }, 400);
              });
              self.remove();
            }
          );
        }, 300);
      }, 400);
    });
  
    $(document).on(
      "click",
      ".selectMultipleBranch > div ",
      function (e) {
        if ($(".selectMultipleWing").hasClass("open")) {
          $(".selectMultipleWing").toggleClass("open");
        }
        $(".selectMultipleBranch").toggleClass("open");
      }
    );
  
    // Select your wing
  
    var selectWing = $("#wing");
    var optionsWing = selectWing.find("option");
  
    var divWing = $("<div />").addClass("selectMultipleWing");
    var activeWing = $("<div />");
    var listWing = $("<ul />");
    var placeholderWing = selectWing.data("placeholder");
  
    var spanWing = $("<span />").text(placeholderWing).appendTo(activeWing);
  
    optionsWing.each(function () {
      var text = $(this).text();
      if ($(this).is(":selected")) {
        activeWing.append($("<a />").html("<em>" + text + "</em><i></i>"));
        spanWing.addClass("hide");
      } else {
        listWing.append($("<li />").html(text));
      }
    });
  
    activeWing.append($("<div />").addClass("arrow"));
    divWing.append(activeWing).append(listWing);
  
    selectWing.wrap(divWing);
  
    $(document).on("click", ".selectMultipleWing ul li", function (e) {
      var select = $(this).parent().parent();
      var li = $(this);
      if (!select.hasClass("clicked")) {
        select.addClass("clicked");
        li.prev().addClass("beforeRemove");
        li.next().addClass("afterRemove");
        li.addClass("remove");
        var a = $("<a />")
          .addClass("notShown")
          .html("<em>" + li.text() + "</em><i></i>")
          .hide()
          .appendTo(select.children("div"));
        a.slideDown(400, function () {
          setTimeout(function () {
            a.addClass("shown");
            select.children("div").children("span").addClass("hide");
            select
              .find("option:contains(" + li.text() + ")")
              .prop("selected", true);
          }, 500);
        });
        setTimeout(function () {
          if (li.prev().is(":last-child")) {
            li.prev().removeClass("beforeRemove");
          }
          if (li.next().is(":first-child")) {
            li.next().removeClass("afterRemove");
          }
          setTimeout(function () {
            li.prev().removeClass("beforeRemove");
            li.next().removeClass("afterRemove");
          }, 200);
  
          li.slideUp(400, function () {
            li.remove();
            select.removeClass("clicked");
          });
        }, 600);
      }
    });
  
    $(document).on("click", ".selectMultipleWing > div a", function (e) {
      var select = $(this).parent().parent();
      var self = $(this);
      self.removeClass().addClass("remove");
      select.addClass("open");
      setTimeout(function () {
        self.addClass("disappear");
        setTimeout(function () {
          self.animate(
            {
              width: 0,
              height: 0,
              padding: 0,
              margin: 0,
            },
            300,
            function () {
              var li = $("<li />")
                .text(self.children("em").text())
                .addClass("notShown")
                .appendTo(select.find("ul"));
              li.slideDown(400, function () {
                li.addClass("show");
                setTimeout(function () {
                  select
                    .find("option:contains(" + self.children("em").text() + ")")
                    .prop("selected", false);
                  if (!select.find("option:selected").length) {
                    select.children("div").children("span").removeClass("hide");
                  }
                  li.removeClass();
                }, 400);
              });
              self.remove();
            }
          );
        }, 300);
      }, 400);
    });
  
    $(document).on(
      "click",
      ".selectMultipleWing > div ",
      function (e) {
        if ($(".selectMultipleBranch").hasClass("open")) {
          $(".selectMultipleBranch").toggleClass("open");
        }
        $(".selectMultipleWing").toggleClass("open");
      }
    );
  });
  
  