import {
  validateMail,
  validateName,
  validatePassword,
  confirmPassword,
} from "../../js/util/validation.js";
import { hideLoader,showLoader } from "../../js/util/loader.js";
import { api_url } from "../../js/util/apiUrl.js";



const sections = document.querySelectorAll("section");
const navbar = document.querySelector(".nav-bar");
const navLinks = document.querySelectorAll(".nav-bar ul li a");
const chevronToggler = document.querySelector(".toggle-bar");
const blogsContainer = document.querySelector(".dashboard-blogs");
const blogsList = document.querySelector(".dashboard-blogList");
const userTableBody = document.querySelector(".users-table tbody");
const dashboardMessages = document.querySelector(".dashboard-messages");
const loggedInUser = JSON.parse(sessionStorage.getItem("currentUser"));
const currentUser = document.querySelector(".current-user span");
const signoutbtn = document.querySelector(".search-bar .search-bar-btn");
const recentMessages = document.querySelector(".recent-messages");
const addBlog = document.querySelector(".btn.btn-blog");
const blogEdit = document.querySelector(".blog-edit");
const deletePopUp=document.querySelector('.delete-confirm');
const okBlog=document.querySelector('.ok');
const cancelBlog=document.querySelector('.cancel');
const okMessage=document.querySelector('.ok-message');
const cancelMessage=document.querySelector('.cancel-message');
const deleteMessagePopUp=document.querySelector('.delete-confirm-message');
const notificationBadge=document.querySelector('.notification-badge');
const likes=document.querySelector('.total-likes');
const comments=document.querySelector('.total-comments');
const posts=document.querySelector('.total-posts');

// create user
const userName = document.querySelector(".add-contact #name");
const userEmail = document.querySelector(".add-contact #email");
const userPassword = document.querySelector(".add-contact #password");
const userConfirmPassword = document.querySelector("#password-confirm");
const createUserForm = document.querySelector(".add-contact form");
const errorMessages = document.querySelectorAll(".error-messages");
const isAdminCheck = document.querySelector("#isadmin");
const registerUserForm = document.querySelector(".add-contact form");

let blogList = [];
let AllUsers = [];
let AllMessages = [];
let totalLikes=0;
let totalComments=0;
let totalPosts=0;

// ++++++++ update and nav bar++++++++

chevronToggler.addEventListener("click", (e) => {
  e.target.classList.toggle("flip");
  toggleNavBar();
});

let token = localStorage.getItem("token");
if(token){
  const [header, payload, signature] = token.split(".");
  const decodedPayload = atob(payload);
  const payloadObj = JSON.parse(decodedPayload);


if (payloadObj) {
  currentUser.innerHTML = payloadObj.userName;
}
}
window.addEventListener("DOMContentLoaded", async (e) => {
  showLoader();
   await fetchBlogs();
   await fetchUsers();
   await fetchMessages();
  setTimeout(()=>{
    displayBlogs(blogList);
    displayUsers(AllUsers);
    displayMessages(AllMessages);
    hideLoader();
    if (loggedInUser) {
      currentUser.innerHTML = loggedInUser.name;
    }
  },3000)
  
 
  if (!navbar.classList.contains("nav-bar-small")) {
    document.querySelector(".dashboard-main-container").style.marginLeft =
      "230px";
  } else {
    document.querySelector(".dashboard-main-container").style.marginLeft =
      "100px";
  }
  blogsList.addEventListener("click",async(e) => {
    let id = e.target.closest(".fa-trash-can").getAttribute("key");
    deletePopUp.style.visibility='visible';
    okBlog.setAttribute('key',id);
    
  });
  okBlog.addEventListener('click',async(e)=>{
    e.preventDefault();
    let id= e.target.getAttribute('key');
    deletePopUp.style.visibility='hidden';
    await removeBlog(id, token);
    fetchBlogs(); 
  })
  cancelBlog.addEventListener('click',(e)=>{
    e.preventDefault();
    deletePopUp.style.visibility='hidden';
    return;
  })
  dashboardMessages.addEventListener("click", async(e) => {
    e.preventDefault();
    let id = e.target.closest(".fa-trash-can").getAttribute("key");
    deleteMessagePopUp.style.visibility='visible';
    okMessage.setAttribute('key',id);
    
  });
  okMessage.addEventListener('click',async (e)=>{
    e.preventDefault();
    let id= e.target.getAttribute('key');
    await deleteMessage(id, token);
    deleteMessagePopUp.style.visibility='hidden';
    fetchMessages();
  })
  cancelMessage.addEventListener('click',(e)=>{
    e.preventDefault();
    deleteMessagePopUp.style.visibility='hidden';
    return;
  })
  displayRecentMessages(AllMessages);

  registerUserForm.addEventListener("submit", async(e) => {
    e.preventDefault();
    let errorName = validateName(userName, 0);
    errorName
      ? (errorMessages[0].innerHTML = errorName.join(","))
      : (errorMessages[0].innerHTML = "");
    let errorMail = validateMail(userEmail, 1);
    errorMail ? (errorMessages[1].innerHTML = errorMail.join(",")) : "";
    let errorPassword = validatePassword(userPassword, 2);
    errorPassword ? (errorMessages[2].innerHTML = errorPassword.join(",")) : "";
    let errorConfirmPassword = confirmPassword(
      userPassword,
      userConfirmPassword,
      3
    );
    errorConfirmPassword
      ? (errorMessages[3].innerHTML = errorPassword.join(","))
      : "";
    let newUser = {
      name: userName.value.trim(),
      email: userEmail.value.trim(),
      password: userPassword.value.trim(),
      confirmPassword: userConfirmPassword.value.trim(),
      isAdmin: isAdminCheck.checked,
    };

    await  createUser(newUser);
    await fetchUsers()
    displayUsers(AllUsers);
    e.target.reset();
  });
  
});

