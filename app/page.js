import * as cv from "@/app/data/cv.mjs";
import CvPage from "@/app/components/CvPage";

export const metadata = {
  alternates: { canonical: "/", languages: { es: "/", en: "/en" } },
};

export default function Home() {
  return <CvPage cv={cv} />;
}
