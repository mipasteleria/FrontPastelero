import { CartContext } from "./carritocontext";
import { useContext } from "react";


function CartProduct({ id, source, paymentOption, quantity, name, status, amount }) {
    const cart = useContext(CartContext);
    
    return (
        <> 
            <h3>{CartProduct?.name || name || "Producto sin nombre"}</h3> {/* Mostrar el nombre o el dato desde getProductData */}
            <p>Estado: {status || "No definido"}</p>
            <p>Cantidad: {quantity}</p>
            <p>Precio por unidad: ${amount ? amount.toFixed(2) : "No disponible"}</p>
            <p>Total: ${(quantity * amount).toFixed(2) || "0.00"}</p>
            
            <button size="sm" onClick={() => cart.deleteFromCart(id, source, paymentOption)}>
                Eliminar del Carrito
            </button>
            <hr />
        </>
    );
}

export default CartProduct;
