import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2'; 
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function SuccessFail() {
    const [status, setStatus] = useState(null);
    const [customerEmail, setCustomerEmail] = useState("");
    const router = useRouter();
    const [paymentOption, setPaymentOption] = useState("");
    const [id, setId] = useState("");
    const [source, setSource] = useState("");

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const sessionId = urlParams.get("session_id");

        fetch(`${API_BASE}/checkout/session-status?session_id=${sessionId}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((data) => {
                setStatus(data.status);
                setCustomerEmail(data.customer_email);
                setPaymentOption(data.paymentOption);
                setId(data.id);
                setSource(data.source);
            })
            .catch((error) => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }, []);

    const successOnLoad = async () => {
        const token = localStorage.getItem("token");

        let url;
        switch (source) {
            case "pastel":
                url = `${API_BASE}/pricecake/${id}`;
                break;
            case "cupcake":
                url = `${API_BASE}/pricecupcake/${id}`;
                break;
            case "snack":
                url = `${API_BASE}/pricesnack/${id}`;
                break;
            default:
                console.error("Invalid source");
                return;
        }

        try {
            let statusUpdate;

            if (paymentOption === "total") {
                statusUpdate = {
                    status: "Liquidado",
                };
            } else if (paymentOption === "Anticipo") {
                statusUpdate = {
                    status: "Agendado con el 50%",
                };
            } else {
                console.error("Invalid payment option");
                return;
            }

            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(statusUpdate),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            // Después de actualizar el estado, enviar el correo
            await fetch(`${API_BASE}/send-confirmation-email`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: customerEmail,
                    customerName: "Nombre del Cliente",  
                    orderDetails: "Detalles del pedido...",  
                }),
            });

            Swal.fire({
                title: paymentOption === "total" ? "¡Cotización Agendada!" : "¡Cotización Agendada con el 50%!",
                text: paymentOption === "total" 
                    ? "La cotización se ha agendado." 
                    : "La cotización se ha agendado con el 50%.",
                icon: "success",
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
                background: "#fff1f2",
                color: "#540027",
            });

        } catch (error) {
            console.error("Error updating data or sending email:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudo agendar la cotización o enviar el correo. Por favor, inténtalo de nuevo.",
                icon: "error",
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
                background: "#fff1f2",
                color: "#540027",
            });
        }
    };

    useEffect(() => {
        if (status === "complete") {
            successOnLoad();
        }
    }, [status]);

    useEffect(() => {
        if (status === "open") {
            router.push("/checkout");
        }
    }, [status, router]);

    if (status === "complete") {
        return (
            <div>
                <section id="success">
                    <p>
                        ¡Agradecemos tu compra! Se enviará un correo de confirmación a {customerEmail}. 
                        Si tienes alguna pregunta, por favor envía un correo a <a href="mailto:pasteleria.ruisenor@gmail.com">esta direccion pasteleria.ruisenor@gmail.com</a>.
                    </p>
                </section>
            </div>
        );
    }

    return null;
}

