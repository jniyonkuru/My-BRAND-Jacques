
const publish=document.getElementById('publish');
const update=document.getElementById('update');
const uploadLink=document.getElementById('upload-link');
const inputFile=document.getElementById('input-file');
const blogTitle=document.getElementById('blog-title');
const blogBody=document.getElementById('mytextarea');
let base64String='';
let imgcontainer=document.getElementById('img-preview');
let AllBlogs=[];

function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return decodeURIComponent(urlParams.get(name));
  }
let editId = getURLParameter('id');
if(editId){
    let blogs=JSON.parse(localStorage.getItem('AllBlogs'))||[];
    let item=blogs.find((item,)=>item.id===editId);
    if(item){
    let itemIndex=blogs.findIndex(item=>item.id===editId);
    blogBody.value=item.body;
    blogTitle.value=item.tilte;
    imgcontainer.style.display='inline';
    imgcontainer.innerHTML=`
    <img src=${item.imgurl}>
    `
update.addEventListener('click',(e)=>{
    e.preventDefault();
    updateBlog(itemIndex,item,blogs);
})}
}

uploadLink.addEventListener('click',(e)=>{
    e.preventDefault();
    inputFile.click();
    
})

inputFile.addEventListener('change',(e)=>{
const fileImage=inputFile.files[0];
const reader=new FileReader();
 reader.onload=function(){
   base64String=reader.result;
   imgcontainer.style.display="inline"
  imgcontainer.innerHTML=`
   <img src=${base64String}>
   `
 }
reader.readAsDataURL(fileImage);

});

 function updateBlog(index,item,blogs){
   item={...item,body:blogBody.value,tilte:blogTitle.value};
   blogs[index]=item;
   localStorage.setItem('AllBlogs',JSON.stringify(blogs));
 }

publish.addEventListener('click',(e)=>{
    e.preventDefault();
    AllBlogs=JSON.parse(localStorage.getItem('AllBlogs'))||[];
    let blog={};
    if(base64String&&blogTitle.value&&blogBody){
        blog.id=new Date();
        blog.tilte=blogTitle.value;
        blog.imgurl=base64String;
        blog.body=blogBody.value;
        blog.date=new Date()
        blog.author={
            name:'Niyonkuru Jacques',
        }
    AllBlogs.push(blog);
    localStorage.setItem('AllBlogs',JSON.stringify(AllBlogs));
     inputFile.value='';
     blogTitle.value='';
     blogBody.value=''
     imgcontainer.style.display='none';
    }else{
        return;
    }
    
})