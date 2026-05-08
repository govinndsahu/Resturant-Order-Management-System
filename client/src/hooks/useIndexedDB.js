const DB_NAME = "cafeteriaDB";
const DB_VERSION = 1;
const PRODUCTS_STORE = "products";
const CATEGORIES_STORE = "categories";

function sortBySn(items = []) {
  return [...items].sort((a, b) => {
    const aSn = Number(a?.sn ?? Number.MAX_SAFE_INTEGER);
    const bSn = Number(b?.sn ?? Number.MAX_SAFE_INTEGER);
    return aSn - bSn;
  });
}

// ✅ Open / Initialize DB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    // Runs when DB is created or version changes
    request.onupgradeneeded = (e) => {
      const db = e.target.result;

      if (!db.objectStoreNames.contains(PRODUCTS_STORE)) {
        const store = db.createObjectStore(PRODUCTS_STORE, { keyPath: "_id" });

        // Create indexes for searching/filtering
        store.createIndex("name", "name", { unique: false });
        store.createIndex("category", "category", { unique: false });
      }

      // ✅ Categories store
      if (!db.objectStoreNames.contains(CATEGORIES_STORE)) {
        const store = db.createObjectStore(CATEGORIES_STORE, {
          keyPath: "_id",
        });
        store.createIndex("name", "name", { unique: false });
      }

      // ✅ Cart store
      if (!db.objectStoreNames.contains("cart")) {
        const store = db.createObjectStore("cart", { keyPath: "_id" });
        store.createIndex("name", "name", { unique: false });
        console.log("✅ Cart store created");
      }
    };

    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

// ✅ Save multiple products at once
export async function saveAllProducts(products) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PRODUCTS_STORE, "readwrite");
    const store = tx.objectStore(PRODUCTS_STORE);

    const clearRequest = store.clear();
    clearRequest.onsuccess = () => {
      products.forEach((p) => store.put(p));
    };
    clearRequest.onerror = (e) => reject(e.target.error);

    tx.oncomplete = () => resolve("✅ All products saved");
    tx.onerror = (e) => reject(e.target.error);
  });
}

// ✅ Get all products
export async function getAllProducts() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PRODUCTS_STORE, "readonly");
    const store = tx.objectStore(PRODUCTS_STORE);
    const request = store.getAll();

    request.onsuccess = () => resolve(sortBySn(request.result));
    request.onerror = (e) => reject(e.target.error);
  });
}

// ============= Categories Store =============

export async function saveAllCategories(categories) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CATEGORIES_STORE, "readwrite");
    const store = tx.objectStore(CATEGORIES_STORE);

    const clearRequest = store.clear();
    clearRequest.onsuccess = () => {
      categories.forEach((c) => store.put(c));
    };
    clearRequest.onerror = (e) => reject(e.target.error);

    tx.oncomplete = () => resolve("✅ Categories saved");
    tx.onerror = (e) => reject(e.target.error);
  });
}

export async function getAllCategories() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CATEGORIES_STORE, "readonly");
    const store = tx.objectStore(CATEGORIES_STORE);
    const request = store.getAll();
    request.onsuccess = () => resolve(sortBySn(request.result));
    request.onerror = (e) => reject(e.target.error);
  });
}

// ============= Cart Store =============

// Generate unique cart item ID combining product ID and size
function generateCartItemId(productId, size) {
  return `${productId}_${size || "standard"}`;
}

// Add or update item in cart
export async function addToCart(product) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("cart", "readwrite");
    const store = tx.objectStore("cart");

    // Create unique ID that includes product ID and size
    const cartItemId = generateCartItemId(product._id, product.size);

    // Check if already in cart
    const getRequest = store.get(cartItemId);

    getRequest.onsuccess = () => {
      const existing = getRequest.result;

      if (existing) {
        // ✅ Already in cart — increase quantity
        existing.quantity += 1;
        store.put(existing);
      } else {
        // ✅ New item — add with quantity 1 and the generated ID
        store.put({ ...product, _id: cartItemId, quantity: 1 });
      }

      resolve("✅ Added to cart");
    };

    getRequest.onerror = (e) => reject(e.target.error);
  });
}

// Get all cart items
export async function getCart() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("cart", "readonly");
    const store = tx.objectStore("cart");
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

// Clear entire cart (after order placed)
export async function clearCart() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("cart", "readwrite");
    const store = tx.objectStore("cart");
    const request = store.clear();
    request.onsuccess = () => resolve("✅ Cart cleared");
    request.onerror = (e) => reject(e.target.error);
  });
}

export async function saveAllCartItems(items) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("cart", "readwrite");
    const store = tx.objectStore("cart");

    // Remove stale items first, then re-add the current cart contents.
    const clearRequest = store.clear();
    clearRequest.onsuccess = () => {
      items.forEach((item) => store.put(item));
    };
    clearRequest.onerror = (e) => reject(e.target.error);

    tx.oncomplete = () => {
      resolve("✅ Cart updated");
    };
    tx.onerror = (e) => reject(e.target.error);
  });
}

// Update quantity of a specific item in cart
export async function updateCartQuantity(productId, quantity) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("cart", "readwrite");
    const store = tx.objectStore("cart");

    const getRequest = store.get(productId);

    getRequest.onsuccess = () => {
      const item = getRequest.result;

      if (item) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
          store.delete(productId);
        } else {
          // Update quantity
          item.quantity = quantity;
          store.put(item);
        }
        resolve("✅ Quantity updated");
      } else {
        reject(new Error("Item not found in cart"));
      }
    };

    getRequest.onerror = (e) => reject(e.target.error);
  });
}

// Remove item from cart
export async function removeFromCart(productId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("cart", "readwrite");
    const store = tx.objectStore("cart");

    const request = store.delete(productId);
    request.onsuccess = () => resolve("✅ Item removed from cart");
    request.onerror = (e) => reject(e.target.error);
  });
}
