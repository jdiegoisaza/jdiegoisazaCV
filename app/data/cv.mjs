// Fuente de verdad del contenido EN ESPAÑOL del sitio (/) Y del CV en PDF (ver ../../cv/generate-tex.mjs).
// La versión en inglés vive en cv.en.mjs (sitio /en + CV_JuanIsaza_EN.pdf) y debe tener la misma forma.
// mobile/nombrePila/apellidos/perfilCV existen solo para el PDF — ningún componente del sitio los usa.

// Textos de interfaz (menú, títulos de sección, botones) y títulos de sección del PDF.
export const ui = {
  lang: "es",
  metaTitulo: "Juan Diego Isaza Londoño — Especialista DevSecOps",
  metaDescripcion:
    "Portafolio con casos de estudio reales de automatización DevSecOps en Azure: pipelines, seguridad integrada y despliegue continuo, incluyendo cómo construí y aseguré este mismo sitio.",
  nav: {
    inicio: "Inicio",
    experiencia: "Experiencia",
    habilidades: "Habilidades",
    portafolio: "Portafolio",
    contacto: "Contacto",
    abrirMenu: "Abrir menú",
    modoClaro: "Cambiar a modo claro",
    modoOscuro: "Cambiar a modo oscuro",
  },
  // Enlace al otro idioma (ruta relativa al basePath del sitio).
  otroIdioma: { label: "EN", href: "/en", titulo: "English version" },
  hero: { saludo: "Hola, soy", contactar: "Contactar", descargarCV: "Descargar CV" },
  // Nombre del PDF dentro de public/ (lo genera el pipeline).
  cvPdf: "CV_JuanIsaza.pdf",
  secciones: {
    experiencia: "Experiencia",
    habilidades: "Habilidades técnicas",
    certificaciones: "Certificaciones",
    educacion: "Educación",
    portafolio: "Portafolio",
    portafolioIntro: "Casos de estudio de proyectos reales, descritos sin datos confidenciales de cliente.",
    contacto: "Contacto",
    contactoIntro:
      "¿Buscas un especialista DevSecOps / Azure DevOps para tu equipo? Escríbeme por cualquiera de estos canales.",
  },
  pdf: {
    perfil: "Perfil Profesional",
    experiencia: "Experiencia",
    educacion: "Educación",
    habilidades: "Habilidades Técnicas",
    certificaciones: "Certificaciones",
    portafolio: "Portafolio",
    repositorio: "Repositorio",
  },
};

export const perfil = {
  nombre: "Juan Diego Isaza Londoño",
  nombrePila: "Juan Diego",
  apellidos: "Isaza Londoño",
  titulo: "Especialista DevSecOps · Ingeniero de Sistemas",
  ubicacion: "Medellín, Colombia",
  mobile: "+57 301 2951921",
  email: "juan.diego-13@hotmail.com",
  github: "https://github.com/jdiegoisaza",
  linkedin: "https://linkedin.com/in/jdiegoisaza",
  // Solo para el PDF (\extrainfo en el header, después de LinkedIn).
  sitioWeb: "https://salmon-bush-02614530f.7.azurestaticapps.net/",
  resumen:
    "Especialista DevSecOps con foco en Azure DevOps, automatización de pipelines CI/CD y estandarización de controles de seguridad a escala organizacional. Diseñé un sistema propio de extensiones y pipeline decorators que inyecta automáticamente controles DevSecOps en cientos de pipelines y decenas de repositorios, y estuve encargado de la homologación de las herramientas DevSecOps de Bancolombia hacia Banco Agrícola (Grupo Cibest, El Salvador), incluyendo contribución directa al proyecto open source Engine Tools.",
  // Versión más completa usada en el PDF (el hero del sitio usa la versión corta de arriba).
  perfilCV:
    "Especialista DevSecOps con foco en Azure DevOps, automatización de pipelines CI/CD y estandarización de controles de seguridad a escala organizacional. Diseñé un sistema propio de extensiones y pipeline decorators que inyecta automáticamente controles DevSecOps en cientos de pipelines y decenas de repositorios, y estuve encargado de la homologación de las herramientas DevSecOps de Bancolombia hacia Banco Agrícola (Grupo Cibest, El Salvador), incluyendo contribución directa al proyecto open source Engine Tools. Ingeniero de Sistemas (Universidad de Antioquia), con bases en desarrollo web (Java, Angular). Experiencia integrando controles SAST, SCA, detección de secretos y escaneo de IaC (SonarQube, JFrog Xray, Trivy, Gitleaks, TruffleHog, Checkov). Certificado en Google Cloud (incluye fundamentos de Kubernetes). Orientado a seguridad desde el diseño (shift-left), automatización con Python, PowerShell y Bash, y colaboración ágil (Scrum).",
};

