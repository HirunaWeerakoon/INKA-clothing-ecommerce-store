# ============================================================
# Root ArgoCD Application (App of Apps Pattern)
# Monitors the GitOps repository for all application manifests
# ============================================================

resource "kubernetes_manifest" "argocd_root_application" {
  manifest = {
    apiVersion = "argoproj.io/v1alpha1"
    kind       = "Application"
    metadata = {
      name      = "root"
      namespace = kubernetes_namespace.argocd.metadata[0].name
    }
    spec = {
      project = "default"

      source = {
        repoURL        = var.gitops_repo_url
        targetRevision = var.gitops_repo_branch
        path           = var.gitops_repo_path
        directory = {
          recurse = true
          include = "**/application.yaml"
        }
      }

      destination = {
        server    = "https://kubernetes.default.svc"
        namespace = var.argocd_namespace
      }

      syncPolicy = {
        automated = {
          prune    = true
          selfHeal = true
        }
        syncOptions = [
          "CreateNamespace=true"
        ]
      }
    }
  }

  depends_on = [
    helm_release.argocd
  ]
}
