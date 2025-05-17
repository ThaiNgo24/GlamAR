document.addEventListener("DOMContentLoaded", () => {
  // Tab functionality
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  // Get tab parameter from URL if any
  const urlParams = new URLSearchParams(window.location.search);
  const tabParam = urlParams.get("tab");

  // Set default active tab based on URL parameter or default to login
  const defaultTab = tabParam === "register" ? "signup" : "login";
  setActiveTab(defaultTab);

  // Add click event listeners to tab buttons
  for (const button of tabButtons) {
    button.addEventListener("click", () => {
      // Add ripple effect to button
      addRippleEffect(button);

      const tab = button.getAttribute("data-tab");
      if (tab) {
        setActiveTab(tab);

        // Update URL without reloading the page
        const newTab = tab === "signup" ? "register" : "login";
        const newUrl = `${window.location.pathname}?tab=${newTab}`;
        window.history.pushState({ path: newUrl }, "", newUrl);
      }
    });
  }

  // Password toggle functionality
  const togglePasswordButtons = document.querySelectorAll(".toggle-password");
  for (const button of togglePasswordButtons) {
    button.addEventListener("click", () => {
      const passwordInput = button.previousElementSibling;
      if (passwordInput) {
        // Toggle password visibility
        if (passwordInput.type === "password") {
          passwordInput.type = "text";
          button.textContent = "Hide";
          passwordInput.focus(); // Keep focus on the field
        } else {
          passwordInput.type = "password";
          button.textContent = "Show";
          passwordInput.focus(); // Keep focus on the field
        }
      }
    });
  }

  // Add focus and blur effects to input fields for better UX
  const formInputs = document.querySelectorAll(".form-input");
  for (const input of formInputs) {
    // Add event listeners for focus and blur
    input.addEventListener("focus", () => {
      const formGroup = input.closest(".form-group");
      if (formGroup) {
        formGroup.classList.add("focused");
      }
    });

    input.addEventListener("blur", () => {
      const formGroup = input.closest(".form-group");
      if (formGroup) {
        formGroup.classList.remove("focused");

        // Add validation class
        if (input.value.trim() !== "") {
          formGroup.classList.add("has-value");
        } else {
          formGroup.classList.remove("has-value");
        }
      }
    });
  }

  // Form submission
  const forms = document.querySelectorAll(".auth-form");
  for (const form of forms) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const activeTab = document
        .querySelector(".tab-button.active")
        ?.getAttribute("data-tab");
      const submitButton = form.querySelector(".auth-button");
      addRippleEffect(submitButton);

      try {
        submitButton.disabled = true;
        submitButton.innerHTML =
          '<span class="loading-spinner"></span> Processing...';

        if (activeTab === "login") {
          const emailOrUsername = document.getElementById("login-email").value;
          const password = document.getElementById("login-password").value;

          const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              emailOrUsername,
              password,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Login failed");
          }

          // Lưu token và user data vào localStorage
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          showNotification(`Welcome back, ${data.user.username}!`, "success");

          setTimeout(() => {
            if (
              document.referrer &&
              document.referrer.includes(window.location.host)
            ) {
              window.history.back();
            } else {
              window.location.href = data.redirect || "/main.html";
            }
          }, 1500);
        } else if (activeTab === "signup") {
          const email = document.getElementById("signup-email").value;
          const password = document.getElementById("signup-password").value;
          const newsletter = document.getElementById(
            "newsletter-checkbox"
          ).checked;

          // Tạo username từ email (phần trước @)
          const username = email.split("@")[0];

          const response = await fetch(
            "http://localhost:5000/api/auth/register",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email,
                password,
                username,
                newsletterSubscribed: newsletter,
              }),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Registration failed");
          }

          // Lưu token và user data vào localStorage
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          showNotification(
            `Welcome to GlamAR, ${data.user.username}!`,
            "success"
          );

          setTimeout(() => {
            if (
              document.referrer &&
              document.referrer.includes(window.location.host)
            ) {
              window.history.back();
            } else {
              window.location.href = data.redirect || "/main.html";
            }
          }, 1500);
        }
      } catch (error) {
        showNotification(error.message, "error");
        submitButton.disabled = false;
        submitButton.textContent = activeTab === "login" ? "Log in" : "Sign up";
      }
    });
  }

  // Ripple effect function
  function addRippleEffect(element) {
    const ripple = document.createElement("span");
    ripple.classList.add("ripple-effect");

    // Get element dimensions
    const rect = element.getBoundingClientRect();

    // Make ripple circle
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;

    // Add ripple to element
    element.appendChild(ripple);

    // Center ripple in element
    ripple.style.left = "0";
    ripple.style.top = "0";

    // Add transform to start ripple animation
    ripple.style.transform = "scale(1)";

    // Remove ripple after animation completes
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  // Character animation enhancement
  const character = document.querySelector(".character-animation");
  if (character) {
    document.addEventListener("mousemove", (e) => {
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;
      const moveX = (mouseX - 0.5) * 15;
      const moveY = (mouseY - 0.5) * 15;

      // Apply subtle movement to character based on mouse position
      character.style.transform = `translateX(${moveX}px) translateY(${moveY}px)`;
    });
  }

  // Function to simulate loading state
  function simulateLoadingState(formType, email) {
    const button = document.querySelector(`#${formType}-tab .auth-button`);
    const originalText = button.textContent || "";

    button.disabled = true;

    // Show loading animation
    button.innerHTML = '<span class="loading-spinner"></span> Processing...';

    setTimeout(() => {
      button.disabled = false;
      button.innerHTML = originalText;

      // Add success animation to form
      const form = document.querySelector(`#${formType}-tab .auth-form`);
      if (form) {
        form.classList.add("form-success");
      }

      // Show welcome message
      const firstName = email.split("@")[0];
      const capitalizedName =
        firstName.charAt(0).toUpperCase() + firstName.slice(1);
      showNotification(`Welcome to GlamAR, ${capitalizedName}!`, "success");

      // Reset success class after animation
      setTimeout(() => {
        if (form) {
          form.classList.remove("form-success");
        }
      }, 1000);
    }, 1500);
  }

  // Notification function
  function showNotification(message, type = "success") {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Add to document
    document.body.appendChild(notification);

    // Show with animation
    setTimeout(() => {
      notification.classList.add("show");
    }, 10);

    // Hide and remove after delay
    setTimeout(() => {
      notification.classList.remove("show");
      notification.addEventListener("transitionend", () => {
        notification.remove();
      });
    }, 3000);
  }

  // Function to set active tab
  function setActiveTab(tabId) {
    // Deactivate all tabs
    for (const btn of tabButtons) {
      btn.classList.remove("active");
      if (btn.getAttribute("data-tab") === tabId) {
        btn.classList.add("active");
      }
    }

    // Hide all tab contents and show the active one
    for (const content of tabContents) {
      content.classList.remove("active");
      if (content.id === `${tabId}-tab`) {
        content.classList.add("active");
      }
    }
  }

  // Add login success animation to the character
  const authButtons = document.querySelectorAll(".auth-button");
  for (const button of authButtons) {
    button.addEventListener("click", () => {
      const character = document.querySelector(".character-animation");
      if (character) {
        character.classList.add("jump");
        setTimeout(() => {
          character.classList.remove("jump");
        }, 1000);
      }
    });
  }

  // Add CSS for the new animations
  const style = document.createElement("style");
  style.textContent = `
    .ripple-effect {
      position: absolute;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.4);
      transform: scale(0);
      pointer-events: none;
      opacity: 1;
      transition: transform 0.6s, opacity 0.6s;
    }

    .form-success {
      animation: successPulse 1s ease;
    }

    @keyframes successPulse {
      0% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(194, 33, 84, 0.4);
      }
      50% {
        transform: scale(1.02);
        box-shadow: 0 0 0 10px rgba(194, 33, 84, 0);
      }
      100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(194, 33, 84, 0);
      }
    }

    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      background-color: #333;
      color: white;
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      transform: translateX(120%);
      transition: transform 0.3s ease;
      max-width: 300px;
    }

    .notification.show {
      transform: translateX(0);
    }

    .notification.success {
      background-color: #c22154;
    }

    .notification.error {
      background-color: #f44336;
    }

    .loading-spinner {
      display: inline-block;
      width: 15px;
      height: 15px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: #fff;
      animation: spin 1s ease-in-out infinite;
      margin-right: 8px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .form-group.focused .form-input {
      border-color: #c22154;
      box-shadow: 0 0 0 3px rgba(194, 33, 84, 0.1);
    }

    .form-group.has-value .form-input {
      background-color: #f9f9f9;
    }

    .jump {
      animation: jump 1s ease;
    }

    @keyframes jump {
      0% {
        transform: translateY(0) scale(1);
      }
      50% {
        transform: translateY(-30px) scale(1.1);
      }
      100% {
        transform: translateY(0) scale(1);
      }
    }
  `;
  document.head.appendChild(style);
});

