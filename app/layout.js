import "./globals.css";

export const metadata = {
  title: "PROLIFIC HUB — Educational Platform by Ishu Jangir",
  description:
    "PROLIFIC HUB — courses, video lectures, test series and study materials for SSC CGL, SSC CHSL, CDS and General Awareness preparation.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f7f8",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
