import { Footer } from "./_components/footer";
import { Header } from "./_components/header";

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="w-full max-w-240 mx-auto p-4 pb-30 flex flex-col gap-4">
        {children}
      </main>
      <Footer />
    </>
  );
}
