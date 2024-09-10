import { CartContext } from "./carritocontext";
import { useContext } from "react";
import { getProductData } from "./pedidos";

function CartProduct({ id, source, paymentOption, quantity, name, status, amount }) {
    const cart = useContext(CartContext);
    const productData = getProductData(id); // Obtener datos adicionales del producto si es necesario

    return (
        <> 
            <h3>{productData?.title || name}</h3> {/* Mostrar el nombre o el dato desde getProductData */}
            <p>Estado: {status || "No definido"}</p>
            <p>Cantidad: {quantity}</p>
            <p>Precio por unidad: ${amount.toFixed(2)}</p>
            <p>Total: ${(quantity * amount).toFixed(2)}</p>
            <button size="sm" onClick={() => cart.deleteFromCart(id, source, paymentOption)}>
                Eliminar del Carrito
            </button>
            <hr />
        </>
    );
}

export default CartProduct;
