import { Footer, Header } from "./_components";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