// Đăng ký
async function register(email, password, username, newsletter) {
  try {
    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        username,
        newsletterSubscribed: newsletter,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Registration failed");

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    showNotification(`Welcome ${data.user.username}!`, "success");

    setTimeout(() => {
      if (
        document.referrer &&
        document.referrer.includes(window.location.host)
      ) {
        window.history.back();
      } else {
        window.location.href = data.redirect || "/dashboard.html";
      }
    }, 1500);
  } catch (error) {
    showNotification(error.message, "error");
  }
}

// Đăng nhập
async function login(emailOrUsername, password) {
  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailOrUsername, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Login failed");

    localStorage.setItem("token", data.token);
    showNotification(`Welcome back ${data.username}!`, "success");
    setTimeout(() => {
      if (
        document.referrer &&
        document.referrer.includes(window.location.host)
      ) {
        window.history.back();
      } else {
        window.location.href = "/dashboard.html";
      }
    }, 1500);
  } catch (error) {
    showNotification(error.message, "error");
  }
}

function checkAuthStatus() {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  if (token && userData) {
    try {
      const user = JSON.parse(userData);
      // Có thể thêm logic kiểm tra token hết hạn ở đây
      return { isAuthenticated: true, user };
    } catch {
      return { isAuthenticated: false };
    }
  }
  return { isAuthenticated: false };
}

// Hàm đăng xuất
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login.html";
}
