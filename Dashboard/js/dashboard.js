const sections = document.querySelectorAll("section");
const navbar=document.querySelector('.nav-bar');
const navLinks = document.querySelectorAll(".nav-bar ul li a");
const chevronToggler = document.querySelector(".toggle-bar");
const blogsContainer = document.querySelector(".dashboard-blogs");
const blogsList = document.querySelector(".dashboard-blogList");
const userTableBody=document.querySelector('.users-table tbody');
const dashboardMessages=document.querySelector('.dashboard-messages');
const loggedInUser=JSON.parse(sessionStorage.getItem('currentUser'));
const currentUser=document.querySelector('.current-user span');
const signoutbtn=document.querySelector('.search-bar .search-bar-btn');
let AllBlogs = [];
let AllUsers=[];
let AllMessages=[];


// ++++++++ update and nav bar++++++++

chevronToggler.addEventListener("click", (e) => {
  e.target.classList.toggle("flip");
  toggleNavBar();
});

// ==============Get blogs======================

window.addEventListener("DOMContentLoaded", (e) => {
  AllBlogs = JSON.parse(localStorage.getItem("AllBlogs")) || [];
  displayBlogs(AllBlogs);
  AllUsers=JSON.parse(localStorage.getItem('AllUsers'))||[];
  displayUsers(AllUsers);
  AllMessages=JSON.parse(localStorage.getItem('userMessages'))||[];
  displayMessages(AllMessages);
  if(loggedInUser){
    currentUser.innerHTML=loggedInUser.name;
  };
  if(!navbar.classList.contains('nav-bar-small')){
    document.querySelector('.dashboard-main-container').style.marginLeft='230px';
    
  }else{
    document.querySelector('.dashboard-main-container').style.marginLeft='80px'
  };

});
blogsList.addEventListener("click", (e) => {
  let id = e.target.closest(".fa-trash-can").getAttribute("key");
  removeBlog(id);
});
blogsList.addEventListener('click',(e)=>{
  let id=e.target.closest('.fa-pen').getAttribute('key');
  window.location.href=`../pages/blog-edit.html?id=${id}`
})

dashboardMessages.addEventListener('click',(e)=>{
  e.preventDefault();
  let id=e.target.closest('.fa-trash-can').getAttribute('key');
  deleteMessage(id);
})
dashboardMessages.addEventListener('click',(e)=>{
  e.preventDefault();
  let id=e.target.closest('.fa-reply').getAttribute('key');
  replyMessage(id);
})


signoutbtn.addEventListener('click',(e)=>{
  e.preventDefault();
  sessionStorage.removeItem('currentUser');
  window.location.href="../../index.html";
})

function displayBlogs(blogs) {
  let mappedBlogs = blogs.map((blog) => {
    return `
        <div class="dashboard-blog-item">
        <div class="dashboard-blog-img">
        <img src=${blog.imgurl}>
        </div>
        <div class="dashboard-blog-description">
          <h4>${blog.tilte}</h4>
          <p>${blog.body.substring(0,100)+"...."}</P>
          <div class="dashboard-blog-description-foot">
          <div class="dashboard-blog-description-foot-item">
          <span>Comments</span>
              <i class="fa-solid fa-comment key=${blog.id}"></i>
         </div>
         <div class="dashboard-blog-description-foot-item">
         <span>5</span></i><span>Likes</span> 

         </div>
         <div class="dashboard-blog-description-foot-item">
              <i class="fa-solid fa-pen" key=${blog.id}></i><span>Edit</span> 
         </div>
         <div class="dashboard-blog-description-foot-item">
         <i class="fa-solid fa-trash-can" key=${blog.id}></i><span>delete</span>
         </div>
              </div>
              </div>
              </div>
        `;
  });

  for (let blog of mappedBlogs) {
    blogsList.innerHTML += blog;
  }
}
function displayUsers(users){
   let mappedUsers=users.map(u=>{
    return`
      <tr>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>${u.isAdmin}</td>
      <td>${u.active}</td>
      </tr>
    `
  })
  mappedUsers.forEach(user=>userTableBody.innerHTML+=user);
  
}

function displayMessages(messages){
  let mappedMessages=messages.map(m=>{
    return`
    <div class="dashboard-message-item">
    <div class="message-title"><i class="fa fa-user-circle fa-lg"></i>
    <h4>${m.name}</h4></div>
    <p>${m.message}</p>
    <span class="messages-options"><i class="fa-solid fa-trash-can" key=${m.id}></i>
    <i class="fa-solid fa-reply" key=${m.id}></i>
    </span>
    <span class="dashboard-message-item-date">${m.date} ,\n\n${m.time}</span>
  </div>
    `
  })
  mappedMessages.forEach(m=>{
    dashboardMessages.innerHTML+=m;
  })
}

function removeBlog(id) {
  AllBlogs = AllBlogs.filter((item) => item.id !== id);
  localStorage.setItem("AllBlogs", JSON.stringify(AllBlogs));
  blogsList.innerHTML = "";
  displayBlogs(AllBlogs);
}

function updateNavbar() {
  sections.forEach((section) => {
    const sectionTOp = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (
      window.scrollY >= sectionTOp &&
      window.scrollY < sectionTOp + sectionHeight
    ) {
      const targetLink = document.querySelector(
        `.nav-bar ul li a[href='#${section.id}']`
      );
      navLinks.forEach((link) => link.classList.remove("active"));
      targetLink.classList.add("active");
    }
  });
}
window.addEventListener("scroll", updateNavbar);
function toggleNavBar() {
  document.querySelector(".nav-bar").classList.toggle("nav-bar-small");
  document.querySelectorAll(".nav-bar-item-text").forEach((item) => item.classList.toggle("disappear"));
  document.querySelector(".logo").classList.toggle("disappear");
  if(!navbar.classList.contains('nav-bar-small')){
    document.querySelector('.dashboard-main-container').style.marginLeft='230px';
    
  }else{
    document.querySelector('.dashboard-main-container').style.marginLeft='80px'
  };
}


function deleteMessage(id){
  AllMessages=AllMessages.filter(m=>m.id!==id);
  dashboardMessages.innerHTML='';
  localStorage.setItem('userMessages',JSON.stringify(AllMessages));
  displayMessages(AllMessages);

}
function replyMessage(id){
let email=AllMessages.filter(user=>user.id===id)[0].email;
console.log(email);
window.location.href=`mailto:${email}`;

}
