// cart-animation.js
$(document).ready(function() {
    let cartCount = 0;
    let currentProduct = null;
  
    // 1. Modal Trigger
    $('.cart-btn').on('click', function() {
      const card = $(this).closest('.card');
      currentProduct = {
        element: this,
        image: card.find('img').attr('src'),
        name: card.find('.details span').text(),
        price: card.find('.price').text()
      };
      
      // Reset selections
      $('#quantity').val(1);
      $('.size-btn').removeClass('active').first().addClass('active');
      $('.color-btn').removeClass('active').first().addClass('active');
      
      // Populate modal
      $('#modal-product-image').attr('src', currentProduct.image);
      $('#modal-product-name').text(currentProduct.name);
      $('#modal-product-price').text(currentProduct.price);
      
      $('#product-modal').fadeIn();
    });
  
    // 2. Selection Handlers
    $('.size-btn, .color-btn').on('click', function() {
      $(this).siblings().removeClass('active');
      $(this).addClass('active');
    });
  
    // 3. Quantity Adjustment
    $('.quantity-btn').on('click', function() {
      const input = $('#quantity');
      let value = parseInt(input.val());
      input.val($(this).hasClass('minus') ? Math.max(1, value-1) : value+1);
    });
  
    // 4. Final Add to Cart
    $('.add-to-cart-final').on('click', function() {
      const quantity = parseInt($('#quantity').val());
      const size = $('.size-btn.active').text();
      const color = $('.color-btn.active').css('background-color');
      
      // Đóng modal ngay
      $('#product-modal').fadeOut();
  
      // Hiệu ứng bay
      const card = $(currentProduct.element).closest('.card');
      const imgtodrag = card.find('img').eq(0);
      const cart = $('.cart-icon-wrapper');
  
      if (imgtodrag) {
        const container = $('<div class="flying-item"></div>')
          .css({
            'position': 'absolute',
            'top': imgtodrag.offset().top,
            'left': imgtodrag.offset().left,
            'width': '150px',
            'height': '150px',
            'z-index': '1000'
          })
          .appendTo('body');
  
        imgtodrag.clone()
          .css({
            'width': '100%',
            'height': '100%',
            'opacity': '0.8'
          })
          .appendTo(container);
  
        if (quantity > 1) {
          $('<div class="qty-overlay">x' + quantity + '</div>')
            .css({
              'position': 'absolute',
              'bottom': '10px',
              'right': '10px',
              'background': 'rgba(255, 71, 87, 0.9)',
              'color': 'white',
              'border-radius': '50%',
              'width': '30px',
              'height': '30px',
              'display': 'flex',
              'align-items': 'center',
              'justify-content': 'center',
              'font-size': '14px',
              'font-weight': 'bold',
              'z-index': '1001',
              'box-shadow': '0 2px 8px rgba(0,0,0,0.3)'
            })
            .appendTo(container);
        }
  
        container.animate({
          'top': cart.offset().top + 10,
          'left': cart.offset().left + 10,
          'width': '75px',
          'height': '75px'
        }, 1000, 'easeInOutExpo', function() {
          $(this).animate({
            'width': 0,
            'height': 0
          }, 200, function() {
            $(this).remove();
            // Cập nhật giỏ hàng SAU KHI animation hoàn tất
            cartCount += quantity;
            $('#cart-count').text(cartCount);
          });
        });
      }
    });
  
    // Modal controls
    $('.close-modal').on('click', function() {
      $('#product-modal').fadeOut();
    });
  
    $(document).on('click', function(e) {
      if ($(e.target).hasClass('product-modal')) {
        $('#product-modal').fadeOut();
      }
    });
  
    $('.modal-content').on('click', function(e) {
      e.stopPropagation();
    });
  });