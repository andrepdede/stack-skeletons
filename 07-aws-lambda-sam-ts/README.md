# 07 – AWS Lambda + API Gateway (TypeScript), SAM and Terraform
Handler is unit-tested locally (`npm i && npm test`). `template.yaml` (SAM) and `main.tf` (Terraform) describe the same infra: two competing IaC options. Neither was deployed or validated against AWS here: run `sam validate` / `terraform validate` first.
Build for deploy: compile `src/handler.ts` to `dist/` (esbuild) and zip for Terraform.
