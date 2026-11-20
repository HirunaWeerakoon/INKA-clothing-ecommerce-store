# ============================================================
# Terraform configuration for Argo CD on k3d
# ============================================================

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.35.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.17.0"
    }
  }
}

# ------------------------------------------------------------
# Providers Configuration
# Point both providers to our local k3d cluster via kubeconfig
# ------------------------------------------------------------
provider "kubernetes" {
  config_path    = pathexpand(var.kubeconfig_path)
  config_context = var.kube_context
}

provider "helm" {
  kubernetes {
    config_path    = pathexpand(var.kubeconfig_path)
    config_context = var.kube_context
  }
}

# ------------------------------------------------------------
# Resource: Create the 'argocd' namespace
# ------------------------------------------------------------
resource "kubernetes_namespace" "argocd" {
  metadata {
    name = var.argocd_namespace
  }
}

# ------------------------------------------------------------
# Resource: Install Argo CD Helm Chart
# ------------------------------------------------------------
resource "helm_release" "argocd" {
  name       = "argo-cd"
  repository = "https://argoproj.github.io/argo-helm"
  chart      = "argo-cd"
  version    = var.argocd_chart_version
  namespace  = kubernetes_namespace.argocd.metadata[0].name

  # Enable the web server in insecure mode for local testing
  # (avoids SSL certificate mismatch issues on localhost)
  set {
    name  = "server.extraArgs[0]"
    value = "--insecure"
  }

  depends_on = [kubernetes_namespace.argocd]
}
