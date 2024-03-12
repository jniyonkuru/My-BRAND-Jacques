import { validateMail,validateName,validatePassword,confirmPassword } from "./util/validation.js"

const signupName = document.querySelector(".signup #name");
const signupEmail = document.querySelector(".signup #email");
const form = document.querySelector(".signup form");
const errorMessages = document.querySelectorAll(".signup-form p");
const signUpPassword = document.querySelector(".signup-form #password");
const signUpConfirmPassword = document.querySelector(
  ".signup-form #password-confirm"
);
let AllUsers = [];

window.addEventListener("DOMContentLoaded", (e) => {
  AllUsers = JSON.parse(localStorage.getItem("AllUsers")) || [];
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
 let errorName= validateName(signupName, 0);
  errorName?errorMessages[0].innerHTML=errorName.join(','):errorMessages[0].innerHTML='';
  let errorMail=validateMail(signupEmail, 1);
  errorMail?errorMessages[1].innerHTML=errorMail.join(','):'';
 let errorPassword= validatePassword(signUpPassword, 2);
 errorPassword?errorMessages[2].innerHTML=errorPassword.join(','):'';
 let errorConfirmPassword=confirmPassword(signUpPassword,signUpConfirmPassword,3);
 errorConfirmPassword?errorMessages[3].innerHTML=errorPassword.join(','):'';
  let newUser = {
    name: signupName.value,
    email: signupEmail.value,
    password: signUpPassword.value,
    confirmPassword: signUpConfirmPassword.value,
    isAdmin: true,
    active: "active",
    signupDate: new Date(),
  };

  if (newUser) {
    let exist = AllUsers.find((exist) => exist.email === newUser.email);
    if (!exist) {
      AllUsers.push(newUser);
      localStorage.setItem("AllUsers", JSON.stringify(AllUsers));
      signupName.value = "";
      signupEmail.value = "";
      signUpPassword.value = "";
      signUpConfirmPassword.value = "";
    } else {
      errorMessages[0].innerHTML =
        "user with the given email already registered";
      return;
    }
  } else {
    return;
  }
});


signupName.addEventListener("input", (e) => {
  e.preventDefault();
  validateName(e.target, 0);
});

signUpPassword.addEventListener("input", (e) => {
  validatePassword(e.target, 2);
});


signupEmail.addEventListener("input", (e) => {
  e.preventDefault();
  validateMail(e.target, 1);
});

signUpConfirmPassword.addEventListener("input", (e) => {
  confirmPassword(e.target, signUpPassword);
});
