import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function SuccessFail() {
    const [status, setStatus] = useState(null);
    const [customerEmail, setCustomerEmail] = useState("");
    const router = useRouter();

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const sessionId = urlParams.get("session_id");

        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/checkout/session-status?session_id=${sessionId}`)
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
    }, [status, router]);

    if (status === "complete") {
        return (
            <section id="success">
                <p>
                    ¡Agradecemos tu compra! Se enviará un correo de confirmación a {customerEmail}. 
                    Si tienes alguna pregunta, por favor envía un correo a <a href="mailto:pasteleria.ruisenor@gmail.com">esta direccion</a>.
                </p>
            </section>
        );
    }

    return null;
}
