
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-inter",
});


export const metadata = {
  title: "TagDynamix - Dynamic Tag Management Solutions",
  description: "TagDynamix offers cutting-edge solutions for dynamic tag management, analytics, and optimization. Enhance your website's performance with our innovative tools.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} display overflow-x-hidden`}>
       <Navbar />
        <main>{children}</main>
       
      </body>
    </html>
  );
}
