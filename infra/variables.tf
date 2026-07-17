variable "subscription_id" {
  description = "ID de la suscripción de Azure donde vive la infraestructura."
  type        = string
}

variable "resource_group_name" {
  description = "Nombre del resource group del sitio."
  type        = string
  default     = "rg-jdiegoisaza-portafolio"
}

variable "static_web_app_name" {
  description = "Nombre del recurso Azure Static Web App."
  type        = string
  default     = "jdiegoisaza-portafolio"
}

variable "location" {
  description = "Región de Azure."
  type        = string
  default     = "eastus2"
}
