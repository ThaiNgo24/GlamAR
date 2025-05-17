document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, initializing...");

  // Initialize loader
  // initLoader();

  // Initialize mobile menu
  initMobileMenu();

  // Initialize scroll animations
  initScrollAnimations();

  // Initialize header scroll effects
  initHeaderScroll();

  // Initialize theme toggle
  initThemeToggle();

  // Initialize dropdown contents
  initDropdownContents();

  // Initialize parallax effects
  initParallaxEffects();

  // Initialize interactive elements
  initInteractiveElements();

  // Initialize tryon carousel
  initTryonCarousel();

  // Initialize hero video
  initHeroVideo();

  // Add hover effects to solution features
  initSolutionFeatures();

  console.log("Initialization complete");
});

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const mobileDropdownToggles = document.querySelectorAll(
    ".mobile-dropdown-toggle"
  );

  // Toggle mobile menu on button click
  mobileMenuToggle.addEventListener("click", function () {
    this.classList.toggle("active");
    mobileMenu.classList.toggle("active");
    document.body.classList.toggle("menu-open");
  });

  // Toggle dropdown content in mobile menu
  mobileDropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const parent = this.closest(".mobile-nav-item");
      const dropdownContent = parent.querySelector(".mobile-dropdown-content");

      this.classList.toggle("active");
      dropdownContent.classList.toggle("active");
    });
  });

  // Handle mobile menu item clicks
  document.querySelectorAll(".mobile-nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      if (
        this.nextElementSibling &&
        this.nextElementSibling.classList.contains("mobile-dropdown-content")
      ) {
        e.preventDefault();
        this.querySelector(".mobile-dropdown-toggle").click();
      }
    });
  });
}

/**
 * Initialize scroll animations
 */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll(".reveal");

  // Initial check for elements in viewport
  checkRevealElements();

  // Check for elements in viewport on scroll
  window.addEventListener("scroll", checkRevealElements);

  function checkRevealElements() {
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;

    revealElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top + scrollY;
      const elementVisible = 150;

      if (scrollY + windowHeight > elementTop + elementVisible) {
        element.classList.add("visible");
      }
    });
  }
}

/**
 * Initialize header scroll effects
 */
function initHeaderScroll() {
  const header = document.querySelector(".header");
  const scrollThreshold = 50;

  // Check initial scroll position
  if (window.scrollY > scrollThreshold) {
    header.classList.add("scrolled");
  }

  window.addEventListener("scroll", function () {
    const currentScrollTop = window.scrollY;

    if (currentScrollTop > scrollThreshold) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}

/**
 * Initialize theme toggle functionality
 */
function initThemeToggle() {
  const themeToggle = document.querySelector(".theme-toggle");
  const root = document.documentElement;

  // Check for saved theme preference
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    enableDarkMode();
  }

  themeToggle.addEventListener("click", function () {
    if (root.classList.contains("dark-theme")) {
      disableDarkMode();
    } else {
      enableDarkMode();
    }
  });

  function enableDarkMode() {
    root.classList.add("dark-theme");
    localStorage.setItem("theme", "dark");
    // Update toggle icon to sun
    themeToggle.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
  }

  function disableDarkMode() {
    root.classList.remove("dark-theme");
    localStorage.setItem("theme", "light");
    // Update toggle icon to moon
    themeToggle.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
  }
} 

/**
 * Initialize video hover effects for solution cards
 */
function initVideoHoverEffects() {
  const solutionCards = document.querySelectorAll(".solution-card");

  solutionCards.forEach((card) => {
    const video = card.querySelector("video");
    if (!video) return;

    // Preload video
    video.load();

    card.addEventListener("mouseenter", () => {
      video.style.display = "block";
      video.currentTime = 0;
      video.play().catch((e) => console.log("Video play error:", e));
      card.querySelector(".solution-img").style.display = "none";
    });

    card.addEventListener("mouseleave", () => {
      video.style.display = "none";
      video.pause();
      card.querySelector(".solution-img").style.display = "block";
    });
  });
}

// Thêm vào sự kiện DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  initVideoHoverEffects();
});

// Add dynamic styles for video hover effect
(function addDynamicStyles() {
  const style = document.createElement("style");
  style.textContent = `
        .solution-image {
            position: relative;
        }
        
        .solution-image img,
        .solution-image video {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: opacity 0.5s ease;
        }
        
        .solution-image video {
            opacity: 0;
        }
        
        .solution-image:hover img {
            opacity: 0;
        }
        
        .solution-image:hover video {
            opacity: 1;
        }
    `;
  document.head.appendChild(style);
})();

/**
 * Initialize interactive elements
 */
