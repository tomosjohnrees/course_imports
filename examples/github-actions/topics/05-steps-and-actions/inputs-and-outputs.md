# Action Inputs and Outputs

Actions are not black boxes. They accept **inputs** that configure their behaviour, and they can produce **outputs** that later steps consume.

## Providing Inputs with `with`

The `with` keyword passes key-value pairs to an action as inputs. Each action defines its own set of accepted inputs in its documentation. For example, `node-version` tells the setup-node action which Node.js version to install, and `cache` tells it to cache npm dependencies for faster future runs.

Inputs are always strings in YAML, so even numeric values should be quoted to avoid unexpected type coercion.

## Capturing Outputs with `id`

Actions can produce outputs -- pieces of data that subsequent steps can reference. To access outputs, give the step an `id`. Later steps reference outputs using the expression syntax `${{ steps.<id>.outputs.<name> }}`.

This pattern works for both `run` steps (which write to the `$GITHUB_OUTPUT` file) and `uses` steps (which declare outputs in their action metadata).

## Combining Inputs and Outputs Across Steps

The real power emerges when you chain steps together. One step's output becomes another step's input, creating a pipeline within a single job. This keeps each step focused on a single responsibility while allowing data to flow between them.
