# DevOps Homelab

Welcome to the **DevOps Homelab** GitHub organization! This organization is a collection of repositories designed to showcase and manage a fully functional homelab environment. It serves as a playground for learning, experimenting, and implementing DevOps best practices using modern tools and technologies.

## Overview

<img width="4800" height="2320" alt="k3d-cicd-gitops-flow-simple" src="https://github.com/user-attachments/assets/5a2d878d-1efa-487d-b2d0-4b99ef4338a8" />

## Contributing

Contributions are welcome! If you have ideas for improvements or new features, feel free to open an issue or submit a pull request in the relevant repository.

## License

All repositories in this organization are licensed under the MIT License. See the `LICENSE` file in each repository for details.

# Try it yourself: what you need

## 1. Accounts (all free)

| # | Account | Why you need it |
|---|---|---|
| 1 | **GitHub account** | Hosts the code repo, the config repo and GitHub Actions |
| 2 | **GitHub organization** (free, created from your account) | The self-hosted runners are registered at organization level |
| 3 | **Docker Hub account** | Stores the container images your pipeline builds |

## 2. Your laptop

**Hardware**

- 8 GB RAM minimum (16 GB recommended)
- 4 CPU cores
- About 20 GB of free disk space

**Operating system:** macOS, Linux, or Windows 10/11 with **WSL2**.

## 3. Software to install

| Tool | Used for | Check it works |
|---|---|---|
| Git | Version control | `git --version` |
| VS Code (or any editor) | Editing code and YAML | — |
| Docker Desktop (or Docker Engine / OrbStack / Colima) | Runs the k3d cluster and builds images | `docker info` |
| k3d v5+ | Creates a Kubernetes cluster inside Docker | `k3d version` |
| kubectl | Talks to the cluster | `kubectl version --client` |
| Helm 3 | Kubernetes package manager | `helm version` |
| Terraform ≥ 1.0 | One-time install of Argo CD | `terraform -version` |
| kubeseal | Encrypts secrets so they are safe to commit | `kubeseal --version` |
| Go 1.23+ | Running and testing the app locally | `go version` |
| curl and a web browser | Testing the deployed app | `curl --version` |
| Argo CD CLI *(optional)* | Syncing apps from the terminal | `argocd version --client` |

## 4. Repositories

Fork or copy these two repos into **your** GitHub organization:

- **`k3d-microservice`**: the app code plus the CI workflow
- **`k3d-gitops`**: the deployment config that Argo CD watches

You also need the Terraform folder `k3d-cluster-bootstrap-tf-infra`. It only runs on your laptop, so it doesn't need to be on GitHub.

## 5. Tokens and credentials to create

| Credential | Where to create it | Permissions | Where it goes |
|---|---|---|---|
| Docker Hub token (CI) | Docker Hub → Account settings → Personal access tokens | **Read & Write** | GitHub secret `DOCKERHUB_TOKEN` in `k3d-microservice` |
| Docker Hub token (cluster) | Same place | **Read-only** | Kubernetes Secret `dockerhub-secret` in namespace `microservices-dev` |
| `GITOPS_TOKEN` | GitHub → Settings → Developer settings → Fine-grained tokens | Repo `k3d-gitops`: **Contents: Read and write** | GitHub secret in `k3d-microservice` |
| Argo CD repo token *(only if `k3d-gitops` is private)* | Fine-grained token | Repo `k3d-gitops`: **Contents: Read-only** | `github_pat_token` in `terraform.tfvars` |
| GitHub App (for the runners) | Organization → Settings → Developer settings → GitHub Apps | Organization: **Self-hosted runners: Read and write**. Install the app on your org | App ID, installation ID and private key `.pem` → sealed into `github-auth` with `kubeseal` |
| `GH_TOKEN` *(optional: Helm chart publishing)* | Token with `write:packages` | Push to GHCR | GitHub secret in `k3d-gitops` |

You also need the GitHub secret `DOCKERHUB_USERNAME` (your Docker Hub username) in `k3d-microservice`.

> ⚠️ **Never commit tokens, passwords or `.pem` files to Git.** Only the *sealed* (encrypted) secret is safe to commit.

## 6. Things you must change to your own names

The repos currently point at the instructor's accounts. Search and replace these:

| Find | Replace with | Files |
|---|---|---|
| `devops-homelab` | your GitHub organization | `argocd-apps/**/application.yaml`, `charts/infra/gha-runner-scale-set/values.yaml`, `.github/workflows/docker-publish.yml`, Terraform `variables.tf` |
| `navindujay` | your Docker Hub username | `charts/microservices/dev/values.yaml` |
| `github-auth-sealedsecret.yaml` | **re-create it with `kubeseal`** | A sealed secret only works on the cluster it was sealed for, so you must seal your own |

Two other things to check:

- **Runner CPU type:** `helm-charts.yaml` downloads `yq_linux_arm64`. On an Intel/AMD (x86) laptop, change it to `yq_linux_amd64`.
- **Branch protection:** the `main` branch of `k3d-gitops` must **allow direct pushes**, because the pipeline pushes there.

## 7. Cluster setup tips

Create the cluster with port 80 exposed so `http://microservice.localhost` works:

```bash
k3d cluster create dev -p "80:80@loadbalancer"
```

If `microservice.localhost` doesn't open in your browser, add this line to your hosts file (`/etc/hosts` on macOS/Linux):

```text
127.0.0.1 microservice.localhost
```

## 8. Helpful background knowledge

- **Required:** basic terminal commands, and Git basics (`clone`, `commit`, `push`, branches).
- **Helpful:** reading YAML, what a Docker container/image is, and basic Kubernetes words (Pod, Deployment, Service).
- **You'll learn along the way:** GitHub Actions, Helm, Argo CD, GitOps.

## ✅ Quick checklist

- [ ] GitHub account and organization
- [ ] Docker Hub account
- [ ] All tools from section 3 installed and checked
- [ ] Both repos forked into your org and names replaced (section 6)
- [ ] Docker Hub tokens: one Read & Write, one Read-only
- [ ] `GITOPS_TOKEN` created and added as a GitHub secret
- [ ] GitHub App created, installed on the org, and its credentials sealed with `kubeseal`
- [ ] k3d cluster created with port 80 mapped
- [ ] `terraform apply` run, and Argo CD shows all apps **Synced / Healthy**
- [ ] Pushed a commit and saw the new version at `http://microservice.localhost` 🎉


---

Happy DevOps-ing! 🚀
