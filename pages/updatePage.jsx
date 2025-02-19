"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const UpdateDeleteForm = () => {
    const { data: session } = useSession();
    const [userData, setUserData] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    console.log("Session data:", session);

    const fetchUserData = async () => {
        if (!session || !session.user) {
            setErrorMessage("You must be logged in to fetch data.");
            return;
        }

        const username = session.user.User;
        const password = session.user.Password;

        try {
            const response = await fetch("/api/fetchUserData", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("User data retrieved:", data);
                setUserData(data);
                setErrorMessage("");
            } else {
                console.error("Error fetching user data:", data.error);
                setUserData([]);
                setErrorMessage(data.error);
            }
        } catch (error) {
            console.error("Server Error:", error);
            setErrorMessage("Server Error. Please try again.");
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [session]);

    const handleUpdate = async () => {
        console.log("Updating entries...");

        const updatedData = userData.map((entry, index) => {
            const name = document.getElementById(`name-${index}`).value;
            const age = parseInt(document.getElementById(`age-${index}`).value, 10);
            const major = document.getElementById(`major-${index}`).value;

            return {
                ...entry,
                Name: name,
                Age: age,
                Major: major,
                estimatedBirthYear: new Date().getFullYear() - age,
            };
        });

        console.log("Sending updated data:", updatedData);

        try {
            const response = await fetch("/api/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Data updated successfully:", data);
                setUserData(updatedData);
                setErrorMessage("");
            } else {
                console.error("Error updating data:", data.error);
                setErrorMessage(data.error);
            }
        } catch (error) {
            console.error("Server Error:", error);
            setErrorMessage("Server Error. Please try again.");
        }
    };

    const handleDelete = async () => {
        const deleteID = parseInt(document.getElementById("deleteID").value.trim(), 10);

        if (isNaN(deleteID) || deleteID < 1 || deleteID > userData.length) {
            setErrorMessage("Invalid row number.");
            return;
        }
        if (userData.length === 1) {
            setErrorMessage("You cannot delete the last remaining entry.");
            return;
        }
        console.log(`Deleting entry at row #${deleteID}`);

        const updatedData = userData.filter((_, index) => index + 1 !== deleteID);

        try {
            const response = await fetch("/api/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Data updated successfully:", data);
                setUserData(updatedData);
                setErrorMessage("");
            } else {
                console.error("Error updating data:", data.error);
                setErrorMessage(data.error);
            }
        } catch (error) {
            console.error("Server Error:", error);
            setErrorMessage("Server Error. Please try again.");
        }
    };

    return (
        <div className="mt-8 p-6 bg-gray-900 text-white shadow-lg rounded-md max-w-lg mx-auto">
            <h2 className="text-xl font-semibold text-white mb-6">Update & Delete Entries</h2>

            <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-300 mb-2">Update Entry</h3>
                <table className="w-full border-collapse border border-gray-700">
                    <thead>
                    <tr className="border border-gray-700">
                        <th className="p-2 text-gray-300">Name</th>
                        <th className="p-2 text-gray-300">Age</th>
                        <th className="p-2 text-gray-300">Major</th>
                        <th className="p-2 text-gray-300">Estimated Birth Year</th>
                    </tr>
                    </thead>
                    <tbody>
                    {userData.length > 0 ? (
                        userData.map((entry, index) => (
                            <tr key={index} className="border border-gray-700">
                                <td className="p-2 text-gray-300">
                                    <input
                                        type="text"
                                        id={`name-${index}`}
                                        defaultValue={entry.Name}
                                        className="bg-gray-800 text-white border border-gray-600 rounded-md px-2 py-1 w-full"
                                    />
                                </td>
                                <td className="p-2 text-gray-300">
                                    <input
                                        type="number"
                                        id={`age-${index}`}
                                        defaultValue={entry.Age}
                                        className="bg-gray-800 text-white border border-gray-600 rounded-md px-2 py-1 w-full"
                                    />
                                </td>
                                <td className="p-2 text-gray-300">
                                    <input
                                        type="text"
                                        id={`major-${index}`}
                                        defaultValue={entry.Major}
                                        className="bg-gray-800 text-white border border-gray-600 rounded-md px-2 py-1 w-full"
                                    />
                                </td>
                                <td className="p-2 text-gray-300">
                                    {entry.estimatedBirthYear}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td className="p-2 text-gray-300" colSpan="4">No data found</td>
                        </tr>
                    )}
                    </tbody>
                </table>

                <button
                    onClick={handleUpdate}
                    className="mt-4 w-full bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 transition"
                >
                    Update Entry
                </button>
            </div>

            <hr className="border-gray-700 my-4"/>

            <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-300 mb-2">Delete Entry</h3>
                <table className="w-full border-collapse border border-gray-700">
                    <thead>
                    <tr className="border border-gray-700">
                        <th className="p-2 text-gray-300">#</th>
                        {/* ✅ Row Number */}
                        <th className="p-2 text-gray-300">Name</th>
                        <th className="p-2 text-gray-300">Age</th>
                        <th className="p-2 text-gray-300">Major</th>
                        <th className="p-2 text-gray-300">Estimated Birth Year</th>
                    </tr>
                    </thead>
                    <tbody>
                    {userData.length > 0 ? (
                        userData.map((entry, index) => (
                            <tr key={index} className="border border-gray-700">
                                <td className="p-2 text-gray-300">{index + 1}</td>
                                {/* ✅ Index */}
                                <td className="p-2 text-gray-300">{entry.Name}</td>
                                <td className="p-2 text-gray-300">{entry.Age}</td>
                                <td className="p-2 text-gray-300">{entry.Major}</td>
                                <td className="p-2 text-gray-300">{entry.estimatedBirthYear}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td className="p-2 text-gray-300 text-center" colSpan="5">
                                ❌ No data found
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>

                <form id="deleteForm">
                    <label htmlFor="deleteID" className="block text-gray-300 mb-2">
                        Enter ID to Delete:
                    </label>
                    <input
                        type="text"
                        id="deleteID"
                        className="w-full border border-gray-600 p-2 rounded bg-gray-800 text-white"
                    />
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
                    >
                        Delete Entry
                    </button>
                </form>
            </div>

            {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
        </div>
    );
};

export default UpdateDeleteForm;
