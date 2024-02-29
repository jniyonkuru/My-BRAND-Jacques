 export let validateName = function (field, errorMessages,serial) {
  let errorMessage = [];
  if (field.value === null || field.value === "") {
    errorMessage.push("Name field should no be empty");
  } else if (field.value.length < 5) {
    errorMessage.push("Provide a valid name");
  } else {
    errorMessage = [];
  }
  errorMessages[serial].innerHTML = errorMessage.join(",");
};


export let validateMail = function (field, errorMessages,serial) {
  let errorMessage = [];
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (field.value === "" || field.value === null) {
    errorMessage.push("field can not be empty");
  } else if (!emailPattern.test(field.value)) {
    errorMessage.push("Provide  a valid  email");
  } else {
    errorMessage = [];
  }
  errorMessages[serial].innerHTML = errorMessage.join(",");
};


 export let validatePassword = function (field, errorMessages,serial) {
  let erroMessage = [];
  let assertNumber = /[0-9]+/;
  let assertSpecialCharacters = /[!@#$%^&*]+/;
  let asertUpperCase = /[A-Z]+/;
  let assertLowerCase = /[a-z]+/;
  let assertLength = /^.{5,16}$/;

  if (field.value === "") {
    erroMessage.push("password field should not be empty");
    errorMessages[serial].innerHTML = erroMessage.join("");
  } else if (!assertNumber.test(field.value)) {
    erroMessage.push("password should contain at least one number");
    errorMessages[serial].innerHTML = erroMessage.join("");
  } else if (!assertLength.test(field.value)) {
    erroMessage.push(
      "password length should be at let 6 characters and max 16"
    );
    errorMessages[serial].innerHTML = erroMessage.join("");
  } else if (!assertSpecialCharacters.test(field.value)) {
    erroMessage.push("password should contain  special character");
    errorMessages[serial].innerHTML = erroMessage.join("");
  } else if (!asertUpperCase.test(field.value)) {
    erroMessage.push("password should contain uppercase character");
    errorMessages[serial].innerHTML = erroMessage.join("");
  } else if (!assertLowerCase.test(field.value)) {
    erroMessage.push("password should contain  lowercase character");
    errorMessages[serial].innerHTML = erroMessage.join("");
  } else {
    erroMessage = [];
    errorMessages[serial].innerHTML = "";
  }
};

 export let confirmPassword = function (field1, errorMessages,field2, serial = 3) {
  let erroMessage = [];
  if (field1.value !== field2.value) {
    erroMessage.push("password does not match");
    errorMessages[serial].innerHTML = erroMessage.join("");
  } else {
    erroMessage = [];
    errorMessages[serial].innerHTML = "";
  }
};

