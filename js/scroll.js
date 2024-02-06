 const socialIcons=document.querySelectorAll(".contact-social i");
const userIcon=document.querySelector(".fa-circle-user");
console.log(userIcon)
  
userIcon.addEventListener("click",()=>{
    socialIcons.forEach(item=>item.classList.toggle("visible"))

})