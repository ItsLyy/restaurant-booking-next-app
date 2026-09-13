import { Footer } from "./_components/footer";
import { Header } from "./_components/header";

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-foreground selection:bg-accent-200/20 selection:text-accent-100">
      <Header />
      <main className="w-full grow max-w-300 mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 flex flex-col gap-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}

