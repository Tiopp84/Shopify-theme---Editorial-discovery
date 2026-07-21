# 09 — Project board và risk register

Cập nhật ít nhất mỗi tuần.

## Status

| Field | Value |
|---|---|
| Overall | IN PROGRESS |
| Current phase | Phase 4 — Discovery |
| Target submission | TBD |
| Product/Design/Engineering/QA/Support owners | Project owner (single-owner plan); Codex supports planning/documentation |

## Milestones

| ID | Milestone | Status | Target | Evidence |
|---|---|---|---|---|
| M0 | Product/eligibility approved | ACHIEVED | 2026-07-19 | `01-product-and-eligibility.md`, `02-scope-and-feature-matrix.md` exit criteria complete |
| M1 | Design approved | ACHIEVED — visual polish deferred | 2026-07-20 | Owner approved prototype direction for foundation; `../Prototype/`, `../Prototype/design-comparison.md` |
| M2 | Foundation stable | ACHIEVED | 2026-07-20 | Clean render, Theme Check and global-shell keyboard/mobile/browser gate pass |
| M3 | Commerce alpha | PLANNED | 2026-11-22 | Product → cart → checkout core-flow gate |
| M4 | Feature complete | PLANNED | 2026-12-27 | Required templates and secondary-template gate |
| M5 | Release candidate | PLANNED | 2027-01-10 | Hardening gate |
| M6 | Submitted | NOT STARTED | TBD | |

## Workstreams

| Workstream | Status | Owner | Next gate |
|---|---|---|---|
| Eligibility/licensing | IN PROGRESS | Project owner | Professional name clearance before public-brand/listing work; asset approvals before use |
| Research/design | COMPLETE FOR FOUNDATION | Project owner | Visual refinement continues during component reviews |
| Architecture/shell | COMPLETE FOR M2 | Project owner | Continue component refinement during downstream reviews |
| Discovery/product/cart | IN PROGRESS | Project owner | Commerce E2E pass — 2026-11-22 |
| Content/templates | PLANNED | Project owner | Feature complete — 2026-12-27 |
| Accessibility/performance | PLANNED | Project owner | Hardening complete — 2027-01-10 |
| Demo/docs/support | PLANNED | Project owner | Commercial ready — 2027-01-10 |
| Submission | PLANNED | Project owner | Release gate signed — TBD |

## Risks

| Risk | Impact | Mitigation | Owner |
|---|---|---|---|
| Bị coi là Dawn derivative | Critical | Repo mới, Skeleton/original, provenance review | Project owner |
| Design không đủ khác biệt | Critical | Competitor/design gate trước build | Project owner |
| Scope creep | High | MVP lock và phase gates | Project owner |
| Product/cart edge cases | High | Dataset matrix/regression | Project owner |
| Lighthouse không đạt | High | Performance budget từ đầu | Project owner |
| Support quá tải | High | Giảm burden, docs, ticket taxonomy | Project owner |
| Asset thiếu license | Critical | Asset register/proof | Project owner |
| Clean install dính demo | High | Automated scan và fresh store | Project owner |
| Requirement thay đổi | High | Re-audit tại design/beta/submission | Project owner |

## Weekly template

```md
### Week YYYY-MM-DD
- Status / completed / evidence:
- Blockers / decisions needed:
- Next week:
- Risks changed:
```
