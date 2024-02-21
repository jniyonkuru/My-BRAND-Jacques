
document.querySelector('header nav .menu-burger').addEventListener('click',(e)=>{
    console.log("clicked")
    document.querySelector('header nav ul').classList.toggle('collapsible');
})