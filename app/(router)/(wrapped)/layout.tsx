import Footer from "../../presentation/components/footer";
import Header from "../../presentation/components/header";
import { Toaster } from "react-hot-toast";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Header />
      {children}
      <Footer />
    </>
  );
}
