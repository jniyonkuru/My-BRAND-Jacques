
const signupName=document.querySelector('.signup #name'); 
 const signupEmail=document.querySelector('.signup #email')
const form= document.querySelector('.signup-form form');
const errorMessages=document.querySelectorAll('.signup-form p');
const signUpPassword=document.querySelector('.signup-form #password');
const signUpConfirmPassword=document.querySelector('.signup-form #password-confirm');
let AllUsers=[];

window.addEventListener('DOMContentLoaded',(e)=>{
  AllUsers=JSON.parse(localStorage.getItem('AllUsers'))||[];
})

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    validateName(signupName,0);
    validateMail(signupEmail,1);
    validatePassword(signUpPassword,2);
  let newUser={
    name:signupName.value,
    email:signupEmail.value,
    password:signUpPassword.value,
    confirmPassword:signUpConfirmPassword.value,
    isAdmin:true,
    active:"active",
    signupDate:new Date()
  }

  if(newUser){
   let exist= AllUsers.find(exist=>exist.email===newUser.email);
   if(!exist){
    AllUsers.push(newUser);
    localStorage.setItem('AllUsers',JSON.stringify(AllUsers));
    signupName.value='';
    signupEmail.value='';
    signUpPassword.value='';
    signUpConfirmPassword.value='';
   }else{
    errorMessages[0].innerHTML='user with the given email already registered';
    return;
   }
  }else{
    return;
  }
})

let validateName= function(field,serial){
    let errorMessage=[];
    if(field.value===null||field.value===''){
 errorMessage.push('Name field should no be empty');
    }else if(field.value.length<5){
    errorMessage.push('Provide a valid name');
    }else{
        errorMessage=[]
    }
errorMessages[serial].innerHTML=errorMessage.join(',')

}
 signupName.addEventListener('input',(e)=>{
    e.preventDefault();
    validateName(e.target,0)
 })
 signUpPassword.addEventListener('input',(e)=>{
    validatePassword(e.target,2)
 })
 
 let validateMail=function(field,serial){
    let errorMessage=[];
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(field.value===''||field.value===null){
     errorMessage.push('field can not be empty');
    }else if(!emailPattern.test(field.value)){
     errorMessage.push('Provide  a valid  email');
    }else {
        errorMessage=[];
    }
       errorMessages[serial].innerHTML=errorMessage.join(',') 
    }
    signupEmail.addEventListener('input',(e)=>{
        e.preventDefault()
        validateMail(e.target,1);
    });

    let validatePassword= function(field,serial){
        let erroMessage=[];
        let assertNumber=/[0-9]+/;
        let assertSpecialCharacters=/[!@#$%^&*]+/;
        let asertUpperCase=/[A-Z]+/;
        let assertLowerCase=/[a-z]+/
        let assertLength=/^.{5,16}$/;
 
    if(field.value===''){
            erroMessage.push("password field should not be empty");
            errorMessages[serial].innerHTML=erroMessage.join('');
     }else if(!assertNumber.test(field.value)){
erroMessage.push('password should contain at least one number');
errorMessages[serial].innerHTML=erroMessage.join('');
  }else if(!assertLength.test(field.value)){
    erroMessage.push('password length should be at let 6 characters and max 16');
    errorMessages[serial].innerHTML=erroMessage.join('');
  }else if(!assertSpecialCharacters.test(field.value)){
    erroMessage.push('password should contain  special character');
    errorMessages[serial].innerHTML=erroMessage.join('');
  }else if(!asertUpperCase.test(field.value)){
    erroMessage.push('password should contain uppercase character');
    errorMessages[serial].innerHTML=erroMessage.join('');
  }else if(!assertLowerCase.test(field.value)){
    erroMessage.push('password should contain  lowercase character');
    errorMessages[serial].innerHTML=erroMessage.join('');

  }else{
    erroMessage=[];
    errorMessages[serial].innerHTML='';
  }

    }
let confirmPassword=function(field1, field2 ,serial=3){
    let erroMessage=[];
    if(field1.value!==field2.value){
        erroMessage.push('password does not match')
      errorMessages[serial].innerHTML=erroMessage.join('');
    }else{
        erroMessage=[];
        errorMessages[serial].innerHTML='';
    }
}
signUpConfirmPassword.addEventListener('input',(e)=>{
    confirmPassword(e.target,signUpPassword);
})


