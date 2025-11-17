// Function to render navbar on all pages
function renderNavbar() {
  const isInPosts = window.location.pathname.includes("/posts/");
  const homeLink = isInPosts ? "../index.html" : "index.html";
  const aboutLink = isInPosts ? "../about.html" : "about.html";

  const navbarHTML = `
    <header class="navbar">
      <div class="nav-container">
        <a href="${homeLink}" class="logo">kossip</a>

        <nav class="nav-links">
          <a href="${isInPosts ? '../about.html' : 'about.html'}" class="nav-link">About</a>
        </nav>
      </div>
    </header>
  `;

  document.body.insertAdjacentHTML("afterbegin", navbarHTML);
}

// Initialize navbar when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderNavbar);
} else {
  renderNavbar();
}
