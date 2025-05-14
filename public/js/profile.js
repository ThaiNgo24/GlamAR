document.addEventListener("DOMContentLoaded", () => {
  // Kiểm tra đăng nhập
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  if (!token || !userData) {
    window.location.href = "/login.html";
    return;
  }

  const user = JSON.parse(userData);

  // Hiển thị thông tin user
  displayUserInfo(user);

  // Xử lý form profile
  document
    .getElementById("profile-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = {
        fullName: document.getElementById("full-name").value,
        bio: document.getElementById("bio").value,
        interests: document.getElementById("interests").value,
      };

      try {
        // Hiển thị loading
        const submitBtn = e.target.querySelector("button[type='submit']");
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML =
          '<i class="fas fa-spinner fa-spin"></i> Updating...';
        submitBtn.disabled = true;

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Cập nhật thông tin user trong localStorage
        const updatedUser = { ...user, ...formData };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Hiển thị thông báo thành công
        showNotification("Profile updated successfully!", "success");
      } catch (error) {
        showNotification("Failed to update profile", "error");
        console.error("Error updating profile:", error);
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });

  // Hiển thị thông báo nếu có từ URL
  const urlParams = new URLSearchParams(window.location.search);
  const successMessage = urlParams.get("success");
  if (successMessage) {
    showNotification(decodeURIComponent(successMessage), "success");
  }
});

function displayUserInfo(user) {
  document.getElementById("profile-username").textContent = user.username;
  document.getElementById("profile-email").textContent = user.email;

  // Hiển thị avatar nếu có
  if (user.avatar) {
    document.getElementById("profile-avatar").src = user.avatar;
  }

  // Hiển thị thông tin bổ sung nếu có
  if (user.fullName) {
    document.getElementById("full-name").value = user.fullName;
  }

  if (user.bio) {
    document.getElementById("bio").value = user.bio;
  }

  if (user.interests) {
    document.getElementById("interests").value = user.interests;
  }
}

function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <i class="fas fa-${
      type === "success" ? "check-circle" : "exclamation-circle"
    }"></i>
    <span>${message}</span>
  `;

  notification.style.position = "fixed";
  notification.style.bottom = "20px";
  notification.style.right = "20px";
  notification.style.padding = "12px 20px";
  notification.style.backgroundColor =
    type === "success" ? "#da0e64" : "#f44336";
  notification.style.color = "white";
  notification.style.borderRadius = "8px";
  notification.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
  notification.style.zIndex = "1000";
  notification.style.display = "flex";
  notification.style.alignItems = "center";
  notification.style.gap = "10px";
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
}

// Thêm vào phần DOMContentLoaded
function initAvatarUpload() {
  const avatarInput = document.createElement("input");
  avatarInput.type = "file";
  avatarInput.accept = "image/*";
  avatarInput.style.display = "none";
  document.body.appendChild(avatarInput);

  const avatarImg = document.getElementById("profile-avatar");
  const avatarWrapper = document.querySelector(".avatar-wrapper");

  // Tạo nút edit avatar
  const editIcon = document.createElement("div");
  editIcon.className = "avatar-edit-icon";
  editIcon.innerHTML = '<i class="fas fa-camera"></i>';
  avatarWrapper.appendChild(editIcon);

  // Xử lý click để mở file dialog
  editIcon.addEventListener("click", () => {
    avatarInput.click();
  });

  // Xử lý khi chọn file
  avatarInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Kiểm tra loại file
    if (!file.type.match("image.*")) {
      showNotification("Please select an image file", "error");
      return;
    }

    // Kiểm tra kích thước file (tối đa 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showNotification("Image size should be less than 2MB", "error");
      return;
    }

    try {
      // Hiển thị loading
      editIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

      // Đọc file và hiển thị preview
      const reader = new FileReader();
      reader.onload = (event) => {
        avatarImg.src = event.target.result;

        // Lưu vào localStorage (tạm thời)
        const user = JSON.parse(localStorage.getItem("user"));
        user.avatar = event.target.result;
        localStorage.setItem("user", JSON.stringify(user));

        showNotification("Avatar updated successfully!", "success");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      showNotification("Failed to update avatar", "error");
    } finally {
      editIcon.innerHTML = '<i class="fas fa-camera"></i>';
    }
  });
}

// Gọi hàm này trong DOMContentLoaded
initAvatarUpload();

function initContactForm() {
  const contactForm = document.getElementById("contact-form");

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const subject = document.getElementById("contact-subject").value;
    const message = document.getElementById("contact-message").value;
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      // Hiển thị loading
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      // Gửi dữ liệu đến server (simulate)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Trong thực tế, bạn sẽ gửi dữ liệu qua API
      console.log("Sending email:", {
        from: user.email,
        subject,
        message,
      });

      showNotification("Your message has been sent successfully!", "success");
      contactForm.reset();
    } catch (error) {
      console.error("Error sending message:", error);
      showNotification("Failed to send message", "error");
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

// Gọi hàm này trong DOMContentLoaded
initContactForm();

async function sendEmail(subject, message) {
  const response = await fetch("/api/send-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: "thaibap2406@gmail.com",
      subject,
      text: `From: ${
        JSON.parse(localStorage.getItem("user")).email
      }\n\n${message}`,
    }),
  });

  if (!response.ok) throw new Error("Failed to send email");
  return await response.json();
}

function initContactForm() {
  const contactForm = document.getElementById("contact-form");

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const subject = document.getElementById("contact-subject").value;
    const message = document.getElementById("contact-message").value;
    const user = JSON.parse(localStorage.getItem("user"));

    // Hiển thị loading
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Gửi email bằng cách mở ứng dụng email mặc định
    const email = "your-email@example.com"; // Thay bằng email của bạn
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(`From: ${user.email}\n\n${message}`)}`;

    // Mở ứng dụng email
    window.location.href = mailtoLink;

    // Reset form sau 1 giây (để người dùng thấy trạng thái loading)
    setTimeout(() => {
      contactForm.reset();
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      submitBtn.disabled = false;
      showNotification(
        "Email application opened. Please send your message.",
        "info"
      );
    }, 1000);
  });
}

// Gọi hàm này trong DOMContentLoaded
initContactForm();
