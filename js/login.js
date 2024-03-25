document.querySelector('header nav .menu-burger').addEventListener('click',(e)=>{
  document.querySelector('header nav ul').classList.toggle('collapsible');
})
import {api_url} from '../js/util/apiUrl.js'

let errorMessage = document.querySelector(".login-form form p");
window.addEventListener("DOMContentLoaded", (e) => {
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

  const loginForm = document.querySelector(".login-form form");

  const loginEmail = document.querySelector(".login-form form #loginemail");
  const loginPassword = document.querySelector(
    ".login-form form #loginpassword"
  );

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();
    try {
      const response = await fetch(`${api_url}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to login");
      }

      // Extract the JWT token from the response
      const { token } = await response.json();

      // Store the token in localStorage
      localStorage.setItem("token", token);

      // Redirect to home page upon successful login
      window.location.href = "./index.html";
    } catch (error) {
      console.error("Error during login:", error);
      showError(error.message || "Failed to login. Please try again.");
    }
  });
});

function showError(message) {
  errorMessage.style.color = "red";
  errorMessage.innerHTML = message;
}
