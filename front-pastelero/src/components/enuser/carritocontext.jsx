import { createContext, useState } from 'react';

export const CartContext = createContext({
  items: [],
  getProductQuantity: () => {},
  addOneToCart: () => {},
  removeOneFromCart: () => {},
  deleteFromCart: () => {},
  getTotalCost: () => {},
});

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  function getProductQuantity(id, source, paymentOption) {
    const product = cart.find(
      (item) =>
        item.id === id &&
        item.source === source &&
        item.paymentOption === paymentOption
    );
    return product ? product.quantity : 0;
  }

  function addOneToCart({ id, source, paymentOption, amount, status, name }) {
    const quantity = getProductQuantity(id, source, paymentOption);

    if (quantity === 0) {
      setCart((prevCart) => [
        ...prevCart,
        {
          id,
          source,
          paymentOption,
          amount,
          status,
          name,
          quantity: 1,
        },
      ]);
    } else {
      setCart((prevCart) =>
        prevCart.map((product) =>
          product.id === id &&
          product.source === source &&
          product.paymentOption === paymentOption
            ? { ...product, quantity: product.quantity + 1 }
            : product
        )
      );
    }
  }

  function removeOneFromCart(id, source, paymentOption) {
    const quantity = getProductQuantity(id, source, paymentOption);
    if (quantity === 1) {
      deleteFromCart(id, source, paymentOption);
    } else {
      setCart((prevCart) =>
        prevCart.map((product) =>
          product.id === id &&
          product.source === source &&
          product.paymentOption === paymentOption
            ? { ...product, quantity: product.quantity - 1 }
            : product
        )
      );
    }
  }

  function deleteFromCart(id, source, paymentOption) {
    setCart((prevCart) =>
      prevCart.filter(
        (product) =>
          !(product.id === id &&
          product.source === source &&
          product.paymentOption === paymentOption)
      )
    );
  }

  function getTotalCost() {
    return cart.reduce((totalCost, cartItem) => {
      return totalCost + cartItem.amount * cartItem.quantity;
    }, 0);
  }

  const contextValue = {
    items: cart,
    getProductQuantity,
    addOneToCart,
    removeOneFromCart,
    deleteFromCart,
    getTotalCost,
  };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}

export default CartProvider;
