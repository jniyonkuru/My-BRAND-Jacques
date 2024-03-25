
import { api_url } from "./util/apiUrl.js";

let blog = "";
let comment = {};
let user={}
const loginBlog=document.querySelector('.blog-detailed .login-form');
const loginForm=document.querySelector('.blog-detailed .login-form form');
const loginEmail=document.querySelector('#loginemail');
const loginPassword=document.querySelector('#loginpassword');
let commentLink = document.querySelector("#comments");
let commentsCount = document.querySelector(".commnets-counts");
const allComments = document.querySelector(".all-comments .commentsList");
const commentForm = document.querySelector(".comment-form form");
const textArea = document.querySelector(".comment-form textarea");
let blogDetailsContainer = document.querySelector(".blog-details");
const isAdmin = document.querySelector("#Admin-only");
const likesCount=document.querySelector('.likes-count');
const likeIcon=document.querySelector('#like i');
window.addEventListener("DOMContentLoaded", async (e) => {
  e.preventDefault();
  document.querySelector('header nav .menu-burger').addEventListener('click',(e)=>{
    document.querySelector('header nav ul').classList.toggle('collapsible');
});
likeIcon.addEventListener('click',async(e)=>{
  e.preventDefault();
  if(!token){
    loginBlog.style.visibility='visible';
      return;
  }
   await likeBlog(BlogId,token);
   fetchOneBlog(BlogId)
})
  commentLink.addEventListener("click", (e) => {
    e.preventDefault();
    allComments.classList.toggle("collapsible");
  });
  commentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!token) {
      loginBlog.style.visibility='visible';
      return;
    }
    comment.commentBody = textArea.value.trim();
    if (comment) {
      await writeComment(BlogId, token, comment);
      fetchOneBlog(BlogId);
      e.target.reset();
    } else {
      return;
    }
  });
  let token = localStorage.getItem("token");
  if (token) {
    const [header, payload, signature] = token.split(".");
    const decodedPayload = atob(payload);
    const payloadObj = JSON.parse(decodedPayload);
    logout.style.display = "flex";
    logout.innerHTML = `<i class="fa-solid fa-circle-user"></i>\n\n<span>${payloadObj.userName}</span><i id='2'class="fa-solid fa-circle-chevron-down"></i>
        <span id="dropDownbtnNav"><button>log out</button></span>
        `;
    loginForm.style.display = "none";
    const dropdwonchevron = document.getElementById("2");
    const dropDownbtnNav = document.querySelector("#dropDownbtnNav");
    const signoutbtn = document.querySelector("#dropDownbtnNav button");
    dropdwonchevron.addEventListener("mouseenter", (e) => {
      dropDownbtnNav.style.display = "block";
    });
    dropDownbtnNav.addEventListener("mouseleave", (e) => {
      dropDownbtnNav.style.display = "none";
      e.target.style.background = "var(--primary-color)";
    });
    signoutbtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("token");
      window.location.href = "../index.html";
    });
    if (payloadObj.isAdmin) {
      isAdmin.style.display = "inline";
    }
  }

  function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return decodeURIComponent(urlParams.get(name));
  }
  let BlogId = getURLParameter("id");
  fetchOneBlog(BlogId);
});


loginForm.addEventListener('submit',async(e)=>{
  e.preventDefault();
  console.log(loginEmail)
  let email=loginEmail.value.trim();
  let password=loginPassword.value.trim();
 try {
   const response = await fetch(`${api_url}/api/users/login`, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({email,password })
   });

   if (!response.ok) {
     const errorData = await response.json();
     throw new Error(errorData.message || 'Failed to login');
   }
   // Extract the JWT token from the response
   const { token } = await response.json();
   // Store the token in localStorage
   localStorage.setItem('token', token);
   // Redirect to home page upon successful login
   location.reload()
   loginBlog.style.visibility='hidden';
 } catch (error) {
   console.error('Error during login:', error);
   showError(error.message || 'Failed to login. Please try again.');
 }
 })

const fetchOneBlog = async function (id) {
  try {
    const response = await fetch(`${api_url}/api/blogs/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch blog");
    }
    const result = await response.json();
    let blog = result.data;
    if (!blog) {
      throw new Error("No such blog");
    }
    let author = await fetchAuthor(blog.author);
    let comments = await fetchComments(id);
    console.log(comments)
    comments = await Promise.all(
      comments.map(async (comment) => {
        return {
          ...comment,
          author: `${await fetchAuthor(comment.author)}`,
        };
      })
    );
    blog.comments = comments;
    blog.author = await author;
    displayBlog(blog);
  } catch (error) {
    console.error("Error while fetching blog:", error);
  }
};

const displayBlog = function (blog) {
  blogDetailsContainer.innerHTML = "";
  blogDetailsContainer.innerHTML += `
     <div class="auth-card">
     <i class="fa fa-user-circle fa-lg"></i>
     <span><span class="date">${blog.createdAt.substring(
       0,
       10
     )}</span><span class="auth-name">${
    "<strong>Author:</strong> " + blog.author
  }</span></span>
   </div>
   <div class="blog-details-img">
     <img src=${blog.image} alt='blog image' />
   </div>
   <h3>${blog.blogTitle}</h3>
   <p>
     ${blog.blogBody}
   </p>
     
     `;
  commentsCount.textContent = blog.comments.length;
  likesCount.textContent=blog.likes;                    
  allComments.innerHTML='';
  blog.comments.forEach((element) => {
    allComments.innerHTML += `
    <div class="comment-item">
    <div class="comment-title">
    <div class='comment-author'>
    <i class="fa fa-user-circle fa-lg"></i>
    <h5>${element.author}</h5>
    </div>
    <div id="tm">${element.createdAt.substring(0, 10)}</div>
    </div>
    <p>${element.commentBody}</p>`;
    commentForm.setAttribute("key", `${blog._id}`);
  });
};
const fetchAuthor = async function (id) {
  try {
    const response = await fetch(`${api_url}/api/users/${id}`);
    if (!response.ok) {
      throw new Error("can not find the author");
      return;
    }
     const author = await response.json();
    console.log(author.data.name);
    return author.data.name;
  } catch (error) {
    console.error("error while fetching the author:", error);
  }
};
const fetchComments = async function (blogId) {
  try {
    const response = await fetch(
      `${api_url}/api/blog/${blogId}/comments`
    );
    if (!response.ok) {
      throw new Error("failed to fetch comments");
    }
    const result = await response.json();
    console.log(result.data);
    return result.data;
  } catch (error) {
    console.error("Error while fetching comments:", error);
  }
};
const writeComment = async function (blogId, token, comment) {
  try {
    const response = await fetch(
      `${api_url}/api/blog/${blogId}/comments`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        
        body: JSON.stringify(comment),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error("error writing a comment");
    }
  } catch (error) {
    console.error("Error while commenting", error);
  }
};
const likeBlog=async function (blogId,token){
  try {
    const response= await fetch(`${api_url}/api/blogs/${blogId}/like`,{
      method:'POST',
      headers:{
        Authorization: `Bearer ${token}`
      }
    });
    if(!response.ok){
      const errorData= await response.json();
    throw new  Error('failed to like a blog')
    }
  } catch (error) {
    console.error('Error occurred while liking a blog post',error.message);
  }
}