export const experiencia = [
  {
    puesto: "Especialista Azure DevOps",
    empresa: "Synergy TPC",
    ubicacion: "Remoto",
    periodo: "Nov 2025 -- Actualidad",
    bullets: [
      "Diseñé, implementé y mantuve pipelines de despliegue automatizado alineados con las mejores prácticas de la industria.",
      "Acompañé a los equipos de desarrollo en la optimización de sus procesos de construcción, liberación y despliegue.",
      "Aseguré el cumplimiento de los estándares de liberación, incluyendo estrategias de reversión, pruebas, control de versiones y documentación operativa.",
      "Apoyé el cumplimiento de requisitos organizacionales, regulatorios y de auditoría, aplicando buenas prácticas de privacidad, disponibilidad e integridad de la información.",
    ],
  },
  {
    puesto: "Especialista DevSecOps",
    empresa: "Devco",
    ubicacion: "Remoto",
    periodo: "Jun 2023 -- Abr 2026",
    bullets: [
      "Rol funcional de Analista DevOps dentro del equipo DevSecOps, asignado como servicio dedicado a Banco Agrícola (Grupo Cibest, El Salvador), aliado estratégico de Bancolombia.",
      "Diseñé y desarrollé múltiples extensiones personalizadas (5+) de Azure DevOps, inyectadas automáticamente mediante pipeline decorators de creación propia, estandarizando controles de seguridad y automatización en cientos de pipelines y decenas de repositorios organizados en un esquema centralizado, sin requerir configuración manual por equipo.",
      "Estuve encargado de la homologación de las herramientas DevSecOps utilizadas por Bancolombia hacia Banco Agrícola, incluyendo la adaptación del motor interno Engine Tools, al cual contribuí directamente como colaborador del proyecto open source.",
      "Eliminé tareas manuales de línea de comandos mediante extensiones reutilizables, reduciendo la intervención manual de múltiples equipos de desarrollo en operaciones repetitivas de pipeline.",
      "Construí un sistema de inventario y reportes automáticos de pipelines, repositorios y cumplimiento de estándares DevSecOps, aportando visibilidad de gobierno a nivel organizacional.",
      "Integré y operé controles de seguridad en el pipeline: SonarQube (SAST), JFrog Xray y Trivy (SCA / escaneo de contenedores), Gitleaks y TruffleHog (detección de secretos) y Checkov (escaneo de IaC), gestionando artefactos en JFrog Artifactory.",
      "Administré Azure Repos, Azure Boards, Azure Artifacts y Environments, definiendo estrategias de branching y control de aprobaciones por ambiente.",
      "Automaticé procesos de integración y despliegue con Python, PowerShell, Bash y YAML, consumiendo la API REST de Azure DevOps y Azure CLI.",
      "Soporte en contenedores con Docker y despliegues sobre Azure Kubernetes Service (AKS); colaboración en observabilidad básica con Prometheus y Grafana, dentro de un marco ágil (Scrum).",
    ],
  },
  {
    puesto: "Practicante TI (Desarrollo Web)",
    empresa: "Fiduciaria Bancolombia",
    ubicacion: "Medellín, Colombia",
    periodo: "Jun 2022 -- Dic 2022",
    bullets: [
      "Desarrollé módulos de aplicaciones web internas con Java, Spring Boot y Angular.",
      "Colaboré en la automatización de despliegues y en la documentación de lineamientos DevOps del equipo.",
    ],
  },
  {
    puesto: "Monitor Arquitectura de Software",
    empresa: "Universidad de Antioquia",
    ubicacion: "Medellín, Colombia",
    periodo: "Nov 2019 -- Sep 2020",
    bullets: [
      "Soporte académico en arquitectura de software y POO.",
      "Acompañamiento a estudiantes en proyectos técnicos.",
    ],
  },
  {
    puesto: "Desarrollador",
    empresa: "Telemedellín",
    ubicacion: "Medellín, Colombia",
    periodo: "Feb 2019 -- Ene 2020",
    bullets: [
      "Desarrollo y soporte de experiencias digitales del Tour Telemedellín.",
      "Mantenimiento de interfaces y mejora de funcionalidades.",
    ],
  },
];

