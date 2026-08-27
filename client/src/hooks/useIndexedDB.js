import { getAppId } from "../utils/util";

function getDbName() {
  const stableName = localStorage.getItem("menuDbName")?.trim();
  const fallbackId = getAppId();
  return `${stableName || fallbackId}DB`;
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(getDbName(), 1);

    // Runs when DB is created or version changes
    request.onupgradeneeded = (e) => {
      const db = e.target.result;

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

function generateCartItemId(productId, size) {
  return `${productId}_${size || "standard"}`;
}

export async function addToCart(product) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("cart", "readwrite");
    const store = tx.objectStore("cart");

    const cartItemId = generateCartItemId(product._id, product.size);

    const getRequest = store.get(cartItemId);

    getRequest.onsuccess = () => {
      const existing = getRequest.result;

      if (existing) {
        existing.quantity += 1;
        store.put(existing);
      } else {
        store.put({ ...product, _id: cartItemId, quantity: 1 });
      }

      resolve("✅ Added to cart");
    };

    getRequest.onerror = (e) => reject(e.target.error);
  });
}

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
