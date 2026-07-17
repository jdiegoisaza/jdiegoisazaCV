terraform {
  required_version = ">= 1.9"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
}

resource "azurerm_resource_group" "portafolio" {
  name     = var.resource_group_name
  location = var.location
}

resource "azurerm_static_web_app" "portafolio" {
  name                = var.static_web_app_name
  resource_group_name = azurerm_resource_group.portafolio.name
  location            = azurerm_resource_group.portafolio.location
  sku_tier            = "Free"
  sku_size            = "Free"
}
