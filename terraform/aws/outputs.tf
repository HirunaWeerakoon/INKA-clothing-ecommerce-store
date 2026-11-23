# ============================================================
# Outputs for AWS Infrastructure
# ============================================================

output "rds_endpoint" {
  description = "The connection endpoint for the RDS MySQL instance"
  value       = aws_db_instance.mysql.endpoint
}

output "rds_address" {
  description = "The hostname of the RDS MySQL instance"
  value       = aws_db_instance.mysql.address
}

output "rds_port" {
  description = "The port the database is listening on"
  value       = aws_db_instance.mysql.port
}

output "ecr_backend_url" {
  description = "URL of the ECR Backend repository"
  value       = aws_ecr_repository.backend.repository_url
}

output "ecr_frontend_url" {
  description = "URL of the ECR Frontend repository"
  value       = aws_ecr_repository.frontend.repository_url
}
