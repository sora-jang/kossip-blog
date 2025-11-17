// Function to render navbar on all pages
function renderNavbar() {
  const isInPosts = window.location.pathname.includes("/posts/");
  const homeLink = isInPosts ? "../index.html" : "index.html";

  const navbarHTML = `
    <header class="navbar">
      <div class="nav-container">
        <a href="${homeLink}" class="logo">kossip</a>
      </div>
    </header>
  `;

  const body = document.body;
  if (body) {
    body.insertAdjacentHTML("afterbegin", navbarHTML);
  }
}

// Initialize navbar when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderNavbar);
} else {
  renderNavbar();
}
