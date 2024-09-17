import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function SuccessFail() {
    const [status, setStatus] = useState(null);
    const [customerEmail, setCustomerEmail] = useState("");
    const router = useRouter();

    const enviarNotificacion = async () => {
        try {
            const response = await fetch(`${API_BASE}/notificaciones`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mensaje: `${customerEmail} ha realizado un pago `,
                }),
            });

            if (!response.ok) {
                throw new Error('Error al enviar la notificación');
            }

            const data = await response.json();
            console.log('Notificación enviada con éxito:', data);
        } catch (error) {
            console.error('Error al enviar la notificación:', error);
        }
    };

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
            })
            .catch((error) => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }, []);

    useEffect(() => {
        if (status === "open") {
            router.push("/checkout");
        }

        if (status === "complete") {
            enviarNotificacion(); // Enviar la notificación siempre que el pago se complete
        }
    }, [status, router]);

    if (status === "complete") {
        return (
            <section id="success">
                <p>
                    ¡Agradecemos tu compra! Se enviará un correo de confirmación a {customerEmail}.
                    Si tienes alguna pregunta, por favor envía un correo a <a href="mailto:pasteleria.ruisenor@gmail.com">esta dirección</a>.
                </p>
            </section>
        );
    }

    return null;
}