export const educacion = [
  {
    titulo: "Ingeniería de Sistemas",
    institucion: "Universidad de Antioquia",
    ubicacion: "Medellín, Colombia",
    periodo: "2015 -- 2023",
    detalle: "Egresado",
  },
  {
    titulo: "Bachiller Académico",
    institucion: "I.E. Campo Valdés",
    ubicacion: "Medellín, Colombia",
    periodo: "2012",
  },
];

export const habilidades = [
  {
    categoria: "DevOps & CI/CD",
    items: [
      "Azure DevOps (Pipelines, Repos, Boards, Artifacts, Environments)",
      "Azure CLI",
      "GitHub Actions",
      "Git",
    ],
  },
  { categoria: "Cloud", items: ["Azure (avanzado)", "AKS (soporte)", "GCP (básico)", "AWS (básico)"] },
  { categoria: "Contenedores", items: ["Docker (intermedio)", "Kubernetes (intermedio)"] },
  { categoria: "IaC", items: ["Terraform", "YAML Pipelines"] },
  {
    categoria: "DevSecOps (SAST/SCA)",
    items: ["SonarQube", "JFrog Xray", "Trivy", "Checkov (IaC Scanning)", "OWASP Top 10"],
  },
  {
    categoria: "Secretos & Artefactos",
    items: ["Gitleaks", "TruffleHog (Secrets Detection)", "Artifactory", "SBOM"],
  },
  { categoria: "Scripting", items: ["Python", "PowerShell", "Bash"] },
  { categoria: "Observabilidad", items: ["Prometheus", "Grafana"] },
  { categoria: "Desarrollo", items: ["Java", "Spring Boot", "Python", "TypeScript", "Angular", "React"] },
  { categoria: "Bases de Datos", items: ["SQL", "NoSQL"] },
  { categoria: "Agile", items: ["Scrum", "Kanban"] },
];

export const certificaciones = [
  {
    titulo: "Google Cloud Platform",
    detalle: "Fundamentals, Infrastructure, Networking, Data/ML/AI, Kubernetes",
    emisor: "Google",
  },
  { titulo: "Build a Website on GCP", emisor: "Google" },
  { titulo: "Lifelong Learning", emisor: "CertiProf" },
  { titulo: "Explore Emerging Tech", emisor: "IBM SkillsBuild" },
];

