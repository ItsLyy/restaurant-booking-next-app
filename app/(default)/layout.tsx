export default function DefaultLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <main className="h-svh max-w-240 mx-auto w-full">{children}</main>;
}
