
import { validateMail, validateName, validatePassword, confirmPassword } from "./util/validation.js";
import { showLoader,hideLoader } from "./util/loader.js";
import { api_url } from "./util/apiUrl.js";
const signupName = document.querySelector(".signup #name");
const signupEmail = document.querySelector(".signup #email");
const form = document.querySelector(".signup-form form");
const errorMessages = document.querySelectorAll(".signup-form p");
const signUpPassword = document.querySelector(".signup-form #password");
const signUpConfirmPassword = document.querySelector(".signup-form #password-confirm");
window.addEventListener("DOMContentLoaded", (e) => {
  document.querySelector('header nav .menu-burger').addEventListener('click',(e)=>{
    document.querySelector('header nav ul').classList.toggle('collapsible');
})

  let token=localStorage.getItem('token');
       if(token){
        const [header, payload, signature] = token.split('.');
        const decodedPayload = atob(payload);
        const payloadObj = JSON.parse(decodedPayload)
        logout.style.display='flex';
        logout.innerHTML=`<i class="fa-solid fa-circle-user"></i>\n\n<span>${payloadObj.userName}</span><i id='2'class="fa-solid fa-circle-chevron-down"></i>
        <span id="dropDownbtnNav"><button>log out</button></span>
        `;
        login.style.display='none';
        const dropdwonchevron=document.getElementById("2");
        const dropDownbtnNav=document.querySelector("#dropDownbtnNav");
        const signoutbtn=document.querySelector('#dropDownbtnNav button');
        dropdwonchevron.addEventListener('mouseenter',(e)=>{
            dropDownbtnNav.style.display="block";
        })
        dropDownbtnNav.addEventListener('mouseleave',(e)=>{
            dropDownbtnNav.style.display="none";
            e.target.style.background='var(--primary-color)';
        })
        signoutbtn.addEventListener('click',(e)=>{
            e.preventDefault()
            localStorage.removeItem('token');
        window.location.href="../index.html";
    
        })
        if(payloadObj.isAdmin){
            isAdmin.style.display='inline'
        }
     }
  signupName.addEventListener("input",(e) => {
    let errorName = validateName(signupName, 0);
    errorName ? (errorMessages[0].textContent = errorName.join(',')) : (errorMessages[0].textContent = '');
  });

  signUpPassword.addEventListener("input", (e) => {
    let errorPassword = validatePassword(signUpPassword, 2);
    errorPassword ? (errorMessages[2].textContent = errorPassword.join(',')) : (errorMessages[2].textContent = '');
  });

  signupEmail.addEventListener("input", (e) => {
    let errorMail = validateMail(signupEmail, 1);
    errorMail ? (errorMessages[1].textContent = errorMail.join(',')) : (errorMessages[1].textContent = '');
  });

  signUpConfirmPassword.addEventListener("input", (e) => {
    let errorConfirmPassword = confirmPassword(signUpPassword, signUpConfirmPassword, 3);
    errorConfirmPassword ? (errorMessages[3].textContent = errorConfirmPassword.join(',')) : (errorMessages[3].textContent = '');
  });

form.addEventListener("submit",async (e) => {
  e.preventDefault();
  let errorName = validateName(signupName, 0);
  errorName ? (errorMessages[0].textContent = errorName.join(',')) : (errorMessages[0].textContent = '');
  let errorMail = validateMail(signupEmail, 1);
  errorMail ? (errorMessages[1].textContent = errorMail.join(',')) : (errorMessages[1].textContent = '');
  let errorPassword = validatePassword(signUpPassword, 2);
  errorPassword ? (errorMessages[2].textContent = errorPassword.join(',')) : (errorMessages[2].textContent = '');
  let errorConfirmPassword = confirmPassword(signUpPassword, signUpConfirmPassword, 3);
  errorConfirmPassword ? (errorMessages[3].textContent = errorConfirmPassword.join(',')) : (errorMessages[3].textContent = '');
  let newUser={
    name:signupName.value.trim(),
    email:signupEmail.value.trim(),
    password:signUpPassword.value.trim(),
    confirmPassword:signUpConfirmPassword.value.trim()
  }
  showLoader();
  setTimeout(async()=>{
     await createNewUser(newUser);
    form.reset();
    hideLoader();
  },2000)
  

});
});



const createNewUser = async (user) => {
  try {
    const response = await fetch(`${api_url}/api/users`, {
      method:"POST",
      headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify(user)
    })
  
    if (!response.ok) {
      const errorData =await response.json();
       showError(errorData.message)
      throw new Error("failed to create user");
    }
  } catch(error) {
    console.error("Error creating user:",error);
  }
};

const showError= function(error){
  document.querySelector('.createUserMessage').style.color='red';
  document.querySelector('.createUserMessage').textContent=error;
}
const showMessage= function(message){
  document.querySelector('.createUserMessage').style.color='green';
  document.querySelector('.createUserMessage').textContent=error;
}