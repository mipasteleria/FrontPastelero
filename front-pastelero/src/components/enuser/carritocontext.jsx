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

  // Obtener cantidad del producto en el carrito
  function getProductQuantity(id, source, paymentOption) {
    const product = cart.find(
      (item) =>
        item.id === id &&
        item.source === source &&
        item.paymentOption === paymentOption
    );
    return product ? product.quantity : 0;
  }

  // Agregar un producto al carrito
  function addOneToCart({ id, source, paymentOption, amount, status, name }) {
    const quantity = getProductQuantity(id, source, paymentOption);

    if (quantity === 0) {
      setCart((prevCart) => [
        ...prevCart,
        {
          id: id,
          source: source.toLowerCase(),
          amount: amount, // Monto seleccionado
          paymentOption: paymentOption, // Tipo de pago (anticipo o total)
          status: status, // Agregar estado
          name: name, // Agregar nombre
          quantity: 1, // Inicializar con cantidad 1
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

  // Quitar un producto del carrito
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

  // Eliminar un producto completamente del carrito
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

  // Calcular el costo total del carrito
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
