

document.querySelector('header nav .menu-burger').addEventListener('click',(e)=>{
    console.log("clicked")
    document.querySelector('header nav ul').classList.toggle('collapsible');
})

// ++++++++ contact-form-validation++++++f
 
let  userMessages=[];
 const messageForm=document.querySelector('.contact-form form');
 const nameField=document.querySelector('#name');
 const emailField=document.querySelector('#email');
 const errorMessagesContainers=document.querySelectorAll('.error-messages');
 const subjectField=document.querySelector('#subject');
 const textField=document.querySelector('#editor');

//  handle page loading
window.addEventListener('DOMContentLoaded',(e)=>{
    userMessages=JSON.parse(localStorage.getItem('userMessages'))||[];
console.log(userMessages);
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
  userMessage.date=`${month}-${day}-${year}`;
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
