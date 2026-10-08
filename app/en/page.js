import * as cv from "@/app/data/cv.en.mjs";
import CvPage from "@/app/components/CvPage";

const { metaTitulo: title, metaDescripcion: description } = cv.ui;

export const metadata = {
  title,
  description,
  alternates: { canonical: "/en", languages: { es: "/", en: "/en" } },
  openGraph: {
    title,
    description,
    url: "/en",
    siteName: "Juan Diego Isaza — Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function HomeEn() {
  return <CvPage cv={cv} />;
}
