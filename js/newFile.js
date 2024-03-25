window.addEventListener("DOMContentLoaded", async (e) => {
  e.preventDefault();
  login.addEventListener("submit", async (e) => {
    let email = loginEmail.value.trim();
    let password = loginPassword.value.trim();
    try {
      const response = await fetch("http://localhost:3008/api/users/login", {
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
      console.log(token);
      // Store the token in localStorage
      localStorage.setItem("token", token);

      // Redirect to home page upon successful login
      // window.location.href=`./blog-details.html?id=${BlogId}`
    } catch (error) {
      console.error("Error during login:", error);
      showError(error.message || "Failed to login. Please try again.");
    }
  });
  commentLink.addEventListener("click", (e) => {
    e.preventDefault();
    allComments.classList.toggle("collapsible");
  });
  commentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!token) {
      loginBlog.style.display = "block";
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
    login.style.display = "none";
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
