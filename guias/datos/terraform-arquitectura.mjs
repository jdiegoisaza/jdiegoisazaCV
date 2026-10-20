// Arquitectura de ejemplo para la guía de Terraform: la infraestructura de la API "pagos" en Azure.
// a_<archivo>: [ruta, para qué sirve, cómo funciona, líneas del archivo, cuidado?]
// i_<recurso>: [nombre, qué es, cómo lo crea Terraform, "a_<archivo>::marcador del bloque"]
// El build valida que cada recurso apunte a un archivo existente y a un bloque que exista en su código.
const NL = String.fromCharCode(10);
function codigo(texto) {
  const lineas = texto.split(NL);
  while (lineas.length && lineas[0].trim() === "") lineas.shift();
  while (lineas.length && lineas[lineas.length - 1].trim() === "") lineas.pop();
  return lineas;
}
const ch = (k, label) => `<button type="button" class="ch" data-k="${k}">${label}</button>`;
const tt = (k, label, clase = "") => `<button type="button" class="tt${clase ? " " + clase : ""}" data-k="${k}">${label}</button>`;

const infra = `
<div class="box lo"><div class="hd">${tt("i_rg", "Grupo de recursos · rg-pagos-prod-brs-001")}<span class="t2">main.tf</span></div>
<div class="box fi"><div class="hd">${tt("i_vnet", "VNet · vnet-pagos-prod-brs-001")}<span class="t2">módulo network · 10.10.0.0/16</span></div>
<div class="gr">
<div class="cat"><b>${tt("i_snet", "snet-app · 10.10.1.0/24", "sm")}</b><i class="s">delegada a App Service</i>${ch("i_nsg", "NSG")}</div>
<div class="cat"><b>${tt("i_snet", "snet-datos · 10.10.2.0/24", "sm")}</b><i class="s">recursos privados</i>${ch("i_nsg", "NSG")}${ch("i_pep", "Private Endpoint del Key Vault")}</div>
</div></div>
<div class="gr">
<div class="cat"><b>Aplicación</b><i class="s">módulo app-service</i>${ch("i_plan", "App Service Plan")}${ch("i_app", "Web App (API)")}${ch("i_rbac", "Permiso sobre Key Vault")}${ch("i_diag", "Diagnóstico a Log Analytics")}</div>
<div class="cat"><b>Seguridad y monitoreo</b><i class="s">main.tf</i>${ch("i_kv", "Key Vault")}${ch("i_log", "Log Analytics")}</div>
</div>
</div>
<div class="cat mt8"><b>Fuera de este proyecto</b><i class="s">se crea una sola vez, aparte</i>${ch("i_state", "State en Storage Account")}</div>`;

export const seccionArquitectura = {
  tipo: "arquitectura",
  titulo: "Arquitectura de un proyecto real",
  corto: "Arquitectura",
  intro:
    "Proyecto de ejemplo: la infraestructura de la API pagos en Azure. Arriba, la estructura del repositorio y el contenido de cada archivo; abajo, los recursos que crea y el código exacto que crea cada uno.",
  arbol: [
    {
      carpeta: "repositorio",
      hijos: [
        {
          carpeta: "infra",
          hijos: [
            ["a_versions", "versions.tf"],
            ["a_backend", "backend.tf"],
            ["a_providers", "providers.tf"],
            ["a_variables", "variables.tf"],
            ["a_locals", "locals.tf"],
            ["a_main", "main.tf", true],
            ["a_outputs", "outputs.tf"],
            { carpeta: "environments", hijos: [["a_dev", "dev.tfvars"], ["a_prod", "prod.tfvars"]] },
            {
              carpeta: "modules",
              hijos: [
                { carpeta: "network", hijos: [["a_net_main", "main.tf"], ["a_net_vars", "variables.tf"], ["a_net_out", "outputs.tf"]] },
                { carpeta: "app-service", hijos: [["a_app_main", "main.tf"], ["a_app_vars", "variables.tf"], ["a_app_out", "outputs.tf"]] },
              ],
            },
            ["a_lock", ".terraform.lock.hcl"],
            ["a_gitignore", ".gitignore"],
          ],
        },
        ["a_pipeline", "azure-pipelines.yml"],
      ],
    },
  ],
  infraTitulo: "Infraestructura que crea (ambiente prod)",
  infra,
};

