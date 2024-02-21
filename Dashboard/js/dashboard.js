const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-bar ul li a");
const chevronToggler = document.querySelector(".toggle-bar");
const blogsContainer = document.querySelector(".dashboard-blogs");
const blogsList = document.querySelector(".dashboard-blogList");
let AllBlogs = [];

// ++++++++ update and nav bar++++++++

chevronToggler.addEventListener("click", (e) => {
  e.target.classList.toggle("flip");
  toggleNavBar();
});

// ==============Get blogs======================

window.addEventListener("DOMContentLoaded", (e) => {
  AllBlogs = JSON.parse(localStorage.getItem("AllBlogs")) || [];
  displayBlogs(AllBlogs);
});
blogsList.addEventListener("click", (e) => {
  let id = e.target.closest(".fa-trash-can").getAttribute("key");
  removeBlog(id);
});
blogsList.addEventListener('click',(e)=>{
  let id=e.target.closest('.fa-pen').getAttribute('key');
  console.log(id)
  window.location.href=`../pages/blog-edit.html?id=${id}`
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
          <p>${blog.body}</P>
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
  document
    .querySelectorAll(".nav-bar-item-text")
    .forEach((item) => item.classList.toggle("disappear"));
  document.querySelector(".logo").classList.toggle("disappear");
}