blogsList.addEventListener("click", async (e) => {
  let id = e.target.closest(".fa-pen").getAttribute("key");
  blogEdit.style.display = "flex";
  let item = await fetchOneBlog(id);
  if (item) {
    blogBody.value = item.blogBody;
    base64String = item.image;
    console.log(base64String);
    blogTitle.value = item.blogTitle;
    imgcontainer.style.display = "inline";
    imgcontainer.innerHTML = `
    <img src=${item.image}>  `;
    update.addEventListener("click", async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append("blogTitle", blogTitle.value);
      formData.append("blogBody", blogBody.value);
      formData.append("image", inputFile.files[0]);
      await updateBlog(formData, token, id);
      fetchBlogs();
      cancelBtn.click();
    });
  }
});

dashboardMessages.addEventListener("click", (e) => {
  e.preventDefault();
  let email = e.target.closest(".fa-reply").getAttribute("key");
  replyMessage(email);
});

signoutbtn.addEventListener("click", (e) => {
  e.preventDefault();
  sessionStorage.removeItem("currentUser");
  localStorage.removeItem("token");
  window.location.href = "../../index.html";
});
addBlog.addEventListener("click", (e) => {
  e.preventDefault();
  blogEdit.style.display = "flex";
});

function displayBlogs(blogs) {
  for(let blog of blogs){
    totalLikes+=blog.likes;
  }
  posts.textContent=blogs.length;
  likes.textContent=totalLikes;
  let mappedBlogs = blogs.map((blog) => {
    return `
        <div class="dashboard-blog-item">
        <div class="dashboard-blog-img">
        <img src=${blog.image}>
        </div>
        <div class="dashboard-blog-description">
          <h4>${blog.blogTitle}</h4>
          <p>${blog.blogBody.substring(0, 100) + "...."}</P>
          <div class="dashboard-blog-description-foot">
          <div class="dashboard-blog-description-foot-item">
          <span>Comments</span>
              <i class="fa-solid fa-comment key=${blog._id}"></i>
         </div>
         <div class="dashboard-blog-description-foot-item">
         <span>${blog.likes}</span></i><span>Likes</span> 

         </div>
         <div class="dashboard-blog-description-foot-item edit">
           <i class="fa-solid fa-pen" key=${blog._id}></i><span>Edit</span> 
         </div>
         <div class="dashboard-blog-description-foot-item delete">
         <i class="fa-solid fa-trash-can" key=${
           blog._id}></i><span>delete</span>
         </div>
              </div>
              </div>
              </div>
        `;
  });
  blogsList.innerHTML = "";
  for (let blog of mappedBlogs) {
  
    blogsList.innerHTML += blog;
  }
}
function displayUsers(users) {
  let mappedUsers = users.map((u) => {
    return `
      <tr>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>${u.isAdmin}</td>
      <td>active</td>
      <td><a href=''class='delete-user' key=${u._id}>delete</a></td>
      </tr>
    `;
  });
  userTableBody.innerHTML='';
  mappedUsers.forEach((user) => (userTableBody.innerHTML += user));
  const deleteUser=document.querySelectorAll('.delete-user');
  console.log(deleteUser)
    deleteUser.forEach(btn=>{
      return btn.addEventListener('click',async(e)=>{
    e.preventDefault();
    let id= e.target.getAttribute('key');
    await removeUsers(id,token);
    await fetchUsers();
    console.log(AllUsers)
    displayUsers(AllUsers)
      })
    })
}

