const body = document.querySelector("body");
const navbar = document.querySelector(".navbar");
const menuBtn = document.querySelector(".menu-btn");
const cancelBtn = document.querySelector(".cancel-btn");
menuBtn.onclick = ()=>{
  navbar.classList.add("show");
  menuBtn.classList.add("hide");
  body.classList.add("disabled");
}
cancelBtn.onclick = ()=>{
  body.classList.remove("disabled");
  navbar.classList.remove("show");
  menuBtn.classList.remove("hide");
}
navbar.classList.add("sticky");

const vw = Math.max(
  document.documentElement.clientWidth || 0,
  window.innerWidth || 0
);
const vh = Math.max(
  document.documentElement.clientHeight || 0,
  window.innerHeight || 0
);

console.log(vw + "  &  " + vh);
let dummy = document.getElementsByClassName("dummy");
let wood = document.getElementsByClassName("wood");
let text = document.getElementsByClassName("info");
let alert = document.getElementsByClassName("event-container");

if (vw >= 768) {
  for (let i = 0; i < wood.length; i++) {
    wood[i].style.display = "none";
    text[i].style.fontSize = 0;
    alert[i].style.display = "none";
  }

  for (let i = 0; i < wood.length; i++) {
    dummy[i].addEventListener("mouseover", () => {
      if (wood[i].style.display === "none") {
        wood[i].style.display = "block";
        text[i].style.fontSize = "1.25rem";
        alert[i].style.display = "block";
      }
    });
  }

  for (let i = 0; i < wood.length; i++) {
    dummy[i].addEventListener("mouseout", () => {
      if (wood[i].style.display === "block") {
        wood[i].style.display = "none";
        text[i].style.fontSize = 0;
        alert[i].style.display = "none";
      }
    });
  }
} else if (vw < 768) {
  for (let i = 0; i < wood.length; i++) {
    wood[i].style.display = "none";
    text[i].style.fontSize = 0;
    alert[i].style.display = "none";
  }

  for (let i = 0; i < wood.length; i++) {
    alert[i].style.display = "block";
    alert[i].style.animation = "myanimation 2s ease-in-out infinite";
  }
}