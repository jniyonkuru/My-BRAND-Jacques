let blog='';
let blogDetailsContainer=document.querySelector('.blog-details');
const isAdmin=document.querySelector('#Admin-only');
window.addEventListener('DOMContentLoaded',(e)=>{
    e.preventDefault();
    let token=localStorage.getItem('token');

    
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

    function getURLParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return decodeURIComponent(urlParams.get(name));
      }
    let BlogId = getURLParameter('id');
    fetchOneBlog(BlogId)
})

const fetchOneBlog=async function(id){

        try {
            const response= await fetch(`http://localhost:3008/api/blogs/${id}`);
        
            if(!response.ok){
                throw new Error('failed to fetch blog')
            }
            const result=await response.json();
            blog=result.data;
            if(!blog){
                throw new Error('no such blog')
            }
           let author=fetchAuthor(blog.author);
            blog.author=await author;
            displayBlog(blog)
            
           } catch (error) {
              console.error('error while fetching bookmarks:',error)
           } 
  
}

    const displayBlog=function(blog){
      
     blogDetailsContainer.innerHTML+=`
     <div class="auth-card">
     <i class="fa fa-user-circle fa-lg"></i>
     <span><span class="date">${blog.createdAt.substring(0,10)}</span><span class="auth-name">${'<strong>Author:</strong> '+blog.author}</span></span>
   </div>
   <div class="blog-details-img">
     <img src=${blog.image} alt='blog image' />
   </div>
   <h3>${blog.blogTitle}</h3>
   <p>
     ${blog.blogBody}
   </p>
     
     `
    }
const fetchAuthor=async function(id){
  try {
    const response= await fetch(`http://localhost:3008/api/users/${id}`);
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