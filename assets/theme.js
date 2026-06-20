document.addEventListener('DOMContentLoaded', function () {

  /* ---- Reveal on scroll ---- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-shown'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-shown'); });
  }

  /* ---- Mobile menu ---- */
  var menuToggle = document.querySelector('[data-menu-toggle]');
  var menuPanel = document.querySelector('[data-menu-panel]');
  var menuOverlay = document.querySelector('[data-menu-overlay]');
  function closeMenu() { menuPanel && menuPanel.classList.remove('is-open'); menuOverlay && menuOverlay.classList.remove('is-open'); }
  function openMenu() { menuPanel && menuPanel.classList.add('is-open'); menuOverlay && menuOverlay.classList.add('is-open'); }
  menuToggle && menuToggle.addEventListener('click', openMenu);
  menuOverlay && menuOverlay.addEventListener('click', closeMenu);
  document.querySelectorAll('[data-menu-close]').forEach(function (b) { b.addEventListener('click', closeMenu); });

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-item__q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      item.classList.toggle('is-open');
    });
  });

  /* ---- Qty boxes (PDP) ---- */
  document.querySelectorAll('[data-qty-box]').forEach(function (box) {
    var input = box.querySelector('input');
    box.querySelector('[data-qty-dec]').addEventListener('click', function () {
      input.value = Math.max(1, (parseInt(input.value, 10) || 1) - 1);
    });
    box.querySelector('[data-qty-inc]').addEventListener('click', function () {
      input.value = (parseInt(input.value, 10) || 1) + 1;
    });
  });

  /* ---- Variant pill selection ---- */
  document.querySelectorAll('[data-variant-pill]').forEach(function (pill) {
    pill.addEventListener('click', function () {
      var group = pill.closest('[data-variant-row]');
      group.querySelectorAll('[data-variant-pill]').forEach(function (p) { p.classList.remove('is-selected'); });
      pill.classList.add('is-selected');
      var select = group.parentElement.querySelector('select[name="id"]');
      if (select) select.value = pill.getAttribute('data-variant-id');
    });
  });

  /* ---- Toast ---- */
  function showToast(msg) {
    var toast = document.querySelector('[data-toast]');
    if (!toast) return;
    toast.querySelector('span').textContent = msg;
    toast.classList.add('is-shown');
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(function () { toast.classList.remove('is-shown'); }, 2600);
  }

  /* ---- Cart drawer ---- */
  var drawer = document.querySelector('[data-cart-drawer]');
  var overlay = document.querySelector('[data-cart-overlay]');
  function openCart() { drawer && drawer.classList.add('is-open'); overlay && overlay.classList.add('is-open'); }
  function closeCart() { drawer && drawer.classList.remove('is-open'); overlay && overlay.classList.remove('is-open'); }
  document.querySelectorAll('[data-cart-open]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); openCart(); }); });
  document.querySelectorAll('[data-cart-close]').forEach(function (b) { b.addEventListener('click', closeCart); });
  overlay && overlay.addEventListener('click', closeCart);

  function renderCartDrawer(cart) {
    var body = document.querySelector('[data-cart-body]');
    var foot = document.querySelector('[data-cart-foot]');
    var countEls = document.querySelectorAll('[data-cart-count]');
    countEls.forEach(function (el) { el.textContent = cart.item_count; });

    if (!body) return;
    if (cart.item_count === 0) {
      body.innerHTML = '<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;padding:40px;text-align:center"><div class="serif" style="font-size:22px;color:var(--c-dark)">Your cart is empty</div><button class="btn btn-olive" data-cart-close>Continue Shopping</button></div>';
      if (foot) foot.innerHTML = '';
      document.querySelectorAll('[data-cart-close]').forEach(function (b) { b.addEventListener('click', closeCart); });
      return;
    }
    var html = '';
    cart.items.forEach(function (item) {
      html += '<div class="cart-line">' +
        '<img src="' + item.image + '" alt="' + item.product_title + '">' +
        '<div style="flex:1">' +
        '<div style="display:flex;justify-content:space-between;gap:10px">' +
        '<div class="serif" style="font-size:18px;font-weight:600;color:var(--c-dark);line-height:1.2">' + item.product_title + '</div>' +
        '<button data-line-remove data-key="' + item.key + '" style="background:none;border:none;cursor:pointer;color:#b3a690;padding:0;display:flex;height:fit-content"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 6l12 12M18 6 6 18" stroke-linecap="round"/></svg></button>' +
        '</div>' +
        '<div style="font-size:11.5px;color:var(--c-muted2);margin:3px 0 12px">' + (item.variant_title || '') + '</div>' +
        '<div style="display:flex;justify-content:space-between;align-items:center">' +
        '<div class="qty-box" style="border:1px solid #e0d6c0">' +
        '<button data-line-dec data-key="' + item.key + '" style="width:30px;height:30px;font-size:16px">&minus;</button>' +
        '<span style="width:30px;text-align:center;font-size:13px">' + item.quantity + '</span>' +
        '<button data-line-inc data-key="' + item.key + '" style="width:30px;height:30px;font-size:16px">+</button>' +
        '</div>' +
        '<div class="serif" style="font-size:16px;font-weight:500;color:var(--c-olive)">' + formatMoney(item.final_line_price) + '</div>' +
        '</div></div></div>';
    });
    body.innerHTML = html;
    if (foot) {
      foot.innerHTML = '<div style="display:flex;justify-content:space-between;font-size:14px;color:var(--c-muted);margin-bottom:16px"><span>Subtotal</span><span style="color:var(--c-dark);font-weight:500">' + formatMoney(cart.total_price) + '</span></div>' +
        '<a href="/checkout" class="btn btn-dark" style="width:100%;margin-bottom:10px">Proceed to Checkout</a>' +
        '<a href="/cart" class="btn btn-outline" style="width:100%">View Full Cart</a>';
    }
    body.querySelectorAll('[data-line-remove]').forEach(function (b) { b.addEventListener('click', function () { updateLine(b.getAttribute('data-key'), 0); }); });
    body.querySelectorAll('[data-line-inc]').forEach(function (b) { b.addEventListener('click', function () { changeLine(b.getAttribute('data-key'), 1); }); });
    body.querySelectorAll('[data-line-dec]').forEach(function (b) { b.addEventListener('click', function () { changeLine(b.getAttribute('data-key'), -1); }); });
  }

  function formatMoney(cents) {
    return (window.Shopify && Shopify.formatMoney) ? Shopify.formatMoney(cents, window.themeMoneyFormat || '${{amount}}') : '$' + (cents / 100).toFixed(2);
  }

  function fetchCart() {
    fetch('/cart.js').then(function (r) { return r.json(); }).then(renderCartDrawer);
  }

  function changeLine(key, delta) {
    fetch('/cart.js').then(function (r) { return r.json(); }).then(function (cart) {
      var line = cart.items.find(function (i) { return i.key === key; });
      if (!line) return;
      updateLine(key, Math.max(0, line.quantity + delta));
    });
  }

  function updateLine(key, qty) {
    var updates = {};
    updates[key] = qty;
    fetch('/cart/update.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates: updates })
    }).then(function (r) { return r.json(); }).then(renderCartDrawer);
  }

  /* Add to cart forms */
  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form.matches('[data-atc-form]')) return;
    e.preventDefault();
    var formData = new FormData(form);
    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: formData
    }).then(function (r) { return r.json(); }).then(function () {
      showToast('Added to your cart');
      fetchCart();
      openCart();
    }).catch(function () { showToast('Could not add item'); });
  });

  fetchCart();

  /* ---- Newsletter (Shopify customer form already posts natively, just toast) ---- */
  document.querySelectorAll('[data-newsletter-form]').forEach(function (f) {
    f.addEventListener('submit', function () { showToast('Thanks for subscribing'); });
  });
});
