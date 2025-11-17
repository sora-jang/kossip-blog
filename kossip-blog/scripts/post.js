// Function to render individual post page
async function renderPost() {
  const main = document.querySelector("main");
  if (!main) return;

  // Extract slug from query parameter (e.g., "?slug=1" -> "1")
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get("slug");

  if (!slug) {
    main.innerHTML =
      "<div class='post-container'><p style='text-align: center;'>게시물을 찾을 수 없습니다.</p></div>";
    return;
  }

  try {
    const response = await fetch(`../assets/data/post-${slug}.json`);
    if (!response.ok) {
      main.innerHTML =
        "<div class='post-container'><p style='text-align: center;'>게시물을 찾을 수 없습니다.</p></div>";
      return;
    }

    const post = await response.json();

    // Adjust image paths - add ../ prefix since we're in posts/ directory
    const adjustImagePath = (src) => {
      if (src.startsWith("../")) return src;
      return `../${src}`;
    };

    // Update page title
    document.title = post.title;

    // Open Graph meta tags are now handled in post.html's synchronous script for social media crawlers
    // // Update Open Graph meta tags
    // // Use thumbnail.src as-is (relative to root) and convert to absolute URL
    // const ogImageUrl = post.thumbnail.src.startsWith("http")
    //   ? post.thumbnail.src
    //   : new URL(post.thumbnail.src, window.location.origin).href;

    // const updateMetaTag = (property, content) => {
    //   let meta = document.querySelector(`meta[property="${property}"]`);
    //   if (!meta) {
    //     meta = document.createElement("meta");
    //     meta.setAttribute("property", property);
    //     document.head.appendChild(meta);
    //   }
    //   meta.setAttribute("content", content);
    // };

    // updateMetaTag("og:title", post.title);
    // updateMetaTag("og:description", post.subtitle);
    // updateMetaTag("og:image", ogImageUrl);
    // updateMetaTag("og:type", "article");
    // updateMetaTag("og:url", window.location.href);

    // Render introduction section
    const introductionHTML = post.introduction
      .map((p) => `<p>${p}</p>`)
      .join("");

    // Render sections
    const sectionsHTML = post.sections
      .map((section) => {
        const paragraphsHTML = section.paragraphs
          .map((p) => `<p>${p}</p>`)
          .join("");
        const imageHTML = section.image
          ? `<img src="${adjustImagePath(section.image.src)}" alt="${
              section.image.alt
            }" />`
          : "";

        return `
          <section class="fade">
            ${section.heading ? `<h3>${section.heading}</h3>` : ""}
            ${paragraphsHTML}
            ${imageHTML}
          </section>
        `;
      })
      .join("");

    // Build complete HTML
    const postHTML = `
      <div class="post-container">
        <section class="fade">
          <h1>${post.title}</h1>
          <h2>${post.subtitle}</h2>
          <time>${post.date}</time>
          <img src="${adjustImagePath(post.mainImage.src)}" alt="${
      post.mainImage.alt
    }" />
        </section>

        <section class="fade">
          ${introductionHTML}
        </section>

        ${sectionsHTML}
      </div>
    `;

    main.innerHTML = postHTML;

    // Initialize fade animations
    initFadeAnimations();
  } catch (error) {
    console.error("Error loading post:", error);
    main.innerHTML = "<p>게시물을 불러오는 중 오류가 발생했습니다.</p>";
  }
}

// Function to initialize fade animations
function initFadeAnimations() {
  const faders = document.querySelectorAll(".fade");
  const appearOptions = { threshold: 0.2 };
  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, appearOptions);
  faders.forEach((fader) => appearOnScroll.observe(fader));
}

// Function to fetch all post JSON files and generate cards
async function loadPosts() {
  const contentGrid = document.querySelector(".content-grid");
  if (!contentGrid) return;

  try {
    // Auto-discover posts by trying consecutive numbers
    const posts = [];
    let i = 1;

    while (true) {
      try {
        const response = await fetch(`assets/data/post-${i}.json`);
        if (!response.ok) break; // Stop when file doesn't exist

        const post = await response.json();
        posts.push(post);
        i++;
      } catch (error) {
        break; // Stop on any error
      }
    }

    if (posts.length === 0) {
      contentGrid.innerHTML = "<p>게시물이 없습니다.</p>";
      return;
    }

    // Sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.dateISO) - new Date(a.dateISO));

    // Generate HTML for each post
    contentGrid.innerHTML = posts
      .map((post) => {
        return `
          <a href="posts/post.html?slug=${post.slug}" class="item-link">
            <div class="item">
              <img
                src="${post.thumbnail.src}"
                alt="${post.thumbnail.alt}"
                class="thumbnail"
              />
              <div class="item-text">
                <h3 class="item-title">${post.title}</h3>
                <p class="item-subtitle">${post.subtitle}</p>
              </div>
            </div>
          </a>
        `;
      })
      .join("");
  } catch (error) {
    console.error("Error loading posts:", error);
    contentGrid.innerHTML = "<p>게시물을 불러오는 중 오류가 발생했습니다.</p>";
  }
}

// Initialize based on page type
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    // Check if we're on a post page or index page
    if (window.location.pathname.includes("/posts/")) {
      renderPost();
    } else {
      loadPosts();
    }
  });
} else {
  if (window.location.pathname.includes("/posts/")) {
    renderPost();
  } else {
    loadPosts();
  }
}
