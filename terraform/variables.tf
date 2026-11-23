# ============================================================
# Terraform Variables for Argo CD Installation
# ============================================================

variable "kubeconfig_path" {
  description = "Path to the kubeconfig file"
  type        = string
  default     = "~/.kube/config"
}

variable "kube_context" {
  description = "Kubernetes context to use"
  type        = string
  default     = "k3d-inka-cluster"
}

variable "argocd_namespace" {
  description = "Namespace where Argo CD should be installed"
  type        = string
  default     = "argocd"
}

variable "argocd_chart_version" {
  description = "Version of the Argo CD Helm chart"
  type        = string
  default     = "7.7.16"
}

variable "gitops_repo_url" {
  description = "URL of the GitOps repository"
  type        = string
  default     = "https://github.com/HirunaWeerakoon/inka-gitops"
}

variable "gitops_repo_branch" {
  description = "Branch of the GitOps repository"
  type        = string
  default     = "main"
}

variable "gitops_repo_path" {
  description = "Path to applications in the GitOps repository"
  type        = string
  default     = "argocd-apps"
}
