"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";

const SubmitForm = () => {
    const { data: session } = useSession();
    const [message, setMessage] = useState("");

    console.log("SubmitForm component loaded!");
    console.log("Session data:", session);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!session || !session.user) {
            alert("You must be logged in to submit data!");
            return;
        }

        const name = document.getElementById("yourname").value;
        const age = document.getElementById("yourage").value;
        const major = document.getElementById("yourmajor").value;

        const username = session.user.User;
        const password = session.user.Password;

        console.log("Form Submitted:", { name, age, major, username, password });

        try {
            const response = await fetch("/api/submitUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Name: name,
                    Age: age,
                    Major: major,
                    UserName: username,
                    PassWord: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Submission Successful:", data);
                setMessage("Entry added successfully!");
            } else {
                console.error("Submission Failed:", data.error);
                setMessage(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error("Error Fetching API:", error);
            setMessage("Server Error. Please try again.");
        }
    };

    return (
        <div className="flex flex-col items-center p-6 bg-gray-800 rounded-md">
            <h2 className="text-white text-xl font-semibold mb-4">Submit Form</h2>

            <form className="w-full max-w-sm space-y-4" onSubmit={handleSubmit}>
                <input id="yourname"
                       type="text"
                       placeholder="Enter Name"
                       className="w-full bg-transparent text-white border border-slate-400 rounded-md px-3 py-2"
                       required
                />
                <input id="yourage"
                       type="number"
                       placeholder="Enter Age"
                       className="w-full bg-transparent text-white border border-slate-400 rounded-md px-3 py-2"
                       required
                />
                <input id="yourmajor"
                       type="text"
                       placeholder="Enter Major"
                       className="w-full bg-transparent text-white border border-slate-400 rounded-md px-3 py-2"
                       required
                />

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white rounded-md py-2 hover:bg-green-700 transition"
                >
                    Submit
                </button>
            </form>

            {message && <p className="mt-4 text-white">{message}</p>}
        </div>
    );
};

export default SubmitForm;
