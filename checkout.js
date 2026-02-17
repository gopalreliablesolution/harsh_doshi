
// Function to fetch and display shipping cost
async function fetchShippingCost() {
  const items = JSON.parse(localStorage.getItem('cartItems')) || [];
  if (items.length === 0) return;

  try {
    const userRegion = localStorage.getItem('user_region') || 'india';
    const regionId = userRegion === 'india'
      ? MEDUSA_CONFIG.DEFAULT_REGION_ID
      : MEDUSA_CONFIG.INTERNATIONAL_REGION_ID;

    const productsRes = await MedusaAPI.getProducts();
    const products = productsRes?.products || [];

    const createCartRes = await MedusaAPI.createCart(regionId);
    if (!createCartRes || !createCartRes.cart) return;
    const cart = createCartRes.cart;

    // Add first item to get shipping options
    const firstItem = items[0];
    let product = products.find(p => p.id == firstItem.id) || products.find(p => p.title === firstItem.title);

    if (product && product.variants && product.variants.length > 0) {
      await MedusaAPI.addLineItem(cart.id, product.variants[0].id, 1);

      // Add dummy shipping address to get shipping options
      await MedusaAPI.updateCart(cart.id, {
        shipping_address: {
          first_name: 'Guest',
          last_name: 'User',
          address_1: 'Address',
          city: 'City',
          country_code: 'in',
          postal_code: '000000',
          phone: '0000000000'
        }
      });

      const shippingOptionsRes = await MedusaAPI.getShippingOptions(cart.id);
      const shippingOptions = shippingOptionsRes.shipping_options || [];

      if (shippingOptions.length > 0) {
        const rawShippingCost = shippingOptions[0].amount || 0;
        let shippingCost, total;
        const currentSymbol = '\u20B9'; // Assuming INR for now as regionId logic defaults to India or specific region

        // HOTFIX: For India, treat the API value as Rupees (major unit) directly
        const userRegion = localStorage.getItem('user_region') || 'india';
        if (userRegion === 'india') {
          shippingCost = rawShippingCost;
        } else {
          shippingCost = rawShippingCost / 100;
        }

        const shippingElement = document.getElementById('shipping');
        const subtotalElement = document.getElementById('subtotal');
        const totalElement = document.getElementById('total');

        if (shippingElement && subtotalElement && totalElement) {
          const subtotalText = subtotalElement.textContent;
          const subtotalValue = parseFloat(subtotalText.replace(/[^\d.-]/g, ''));
          total = subtotalValue + shippingCost;

          shippingElement.textContent = `${currentSymbol} ${shippingCost.toLocaleString('en-IN', { minimumFractionDigits: userRegion === 'india' ? 0 : 2, maximumFractionDigits: userRegion === 'india' ? 0 : 2 })}`;
          totalElement.textContent = `${currentSymbol} ${total.toLocaleString('en-IN', { minimumFractionDigits: userRegion === 'india' ? 0 : 2, maximumFractionDigits: userRegion === 'india' ? 0 : 2 })}`;
        }
      }
    }
  } catch (error) {
    console.error('Error fetching shipping cost:', error);
  }
}

// Function to safely parse price string to number
function parsePriceString(priceStr) {
  if (!priceStr) return { value: 0, symbol: '$' };
  try {
    // If it's already a number, return it
    let symbol = '$';
    if (typeof priceStr === 'number') {
      return { value: priceStr, symbol: symbol };
    }

    // Detect currency symbol if possible
    if (priceStr.toString().includes('\u20B9')) symbol = '\u20B9';

    // Remove currency symbols, commas, and whitespace
    const cleanPrice = priceStr.toString().replace(/[^\d.-]/g, '');
    const parsed = parseFloat(cleanPrice);

    return { value: isNaN(parsed) ? 0 : parsed, symbol: symbol };
  } catch (error) {
    console.error('Error parsing price:', error);
    return { value: 0, symbol: '$' };
  }
}

