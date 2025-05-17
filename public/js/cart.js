function selectColor(colorOption) {
  document
    .querySelectorAll(".color-btn")
    .forEach((c) => c.classList.remove("active"));
  colorOption.classList.add("active");
}

function selectSize(sizeOption) {
  document
    .querySelectorAll(".size-btn")
    .forEach((s) => s.classList.remove("active"));
  sizeOption.classList.add("active");
}

function changeQuantity(change) {
  const input = document.getElementById("quantity");
  let value = parseInt(input.value) + change;
  if (value < 1) value = 1;
  input.value = value;
}

// AR Modal
function openARModal() {
  $("#ar-iframe").attr(
    "src",
    "https://sketchfab.com/models/97cbff16eec648fdb211ea58159bd9ba/embed?ar_mode=1"
  );
  $("#ar-modal").fadeIn();
}

function closeARModal() {
  $("#ar-iframe").attr("src", "");
  $("#ar-modal").fadeOut();
}

// flying animation
$(document).ready(function () {
  async function loadCartCount() {
    try {
      const userId = localStorage.getItem("userId") || "guest";
      const response = await fetch(`/api/cart/${userId}`);
      const data = await response.json();
      $("#cart-count").text(
        data.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
      );
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  }

  loadCartCount();

  $("#add-to-cart-direct").on("click", async function () {
    if (!localStorage.getItem("token")) {
      Swal.fire({
        title: "LOGIN REQUIRED",
        html: `<div style="font-size:16px;color:#555;margin:15px 0 25px;">
                You need to login to add items to your cart
              </div>`,
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "LOGIN NOW",
        cancelButtonText: "CONTINUE SHOPPING",
        customClass: {
          confirmButton: "swal-confirm-btn",
          cancelButton: "swal-cancel-btn",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.setItem("redirectUrl", window.location.href);
          window.location.href = "/login.html";
        }
      });
      return;
    }

    const quantity = parseInt($("#quantity").val()) || 1;
    const productImage = $(".main-image-container");
    const productThumbnail = $("#product-thumbnail");
    const cartIcon = $(".cart-icon-wrapper");

    // Hiệu ứng bay vào giỏ hàng
    const flyingItem = $('<div class="flying-item"></div>');
    const imgClone = productThumbnail.clone();

    flyingItem
      .css({
        top: productImage.offset().top,
        left: productImage.offset().left,
        width: "150px",
        height: "150px",
      })
      .append(imgClone);

    if (quantity > 1) {
      flyingItem.append('<div class="qty-overlay">x' + quantity + "</div>");
    }

    $("body").append(flyingItem);

    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId") || "guest",
          productId: "heart-glasses-001",
          name: $(".product-title").text(),
          price: parseFloat($(".product-price").text().replace("$", "")),
          quantity: quantity,
          image: productThumbnail.attr("src"),
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      const cartPos = cartIcon.offset();
      const curvePoint = { left: cartPos.left + 50, top: cartPos.top + 30 };
      const endPos = { left: cartPos.left + 30, top: cartPos.top + 10 };

      flyingItem.animate(
        {
          left: curvePoint.left,
          top: curvePoint.top,
          width: "50px",
          height: "50px",
        },
        600,
        "swing",
        function () {
          $(this).animate(
            {
              left: endPos.left,
              top: endPos.top,
              width: "30px",
              height: "30px",
            },
            400,
            "swing",
            function () {
              $(this).remove();

              // Cập nhật số lượng giỏ hàng
              $("#cart-count").text(result.cartCount);

              // Hiệu ứng bounce
              cartIcon.css("transform", "scale(1.2)");
              setTimeout(() => {
                cartIcon.css("transform", "scale(1)");

                // Quay lại trang trước (show sản phẩm) và cập nhật giỏ hàng
                if (document.referrer.includes(window.location.hostname)) {
                  window.location.href = document.referrer;
                } else {
                  window.location.href = "/demo-store.html"; // Fallback URL
                }
              }, 300);
            }
          );
        }
      );
    } catch (error) {
      flyingItem.remove();
      Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "error",
        confirmButtonColor: "#da0e64",
      });
    }
  });
});
