# ============================================================
# Variables for AWS Infrastructure
# ============================================================

variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name prefix for tags and resources"
  type        = string
  default     = "inka"
}

variable "db_name" {
  description = "Name of the MySQL database"
  type        = string
  default     = "inka_clothing_store"
}

variable "db_username" {
  description = "Master username for RDS MySQL"
  type        = string
  default     = "admin"
}

variable "db_password" {
  description = "Master password for RDS MySQL"
  type        = string
  default     = "InkaStore2026!"
  sensitive   = true
}
