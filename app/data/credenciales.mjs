// Configuración de la sección "Formación y credenciales" (sitio ES/EN + PDF).
//
// Hay dos tipos de credenciales:
//   1. Automáticas: se leen de los perfiles públicos de Credly y Google Skills Boost con
//      `node scripts/fetch-credenciales.mjs` (corre solo en el pipeline antes del build).
//      El resultado queda en credenciales.generated.json (se comitea como copia de respaldo).
//   2. Manuales: certificados en PDF (p. ej. AWS Skill Builder). Deja el PDF en
//      public/credenciales/<carpeta>/ y agrégalo a `manuales`. La miniatura se genera sola.
//
// Los nombres de cursos/insignias son nombres propios: se muestran igual en ambos idiomas.

export const fuentes = {
  // credly.com/users/<usuario>
  credly: "juan-diego-isaza-londono",
  // skills.google/public_profiles/<id>
  skillsBoost: "dc58096a-bed4-4b02-80c2-8172ed18185e",
};

// Ids de credenciales automáticas que no se muestran (ver credenciales.generated.json).
export const ocultar = [
  // "Build a Website on Google Cloud Skill Badge" en Credly: re-emisión (2026) de la insignia
  // de Skills Boost de 2022, que es la que se muestra.
  "credly-97ccc3d1-66eb-49f6-aaed-b25016f4540a",
];

// Credenciales que se muestran en el sitio pero NO en el CV en PDF (para que quepa en 2 páginas).
// Usa el id de credenciales.generated.json o el `id` de los manuales.
export const ocultarEnPDF = [
  "credly-b5c75baf-b128-4af7-b62e-796bbf08c65b", // LFC102: Inclusive Open Source Community Orientation
  "credly-50a4da6b-cfdc-4c02-82a6-786c04ea0030", // LFD103: A Beginner's Guide to Linux Kernel Development
  "credly-a6c26d4a-5463-42da-bd4e-d22db33625bc", // CertiProf: Lifelong Learning 2025
  "credly-060a7b1a-6c8a-410d-b88f-3c474575d38d", // CertiProf: Lifelong Learning
  "credly-2a1c1f09-d9dc-4e79-90c6-d5d1d84bb792", // IBM SkillsBuild: Explore Emerging Tech
];

// Certificados en PDF. `pdf` es una ruta dentro de public/; si hay versión por idioma,
// usa { es, en } y cada página enlaza la suya.
export const manuales = [
  {
    id: "aws-devops-on-aws",
    titulo: "Getting Started with DevOps on AWS",
    emisor: "AWS",
    fecha: "2026-05-03",
    pdf: "credenciales/aws/devops-on-aws.pdf",
  },
  {
    id: "aws-cloudformation",
    titulo: "Getting Started with AWS CloudFormation",
    emisor: "AWS",
    fecha: "2026-05-03",
    pdf: "credenciales/aws/cloudformation.pdf",
  },
  {
    id: "aws-containers",
    titulo: "Introduction to Containers",
    emisor: "AWS",
    fecha: "2026-09-02",
    pdf: "credenciales/aws/introduction-to-containers.pdf",
  },
  {
    id: "aws-simulearn-computing-solutions",
    titulo: "AWS SimuLearn: Computing Solutions",
    emisor: "AWS",
    fecha: "2026-09-02",
    pdf: {
      es: "credenciales/aws/simulearn-computing-solutions-es.pdf",
      en: "credenciales/aws/simulearn-computing-solutions-en.pdf",
    },
  },
  {
    id: "aws-simulearn-cloud-computing-essentials",
    titulo: "AWS SimuLearn: Cloud Computing Essentials",
    emisor: "AWS",
    fecha: "2026-09-01",
    pdf: {
      es: "credenciales/aws/simulearn-cloud-computing-essentials-es.pdf",
      en: "credenciales/aws/simulearn-cloud-computing-essentials-en.pdf",
    },
  },
  {
    id: "aws-simulearn-cloud-first-steps",
    titulo: "AWS SimuLearn: Cloud First Steps",
    emisor: "AWS",
    fecha: "2026-09-01",
    pdf: {
      es: "credenciales/aws/simulearn-cloud-first-steps-es.pdf",
      en: "credenciales/aws/simulearn-cloud-first-steps-en.pdf",
    },
  },
];