export const datosArquitectura = {
  a_versions: ["infra/versions.tf", "Fija la versión de Terraform y de los providers.", "Es lo primero que lee terraform init. required_version evita que alguien ejecute el código con una versión de Terraform incompatible, y required_providers indica de dónde se descarga cada provider y qué versiones se aceptan: ~> 4.0 permite cualquier 4.x pero no la 5.0, que puede traer cambios incompatibles. La versión exacta que se termina usando queda registrada en .terraform.lock.hcl.", codigo(`
terraform {
  required_version = ">= 1.9"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }
}
`)],

  a_backend: ["infra/backend.tf", "Dice dónde se guarda el state.", "El state vive en un contenedor de una Storage Account creada aparte (una sola vez), con versionado y acceso restringido. La key se deja fuera del archivo y se pasa en el init, así el mismo código sirve para cada ambiente: pagos/dev.tfstate, pagos/prod.tfstate. use_azuread_auth hace que el acceso al state use la identidad de Entra ID en lugar de las llaves de la cuenta.", codigo(`
# El state vive en una Storage Account compartida, creada una sola vez y aparte.
# La key cambia por ambiente y se pasa al inicializar:
#   terraform init -backend-config="key=pagos/prod.tfstate"
terraform {
  backend "azurerm" {
    resource_group_name  = "rg-tfstate-brs-001"
    storage_account_name = "sttfstatebrs001"
    container_name       = "tfstate"
    use_azuread_auth     = true
  }
}
`), "Quien puede leer el state puede leer los valores sensibles que contenga: restringe el acceso a esa Storage Account."],

  a_providers: ["infra/providers.tf", "Configura el provider de Azure.", "features {} es obligatorio en azurerm y permite ajustar comportamientos; aquí se evita que un terraform destroy purgue definitivamente el Key Vault (queda en soft delete y se puede recuperar). Desde azurerm 4 hay que indicar la suscripción; llega como variable para no dejarla escrita en el código. La autenticación no va aquí: se toma de az login en local o de las variables ARM_* en el pipeline.", codigo(`
provider "azurerm" {
  # Obligatorio en azurerm; permite ajustar comportamientos del provider.
  features {
    key_vault {
      # Al destruir, el Key Vault queda en soft delete (recuperable) en vez de purgarse.
      purge_soft_delete_on_destroy = false
    }
  }

  # Obligatorio desde azurerm 4. Llega como variable (TF_VAR_subscription_id).
  subscription_id = var.subscription_id
}
`)],

  a_variables: ["infra/variables.tf", "Las entradas del proyecto: lo que cambia entre ambientes.", "Cada variable tiene tipo y descripción, y algunas valor por defecto o validación (ambiente solo acepta dev, qa o prod: un error de tipeo falla en el plan y no en producción). Los valores llegan del .tfvars de cada ambiente y, los que no deben quedar en archivos, como la suscripción, desde el pipeline con TF_VAR_subscription_id.", codigo(`
variable "subscription_id" {
  type        = string
  description = "Suscripción donde se despliega (llega desde el pipeline)"
}

variable "ambiente" {
  type        = string
  description = "dev, qa o prod"

  validation {
    condition     = contains(["dev", "qa", "prod"], var.ambiente)
    error_message = "El ambiente debe ser dev, qa o prod."
  }
}

variable "ubicacion" {
  type    = string
  default = "brazilsouth"
}

variable "rango_vnet" {
  type        = string
  description = "Rango de la VNet, ej. 10.10.0.0/16"
}

variable "sku_plan" {
  type        = string
  description = "Tamaño del App Service Plan"
  default     = "B1"
}
`)],

  a_locals: ["infra/locals.tf", "Valores calculados que se reutilizan en todo el proyecto.", "sufijo arma la convención de nombres una sola vez (pagos-prod-brs) y tags define las etiquetas comunes que llevan todos los recursos. Si mañana cambia la convención, se cambia en un solo lugar.", codigo(`
locals {
  # Convención de nombres: <app>-<ambiente>-<región>
  sufijo = "pagos-\${var.ambiente}-brs"

  # Etiquetas comunes para todos los recursos
  tags = {
    app        = "pagos"
    ambiente   = var.ambiente
    gestionado = "terraform"
  }
}
`)],

  a_main: ["infra/main.tf", "El corazón del proyecto: qué se crea y cómo se conecta.", "Crea el grupo de recursos y los recursos compartidos (Log Analytics, Key Vault y su private endpoint) y llama a los módulos network y app-service pasándoles lo que necesitan. Fíjate en las referencias: module.network.subnet_ids[\"app\"] usa un output del módulo de red como entrada del módulo de la app, y por eso Terraform sabe que primero debe crear la red. data.azurerm_client_config lee el tenant de la sesión actual sin escribirlo en el código.", codigo(`
# Datos de la sesión actual (tenant), sin escribirlos en el código.
data "azurerm_client_config" "actual" {}

resource "azurerm_resource_group" "main" {
  name     = "rg-\${local.sufijo}-001"
  location = var.ubicacion
  tags     = local.tags
}

# Red: VNet + subredes + NSG (ver modules/network)
module "network" {
  source              = "./modules/network"
  nombre              = local.sufijo
  resource_group_name = azurerm_resource_group.main.name
  ubicacion           = azurerm_resource_group.main.location
  rango_vnet          = var.rango_vnet
  tags                = local.tags
}

resource "azurerm_log_analytics_workspace" "log" {
  name                = "log-\${local.sufijo}-001"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "PerGB2018"
  retention_in_days   = 30
  tags                = local.tags
}

resource "azurerm_key_vault" "kv" {
  name                      = "kv-\${local.sufijo}"
  resource_group_name       = azurerm_resource_group.main.name
  location                  = azurerm_resource_group.main.location
  tenant_id                 = data.azurerm_client_config.actual.tenant_id
  sku_name                  = "standard"
  enable_rbac_authorization = true
  purge_protection_enabled  = true
  tags                      = local.tags
}

# IP privada para el Key Vault dentro de snet-datos
resource "azurerm_private_endpoint" "kv" {
  name                = "pep-kv-\${local.sufijo}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  subnet_id           = module.network.subnet_ids["datos"]
  tags                = local.tags

  private_service_connection {
    name                           = "psc-kv-\${local.sufijo}"
    private_connection_resource_id = azurerm_key_vault.kv.id
    subresource_names              = ["vault"]
    is_manual_connection           = false
  }
}

# Aplicación: plan + Web App + permisos + diagnóstico (ver modules/app-service)
module "api" {
  source                     = "./modules/app-service"
  nombre                     = local.sufijo
  resource_group_name        = azurerm_resource_group.main.name
  ubicacion                  = azurerm_resource_group.main.location
  sku                        = var.sku_plan
  subnet_id                  = module.network.subnet_ids["app"]
  key_vault_id               = azurerm_key_vault.kv.id
  key_vault_uri              = azurerm_key_vault.kv.vault_uri
  log_analytics_workspace_id = azurerm_log_analytics_workspace.log.id
  tags                       = local.tags
}
`)],

  a_outputs: ["infra/outputs.tf", "Lo que el proyecto entrega al terminar.", "Muestra datos útiles después del apply (la URL de la API, la URI del Key Vault) y permite que un pipeline los lea con terraform output -raw, por ejemplo para ejecutar pruebas contra la URL recién desplegada.", codigo(`
output "resource_group" {
  value = azurerm_resource_group.main.name
}

output "app_url" {
  description = "URL pública de la API"
  value       = module.api.url
}

output "key_vault_uri" {
  value = azurerm_key_vault.kv.vault_uri
}
`)],

  a_dev: ["infra/environments/dev.tfvars", "Valores del ambiente de desarrollo.", "Mismo código, valores distintos: un rango de red propio (para que no choque con prod si algún día se conectan) y un plan pequeño y barato. Se usa con -var-file=environments/dev.tfvars. No lleva secretos ni el ID de la suscripción: esos llegan desde el pipeline.", codigo(`
ambiente   = "dev"
rango_vnet = "10.20.0.0/16"
sku_plan   = "B1"

# subscription_id NO va aquí: llega desde el pipeline como TF_VAR_subscription_id
`)],

  a_prod: ["infra/environments/prod.tfvars", "Valores del ambiente de producción.", "Rango de red distinto y un plan de mayor capacidad (P1v3 soporta más carga y deployment slots). Cualquier cambio a este archivo pasa por pull request, y su plan se revisa antes de aplicarse.", codigo(`
ambiente   = "prod"
rango_vnet = "10.10.0.0/16"
sku_plan   = "P1v3"
`)],

  a_net_main: ["infra/modules/network/main.tf", "Crea la red: VNet, subredes y un NSG por subred.", "Las subredes se definen en un local y se crean con for_each, así que agregar una nueva es agregar una línea al mapa. cidrsubnet calcula los rangos a partir del de la VNet (/16 + 8 bits = subredes /24). El bloque dynamic agrega la delegación a App Service solo en la subred de la app, que la necesita para la integración con VNet. Los NSG también usan for_each: uno por subred, asociado automáticamente.", codigo(`
locals {
  # cidrsubnet parte la VNet: /16 + 8 bits = subredes /24 (x.x.1.0/24, x.x.2.0/24)
  subredes = {
    app   = { prefijo = cidrsubnet(var.rango_vnet, 8, 1), delegar_a_app_service = true }
    datos = { prefijo = cidrsubnet(var.rango_vnet, 8, 2), delegar_a_app_service = false }
  }
}

resource "azurerm_virtual_network" "vnet" {
  name                = "vnet-\${var.nombre}-001"
  resource_group_name = var.resource_group_name
  location            = var.ubicacion
  address_space       = [var.rango_vnet]
  tags                = var.tags
}

resource "azurerm_subnet" "snet" {
  for_each             = local.subredes
  name                 = "snet-\${each.key}"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = [each.value.prefijo]

  # Solo la subred de la app se delega a App Service (integración con VNet)
  dynamic "delegation" {
    for_each = each.value.delegar_a_app_service ? [1] : []
    content {
      name = "app-service"
      service_delegation {
        name    = "Microsoft.Web/serverFarms"
        actions = ["Microsoft.Network/virtualNetworks/subnets/action"]
      }
    }
  }
}

resource "azurerm_network_security_group" "nsg" {
  for_each            = local.subredes
  name                = "nsg-snet-\${each.key}"
  resource_group_name = var.resource_group_name
  location            = var.ubicacion
  tags                = var.tags
}

resource "azurerm_subnet_network_security_group_association" "asociacion" {
  for_each                  = local.subredes
  subnet_id                 = azurerm_subnet.snet[each.key].id
  network_security_group_id = azurerm_network_security_group.nsg[each.key].id
}
`)],

  a_net_vars: ["infra/modules/network/variables.tf", "Las entradas del módulo de red.", "Un módulo no sabe nada del proyecto que lo usa: todo lo que necesita llega por variables. Por eso se puede reutilizar en otros proyectos con otros nombres y otros rangos.", codigo(`
variable "nombre" {
  type        = string
  description = "Sufijo para los nombres, ej. pagos-prod-brs"
}

variable "resource_group_name" {
  type = string
}

variable "ubicacion" {
  type = string
}

variable "rango_vnet" {
  type        = string
  description = "Rango de la VNet, ej. 10.10.0.0/16"
}

variable "tags" {
  type    = map(string)
  default = {}
}
`)],

  a_net_out: ["infra/modules/network/outputs.tf", "Lo que el módulo de red le entrega a quien lo usa.", "subnet_ids devuelve un mapa nombre → ID construido con una expresión for, así el proyecto raíz puede pedir module.network.subnet_ids[\"app\"] sin saber cómo se crearon las subredes por dentro.", codigo(`
output "vnet_id" {
  value = azurerm_virtual_network.vnet.id
}

# Mapa nombre => ID, para usar module.network.subnet_ids["app"]
output "subnet_ids" {
  value = { for nombre, subred in azurerm_subnet.snet : nombre => subred.id }
}
`)],

  a_app_main: ["infra/modules/app-service/main.tf", "Crea la aplicación: plan, Web App, permiso sobre Key Vault y diagnóstico.", "La Web App sale a la red privada por la subred delegada (virtual_network_subnet_id), solo acepta HTTPS con TLS 1.2 y tiene una identidad administrada. Esa identidad recibe el rol Key Vault Secrets User sobre el Key Vault, y la app lee la contraseña de la base con una referencia a Key Vault en app_settings: el secreto nunca pasa por Terraform ni queda en el state. El diagnostic setting envía los logs HTTP a Log Analytics.", codigo(`
resource "azurerm_service_plan" "plan" {
  name                = "asp-\${var.nombre}"
  resource_group_name = var.resource_group_name
  location            = var.ubicacion
  os_type             = "Linux"
  sku_name            = var.sku
  tags                = var.tags
}

resource "azurerm_linux_web_app" "api" {
  name                      = "app-\${var.nombre}-api"
  resource_group_name       = var.resource_group_name
  location                  = var.ubicacion
  service_plan_id           = azurerm_service_plan.plan.id
  virtual_network_subnet_id = var.subnet_id
  https_only                = true
  tags                      = var.tags

  identity {
    type = "SystemAssigned"
  }

  site_config {
    always_on                         = true
    minimum_tls_version               = "1.2"
    health_check_path                 = "/health"
    health_check_eviction_time_in_min = 5

    application_stack {
      node_version = "20-lts"
    }
  }

  app_settings = {
    # Referencia a Key Vault: App Service lee el secreto con su identidad;
    # el valor nunca pasa por Terraform ni queda en el state.
    DB_PASSWORD = "@Microsoft.KeyVault(SecretUri=\${var.key_vault_uri}secrets/db-password/)"
  }
}

# Mínimo privilegio: la app solo puede LEER secretos, y solo de este Key Vault.
resource "azurerm_role_assignment" "kv_lector" {
  scope                = var.key_vault_id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = azurerm_linux_web_app.api.identity[0].principal_id
}

resource "azurerm_monitor_diagnostic_setting" "api" {
  name                       = "diag-a-log-analytics"
  target_resource_id         = azurerm_linux_web_app.api.id
  log_analytics_workspace_id = var.log_analytics_workspace_id

  enabled_log {
    category = "AppServiceHTTPLogs"
  }
}
`)],

  a_app_vars: ["infra/modules/app-service/variables.tf", "Las entradas del módulo de la aplicación.", "Recibe IDs de recursos creados en otros lugares (subred, Key Vault, Log Analytics) en lugar de crearlos: cada módulo tiene una responsabilidad clara y el proyecto raíz es quien los conecta.", codigo(`
variable "nombre" {
  type = string
}

variable "resource_group_name" {
  type = string
}

variable "ubicacion" {
  type = string
}

variable "sku" {
  type        = string
  description = "Tamaño del plan: B1, P1v3..."
}

variable "subnet_id" {
  type        = string
  description = "Subred delegada para la integración con VNet"
}

variable "key_vault_id" {
  type = string
}

variable "key_vault_uri" {
  type = string
}

variable "log_analytics_workspace_id" {
  type = string
}

variable "tags" {
  type    = map(string)
  default = {}
}
`)],

  a_app_out: ["infra/modules/app-service/outputs.tf", "Lo que entrega el módulo de la aplicación.", "La URL, que el proyecto raíz expone en sus outputs, y el principal_id de la identidad, por si otro recurso necesita darle permisos a la app (por ejemplo, una base de datos).", codigo(`
output "url" {
  value = "https://\${azurerm_linux_web_app.api.default_hostname}"
}

output "principal_id" {
  description = "Identidad de la app, para darle permisos en otros recursos"
  value       = azurerm_linux_web_app.api.identity[0].principal_id
}
`)],

  a_lock: ["infra/.terraform.lock.hcl", "Registro de las versiones exactas de los providers.", "Lo genera terraform init y se sube a Git. Garantiza que el equipo y el pipeline usen exactamente la misma versión del provider. Debe tener los checksums de todas las plataformas donde se ejecuta (por ejemplo, Windows en local y Linux en el agente); se agregan con terraform providers lock.", codigo(`
# This file is maintained automatically by "terraform init".
# Manual edits may be lost in future updates.

provider "registry.terraform.io/hashicorp/azurerm" {
  version     = "4.81.0"
  constraints = "~> 4.0"
  hashes = [
    "h1:<checksum-windows_amd64>",
    "h1:<checksum-linux_amd64>",
    "zh:<checksum-del-paquete>",
  ]
}
`)],

  a_gitignore: ["infra/.gitignore", "Lo que nunca debe llegar al repositorio.", "El state local y sus copias (guardan valores sensibles en texto plano), la carpeta .terraform (providers descargados, pesan cientos de MB) y los planes guardados. El .terraform.lock.hcl, en cambio, sí se versiona.", codigo(`
# State local y sus copias: nunca a Git (guardan valores sensibles en texto plano)
*.tfstate
*.tfstate.*

# Providers y módulos descargados por terraform init
.terraform/

# Planes guardados (pueden contener valores sensibles)
*.tfplan
tfplan

# Logs de depuración
crash.log
terraform.log

# Ojo: .terraform.lock.hcl SÍ se versiona
`)],

  a_pipeline: ["azure-pipelines.yml", "Despliega la infraestructura de forma controlada.", "Stage Plan: con una service connection de Azure que usa workload identity federation (OIDC, sin secretos guardados), ejecuta fmt, init con la key del ambiente, validate, Checkov y plan, y publica el plan como artefacto. Stage Apply: es un deployment job sobre un Environment con aprobación manual; descarga ese mismo plan y lo aplica, así se aplica exactamente lo que se revisó. Nadie ejecuta apply en producción desde su máquina.", codigo(`
# Pipeline de infraestructura: plan revisado -> aprobación -> apply de ese mismo plan.
trigger:
  branches:
    include: [main]
  paths:
    include: [infra/*]

variables:
  ambiente: prod

stages:
  - stage: Plan
    jobs:
      - job: plan
        steps:
          - task: AzureCLI@2
            displayName: "fmt, init, validate, Checkov y plan"
            inputs:
              azureSubscription: "sc-pagos-prod"   # service connection con workload identity federation (OIDC)
              scriptType: bash
              scriptLocation: inlineScript
              addSpnToEnvironment: true            # expone servicePrincipalId, tenantId e idToken
              workingDirectory: infra
              inlineScript: |
                export ARM_USE_OIDC=true
                export ARM_CLIENT_ID=$servicePrincipalId
                export ARM_TENANT_ID=$tenantId
                export ARM_OIDC_TOKEN=$idToken
                export TF_VAR_subscription_id=$(az account show --query id -o tsv)
                terraform fmt -check -recursive
                terraform init -input=false -backend-config="key=pagos/$(ambiente).tfstate"
                terraform validate
                checkov -d . --framework terraform --compact
                terraform plan -input=false -var-file=environments/$(ambiente).tfvars -out=tfplan
          - publish: infra/tfplan
            artifact: tfplan

  - stage: Apply
    dependsOn: Plan
    jobs:
      - deployment: apply
        environment: pagos-prod   # la aprobación manual se configura en el Environment
        strategy:
          runOnce:
            deploy:
              steps:
                - checkout: self
                - download: current
                  artifact: tfplan
                - task: AzureCLI@2
                  displayName: "apply del plan aprobado"
                  inputs:
                    azureSubscription: "sc-pagos-prod"
                    scriptType: bash
                    scriptLocation: inlineScript
                    addSpnToEnvironment: true
                    workingDirectory: infra
                    inlineScript: |
                      export ARM_USE_OIDC=true
                      export ARM_CLIENT_ID=$servicePrincipalId
                      export ARM_TENANT_ID=$tenantId
                      export ARM_OIDC_TOKEN=$idToken
                      terraform init -input=false -backend-config="key=pagos/$(ambiente).tfstate"
                      terraform apply -input=false $(Pipeline.Workspace)/tfplan/tfplan
`)],

  i_rg: ["Grupo de recursos", "Contiene todos los recursos de la API en el ambiente.", "Se crea en main.tf con la convención de nombres del local sufijo y las etiquetas comunes. Todos los demás recursos lo referencian (azurerm_resource_group.main.name), así que es lo primero que Terraform crea y lo último que destruiría.", "a_main::resource \"azurerm_resource_group\" \"main\""],
  i_vnet: ["Virtual Network", "La red privada del ambiente.", "La crea el módulo network con el rango que llega del .tfvars (10.10.0.0/16 en prod, 10.20.0.0/16 en dev).", "a_net_main::resource \"azurerm_virtual_network\" \"vnet\""],
  i_snet: ["Subredes (snet-app y snet-datos)", "Segmentos de la VNet: uno para la app y otro para los recursos privados.", "Se crean con for_each sobre el mapa local.subredes, y cidrsubnet calcula cada rango. snet-app lleva una delegación a App Service (bloque dynamic), necesaria para la integración con VNet.", "a_net_main::resource \"azurerm_subnet\" \"snet\""],
  i_nsg: ["NSG por subred", "Las reglas de firewall de cada subred.", "Un NSG por subred, creado con for_each y asociado a su subred con azurerm_subnet_network_security_group_association. Las reglas específicas se agregarían como recursos azurerm_network_security_rule.", "a_net_main::resource \"azurerm_network_security_group\" \"nsg\""],
  i_pep: ["Private Endpoint del Key Vault", "Le da al Key Vault una IP privada dentro de snet-datos.", "Se crea en main.tf apuntando al Key Vault (subresource vault) y a la subred de datos que entrega el módulo de red. En un proyecto completo se agrega además la zona DNS privada (privatelink.vaultcore.azure.net) para que el nombre del Key Vault resuelva a esa IP privada.", "a_main::resource \"azurerm_private_endpoint\" \"kv\""],
  i_plan: ["App Service Plan", "El cómputo donde corre la API.", "Lo crea el módulo app-service; el tamaño (sku_name) llega desde el .tfvars de cada ambiente: B1 en dev, P1v3 en prod.", "a_app_main::resource \"azurerm_service_plan\" \"plan\""],
  i_app: ["Web App (API)", "La aplicación pagos-api.", "Linux Web App con HTTPS obligatorio, TLS 1.2, health check, identidad administrada y salida por snet-app. La contraseña de la base llega con una referencia a Key Vault en app_settings.", "a_app_main::resource \"azurerm_linux_web_app\" \"api\""],
  i_rbac: ["Permiso de la app sobre Key Vault", "Deja que la identidad de la app lea secretos.", "Asignación RBAC con el rol Key Vault Secrets User y scope solo en ese Key Vault (mínimo privilegio). Usa el principal_id de la identidad administrada de la Web App.", "a_app_main::resource \"azurerm_role_assignment\" \"kv_lector\""],
  i_diag: ["Diagnóstico hacia Log Analytics", "Envía los logs HTTP de la app al workspace.", "Un diagnostic setting sobre la Web App que manda la categoría AppServiceHTTPLogs al workspace que el módulo recibe como variable.", "a_app_main::resource \"azurerm_monitor_diagnostic_setting\" \"api\""],
  i_kv: ["Key Vault", "Guarda los secretos de la aplicación.", "Se crea en main.tf con autorización RBAC (permisos por roles en lugar de access policies) y purge protection. El tenant se lee de data.azurerm_client_config, sin escribirlo en el código.", "a_main::resource \"azurerm_key_vault\" \"kv\""],
  i_log: ["Log Analytics", "Centraliza los logs del ambiente.", "Workspace con retención de 30 días; su ID se pasa al módulo de la app para el diagnóstico.", "a_main::resource \"azurerm_log_analytics_workspace\" \"log\""],
  i_state: ["State en Storage Account", "Donde Terraform guarda la memoria del proyecto.", "No lo crea este proyecto: es una Storage Account compartida que se crea una sola vez, con versionado y acceso restringido. backend.tf indica dónde está, y la key de cada ambiente se pasa en el init.", "a_backend::backend \"azurerm\""],
};