export const proyectos = [
  {
    titulo: "linceo — Orquestador DevSecOps",
    subtitulo: "Proyecto propio, open source (Apache-2.0) — publicado en PyPI y GHCR",
    resumen:
      "Orquestador que unifica cómo se ejecutan e interpretan los escaneos de seguridad en un pipeline: ejecuta Gitleaks, Trivy y Checkov sobre secretos, dependencias, infraestructura como código e imágenes de contenedor, normaliza los hallazgos a un modelo común, aplica la política de la organización —local o centralizada en un repositorio que todos los pipelines heredan— y devuelve un veredicto único, con exportación a SARIF para ver los hallazgos sobre el código. Arquitectura hexagonal: el núcleo no conoce ninguna herramienta por nombre y cada integración se descubre por entry points, de modo que la tercera y la cuarta entraron sin modificar los contratos. Funciona en local, Azure DevOps y GitHub Actions, y se distribuye como paquete de PyPI y como imagen de contenedor con las herramientas y la base de vulnerabilidades incluidas para operar sin conexión.",
    resumenCV:
      "Orquestador open source (Python, Apache-2.0) que ejecuta Gitleaks, Trivy y Checkov, normaliza los hallazgos, aplica la política de la organización y emite un veredicto único con SARIF. Arquitectura hexagonal; publicado en PyPI y GHCR.",
    stack: ["Python", "Gitleaks", "Trivy", "Checkov", "SARIF", "Docker", "Azure DevOps", "GitHub Actions"],
    repos: [
      { label: "GitHub", url: "https://github.com/jdiegoisaza/linceo" },
      { label: "PyPI", url: "https://pypi.org/project/linceo/" },
      { label: "GHCR", url: "https://github.com/jdiegoisaza/linceo/pkgs/container/linceo" },
    ],
  },
  {
    titulo: "linceo DevSecOps Scan — Extensión de Azure DevOps",
    subtitulo: "Proyecto propio, publicado en el Marketplace de Visual Studio",
    resumen:
      "Extensión que convierte la ejecución de linceo en dos tareas nativas de Azure Pipelines: reemplaza un docker run con doce variables de entorno, un punto de montaje y el mapeo del token de identidad del build por tres líneas de configuración. Traduce los códigos de salida distinguiendo un gate fallido por hallazgos (configurable) de una herramienta rota (falla siempre), porque un pipeline verde que no llegó a escanear nada es peor que uno rojo. Incluye una tarea de instalación que descarga las herramientas con verificación de checksum y caché entre ejecuciones, sin depender de Docker ni de una imagen de 2.4 GB. Release automatizado de punta a punta: cada push construye y valida el paquete, y cada tag publica al Marketplace.",
    resumenCV:
      "Extensión de Azure DevOps (TypeScript) que convierte linceo en tareas nativas de Azure Pipelines, con instalación verificada por checksum y release automatizado al Marketplace.",
    stack: ["TypeScript", "Azure DevOps", "Azure Pipelines", "CI/CD"],
    repos: [
      { label: "GitHub", url: "https://github.com/jdiegoisaza/linceo-DevSecOps-Scan" },
      { label: "Marketplace", url: "https://marketplace.visualstudio.com/items?itemName=juandiego-13.linceo-devsecops-scan" },
    ],
  },
  {
    titulo: "Gobernanza automática de CI/CD a escala",
    subtitulo: "Extensiones + pipeline decorators propios (Devco / Banco Agrícola)",
    resumen:
      "Diseño y desarrollo de un sistema de extensiones de Azure DevOps inyectadas automáticamente vía pipeline decorators, estandarizando controles DevSecOps en cientos de pipelines sin configuración manual por equipo.",
    resumenCV:
      "Extensiones de Azure DevOps inyectadas vía pipeline decorators propios que estandarizan controles DevSecOps en cientos de pipelines sin configuración por equipo (Devco / Banco Agrícola).",
    stack: ["Azure DevOps", "YAML", "PowerShell", "Python", "Azure DevOps REST API"],
    repos: [
      {
        label: "Ver ejemplo público del patrón",
        url: "https://github.com/jdiegoisaza/Decorator_DevOps",
      },
    ],
  },
  {
    titulo: "Homologación DevSecOps Bancolombia → Banco Agrícola",
    subtitulo: "Adaptación y contribución open source al motor Engine Tools",
    resumen:
      "Homologación de herramientas DevSecOps entre dos entidades del mismo grupo bancario, incluyendo contribución directa al proyecto open source Engine Tools de Bancolombia.",
    resumenCV:
      "Homologación de herramientas DevSecOps entre dos entidades del mismo grupo bancario, con contribución directa al proyecto open source Engine Tools.",
    stack: ["Azure DevOps", "Engine Tools", "SonarQube", "JFrog Xray", "Trivy"],
  },
  {
    titulo: "De GitHub Pages a un pipeline DevSecOps propio en Azure",
    subtitulo: "Este mismo sitio: Azure Static Web Apps + Azure DevOps + Terraform",
    resumen:
      "Migré este portafolio a un pipeline propio en Azure DevOps (agente self-hosted) con un stage de seguridad real —Gitleaks, npm audit, Trivy, SBOM y Checkov— antes de compilar y desplegar a Azure Static Web Apps. Infraestructura versionada en Terraform, importada desde los recursos existentes sin downtime.",
    resumenCV:
      "Este sitio: pipeline propio en Azure DevOps con stage de seguridad (Gitleaks, npm audit, Trivy, SBOM, Checkov) y despliegue a Azure Static Web Apps con Terraform.",
    stack: ["Azure Static Web Apps", "Azure DevOps Pipelines", "Terraform", "Gitleaks", "Trivy", "Checkov", "SonarCloud"],
  },
  {
    titulo: "Extensiones y pipeline decorators para Azure DevOps",
    subtitulo: "Proyecto propio, open source — el mismo patrón usado en Devco",
    resumen:
      "Implementación pública y genérica del patrón de pipeline decorators: una extensión con 9 decorators (Gitleaks, Checkov, Trivy, Hadolint, auditoría de builds y releases, detección de rollback) que se inyectan automáticamente en cualquier pipeline de la organización, sin configuración manual por equipo. Incluye además la plantilla reutilizable para construir nuevas tareas personalizadas en TypeScript y Python.",
    resumenCV:
      "Versión pública del patrón: una extensión con 9 decorators de seguridad y auditoría inyectados en todos los pipelines, más una plantilla para tareas en TypeScript y Python.",
    stack: ["Azure DevOps", "TypeScript", "Python", "Gitleaks", "Checkov", "Trivy", "Hadolint"],
    repos: [
      { label: "Decorator_DevOps", url: "https://github.com/jdiegoisaza/Decorator_DevOps" },
      { label: "ExtensionsTemplate_DevOps", url: "https://github.com/jdiegoisaza/ExtensionsTemplate_DevOps" },
    ],
  },
];