// Remove item from cart (used on checkout page)
function removeFromCart(index) {
  const items = JSON.parse(localStorage.getItem('cartItems')) || [];
  if (index >= 0 && index < items.length) {
    items.splice(index, 1);
    localStorage.setItem('cartItems', JSON.stringify(items));
    displayCartItems();
  }
}

// Function to display cart items from localStorage
function displayCartItems() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const cartContainer = document.getElementById('cartItems');
  const subtotalElement = document.getElementById('subtotal');
  const totalElement = document.getElementById('total');

  if (!cartContainer || !subtotalElement || !totalElement) {
    console.error('Required DOM elements not found');
    return;
  }

  if (cartItems.length === 0) {
    cartContainer.innerHTML = '<div class="cart-item">Your bag is empty</div>';
    subtotalElement.textContent = '$0.00';
    totalElement.textContent = '$0.00';
    return;
  }

  let subtotal = 0;
  let currentSymbol = '\u20B9'; // Default to INR symbol based on my fixes
  cartContainer.innerHTML = '';

  cartItems.forEach((item, index) => {
    // Safely convert price string to number
    const { value: priceValue, symbol } = parsePriceString(item.price);
    subtotal += priceValue;
    currentSymbol = symbol;

    const formattedPrice = currentSymbol === '\u20B9'
      ? priceValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : priceValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const itemHtml = `
      <div class="cart-item">
        <img src="${item.image || ''}" alt="${item.title || 'Product'}" onerror="this.src='assets/placeholder.jpg'">
        <div class="cart-item-info">
          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 4px;">
            <div style="flex: 1; padding-right: 12px;">
              <h3 class="cart-item-title" style="margin: 0; font-size: 1rem;">${item.title || 'Product'}</h3>
            </div>
            <div style="display:flex; flex-direction:column; justify-content: end; align-items:end;">
              <div style="font-weight: 700; font-size: 1rem; white-space: nowrap;">${currentSymbol} ${formattedPrice}</div>
              <button onclick="removeFromCart(${index})" style="background:none;border:none;color:#999;cursor:pointer;padding: 4px 0;font-size: 0.85rem;text-decoration: underline;">Remove</button>
            </div>
          </div>
          
          <div class="cart-item-details" style="margin-top: 2px;">
              <p class="cart-item-description" style="margin: 4px 0 0 0; font-size: 0.85rem; color: #666;">${item.description || ''}</p>
            <p class="cart-item-meta">Metal: ${item.metal || 'N/A'}</p>
            <p class="cart-item-meta">Size: ${item.size || 'N/A'}</p>
          </div>
          
          <div style="margin-top: auto; display: flex; justify-content: flex-end;">
          </div>
        </div>
      </div>
    `;
    cartContainer.innerHTML += itemHtml;
  });

  // Update totals and counts with proper formatting
  const formattedSubtotal = currentSymbol === '\u20B9'
    ? subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  subtotalElement.textContent = `${currentSymbol} ${formattedSubtotal}`;
  totalElement.textContent = `${currentSymbol} ${formattedSubtotal}`;

  // Initialize shipping display
  const shippingElement = document.getElementById('shipping');
  if (shippingElement) {
    shippingElement.textContent = `${currentSymbol} ...`;
  }

  const orderCount = document.getElementById('order-count');
  if (orderCount) orderCount.textContent = `(${cartItems.length} Item${cartItems.length > 1 ? 's' : ''})`;
}

// (cart display will be initialized in the main DOMContentLoaded handler below)

