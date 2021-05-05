const toggleForm = () => {
  $container = $(".container");
  $container.toggleClass("active");
};

$(document).ready(() => {
  const formType = window.location.href.split("#")[1];
  if (formType === "signup") {
    if (!$(".container").hasClass("active")) {
      $(".container").addClass("active");
    } else {
      $(".container").removeClass("active");
    }
  } else {
    $(".container").removeClass("active");
  }

  
});

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
    $(this).siblings("small.invalid_email").removeClass("hidden");
  } else {
    $(this).removeClass("border-2 border-red-500");
    $(this).siblings("small.invalid_email").addClass("hidden");
  }
});
// Confirm Password Validation
$("#confirm-password").on("change", function () {
  $password = $("#signup-password").val();
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
    // console.log('password')
    $password.attr("type", "text");
    ele.children().removeClass("bx-hide").addClass("bx-show");
    $password.focus();
  } else {
    // console.log('text')
    $password.attr("type", "password");
    ele.children().removeClass("bx-show").addClass("bx-hide");
  }
}
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

  });

// Track next page from url
let nextPage = window.location.href.split("=")[1];
let baseUrl = window.location.origin;