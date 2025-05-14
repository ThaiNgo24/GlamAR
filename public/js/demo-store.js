document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu toggle
  const menuToggle = document.querySelector(".mobile-menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", function () {
      menuToggle.classList.toggle("active");
      mobileMenu.classList.toggle("active");
      document.body.classList.toggle("menu-open");
    });
  }

  // Mobile dropdown toggles
  const mobileDropdownToggles = document.querySelectorAll(
    ".mobile-nav-link .mobile-dropdown-toggle"
  );

  mobileDropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const parent = this.closest(".mobile-nav-item");
      const dropdown = parent.querySelector(".mobile-dropdown-content");

      this.classList.toggle("active");
      dropdown.classList.toggle("active");
    });
  });

  // Scroll animations
  const animateElements = document.querySelectorAll(".reveal");

  function checkScrollAnimation() {
    const triggerBottom = window.innerHeight * 0.85;

    animateElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;

      if (elementTop < triggerBottom) {
        element.classList.add("visible");
      }
    });
  }

  // Run once on load
  checkScrollAnimation();

  // Run on scroll
  window.addEventListener("scroll", checkScrollAnimation);

  // Header scroll effect
  const header = document.querySelector(".header");

  function handleHeaderScroll() {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", handleHeaderScroll);

  // Theme toggle
  const themeToggle = document.querySelector(".theme-toggle");

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      document.body.classList.toggle("dark-theme");

      // Save theme preference
      const isDarkMode = document.body.classList.contains("dark-theme");
      localStorage.setItem("darkMode", isDarkMode);
    });

    // Check for saved theme preference
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    if (savedDarkMode) {
      document.body.classList.add("dark-theme");
    }
  }

  // Try-on card animations
  const tryonCards = document.querySelectorAll(".tryon-card");

  tryonCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      // Remove active class from all cards
      tryonCards.forEach((c) => c.classList.remove("active"));

      // Add active class to current card
      this.classList.add("active");

      // Add expanding class for z-index control
      this.classList.add("expanding");

      // Play video
      const video = this.querySelector("video");
      if (video) {
        video.play();
      }
    });

    card.addEventListener("mouseleave", function () {
      // Remove expanding class
      this.classList.remove("expanding");

      // Pause video
      const video = this.querySelector("video");
      if (video) {
        video.pause();
      }
    });
  });

  // Solution cards video hover
  const solutionCards = document.querySelectorAll(".solution-card");

  solutionCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      const video = this.querySelector("video");
      if (video) {
        video.play();
      }
    });

    card.addEventListener("mouseleave", function () {
      const video = this.querySelector("video");
      if (video) {
        video.pause();
      }
    });
  });

  // Categories hover effect
  const categoryItems = document.querySelectorAll(".category-item");

  categoryItems.forEach((item) => {
    item.addEventListener("mouseenter", function () {
      this.classList.add("hovered");
    });

    item.addEventListener("mouseleave", function () {
      this.classList.remove("hovered");
    });
  });

  // Chat button
  const chatButton = document.querySelector(".chat-button");

  if (chatButton) {
    chatButton.addEventListener("click", function () {
      alert("Chat feature would open here!");
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Kiểm tra trạng thái đăng nhập
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  if (token && userData) {
    try {
      const user = JSON.parse(userData);

      // Cập nhật UI cho người dùng đã đăng nhập
      const loginBtn = document.querySelector('a[href="../login.html"]');
      if (loginBtn) {
        loginBtn.textContent = user.username;
        loginBtn.href = "#";
        loginBtn.addEventListener("click", (e) => {
          e.preventDefault();
          // Hiển thị menu dropdown với tùy chọn đăng xuất
        });

        // Thêm nút đăng xuất
        const logoutBtn = document.createElement("a");
        logoutBtn.href = "#";
        logoutBtn.className = "btn btn-outline";
        logoutBtn.textContent = "Logout";
        logoutBtn.addEventListener("click", (e) => {
          e.preventDefault();
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login.html";
        });

        loginBtn.parentNode.insertBefore(logoutBtn, loginBtn.nextSibling);
      }
    } catch (e) {
      console.error("Error parsing user data:", e);
    }
  }
});
