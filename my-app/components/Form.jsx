import { useActionState } from "react";

export default function SignupPage() {
    async function signup(prevState, formData) {
        "use server";
        const email = formData.get("email");
        try {
            alert(`Added "${email}"`);
        } catch (err) {
            return err.toString();
        }
    }

    const [message, signupAction] = useActionState(signup, null);

    return (
        <>
            <h1>Signup for my newsletter</h1>
            <p>Signup with the same email twice to see an error</p>
            <form action={signupAction} id="signup-form">
                <label htmlFor="email">Email: </label>
                <input name="email" id="email" placeholder="react@example.com" />
                <button>Sign up</button>
                {!!message && <p>{message}</p>}
            </form>
        </>
    );
}
