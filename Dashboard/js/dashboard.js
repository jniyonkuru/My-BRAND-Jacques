const sections=document.querySelectorAll('section');
const navLinks=document.querySelectorAll('.nav-bar ul li a');

function updateNavbar(){
sections.forEach(section=>{
    const sectionTOp=section.offsetTop;
    const sectionHeight=section.clientHeight;
    if(window.scrollY>=sectionTOp&&window.scrollY<sectionTOp+sectionHeight){
        const targetLink=document.querySelector(`.nav-bar ul li a[href='#${section.id}']`);
        console.log(targetLink)
        navLinks.forEach(link=>link.classList.remove('active'));
        targetLink.classList.add('active');
    }
})

}
window.addEventListener('scroll' ,updateNavbar)
