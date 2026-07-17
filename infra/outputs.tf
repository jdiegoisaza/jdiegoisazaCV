output "default_hostname" {
  description = "Hostname público asignado por Azure al Static Web App."
  value       = azurerm_static_web_app.portafolio.default_host_name
}

output "static_web_app_id" {
  description = "Resource ID del Static Web App."
  value       = azurerm_static_web_app.portafolio.id
}