// Function to copy shipping address to billing
function copyShippingToBilling() {
  const sameAsShippingCheckbox = document.getElementById('same-as-shipping');

  if (sameAsShippingCheckbox) {
    sameAsShippingCheckbox.addEventListener('change', function () {
      const billingForm = document.getElementById('billing-form');
      const shippingForm = document.getElementById('shipping-form');

      if (this.checked && billingForm && shippingForm) {
        // Copy values from shipping to billing
        const fields = ['first-name', 'last-name', 'address', 'city', 'state', 'zip', 'country'];
        fields.forEach(f => {
          const sField = document.getElementById(`shipping-${f}`);
          const bField = document.getElementById(`billing-${f}`);
          if (sField && bField) bField.value = sField.value;
        });

        // Disable billing form fields
        billingForm.querySelectorAll('input, select').forEach(field => {
          field.disabled = true;
        });
      } else if (billingForm) {
        // Enable billing form fields
        billingForm.querySelectorAll('input, select').forEach(field => {
          field.disabled = false;
          field.value = '';
        });
      }
    });
  }
}

// Function to handle form submission
async function handlePlaceOrder() {
  const placeOrderBtn = document.getElementById('place-order-btn');
  const items = JSON.parse(localStorage.getItem('cartItems')) || [];

  if (items.length === 0) {
    placeOrderBtn.disabled = true;
    placeOrderBtn.innerText = "Cart is Empty";
    return;
  }

  placeOrderBtn.addEventListener('click', async function (e) {
    e.preventDefault();

    // Basic validation
    const requiredFields = [
      'shipping-first-name', 'shipping-last-name', 'shipping-email', 'shipping-phone',
      'shipping-address', 'shipping-city', 'shipping-state', 'shipping-zip', 'shipping-country'
    ];

    let isValid = true;
    const shippingData = {};

    requiredFields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field) {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = 'red';
        } else {
          field.style.borderColor = '#ddd';
          shippingData[fieldId] = field.value.trim();
        }
      }
    });

    if (!isValid) {
      alert('Please fill in all required shipping fields.');
      return;
    }

    placeOrderBtn.innerText = "Processing...";
    placeOrderBtn.disabled = true;

    try {
      // 1. Fetch Products to map variants
      const productsRes = await MedusaAPI.getProducts();
      const products = productsRes?.products || [];

      if (!Array.isArray(products) || products.length === 0) {
        console.error("Products not loaded for mapping", productsRes);
        // We can still try to proceed if we have basic item info, 
        // but for now let's alert to help debug
        // alert("Warning: Could not fetch product details for mapping. Checkout might fail.");
      }

      // 2. Create Cart - use selected region from index page popup
      const userRegion = localStorage.getItem('user_region') || 'india';
      const regionId = userRegion === 'india'
        ? MEDUSA_CONFIG.DEFAULT_REGION_ID
        : 'reg_01KF2GD0MN8W41NC3YF85JRQGK'; // International region

      const createCartRes = await MedusaAPI.createCart(regionId);
      if (!createCartRes || !createCartRes.cart) {
        throw new Error("Failed to create cart: " + JSON.stringify(createCartRes));
      }
      const cart = createCartRes.cart;

      // 3. Add Items
      for (const item of items) {
        // Find product
        // Try matching by ID first (if string/number match), else title
        let product = products.find(p => p.id == item.id);
        if (!product) product = products.find(p => p.title === item.title);

        if (product) {
          // Find Variant
          // We need to match Metal and Size
          const metalOptionId = product.options.find(o => o.title === "Metal")?.id;
          const sizeOptionId = product.options.find(o => o.title === "Size")?.id;

          const variant = product.variants.find(v => {
            let matchMetal = true;
            let matchSize = true;

            if (metalOptionId) {
              const val = v.options.find(o => o.option_id === metalOptionId)?.value;
              if (item.metal && val !== item.metal) matchMetal = false;
            }
            if (sizeOptionId) {
              const val = v.options.find(o => o.option_id === sizeOptionId)?.value;
              if (item.size && val !== item.size) matchSize = false;
            }
            return matchMetal && matchSize;
          });

          if (variant) {
            await MedusaAPI.addLineItem(cart.id, variant.id, 1);
          } else {
            console.warn(`Variant not found for ${item.title} (${item.metal}, ${item.size}). Adding first variant as fallback.`);
            if (product.variants.length > 0) {
              await MedusaAPI.addLineItem(cart.id, product.variants[0].id, 1);
            }
          }
        }
      }

      // 4. Update Cart with Shipping Address
      const updateRes = await MedusaAPI.updateCart(cart.id, {
        email: shippingData['shipping-email'],
        shipping_address: {
          first_name: shippingData['shipping-first-name'],
          last_name: shippingData['shipping-last-name'],
          address_1: shippingData['shipping-address'],
          city: shippingData['shipping-city'],
          country_code: (shippingData['shipping-country'] || 'in').slice(0, 2).toLowerCase(), // naive 2-letter code
          postal_code: shippingData['shipping-zip'],
          phone: shippingData['shipping-phone'],
          province: shippingData['shipping-state']
        }
      });
      if (!updateRes || !updateRes.cart) {
        throw new Error("Failed to update cart address: " + JSON.stringify(updateRes));
      }

      // 4.5 Select Shipping Method
      const shippingOptionsRes = await MedusaAPI.getShippingOptions(cart.id);
      const shippingOptions = shippingOptionsRes.shipping_options || [];

      if (shippingOptions.length > 0) {
        const firstOption = shippingOptions[0];
        console.log(`Selecting shipping option: ${firstOption.name} (${firstOption.id})`);
        const cartWithShipping = await MedusaAPI.addShippingMethod(cart.id, firstOption.id);

        // Update UI with shipping cost
        if (cartWithShipping && cartWithShipping.cart) {
          const userRegion = localStorage.getItem('user_region') || 'india';
          let shippingCost, itemSubtotal, totalWithShipping;

          // HOTFIX: For India, treat values as major units
          if (userRegion === 'india') {
            shippingCost = cartWithShipping.cart.shipping_total || 0;
            itemSubtotal = cartWithShipping.cart.item_subtotal || 0;
            totalWithShipping = cartWithShipping.cart.total || 0;
          } else {
            shippingCost = (cartWithShipping.cart.shipping_total || 0) / 100;
            itemSubtotal = (cartWithShipping.cart.item_subtotal || 0) / 100;
            totalWithShipping = (cartWithShipping.cart.total || 0) / 100;
          }

          const shippingElement = document.getElementById('shipping');
          const subtotalElement = document.getElementById('subtotal');
          const totalElement = document.getElementById('total');

          if (shippingElement && subtotalElement && totalElement) {
            const currencySymbol = '\u20B9';
            const digits = userRegion === 'india' ? 0 : 2;
            shippingElement.textContent = `${currencySymbol} ${shippingCost.toLocaleString('en-IN', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
            subtotalElement.textContent = `${currencySymbol} ${itemSubtotal.toLocaleString('en-IN', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
            totalElement.textContent = `${currencySymbol} ${totalWithShipping.toLocaleString('en-IN', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
          }
        }
      } else {
        throw new Error("No shipping options available. Please configure shipping in Medusa admin.");
      }

      // 5. Create Payment Sessions
      const sessionsRes = await MedusaAPI.createPaymentSessions(cart.id);
      if (!sessionsRes || !sessionsRes.cart) {
        throw new Error("Failed to create payment sessions: " + JSON.stringify(sessionsRes));
      }
      const cartWithPayment = sessionsRes.cart;

      console.log("Cart with payment sessions:", cartWithPayment);
      const sessions = cartWithPayment?.payment_sessions || [];

      // Match the correct provider ID
      const providerId = "pp_razorpay_razorpay";
      // Look for any session that starts with 'razorpay' or matches our preferred ID
      const razorpaySession = sessions.find(s =>
        s.provider_id === providerId ||
        s.provider_id === "razorpay" ||
        s.provider_id.includes("razorpay")
      );

      if (!razorpaySession) {
        console.error("Razorpay session not found", sessions);
        alert(`Payment initialization failed. Available sessions: ${sessions.map(s => s.provider_id).join(", ")}`);
        placeOrderBtn.innerText = "Place Order";
        placeOrderBtn.disabled = false;
        return;
      }

      await MedusaAPI.selectPaymentSession(cart.id, razorpaySession.provider_id);

      // 6. Open Razorpay
      const options = {
        key: 'rzp_test_S4Vz0IXYYKaMSL', // Should match backend
        amount: razorpaySession.amount,
        currency: razorpaySession.currency_code.toUpperCase(),
        name: "Harssh Doshi",
        description: "Order #" + cart.id.slice(0, 8),
        order_id: razorpaySession.data.id || razorpaySession.data.razorpay_order_id || razorpaySession.data.order_id, // Razorpay Order ID from backend
        handler: async function (response) {
          // Payment success
          console.log("Payment success", response);

          // Update session with Razorpay details (payment_id, signature)
          await MedusaAPI.updatePaymentSession(cart.id, razorpaySession.provider_id, response);

          // Complete Cart
          const completeRes = await MedusaAPI.completeCart(cart.id);
          if (completeRes.type === "order") {
            // Prepare email data
            const emailData = {
              orderId: completeRes.order.id,
              customerEmail: shippingData['shipping-email'],
              customerName: `${shippingData['shipping-first-name']} ${shippingData['shipping-last-name']}`,
              shippingAddress: {
                firstName: shippingData['shipping-first-name'],
                lastName: shippingData['shipping-last-name'],
                address: shippingData['shipping-address'],
                city: shippingData['shipping-city'],
                state: shippingData['shipping-state'],
                zip: shippingData['shipping-zip'],
                country: shippingData['shipping-country'],
                phone: shippingData['shipping-phone']
              },
              items: items.map(item => ({
                title: item.title,
                price: item.price,
                metal: item.metal,
                size: item.size,
                image: item.image,
                description: item.description
              })),
              total: completeRes.order.total,
              subtotal: completeRes.order.subtotal,
              shippingTotal: completeRes.order.shipping_total,
              currency: completeRes.order.currency_code
            };

            // Send confirmation email
            try {
              await MedusaAPI.sendOrderConfirmationEmail(emailData);
              console.log('Order confirmation email sent successfully');
            } catch (emailError) {
              console.error('Failed to send confirmation email:', emailError);
            }

            localStorage.removeItem('cartItems');
            // Show popup instead of redirecting
            const popup = document.getElementById('successPopup');
            const orderIdEl = document.getElementById('display-order-id');
            const orderInfoEl = document.getElementById('order-info');

            if (orderIdEl && orderInfoEl) {
              orderIdEl.textContent = completeRes.order.id;
              orderInfoEl.style.display = 'block';
            }
            if (popup) popup.classList.add('active');
          } else {
            alert("Order completion failed: " + JSON.stringify(completeRes));
          }
        },
        prefill: {
          name: `${shippingData['shipping-first-name']} ${shippingData['shipping-last-name']}`,
          email: shippingData['shipping-email'],
          contact: shippingData['shipping-phone']
        },
        theme: {
          color: "#000000"
        }
      };

      const rzp1 = new Razorpay(options);
      rzp1.on('payment.failed', function (response) {
        alert("Payment Failed: " + response.error.description);
        placeOrderBtn.innerText = "Place Order";
        placeOrderBtn.disabled = false;
      });
      rzp1.open();


    } catch (err) {
      console.error(err);
      alert('An error occurred during checkout. Check console properly. ' + err.message);
      placeOrderBtn.innerText = "Place Order";
      placeOrderBtn.disabled = false;
    }
  });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
  // Render cart items into the order summary
  displayCartItems();
  copyShippingToBilling();
  handlePlaceOrder();
  // Fetch and display shipping cost
  fetchShippingCost();
});

