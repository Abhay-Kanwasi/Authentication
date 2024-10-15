import "./globals.css";
import StoreProvider from "./StoreProvider";
export const metadata = {
  title: "Authentication",
  description: "Full authentication using MERN",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
