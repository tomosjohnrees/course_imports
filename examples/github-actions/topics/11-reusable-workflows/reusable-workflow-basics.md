# Reusable Workflows

A reusable workflow is a regular GitHub Actions workflow file that declares the special `workflow_call` trigger. This trigger turns the workflow into something other workflows can *call*, much like calling a function from another function.

## How It Works

1. You create a workflow file (the **called** workflow) with `on: workflow_call`.
2. In another workflow (the **caller**), you reference the called workflow using the `uses` keyword at the **job level** -- not the step level.
3. When the caller runs, GitHub Actions spins up the called workflow as if it were a nested job.

## Key Characteristics

- A reusable workflow can define **inputs** (parameters the caller passes in) and **secrets** (sensitive values the caller provides).
- The called workflow runs in its own context. It has its own jobs, steps, and runners.
- A single caller workflow can call multiple reusable workflows, and a reusable workflow can call other reusable workflows (up to four levels deep).
- Reusable workflows can live in the same repository or in a completely different repository.

## Defining Inputs and Secrets

Inputs and secrets are declared under the `workflow_call` trigger. Inputs support types (`string`, `boolean`, `number`) and can have default values. Secrets can be marked as `required`.
