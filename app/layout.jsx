export const metadata = {
  title: 'VVV Digitals',
  description: 'Gemini sandbox rebuild'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin:0 }}>{children}</body>
    </html>
  );
}
