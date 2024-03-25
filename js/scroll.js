 import { api_url } from "./util/apiUrl.js";
document.querySelector('header nav .menu-burger').addEventListener('click',(e)=>{
    document.querySelector('header nav ul').classList.toggle('collapsible');
})

// ++++++++ contact-form-validation++++++f
 
let  userMessages=[];
let portfolio=[]
const swiperWrapper=document.querySelector('.swiper-wrapper')
 const messageForm=document.querySelector('.contact-form form');
 const nameField=document.querySelector('#name');
 const emailField=document.querySelector('#email');
 const errorMessagesContainers=document.querySelectorAll('.error-messages');
 const textField=document.querySelector('#editor');
 const isAdmin=document.querySelector('#Admin-only');
 const login=document.querySelector('#login');
 const logout=document.querySelector('#logout');
 const dropDownbtnNav=document.querySelector("#dropDownbtnNav");
 const responseMessage=document.querySelector('.contact-page .contact-form .success-message');
 const errorResponse=document.querySelector('.contact-page .contact-form .fail-message');

//  handle page loading
window.addEventListener('DOMContentLoaded',(e)=>{
    fetchPortfolio();
let token=localStorage.getItem('token');
const [header, payload, signature] = token.split('.');
const decodedPayload = atob(payload);
const payloadObj = JSON.parse(decodedPayload);
   if(token){
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
})

//  handle submit event of the form

 messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    validateName(nameField,0);
    validateMail(emailField,1);
    validateText(textField,2);
    let userMessage={};
 
  userMessage.email=emailField.value.trim();
  userMessage.name=nameField.value.trim();
  userMessage.messageBody=textField.value.trim();
 if(userMessage.email&&userMessage.name&&userMessage.messageBody){
     userMessages.push(userMessage);

    writeMessage(userMessage);
     nameField.value='';
     emailField.value='';
     textField.value='';
 }else{
    return;
 }

 });

nameField.addEventListener('input',(e)=>{
    validateName(nameField,0);
})
emailField.addEventListener('input',(e)=>{
    validateMail(emailField,1);
})

textField.addEventListener('input',(e)=>{
    validateText(textField,2);
})
 document.querySelectorAll('input').forEach((inputfield,index)=>inputfield.addEventListener('blur',(e)=>{
    errorMessagesContainers[index].innerHTML='';
    
 }))

  textField.addEventListener('input',(e)=>{
          errorMessagesContainers[2].innerHTML='';

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
errorMessagesContainers[serial].innerHTML=errorMessage.join(',')

}
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
   errorMessagesContainers[serial].innerHTML=errorMessage.join(',') 
}

let validateSubject=function(field ,serial){
    let errorMessage=[];
    if(field.value===''||field.value===null){
      errorMessage.push('subject field should not be empty');
    }else{
        errorMessage=[];
    }
    errorMessagesContainers[serial].textContent=errorMessage.join();

}

 let validateText=function(field ,serial){
      let errorMessage=[];
      if(field.value===''|| field.value===null){
     errorMessage.push('Message field can not be empty');

      }else {
        errorMessage=[]
      }
      errorMessagesContainers[serial].innerHTML=errorMessage.join(',');

};

let fetchPortfolio=async function(){
    const response= await fetch(`${api_url}/api/portfolio`);
    const result=await response.json();
    portfolio=result.data
    displayPOrtfolio(portfolio);
    
}
let displayPOrtfolio= function(data){
    
  let mappedPortfolio=data.map((item,index)=>{
    return `<div class="swiper-slide">
      <img src=${item.image} alt="">
      <a href=${item.workUrl}>${item.workTitle}</a>
    </div>`
  })
swiperWrapper.innerHTML=mappedPortfolio.join();
}

const writeMessage=async function(message){

    try {
        const response= await fetch(`${api_url}/api/messages`,{
        method:'POST',
        headers:{
        'content-type':'application/json'
        },
        body:JSON.stringify(message)
        
    })
    if(!response.ok){
        const errorData= await response.json()
        throw  new Error(errorData.message||'error happened')
    }
    showLoader();
    setTimeout(function() {
        hideLoader();
        showResponse('Message sent successfully')
    }, 3000);
    
    } catch (error){
        showLoader();
        setTimeout(function() {
            hideLoader();
            showError('Message not sent'||error.message)
        }, 3000)
        
        
        
    }
}
function showLoader() {
    var loader = document.getElementById('loader');
    loader.style.display = 'block';
}

function hideLoader() {
    var loader = document.getElementById('loader');
    loader.style.display = 'none';
}

const showResponse=function(message){
responseMessage.textContent=message;
responseMessage.style.display='block';
setTimeout(()=>{
    responseMessage.style.display='none'
},2000)
}
 const showError=function(error){
  errorResponse.textContent=error;
  errorResponse.style.display='block';

 }



