// Fuente de verdad del contenido del sitio. Debe mantenerse alineado con ../../resume.tex

export const perfil = {
  nombre: "Juan Diego Isaza Londoño",
  titulo: "Especialista DevSecOps · Ingeniero de Sistemas",
  ubicacion: "Medellín, Colombia",
  email: "juan.diego-13@hotmail.com",
  github: "https://github.com/jdiegoisaza",
  linkedin: "https://linkedin.com/in/jdiegoisaza",
  resumen:
    "Especialista DevSecOps con foco en Azure DevOps, automatización de pipelines CI/CD y estandarización de controles de seguridad a escala organizacional. Diseñé un sistema propio de extensiones y pipeline decorators que inyecta automáticamente controles DevSecOps en más de 60 pipelines y repositorios, y estuve encargado de la homologación de las herramientas DevSecOps de Bancolombia hacia Banco Agrícola (Grupo Cibest, El Salvador), incluyendo contribución directa al proyecto open source Engine Tools.",
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
      "Diseñé y desarrollé múltiples extensiones personalizadas (5+) de Azure DevOps, inyectadas automáticamente mediante pipeline decorators de creación propia, estandarizando controles de seguridad y automatización en más de 60 pipelines y repositorios organizados en un esquema centralizado, sin requerir configuración manual por equipo.",
      "Estuve encargado de la homologación de las herramientas DevSecOps utilizadas por Bancolombia hacia Banco Agrícola, incluyendo la adaptación del motor interno Engine Tools, al cual contribuí directamente como colaborador del proyecto open source.",
      "Eliminé tareas manuales de línea de comandos mediante extensiones reutilizables, reduciendo la intervención manual de múltiples equipos de desarrollo en operaciones repetitivas de pipeline.",
      "Construí un sistema de inventario y reportes automáticos de pipelines, repositorios y cumplimiento de estándares DevSecOps, aportando visibilidad de gobierno a nivel organizacional.",
      "Integré y operé controles de seguridad en el pipeline: SonarQube (SAST), JFrog Xray y Trivy (SCA / escaneo de contenedores), Gitleaks y TruffleHog (detección de secretos) y Checkov (escaneo de IaC), gestionando artefactos en JFrog Artifactory.",
      "Administré Azure Repos, Azure Boards, Azure Artifacts y Environments, definiendo estrategias de branching y control de aprobaciones por ambiente.",
      "Automaticé procesos de integración y despliegue con Python, PowerShell, Bash y YAML, consumiendo la API REST de Azure DevOps y Azure CLI.",
      "Soporte en contenedores con Docker y despliegues sobre Azure Kubernetes Service (AKS), en desarrollo continuo de habilidades Kubernetes; colaboración en observabilidad básica con Prometheus y Grafana, dentro de un marco ágil (Scrum).",
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
    periodo: "2015 -- 2023",
    detalle: "Egresado",
  },
  {
    titulo: "Bachiller Académico",
    institucion: "I.E. Campo Valdés",
    periodo: "2012",
  },
];

export const habilidades = [
  {
    categoria: "DevOps & CI/CD",
    items: "Azure DevOps (Pipelines, Repos, Boards, Artifacts, Environments), Azure CLI, GitHub Actions, Git",
  },
  { categoria: "Cloud", items: "Azure (avanzado), AKS (soporte), GCP (básico), AWS (básico)" },
  { categoria: "Contenedores", items: "Docker (intermedio), Kubernetes (en desarrollo)" },
  { categoria: "IaC", items: "Terraform, YAML Pipelines" },
  {
    categoria: "DevSecOps (SAST/SCA)",
    items: "SonarQube, JFrog Xray, Trivy, Checkov (IaC Scanning), OWASP Top 10",
  },
  {
    categoria: "Secretos & Artefactos",
    items: "Gitleaks, TruffleHog (Secrets Detection), Artifactory, SBOM",
  },
  { categoria: "Scripting", items: "Python, PowerShell, Bash" },
  { categoria: "Observabilidad", items: "Prometheus, Grafana" },
  { categoria: "Desarrollo", items: "Java, Spring Boot, Python, TypeScript, Angular, React" },
  { categoria: "Bases de Datos", items: "SQL y NoSQL" },
  { categoria: "Agile", items: "Scrum, Kanban" },
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
    titulo: "Gobernanza automática de CI/CD a escala",
    subtitulo: "Extensiones + pipeline decorators propios (Devco / Banco Agrícola)",
    resumen:
      "Diseño y desarrollo de un sistema de extensiones de Azure DevOps inyectadas automáticamente vía pipeline decorators, estandarizando controles DevSecOps en más de 60 pipelines sin configuración manual por equipo.",
    stack: ["Azure DevOps", "YAML", "PowerShell", "Python", "Azure DevOps REST API"],
  },
  {
    titulo: "Homologación DevSecOps Bancolombia → Banco Agrícola",
    subtitulo: "Adaptación y contribución open source al motor Engine Tools",
    resumen:
      "Homologación de herramientas DevSecOps entre dos entidades del mismo grupo bancario, incluyendo contribución directa al proyecto open source Engine Tools de Bancolombia.",
    stack: ["Azure DevOps", "Engine Tools", "SonarQube", "JFrog Xray", "Trivy"],
  },
  {
    titulo: "De GitHub Pages a un pipeline DevSecOps propio en Azure",
    subtitulo: "Este mismo sitio: Azure Static Web Apps + Azure DevOps + Terraform",
    resumen:
      "Migré este portafolio a un pipeline propio en Azure DevOps (agente self-hosted) con un stage de seguridad real —Gitleaks, npm audit, Trivy, SBOM y Checkov— antes de compilar y desplegar a Azure Static Web Apps. Infraestructura versionada en Terraform, importada desde los recursos existentes sin downtime.",
    stack: ["Azure Static Web Apps", "Azure DevOps Pipelines", "Terraform", "Gitleaks", "Trivy", "Checkov", "SonarCloud"],
  },
];
