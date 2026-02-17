// Shared product data
let productsData = [];

// Get region ID based on user selection from index page popup
function getRegionId() {
  const userRegion = localStorage.getItem('user_region') || 'india';
  return userRegion === 'india'
    ? MEDUSA_CONFIG.INDIA_REGION_ID
    : MEDUSA_CONFIG.INTERNATIONAL_REGION_ID;
}

const getProductsUrl = () => `${MEDUSA_CONFIG.BACKEND_URL}/store/products?region_id=${getRegionId()}`;

// ---- FETCH PRODUCTS FROM STORE API ----
async function fetchProducts() {
  try {
    const response = await fetch(getProductsUrl(), {
      headers: {
        'accept': 'application/json',
        'x-publishable-api-key': MEDUSA_CONFIG.PUBLISHABLE_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Products API error: ${response.status}`);
    }

    const result = await response.json();
    const products = result.products || [];

    // Determine target currency based on region
    const userRegion = localStorage.getItem('user_region') || 'india';
    const targetCurrency = userRegion === 'india' ? 'inr' : 'usd';

    productsData = products.map((product, index) => {
      // ---- METAL & SIZE ----
      let metalValues = [];
      let sizeValues = [];

      (product.options || []).forEach(option => {
        if (option.title === 'Metal') {
          metalValues = option.values.map(v => v.value);
        }
        if (option.title === 'Size') {
          sizeValues = option.values.map(v => v.value);
        }
      });

      // ---- PRICE LOGIC ----
      let price = 0;
      let currencyCode = targetCurrency.toUpperCase();

      if (product.variants && product.variants.length > 0) {
        // Try to find price matching the target currency
        let selectedPriceObj = null;

        // Check all variants to find a price that matches our target currency
        // usually we take the first variant's price, but we want to be sure we get the right currency
        const firstVariant = product.variants[0];

        if (firstVariant.prices && firstVariant.prices.length > 0) {
          selectedPriceObj = firstVariant.prices.find(p => p.currency_code === targetCurrency);
          if (!selectedPriceObj) {
            // Fallback to any available price if target not found
            selectedPriceObj = firstVariant.prices[0];
          }
        }

        // If we found a price object in the prices array
        if (selectedPriceObj) {
          price = selectedPriceObj.amount;
          currencyCode = selectedPriceObj.currency_code.toUpperCase();
        } else if (firstVariant.calculated_price) {
          // Fallback to calculated_price if available (though prices array is more reliable for specific currency)
          price = firstVariant.calculated_price.calculated_amount;
          currencyCode = (firstVariant.calculated_price.currency_code || targetCurrency).toUpperCase();
        }
      }

      // ---- IMAGES - Use thumbnail and images array ----
      const images = [];

      // Add thumbnail first if it exists
      if (product.thumbnail) {
        images.push(product.thumbnail);
      }

      // Add other images
      if (product.images && product.images.length > 0) {
        product.images.forEach(img => {
          const imgUrl = img.url || img;
          if (imgUrl && !images.includes(imgUrl)) {
            images.push(imgUrl);
          }
        });
      }

      // Fallback to placeholder if no images
      if (images.length === 0) {
        images.push('assets/placeholder.png');
      }

      return {
        id: product.id || index,
        title: product.title || 'Untitled Product',
        subDescription: product.subtitle || '',
        description: product.description || '',
        material: product.material || '',
        metal: metalValues.join(', '),
        size: sizeValues.join(', '),
        price: price, // This is in cents/minor units
        currency_code: currencyCode,
        images: images,
        url: `products.html?id=${product.id}`,
        options: product.options || [],
        variants: product.variants || [],
      };
    });

    console.log('Products loaded successfully:', productsData.length, 'products');
    console.log('Sample product data:', productsData[0].price);
    console.log("price", productsData[0].variants)
    // console.log("currency", productsData[0].calculated_price.currency_code); // Output: "inr"
    // Using optional chaining to safely access nested properties
    const price = productsData[0]?.calculated_price?.calculated_amount ?? 'Price not available';
    console.log("price", price);

    // For currency
    const currency = productsData[0]?.calculated_price?.currency_code ?? 'Currency not available';
    console.log("currency", currency);

    return productsData;

  } catch (error) {
    console.error('Error loading products:', error);
    productsData = [];
    return productsData;
  }
}

// Initialize
fetchProducts();

// Export (optional)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { productsData, fetchProducts };
}
