# GitHub Copilot Instructions

## AI Model Availability

When using GitHub Copilot (both in VS Code and the Copilot Coding Agent), note that **`claude-sonnet-4-6` is not an available model**.

Available Anthropic models through GitHub Copilot (subject to your subscription tier):
- `claude-3-5-sonnet` (Claude 3.5 Sonnet) — recommended
- `claude-3-5-haiku` (Claude 3.5 Haiku)
- `claude-3-opus`

For the most up-to-date list of supported models, see the [GitHub Copilot model documentation](https://docs.github.com/en/copilot/using-github-copilot/ai-models/changing-the-ai-model-for-copilot-chat).

> **Note:** Model availability depends on your GitHub Copilot subscription plan and is controlled by GitHub's platform — it cannot be configured at the repository level.

## Project Context

This is **Bizim.pk**, a Next.js e-commerce store for selling school and college bags online.

- **Framework**: Next.js (App Router) with TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: .NET 10 API (`/api` directory)
- **Key pages**: Home, Collections, About, Contact, Cart, Auth, Admin Dashboard, Order Confirmation
