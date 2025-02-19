import { useEffect } from "react";
import { useRouter } from "next/router";


export default function Home() {
    const router = useRouter();

    useEffect(() => {
        router.push("/submit"); // ✅ Redirects to /login
    }, []);

    return null; // Prevents flashing content
}
