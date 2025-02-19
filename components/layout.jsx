import { Geist, Geist_Mono } from "next/font/google";
import "../app/globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "A4 Assigment",
    description: "in progress",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-r from-blue-500 to-green-500 text-white min-h-screen flex justify-center items-center`}
        >
        {children}
        </body>
        </html>
    );
}
