# 🛍️ INKA Clothing — Full-Stack E-Commerce & Hybrid Cloud Architecture

[![Java 21](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Multi--Stage-2496ED.svg)](https://www.docker.com/)
[![Terraform](https://img.shields.io/badge/Terraform-AWS-7B42BC.svg)](https://www.terraform.io/)
[![AWS](https://img.shields.io/badge/AWS-RDS%20%7C%20ECR%20%7C%20VPC-FF9900.svg)](https://aws.amazon.com/)
[![GitOps](https://img.shields.io/badge/GitOps-Argo%20CD-red.svg)](https://github.com/HirunaWeerakoon/inka-gitops)

A modern, production-ready e-commerce clothing platform designed with a microservices-based backend, a React frontend, automated CI/CD testing, and a **Hybrid Cloud GitOps deployment architecture**.

> 🔗 **Looking for the Kubernetes & Argo CD manifests?** Check out the dedicated GitOps repository: [**inka-gitops**](https://github.com/HirunaWeerakoon/inka-gitops).

---

## 🏛️ System Architecture

```
                  ┌────────────────────────────────────────────────────────┐
                  │          App Repository (inka_clothing_ecommerce_store) │
                  │   - Spring Boot 21 Backend + React 18 Frontend         │
                  │   - Multi-stage Dockerfiles                            │
                  │   - Terraform AWS Infrastructure (VPC, RDS, ECR)       │
                  └───────────────────────────┬────────────────────────────┘
                                              │ (push to main/dev)
                                              ▼
                  ┌────────────────────────────────────────────────────────┐
                  │                 GitHub Actions CI                      │
                  │   1. Run Spring Boot Tests (H2 in-memory DB)           │
                  │   2. Run React Jest Tests                              │
                  │   3. Build & push Docker images (Docker Hub & AWS ECR) │
                  │   4. Auto-patch image tag in inka-gitops using yq      │
                  └───────────────────────────┬────────────────────────────┘
                                              │ (git commit)
                                              ▼
                  ┌────────────────────────────────────────────────────────┐
                  │              GitOps Repo (inka-gitops)                 │
                  │   - Argo CD Root App-of-Apps Pattern                   │
                  │   - Modular Helm Charts + Bitnami SealedSecrets        │
                  └───────────────────────────┬────────────────────────────┘
                                              │ (Automated Sync)
                                              ▼
    ┌───────────────────────────────────────────────────────────────────────────┐
    │                      k3d Kubernetes Cluster (Local)                       │
    │                                                                           │
    │   [ Traefik Ingress: 8080 ] ──> [ React Frontend Pod: 80 (Nginx) ]        │
    │                                              │                            │
    │                                              ▼ (Reverse Proxy /api)       │
    │                               [ Spring Boot Backend Pod: 8080 ]           │
    │                                              │                            │
    └──────────────────────────────────────────────┼────────────────────────────┘
                                                   │ (Transatlantic JDBC :3306)
                                                   ▼
    ┌───────────────────────────────────────────────────────────────────────────┐
    │                      AWS Cloud Infrastructure (us-east-1)                 │
    │   - AWS VPC, Public/Private Subnets, Internet Gateway, Security Groups    │
    │   - Managed AWS RDS MySQL 8.0 (inka-mysql with multi-table catalog)       │
    │   - Private Amazon ECR Repositories (inka-backend & inka-frontend)        │
    └───────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack & Technologies

### 1. Application Layer
- **Backend**: Java 21, Spring Boot 3, Spring Data JPA / Hibernate, HikariCP, Stripe Payments SDK, Google OAuth2.
- **Frontend**: React 18, React Router, Tailwind CSS, Axios.
- **Reverse Proxy**: Nginx Alpine reverse-proxying `/api` calls directly to the backend.

### 2. DevOps & Containerization
- **Multi-Stage Docker**:
  - Backend: `eclipse-temurin:21-jdk` (builder) ➔ `eclipse-temurin:21-jre-alpine` (runtime).
  - Frontend: `node:20-alpine` (builder) ➔ `nginx:alpine` (runtime).
- **CI Automation**: GitHub Actions running automated unit & integration test suites before building images.

### 3. Cloud Infrastructure as Code (Terraform & AWS)
- **Terraform** provisions all cloud resources in `terraform/aws/`:
  - **AWS VPC**: Custom 10.0.0.0/16 VPC with dual-AZ subnets (`us-east-1a`, `us-east-1b`).
  - **AWS RDS MySQL 8.0**: `db.t3.micro` managed database instance with automated backup & DDL schema creation.
  - **AWS ECR**: Private container repositories with vulnerability scanning on push.

---

## 📂 Repository Structure

```
├── inka_backend/              # Spring Boot Java 21 application
│   ├── src/main/java/         # Controllers, Services, DTOs, JPA Entities
│   ├── src/test/resources/    # H2 in-memory test configuration
│   └── pom.xml                # Maven dependencies
├── frontend/                  # React 18 client application
│   ├── src/                   # Components, Pages, Assets
│   └── package.json           # Node dependencies & Jest test scripts
├── docker/                    # Optimized multi-stage Dockerfiles
│   ├── backend.Dockerfile     # Temurin JDK -> JRE multi-stage build
│   ├── frontend.Dockerfile    # Node 20 build -> Nginx Alpine runtime
│   └── nginx.conf             # Nginx reverse proxy configuration
├── terraform/                 # Infrastructure as Code
│   ├── aws/                   # AWS Cloud IaC (VPC, RDS, ECR, Security Groups)
│   ├── main.tf                # Local cluster Argo CD bootstrap
│   └── application.tf         # Root App-of-Apps Argo CD declaration
├── .github/workflows/         # Continuous Integration
│   └── ci.yml                 # Automated Test, Build, & GitOps update pipeline
└── docker-compose.yml         # Quick local standalone run setup
```

---

## 🚀 Getting Started

### Option 1: Quick Run with Docker Compose
To run the full stack locally without Kubernetes:
```bash
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080/api/products`

---

### Option 2: Deploying AWS Cloud Infrastructure
To spin up the managed AWS RDS MySQL database and ECR registries:

```bash
cd terraform/aws
terraform init
terraform apply -auto-approve
```

Outputs will display:
- `rds_endpoint`: Endpoint address for the AWS MySQL instance.
- `ecr_backend_url` & `ecr_frontend_url`: ECR registry URLs.

*(To destroy and avoid AWS charges: `terraform destroy -auto-approve`).*

---

## 💡 Acknowledgements & Inspiration
This project was inspired by a tech session conducted by engineers from **Sysco LABS**, where a local Kubernetes homelab blueprint was shared. We took that homelab foundation and scaled it into a **Hybrid Cloud Architecture**, orchestrating local Kubernetes compute against live managed AWS Cloud services.
