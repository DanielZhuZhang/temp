import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";


const Navbar = () => {
    const { data: session } = useSession();
    console.log("🔍 Session data:", session);

    return (
        <nav className="bg-gray-900 p-4 shadow-lg fixed top-0 left-0 w-full">
            <div className="flex justify-between items-center max-w-4xl mx-auto">
                <div className="flex space-x-6">
                    <Link href="/submit" className="text-white px-4 py-2 rounded-md hover:bg-gray-600">Submit</Link>
                    <Link href="/updatePage" className="text-white px-4 py-2 rounded-md hover:bg-gray-600">Update</Link>
                </div>

                <div>
                    {session ? (
                        <>
                            <span className="text-white mr-4"> <h1>Welcome, {session.user?.User || "Guest"}!</h1></span>
                            <button onClick={() => signOut()} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <button onClick={() => signIn()} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                            Sign In
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
