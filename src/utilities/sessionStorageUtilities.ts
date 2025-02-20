// sessionStorageUtilities.ts
export const loadCartFromSession = () => {
    try {
        const serializedCart = sessionStorage.getItem("cart");
        if (serializedCart === null) {
            return undefined; 
        }
        return JSON.parse(serializedCart);
    } catch (e) {
        console.error("Error loading cart from sessionStorage", e);
        return undefined;
    }
};

export const saveCartToSession = (cart: any) => {
    try {
        const serializedCart = JSON.stringify(cart);
        sessionStorage.setItem("cart", serializedCart);
    } catch (e) {
        console.error("Error saving cart to sessionStorage", e);
    }
};

