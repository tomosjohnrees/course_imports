# GitHub Actions in the CI/CD Landscape

## What Is CI/CD?

**Continuous Integration (CI)** is the practice of automatically building and testing code every time a developer pushes changes. It catches bugs early and keeps the main branch in a releasable state.

**Continuous Delivery (CD)** extends CI by automatically preparing releases — and optionally deploying them — so that working software can be shipped at any time with confidence.

Together, CI/CD forms the backbone of modern software delivery.

## Where GitHub Actions Fits

GitHub Actions is a general-purpose automation platform, but CI/CD is its most common use case. With Actions you can implement the full CI/CD pipeline:

1. **Continuous Integration** — Run linters, unit tests, and integration tests on every pull request. Report results as PR status checks.
2. **Continuous Delivery** — Build artifacts, push Docker images, and deploy to staging or production environments automatically when code merges.
3. **Beyond CI/CD** — Actions can also automate repository housekeeping, coordinate releases, synchronise issues with project boards, and more.

## How It Compares

| Feature | GitHub Actions | Jenkins | CircleCI | GitLab CI |
|---------|---------------|---------|----------|-----------|
| Hosted by provider | Yes | No (self-host) | Yes | Yes |
| Config as code | YAML in repo | Jenkinsfile | YAML in repo | YAML in repo |
| Built into code host | Yes | No | No | Yes |
| Marketplace of plugins | 20,000+ actions | 1,800+ plugins | Orbs | Templates |
| Free tier for public repos | Unlimited | N/A | Limited | Limited |

GitHub Actions stands out because it removes the gap between your code hosting and your automation infrastructure. There is no external service to configure, no webhook to maintain, and no separate authentication layer to manage.
