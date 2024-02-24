
  const loginEmail=document.querySelector('.login-form form #loginemail');
  const loginPassword=document.querySelector('.login-form form #loginpassword');
  const loginForm=document.querySelector('.login-form form');
  let errorMessage=document.querySelector('.login-form form p');

  let AllUsers=[];

    window.addEventListener('DOMContentLoaded',(e)=>{
  AllUsers=JSON.parse(localStorage.getItem('AllUsers'))||[];
  loginForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    Autherisation(loginEmail.value);
  })
})

  let Autherisation= function(email){
     let exist=AllUsers.find(u=>u.email=email);
     if(exist &&exist.password===loginPassword.value){
      sessionStorage.setItem('currentUser',JSON.stringify(exist));
      window.location.href='./index.html';
     }else{
        errorMessage.innerHTML='wrong username or password';
     }
  }
  