function displayMessages(messages) {
  let mappedMessages = messages.map((m) => {
    return `
    <div class="dashboard-message-item">
    <div class="message-title"><i class="fa fa-user-circle fa-lg"></i>
    <h4>${m.name}</h4></div>
    <p>${m.messageBody}</p>
    <span class="messages-options"><i class="fa-solid fa-trash-can" key=${
      m._id
    }></i>
    <i class="fa-solid fa-reply" key=${m.email}></i>
    </span>
    <span class="dashboard-message-item-date">${m.date.substring(0, 10)} ,\n\n${
      m.date.substring(11,19)
    }</span>
  </div>
    `;
  });
  dashboardMessages.innerHTML='';
  mappedMessages.forEach((m) => {
    dashboardMessages.innerHTML += m;
  });
  notificationBadge.textContent=messages.length;
}

async function removeBlog(id, token) {
  try {
    const response = await fetch(`${api_url}/api/blogs/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete resource");
    }
    const data = await response.json();
  } catch (error) {
    console.error("Error deleting resource:", error);
  }
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
  if (!navbar.classList.contains("nav-bar-small")) {
    document.querySelector(".dashboard-main-container").style.marginLeft =
      "230px";
  } else {
    document.querySelector(".dashboard-main-container").style.marginLeft =
      "80px";
  }
}

async function deleteMessage(id, token) {
  try {
    const response = await fetch(`${api_url}/api/messages/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to delete resource");
    }
    displayMessages(AllMessages);
  } catch (error) {
    console.error("Error deleting resource:", error);
  }
 
}
function replyMessage(email) {
  
  window.location.href = `mailto:${email}`;
}

function displayRecentMessages(messages) {
  let mappedMessages = messages.map((m) => {
    return `
<div class="message-item">
<div class="message-title"><i class="fa fa-user-circle fa-lg"></i>
    <h4>${m.name}</h4></div>
    <p>${m.messageBody}</p>
</div>
`;
  });
  recentMessages.innerHTML = "";
  for (let i = 0; i < 4; i++) {
    if(mappedMessages[i])
    recentMessages.innerHTML += mappedMessages[i];
  }
}
//// blog edit
const publish = document.getElementById("publish");
const update = document.getElementById("update");
const uploadLink = document.getElementById("upload-link");
const inputFile = document.getElementById("input-file");
const blogTitle = document.getElementById("blog-title");
const blogBody = document.getElementById("mytextarea");
let base64String = "";
let imgcontainer = document.getElementById("img-preview");
let cancelBtn = document.querySelector(".btn-cancel");

publish.addEventListener("click", async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append("blogTitle", blogTitle.value);
  formData.append("blogBody", blogBody.value);
  formData.append("image", inputFile.files[0]);
  await writePost(formData, token);
  inputFile.value = "";
  blogTitle.value = "";
  blogBody.value = "";
  imgcontainer.style.display = "none";
  fetchBlogs();
});

function getURLParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return decodeURIComponent(urlParams.get(name));
}
let editId = getURLParameter("id");
if (editId) {
  let blogs = JSON.parse(localStorage.getItem("AllBlogs")) || [];
  let item = blogs.find((item) => item.id === editId);
  if (item) {
    let itemIndex = blogs.findIndex((item) => item.id === editId);
    blogBody.value = item.body;
    base64String = item.imgurl;
    blogTitle.value = item.tilte;
    imgcontainer.style.display = "inline";
    imgcontainer.innerHTML = `
    <img src=${item.imgurl}>
    `;
    update.addEventListener("click", (e) => {
      e.preventDefault();
      updateBlog(itemIndex, item, blogs);
    });
  }
}

uploadLink.addEventListener("click", (e) => {
  e.preventDefault();
  inputFile.click();
});

