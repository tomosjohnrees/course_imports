# GitHub-Hosted Runners

GitHub provides managed virtual machines that are provisioned fresh for every job. These **hosted runners** come pre-installed with common developer tools, SDKs, and utilities, so you can start building right away.

## Available Runner Images

| Label | Operating System | Architecture |
|---|---|---|
| `ubuntu-latest` | Ubuntu (current LTS) | x64 |
| `ubuntu-24.04` | Ubuntu 24.04 | x64 |
| `ubuntu-22.04` | Ubuntu 22.04 | x64 |
| `windows-latest` | Windows Server (current) | x64 |
| `windows-2022` | Windows Server 2022 | x64 |
| `macos-latest` | macOS (current) | ARM64 (M1) |
| `macos-14` | macOS 14 Sonoma | ARM64 (M1) |
| `macos-13` | macOS 13 Ventura | x64 |

## What Comes Pre-installed?

Each runner image includes a rich set of tools. For example, the Ubuntu runner ships with:

- **Languages:** Node.js, Python, Ruby, Go, Java, .NET, Rust
- **Package managers:** npm, pip, gem, cargo, Maven, Gradle
- **Tools:** Git, Docker, Docker Compose, curl, wget, jq
- **Browsers:** Chrome, Firefox (useful for end-to-end testing)

The exact list varies by image and is updated regularly. GitHub publishes the full software list for each runner image in their documentation.

## Choosing a Runner

For most projects, **`ubuntu-latest`** is the best default. It is the fastest to provision, has the lowest per-minute cost, and supports Docker natively. Use `windows-latest` or `macos-latest` when your project specifically targets those platforms -- for example, building a .NET Framework app on Windows or compiling a macOS/iOS application.

You can also pin to a specific version like `ubuntu-22.04` instead of using the `-latest` tag. This protects your workflow from unexpected breakage when GitHub rolls the latest tag forward to a newer image.
