 export let validateName = function (field,serial) {
  let errorMessage = [];
  if (field.value === null || field.value === "") {
    errorMessage.push("Name field should no be empty");
  } else if (field.value.length < 5) {
    errorMessage.push("Provide a valid name");
  } else {
    errorMessage = [];
  }
  return errorMessage;
};


export let validateMail = function (field,serial) {
  let errorMessage = [];
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (field.value === "" || field.value === null) {
    errorMessage.push("field can not be empty");
  } else if (!emailPattern.test(field.value)) {
    errorMessage.push("Provide  a valid  email");
  } else {
    errorMessage = [];
  }
  return errorMessage;
};


 export let validatePassword = function (field,serial) {
  let errorMessage = [];
  let assertNumber = /[0-9]+/;
  let assertSpecialCharacters = /[!@#$%^&*]+/;
  let assertUpperCase = /[A-Z]+/;
  let assertLowerCase = /[a-z]+/;
  let assertLength = /^.{5,16}$/;

  if (field.value === "") {
    errorMessage.push("password field should not be empty");
  } else if (!assertNumber.test(field.value)) {
    errorMessage.push("password should contain at least one number");
  } else if (!assertLength.test(field.value)) {
    errorMessage.push(
      "password length should be at let 6 characters and max 16"
    );
  } else if (!assertSpecialCharacters.test(field.value)) {
    errorMessage.push("password should contain  special character");
  } else if (!assertUpperCase.test(field.value)) {
    errorMessage.push("password should contain uppercase character");

  } else if (!assertLowerCase.test(field.value)) {
    errorMessage.push("password should contain  lowercase character");
  } else {
    errorMessage = [];
  }
  return errorMessage;
};

 export let confirmPassword = function (field1,field2, serial = 3) {
  let errorMessage = [];
  if (field1.value !== field2.value) {
    errorMessage.push("password does not match");
  } else {
    errorMessage = [];
  }
  return errorMessage;
};