inputFile.addEventListener("change", (e) => {
  const fileImage = inputFile.files[0];
  const reader = new FileReader();
  reader.onload = function () {
    base64String = reader.result;
    imgcontainer.style.display = "inline";
    imgcontainer.innerHTML = `
   <img src=${base64String}>
   `;
  };
  reader.readAsDataURL(fileImage);
});

// function updateBlogs(index, item, blogs) {
//   item = {
//     ...item,
//     body: blogBody.value,
//     tilte: blogTitle.value,
//     imgurl: base64String,
//   };
//   blogs[index] = item;
//   localStorage.setItem("AllBlogs", JSON.stringify(blogs));
//   blogBody.value = "";
//   blogTitle.value = "";
//   imgcontainer.style.display = "none";
//   AllBlogs = blogs;
//   displayBlogs(AllBlogs);
//   cancelBtn.click();
// }

cancelBtn.addEventListener("click", (e) => {
  e.preventDefault();
  resetForm();
  blogEdit.style.display = "none";
});

const fetchBlogs = async function () {
  try {
    const response = await fetch(`${api_url}/api/blogs`);

    if (!response.ok) {
      throw new Error("failed to fetch blogs");
      return;
    }
    const result = await response.json();
    //  const authorPromises = result.data.map(blog => fetchAuthor(blog.author));
    //  const authors = await Promise.all(authorPromises)

    blogList = result.data;
    //  blogList=blogList.map((blog,index)=>{
    //      return{...blog,author:authors[index]}
    //  })
    displayBlogs(blogList);
  } catch (error) {
    console.error("error while fetching blogs:", error);
  }
};

// function retrieving all users

const fetchUsers = async function () {
  try {
    const response = await fetch(`${api_url}/api/users`);
    if (!response.ok) {
      throw new Error("failed to fetch users");
    }
    const result = await response.json();
    AllUsers = result.data;
    // displayUsers(AllUsers);
  } catch (error) {
    console.error("error while fetching users", error);
  }
};

// a function retrieving all messages
const fetchMessages = async function () {
  try {
    const response = await fetch(`${api_url}/api/messages`);
    if (!response.ok) {
      throw new Error("failed to fetch messages");
    }
    const result = await response.json();
    AllMessages = result.data;
    displayMessages(AllMessages);
    displayRecentMessages(AllMessages);
  } catch (error) {
    console.error("error while fetching users", error);
  }
};

// function to create a user

  const createUser = async (user) => {
  try {
    const response = await fetch(`${api_url}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData.message)
      throw new Error("failed to create user");
    }
    const data = await response.json();
    
    document.querySelector('.createUserMessage').textContent="user created successfully"
    document.querySelector('.createUserMessage').style.visibility='visible';
    setTimeout(()=>{
      document.querySelector('.createUserMessage').style.visibility='hidden';
    },2000);
    fetchUsers();
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

// write a post function

async function writePost(formData, token) {
  try {
    const response = await fetch(`${api_url}/api/blogs`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json();
      document.querySelector(".blogEditMessage").textContent =
        errorData.message;
      throw new Error("failed to post a blog");
    }
    cancelBtn.click();
  } catch (error) {
    console.error("error writing a blog:", error);
  }
}
function resetForm() {
  inputFile.value = "";
  blogTitle.value = "";
  blogBody.value = "";
  imgcontainer.style.display = "none";
}
async function updateBlog(formData, token, id) {
  try {
    const response = await fetch(`${api_url}/api/blogs/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData);
      // throw new Error("Failed to update the blog");
    }
    const result = await response.json();
    console.log(result.data);
  } catch (error) {}
}

const fetchOneBlog = async function (id) {
  try {
    const response = await fetch(`${api_url}/api/blogs/${id}`);
    if (!response.ok) {
      throw new Error("failed to fetch blog");
      return;
    }
    const result = await response.json();
    console.log(result.data);
    return result.data;
  } catch (error) {
    console.error("error while fetching blogs:", error);
  }
};
const removeUsers=async function(id,token){
  try {
    const response= await fetch(`${api_url}/api/users/${id}`,{
      method:'DELETE',
      headers:{
        'Authorization':`Bearer ${token}`
      }
    })
    if(!response.ok){
      throw new Error('failed to delete user');
      const errorData= await response.json()
      console.log(errorData.message)
    }
  } catch (error) {
    console.error('failed to delete user',error)
  }
}

