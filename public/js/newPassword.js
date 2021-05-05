// Confirm Password Validation
$("#confirm-password").on("change", function () {
  $password = $("#new-password").val();
  $confirm_password = $(this).val();
  if ($password != $confirm_password) {
    $(this).addClass("border-2 border-red-500");
    $(this).parent().siblings("small.no_match").removeClass("hidden");
  } else {
    $(this).removeClass("border-2 border-red-500");
    $(this).parent().siblings("small.no_match").addClass("hidden");
  }
});

// Show/Hide password
function togglePasswordVisibility(ele) {
  $password = ele.parent().siblings();
  if ($password.attr("type") === "password") {
    $password.attr("type", "text");
    ele.children().removeClass("bx-hide").addClass("bx-show");
  } else {
    $password.attr("type", "password");
    ele.children().removeClass("bx-show").addClass("bx-hide");
  }
}

// Confirm Password Validation
function matchPassword(password, confirm_password) {
  if (password != confirm_password) {
    $(this).addClass("border-2 border-red-500");
    $(this).parent().siblings("small.no_match").removeClass("hidden");
    showToast(401, "Passwords donot match 🚫");
    return false;
  } else {
    $(this).removeClass("border-2 border-red-500");
    $(this).parent().siblings("small.no_match").addClass("hidden");
    return true;
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
    showToast(200, "Password successfully changed 🙌");
  } else {
    showToast(400, res.responseJSON.message || "Sorry, There seems to be a problem at our end");
  }
  setTimeout(function () {
    if (res === "success") {
      $("#update-btn").removeClass("validate-success");
    } else {
      $("#update-btn").removeClass("validate-fail");
    }
    $("#update-icon").show();
    $("#update-btn span").text("Update Password");
    if (res === "success") {
      window.location.replace("/auth");
    }
  }, 1250);
}

// Update password form submit
function updatePassword() {
  $password = $("#update_form #new-password").val();
  $confirm_password = $("#update_form #confirm-password").val();
  if (!matchPassword($password, $confirm_password)) {
    return;
  }
  $("#update-icon").hide();
  $("#update-btn span").text("");
  $("#update-btn").addClass("onclic", 50);

  var code = new URL(window.location.href).searchParams.get("rid");
  const data = {
    password: $password
  }

  $.ajax({
    type: "POST",
    url: `/resetpassword/${code}`,
    data: data,
    dataType: "json",
  })
    .done(function (data) {
      // console.log(data)
      validate("success");
    })
    .fail(function (err) {
      // console.log("error")
      validate(err);
    });
}

// Submit forms on click of 'ENTER' key
$("input").keypress(function (e) {
  if (e.keyCode === 13) {
    let authType = window.location.href.split("#")[1];
    if (authType === "signup") {
      $("#signup-btn").click();
    } else {
      $("#signin-btn").click();
    }
  }
});