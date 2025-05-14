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
  // Hàm kiểm tra và xác thực người dùng
  const checkAuth = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      return null;
    }

    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  };

  // Hàm hiển thị thông tin user
  const displayUserProfile = (user) => {
    const loginBtn = document.querySelector('a[href="../login.html"]');
    if (!loginBtn) return;

    // Tạo container profile
    const profileContainer = document.createElement("div");
    profileContainer.className = "user-profile-container";
    profileContainer.style.display = "flex";
    profileContainer.style.alignItems = "center";
    profileContainer.style.gap = "10px";

    // Tạo link profile
    const profileLink = document.createElement("a");
    profileLink.href = `/profile.html?id=${user.id}`;
    profileLink.className = "user-profile-link";
    profileLink.style.display = "flex";
    profileLink.style.alignItems = "center";
    profileLink.style.gap = "8px";
    profileLink.style.transition = "all 0.3s ease";

    // Tạo avatar
    const avatar = document.createElement("div");
    avatar.className = "user-avatar";
    avatar.textContent = user.username.charAt(0).toUpperCase();
    avatar.style.width = "32px";
    avatar.style.height = "32px";
    avatar.style.borderRadius = "50%";
    avatar.style.backgroundColor = "#da0e64";
    avatar.style.color = "white";
    avatar.style.display = "flex";
    avatar.style.alignItems = "center";
    avatar.style.justifyContent = "center";
    avatar.style.fontWeight = "bold";

    // Tạo tên user
    const userName = document.createElement("span");
    userName.className = "user-name";
    userName.textContent = user.username;
    userName.style.fontWeight = "500";
    userName.style.whiteSpace = "nowrap";
    userName.style.overflow = "hidden";
    userName.style.textOverflow = "ellipsis";
    userName.style.maxWidth = "120px";

    // Tạo dropdown icon
    const dropdownIcon = document.createElement("span");
    dropdownIcon.className = "dropdown-icon";
    dropdownIcon.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    // Gắn các phần tử vào DOM
    profileLink.appendChild(avatar);
    profileLink.appendChild(userName);
    profileLink.appendChild(dropdownIcon);
    profileContainer.appendChild(profileLink);

    // Thay thế nút login
    loginBtn.replaceWith(profileContainer);

    // Tạo dropdown menu
    const dropdownMenu = document.createElement("div");
    dropdownMenu.className = "user-dropdown-menu";
    dropdownMenu.style.position = "absolute";
    dropdownMenu.style.top = "100%";
    dropdownMenu.style.right = "0";
    dropdownMenu.style.backgroundColor = "white";
    dropdownMenu.style.borderRadius = "8px";
    dropdownMenu.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
    dropdownMenu.style.padding = "8px 0";
    dropdownMenu.style.minWidth = "180px";
    dropdownMenu.style.zIndex = "100";
    dropdownMenu.style.display = "none";
    dropdownMenu.style.overflow = "hidden";

    // Tạo menu item
    const menuItems = [
      { text: "My Profile", icon: "👤", href: `/profile.html?id=${user.id}` },
      { text: "Settings", icon: "⚙️", href: "/settings.html" },
      { text: "Logout", icon: "🚪", action: "logout" },
    ];

    menuItems.forEach((item) => {
      const menuItem = document.createElement("a");
      menuItem.className = "user-menu-item";
      menuItem.href = item.href || "#";
      menuItem.style.display = "flex";
      menuItem.style.alignItems = "center";
      menuItem.style.padding = "8px 16px";
      menuItem.style.color = "#141b1d";
      menuItem.style.transition = "all 0.2s ease";

      if (item.action === "logout") {
        menuItem.addEventListener("click", (e) => {
          e.preventDefault();
          handleLogout();
        });
      }

      const iconSpan = document.createElement("span");
      iconSpan.style.marginRight = "8px";
      iconSpan.textContent = item.icon;

      const textSpan = document.createElement("span");
      textSpan.textContent = item.text;

      menuItem.appendChild(iconSpan);
      menuItem.appendChild(textSpan);
      dropdownMenu.appendChild(menuItem);

      menuItem.addEventListener("mouseenter", () => {
        menuItem.style.backgroundColor = "#f5f5f5";
      });

      menuItem.addEventListener("mouseleave", () => {
        menuItem.style.backgroundColor = "transparent";
      });
    });

    // Thêm dropdown vào DOM
    profileContainer.appendChild(dropdownMenu);

    // Xử lý click để mở/đóng dropdown
    profileLink.addEventListener("click", (e) => {
      e.preventDefault();
      const isVisible = dropdownMenu.style.display === "block";
      dropdownMenu.style.display = isVisible ? "none" : "block";
    });

    // Đóng dropdown khi click bên ngoài
    document.addEventListener("click", (e) => {
      if (!profileContainer.contains(e.target)) {
        dropdownMenu.style.display = "none";
      }
    });
  };

  // Hàm xử lý logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Hiển thị thông báo logout thành công
    showNotification("You have been logged out successfully", "success");

    // Chuyển hướng sau 1.5 giây
    setTimeout(() => {
      window.location.href = "/login.html";
    }, 1500);
  };

  // Hàm hiển thị thông báo
  const showNotification = (message, type = "success") => {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.position = "fixed";
    notification.style.top = "20px";
    notification.style.right = "20px";
    notification.style.padding = "12px 20px";
    notification.style.backgroundColor =
      type === "success" ? "#da0e64" : "#f44336";
    notification.style.color = "white";
    notification.style.borderRadius = "4px";
    notification.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
    notification.style.zIndex = "1000";
    notification.style.transform = "translateX(120%)";
    notification.style.transition = "transform 0.3s ease";

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 10);

    setTimeout(() => {
      notification.style.transform = "translateX(120%)";
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  };

  // Kiểm tra và hiển thị thông tin user
  const currentUser = checkAuth();
  if (currentUser) {
    displayUserProfile(currentUser);
  } else {
    // Xóa token không hợp lệ nếu có
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
});