function initInteractiveElements() {
  // Add interactive effects to cards
  const tryonCards = document.querySelectorAll(".tryon-card");
  const metricCards = document.querySelectorAll(".metric-card");
  const solutionCards = document.querySelectorAll(".solution-card");

  // Add tilt effect to cards
  const allCards = [...tryonCards, ...metricCards, ...solutionCards];

  allCards.forEach((card) => {
    card.addEventListener("mousemove", handleCardTilt);
    card.addEventListener("mouseleave", resetCardTilt);
  });

  function handleCardTilt(e) {
    if (window.innerWidth <= 768) return;

    const card = this;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate tilt angle - max 10 degrees
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = ((y - centerY) / centerY) * 5; // Vertical tilt
    const tiltY = ((centerX - x) / centerX) * 5; // Horizontal tilt

    // Apply tilt and scale effect
    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;

    // Add highlight effect
    const glare =
      card.querySelector(".card-glare") || document.createElement("div");

    if (!glare.classList.contains("card-glare")) {
      glare.classList.add("card-glare");
      card.appendChild(glare);
    }

    // Position the glare effect
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 80%)`;
  }

  function resetCardTilt() {
    // Reset transform
    this.style.transform = "";

    // Remove glare effect
    const glare = this.querySelector(".card-glare");
    if (glare) {
      glare.remove();
    }
  }
}

/**
 * Initialize tryon carousel with auto-rotating videos
 */
function initTryonCarousel() {
  const cards = document.querySelectorAll(".tryon-card");
  if (!cards.length) return;

  let currentIndex = 0;
  let isAnimating = false;
  const interval = 6000;

  // Preload videos
  cards.forEach((card) => {
    const video = card.querySelector("video");
    if (video) {
      video.preload = "auto";
      video.muted = true;
      video.playsInline = true;
      video.load();
    }
  });

  function activateCard(index) {
    if (isAnimating) return;
    isAnimating = true;

    const currentCard = cards[currentIndex];
    const nextCard = cards[index];

    // Bắt đầu thu nhỏ card hiện tại
    currentCard.classList.remove("active", "expanding");

    // Đồng thời mở rộng card tiếp theo
    nextCard.classList.add("active", "expanding");

    // Phát video khi card được active
    const video = nextCard.querySelector("video");
    if (video) {
      video.currentTime = 0;
      video.play().catch((e) => console.log("Video play:", e));
    }

    // Cập nhật chỉ số hiện tại
    currentIndex = index;

    // Reset trạng thái animation sau khi hoàn thành
    setTimeout(() => {
      isAnimating = false;
    }, 1000); // Thời gian transition

    // Tự động chuyển sang card tiếp theo
    if (!nextCard.dataset.manual) {
      setTimeout(() => {
        const nextIndex = (currentIndex + 1) % cards.length;
        activateCard(nextIndex);
      }, interval);
    }
  }

  // Bắt đầu rotation
  cards[0].classList.add("active", "expanding");
  setTimeout(() => {
    activateCard(1 % cards.length);
  }, interval);

  // Vô hiệu hóa hover effect như yêu cầu
}

window.addEventListener("DOMContentLoaded", initTryonCarousel);

/**
 * Initialize hero video
 */
function initHeroVideo() {
  const heroVideo = document.querySelector(".hero-video-background video");

  if (heroVideo) {
    // Ensure video plays
    heroVideo.play().catch(function (error) {
      console.log("Hero video playback prevented by browser:", error);
    });

    // Make sure video is muted (some browsers require this for autoplay)
    heroVideo.muted = true;

    // Handle any errors
    heroVideo.addEventListener("error", function (e) {
      console.error("Hero video error:", e);
    });
  }
}

/**
 * Add CSS for dynamic styles
 */
(function addDynamicStyles() {
  const style = document.createElement("style");
  style.textContent = `
        .card-glare {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: inherit;
            pointer-events: none;
            z-index: 2;
        }

        /* Dark theme styles */
        .dark-theme {
            --color-dark: #fbfbfb;
            --color-light: #141b1d;
            color: #fbfbfb;
            background-color: #141b1d;
        }

        .dark-theme .header,
        .dark-theme .mobile-menu,
        .dark-theme .dropdown-menu,
        .dark-theme .language-dropdown,
        .dark-theme .mobile-dropdown-content {
            background-color: #1c2528;
            color: #fbfbfb;
        }

        .dark-theme .solution-card,
        .dark-theme .tryon-card,
        .dark-theme .metric-card,
        .dark-theme .tryon-card-content {
            background-color: #1c2528;
            color: #fbfbfb;
        }

        .dark-theme .solution-feature span,
        .dark-theme .tryon-card-description,
        .dark-theme .metric-description,
        .dark-theme .section-subtitle {
            color: #c9ccd2;
        }
    `;

  document.head.appendChild(style);
})();

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
