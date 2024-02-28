
document.querySelector('header nav .menu-burger').addEventListener('click',(e)=>{
    document.querySelector('header nav ul').classList.toggle('collapsible');
})

// ++++++++ contact-form-validation++++++f
 
let  userMessages=[];
let loggedin='';
 const messageForm=document.querySelector('.contact-form form');
 const nameField=document.querySelector('#name');
 const emailField=document.querySelector('#email');
 const errorMessagesContainers=document.querySelectorAll('.error-messages');
 const subjectField=document.querySelector('#subject');
 const textField=document.querySelector('#editor');
 const isAdmin=document.querySelector('#Admin-only');
 const login=document.querySelector('#login');
 const logout=document.querySelector('#logout');

 const dropDownbtnNav=document.querySelector("#dropDownbtnNav");

//  handle page loading
window.addEventListener('DOMContentLoaded',(e)=>{
    userMessages=JSON.parse(localStorage.getItem('userMessages'))||[];
   let currentUser=JSON.parse(sessionStorage.getItem('currentUser'));
 if(currentUser&&currentUser.isAdmin){
    isAdmin.style.display='inline';
    logout.style.display='flex';
    logout.innerHTML=`<i class="fa-solid fa-circle-user"></i>\n\n<span>${currentUser.name}</span><i id='2'class="fa-solid fa-circle-chevron-down"></i>
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
        sessionStorage.removeItem('currentUser');
    window.location.href="../index.html";

    })
 }
})

//  handle submit event of the form

 messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    validateName(nameField,0);
    validateMail(emailField,1);
    validateSubject(subjectField,2)
    validateText(textField,3);
  let userMessage={};
  const month=new Date().getMonth()+1;
  const day=new Date().getDate();
  const year=new Date().getFullYear();
  const hour=new Date().getHours();
  const min=new Date().getMinutes();
  userMessage.date=`${month}-${day}-${year}`;
  userMessage.id=new Date();
  userMessage.time=`${hour}:${min}`;
  userMessage.email=emailField.value;
  userMessage.name=nameField.value;
  userMessage.title=subjectField.value;
  userMessage.message=textField.value;
 if(userMessage.date&&userMessage.email&&userMessage.name&&userMessage.title&&userMessage.message){
     userMessages.push(userMessage);
     localStorage.setItem('userMessages',JSON.stringify(userMessages));
     nameField.value='';
     emailField.value='';
     subjectField.value='';
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
subjectField.addEventListener('input',(e)=>{
    validateSubject(subjectField,2)
})
textField.addEventListener('input',(e)=>{
    validateText(textField,3);
})
 document.querySelectorAll('input').forEach((inputfield,index)=>inputfield.addEventListener('blur',(e)=>{
    errorMessagesContainers[index].innerHTML='';
    
 }))

  textField.addEventListener('input',(e)=>{
          errorMessagesContainers[3].innerHTML='';

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

}




