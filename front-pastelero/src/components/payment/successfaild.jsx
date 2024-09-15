import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { io } from 'socket.io-client';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const socket = io(API_BASE); // Conectar al servidor de Socket.IO

export default function SuccessFail() {
    const [status, setStatus] = useState(null);
    const [customerEmail, setCustomerEmail] = useState("");
    const router = useRouter();

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

                // Verificar si la notificación ya se ha enviado utilizando localStorage
                const notificationKey = `notificationSent_${sessionId}`;
                const isNotificationSent = localStorage.getItem(notificationKey);

                if (data.status === "complete" && !isNotificationSent) {
                    // Emitir evento de Socket.IO
                    socket.emit('pagoRealizado', {
                        customer_email: data.customer_email,
                        nombreUsuario: data.customer_email,
                    });

                    // Marcar la notificación como enviada en localStorage
                    localStorage.setItem(notificationKey, 'true');
                }
            })
            .catch((error) => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }, []); // Solo se ejecuta cuando el componente se monta

    useEffect(() => {
        if (status === "open") {
            router.push("/checkout");
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
