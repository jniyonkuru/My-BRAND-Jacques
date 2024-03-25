import { hideLoader,showLoader } from "./util/loader.js";
import {api_url} from './util/apiUrl.js'
console.log(api_url)

document.querySelector('header nav .menu-burger').addEventListener('click',(e)=>{
    document.querySelector('header nav ul').classList.toggle('collapsible');
})
const searchInput=document.querySelector('.search-bar input');

const isAdmin=document.querySelector('#Admin-only');
const blogsContainer= document.querySelector('.blogs-container');
let readMoreBtns=[];
let blogList=[];
let author='';

window.addEventListener('DOMContentLoaded',(e)=>{
    let token=localStorage.getItem('token');
    showLoader();
    
       if(token){
        const [header, payload, signature] = token.split('.');
        const decodedPayload = atob(payload);
        const payloadObj = JSON.parse(decodedPayload)
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

searchInput.addEventListener('input',(e)=>{
e.preventDefault();
let query=searchInput.value;
console.log(searchInput)
searchBlog(query)

   
})

    fetchBlogs()
})
  // function to fetch blogs

const fetchBlogs=async function(){
   try {
    const response= await fetch(`${api_url}/api/blogs`);

    if(!response.ok){
        throw new Error('failed to fetch blogs')
    }
    const result=await response.json();
    const authorPromises = result.data.map(blog => fetchAuthor(blog.author));
    const authors = await Promise.all(authorPromises)

    blogList=result.data;
    blogList=blogList.map((blog,index)=>{
        return{...blog,author:authors[index]}
    })
    
    setTimeout(async ()=>{
     hideLoader();
     displayBlogs(blogList);
     addEventListenerToBtns();
    },3000)
    
    
    
   } catch (error) {
      console.error('error while fetching blogs:',error)
   }

}

 // function to display blogs
 
 const displayBlogs=function(blogs){
    if(!Array.isArray(blogs)||blogs.length===0){
        blogsContainer.innerHTML="no blogs yet"
     return;
    }
   blogsContainer.innerHTML='';
  const mappedBlogs=blogs.map((item,index)=>{
    return`
    <div class="blog">
            <div class="blog-img">
            <img src=${item.image} alt="">
            </div>
            <div class="auth">
            <i class="fa fa-user-circle fa-lg"></i>
            </div>
            <span><span class="date">${item.createdAt.substring(0,10)}</span><span class="auth-name">${ '<strong>Author:</strong> ' +item.author}</span></span>
            <h4><a href="./blog-details.html">${item.blogTitle}</a></h4>
            <p>${item.blogBody.substring(0,50)+'....'}</p>
            <a class='readmore' key=${item._id}>Read more</a>
        </div>
    
    `
  })
  for(let blog of mappedBlogs){
    blogsContainer.innerHTML+=blog;
  }
  
 
 }

const navigateTo=function(id){
    window.location.href=`./blog-details.html?id=${id}`;

}
 const addEventListenerToBtns=function(){
    readMoreBtns=document.querySelectorAll('.readmore')
    readMoreBtns.forEach(item=>item.addEventListener('click',(e)=>{
        const blogId=e.target.getAttribute('key')
        navigateTo(blogId)
    }))  
 }

 const fetchAuthor=async function(id){
  try {
    const response= await fetch(`${api_url}/api/users/${id}`);
    if(!response.ok){
        throw new Error('can not find the author');
        return;
    }
    author=await response.json();
    console.log(author.data.name)

    return author.data.name;
    
  } catch (error) {
    console.error('error while fetching the author:',error)
  }

 }
 const searchBlog = async function(query) {
    console.log(query)
    try {
        const response = await fetch(`${api_url}/api/blogs/searchByQuery?query=${query}`);
        if (!response.ok) {
            throw new Error('Failed to fetch blog');
        }
        const blogs = await response.json();
        console.log(blogs)
        displayBlogs(blogs);
    } catch (error) {
        console.error('Error while searching the blog', error);
    }
};
