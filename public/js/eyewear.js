$(document).ready(function () {
  $("#sort-by").on("change", function () {
    const sortValue = $(this).val();
    const $products = $(".product-card");

    $products.sort(function (a, b) {
      const aName = $(a).data("name").toLowerCase();
      const bName = $(b).data("name").toLowerCase();
      const aPrice = parseFloat($(a).data("price"));
      const bPrice = parseFloat($(b).data("price"));

      switch (sortValue) {
        case "name-asc":
          return aName.localeCompare(bName);
        case "name-desc":
          return bName.localeCompare(aName);
        case "price-asc":
          return aPrice - bPrice;
        case "price-desc":
          return bPrice - aPrice;
        default:
          return 0;
      }
    });

    $("#products-container").html($products);
  });
  updateCartCount();

  // Thêm sự kiện lắng nghe storage để cập nhật realtime
  window.addEventListener("storage", function (event) {
    if (event.key === "cartUpdated") {
      updateCartCount();
    }
  });
});

async function updateCartCount() {
  try {
    const userId = localStorage.getItem("userId") || "guest";
    const response = await fetch(`/api/cart/${userId}`);
    if (response.ok) {
      const data = await response.json();
      const itemCount =
        data.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      $(".cart-icon-wrapper #cart-count").text(itemCount);

      // Lưu vào storage để đồng bộ giữa các tab
      localStorage.setItem("cartUpdated", Date.now().toString());
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật giỏ hàng:", error);
  }
}

// $(document).ready(function () {
//   updateCartCount();
// });
