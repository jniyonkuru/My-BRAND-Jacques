import {
  validateMail,
  validateName,
  validatePassword,
  confirmPassword,
} from "../../js/util/validation.js";

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

// create user
const userName = document.querySelector(".add-contact #name");
const userEmail = document.querySelector(".add-contact #email");
const userPassword = document.querySelector(".add-contact #password");
const userConfirmPassword = document.querySelector("#password-confirm");
const createUserForm = document.querySelector(".add-contact form");
const errorMessages = document.querySelectorAll(".error-messages");
const isAdminCheck = document.querySelector("#isadmin");
const registerUserForm = document.querySelector(".add-contact form");
console.log(userConfirmPassword);

let blogList = [];
let AllUsers = [];
let AllMessages = [];

// ++++++++ update and nav bar++++++++

chevronToggler.addEventListener("click", (e) => {
  e.target.classList.toggle("flip");
  toggleNavBar();
});

let token = localStorage.getItem("token");
const [header, payload, signature] = token.split(".");
const decodedPayload = atob(payload);
const payloadObj = JSON.parse(decodedPayload);
if (payloadObj) {
  currentUser.innerHTML = payloadObj.userName;
}
window.addEventListener("DOMContentLoaded", (e) => {
  fetchBlogs();
  displayBlogs(blogList);
  fetchUsers();
  fetchMessages();
  displayUsers(AllUsers);
  displayMessages(AllMessages);
  if (loggedInUser) {
    currentUser.innerHTML = loggedInUser.name;
  }
  if (!navbar.classList.contains("nav-bar-small")) {
    document.querySelector(".dashboard-main-container").style.marginLeft =
      "230px";
  } else {
    document.querySelector(".dashboard-main-container").style.marginLeft =
      "100px";
  }
  blogsList.addEventListener("click", (e) => {
    let id = e.target.closest(".fa-trash-can").getAttribute("key");
    removeBlog(id, token);
  });
  dashboardMessages.addEventListener("click", (e) => {
    e.preventDefault();
    let id = e.target.closest(".fa-trash-can").getAttribute("key");
    deleteMessage(id, token);
  });
  displayRecentMessages(AllMessages);

  registerUserForm.addEventListener("submit", (e) => {
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

    createUser(newUser);
  });
});

blogsList.addEventListener("click", async (e) => {
  let id = e.target.closest(".fa-pen").getAttribute("key");
  blogEdit.style.display = "flex";
  let item= await fetchOneBlog(id);
  if (item) {
    blogBody.value = item.blogBody;
    base64String = item.image;
    console.log(base64String)
    blogTitle.value = item.blogTitle;
    imgcontainer.style.display = "inline";
    imgcontainer.innerHTML = `
    <img src=${item.image}>  `;
    update.addEventListener("click", async(e) => {
      e.preventDefault();
      const formData= new FormData();
      formData.append('blogTitle',blogTitle.value);
      formData.append('blogBody',blogBody.value)
      formData.append('image',`${inputFile.files[0]||base64String}`);
      await updateBlog(formData,token,id);

    });
  }
});

dashboardMessages.addEventListener("click", (e) => {
  e.preventDefault();
  let id = e.target.closest(".fa-reply").getAttribute("key");
  replyMessage(id);
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
         <span>5</span></i><span>Likes</span> 

         </div>
         <div class="dashboard-blog-description-foot-item">
              <i class="fa-solid fa-pen" key=${blog._id}></i><span>Edit</span> 
         </div>
         <div class="dashboard-blog-description-foot-item">
         <i class="fa-solid fa-trash-can" key=${
           blog._id
         }></i><span>delete</span>
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
      </tr>
    `;
  });
  mappedUsers.forEach((user) => (userTableBody.innerHTML += user));
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
    <i class="fa-solid fa-reply" key=${m._id}></i>
    </span>
    <span class="dashboard-message-item-date">${m.date.substring(0, 10)} ,\n\n${
      m.date
    }</span>
  </div>
    `;
  });
  mappedMessages.forEach((m) => {
    dashboardMessages.innerHTML += m;
  });
}

async function removeBlog(id, token) {
  try {
    const response = await fetch(`http://localhost:3008/api/blogs/${id}`, {
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
    console.log("Resource deleted:", data);
  } catch (error) {
    console.error("Error deleting resource:", error);
  }
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
    const response = await fetch(`http://localhost:3008/api/messages/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete resource");
    }
  } catch (error) {
    console.error("Error deleting resource:", error);
  }

  displayMessages(AllMessages);
}
function replyMessage(id) {
  let email = AllMessages.filter((user) => user.id === id)[0].email;
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
    const response = await fetch("http://localhost:3008/api/blogs");

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
    const response = await fetch("http://localhost:3008/api/users");
    if (!response.ok) {
      throw new Error("failed to fetch users");
    }
    const result = await response.json();
    AllUsers = result.data;
    displayUsers(AllUsers);
  } catch (error) {
    console.error("error while fetching users", error);
  }
};

// a function retrieving all messages
const fetchMessages = async function () {
  try {
    const response = await fetch("http://localhost:3008/api/messages");
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
    const response = await fetch("http://localhost:3008/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error("failed to create user");
    }
    const data = await response.json();
    console.log("User created:", data.message);
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

// write a post function

async function writePost(formData, token) {
  try {
    const response = await fetch("http://localhost:3008/api/blogs", {
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
async function updateBlog(formData, token,id) {
  try {
    const response = await fetch(`http://localhost:3008/api/blogs/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body:formData,
    });
    if (!response.ok) {
      const errorData= await response.json()
      console.log(errorData)
      // throw new Error("Failed to update the blog");
    }
    const result = await response.json();
    console.log(result.data);
  } catch (error) {}
}

const fetchOneBlog = async function (id) {
  try {
    const response = await fetch(`http://localhost:3008/api/blogs/${id}`);
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