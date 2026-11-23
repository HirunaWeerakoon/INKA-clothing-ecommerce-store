# ============================================================
# AWS RDS MySQL (Managed Cloud Database - AWS Free Tier Eligible)
# ============================================================

resource "aws_security_group" "rds_sg" {
  name        = "${var.project_name}-rds-sg"
  description = "Allow inbound MySQL traffic"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "MySQL access from anywhere (for development/seeding)"
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-rds-sg"
  }
}

resource "aws_db_instance" "mysql" {
  identifier           = "${var.project_name}-mysql"
  allocated_storage    = 20               # Free Tier: up to 20 GB included free!
  max_allocated_storage = 20              # Prevents storage auto-scaling extra charges
  storage_type         = "gp2"
  engine               = "mysql"
  engine_version       = "8.0"
  instance_class       = "db.t3.micro"    # Free Tier eligible!
  db_name              = var.db_name
  username             = var.db_username
  password             = var.db_password
  parameter_group_name = "default.mysql8.0"

  db_subnet_group_name   = aws_db_subnet_group.rds_subnet_group.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  publicly_accessible    = true           # Allows connecting from laptop for seed data
  skip_final_snapshot    = true           # Allows clean 'terraform destroy' with no leftover costs

  tags = {
    Name = "${var.project_name}-mysql-rds"
  }
}
