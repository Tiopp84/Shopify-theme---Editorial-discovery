# Narrivelle documentation

Tài liệu được chia theo vai trò để `Roadmap/` luôn ngắn gọn và chỉ chứa nội dung điều hành dự án.

## Cấu trúc

```text
docs/
├── Roadmap/         Phase, gates, project board và current step
├── Discovery/       Product brief, market research và naming
├── Specifications/  Scope và acceptance chi tiết của sản phẩm
├── QA/              Test runbook, review record và verification evidence
└── Governance/      Provenance, dependency, asset và license controls
```

## Điểm bắt đầu

- Trạng thái và việc tiếp theo: [`Roadmap/current-step.md`](Roadmap/current-step.md)
- Lộ trình tổng thể: [`Roadmap/README.md`](Roadmap/README.md)
- Product brief: [`Discovery/product-brief.md`](Discovery/product-brief.md)
- Competitive analysis: [`Discovery/competitive-analysis.md`](Discovery/competitive-analysis.md)
- MVP scope: [`Specifications/mvp-feature-matrix.md`](Specifications/mvp-feature-matrix.md)
- Design principles and prototype gate: [`Specifications/design-principles-and-prototype-criteria.md`](Specifications/design-principles-and-prototype-criteria.md)
- Interaction architecture standard: [`Specifications/interaction-architecture-standard.md`](Specifications/interaction-architecture-standard.md)
- Section picker taxonomy and placement governance: [`Specifications/section-picker-taxonomy.md`](Specifications/section-picker-taxonomy.md)
- Visual design tokens: [`Specifications/visual-design-tokens.md`](Specifications/visual-design-tokens.md)
- Phase 7 differentiation contract: [`Specifications/differentiation-contract.md`](Specifications/differentiation-contract.md)
- Motion architecture: [`Specifications/motion-architecture.md`](Specifications/motion-architecture.md)
- Theme motion implementation: [`Specifications/theme-motion-implementation.md`](Specifications/theme-motion-implementation.md)
- Source/license policy: [`Governance/source-provenance-and-licenses.md`](Governance/source-provenance-and-licenses.md)

## Quy tắc phân loại

- `Roadmap/`: chỉ trả lời **đang ở phase nào, gate nào, khi nào được đi tiếp**.
- `Discovery/`: bằng chứng và quyết định **xây sản phẩm gì, cho ai, khác biệt thế nào**.
- `Specifications/`: trả lời **phải xây những capability nào và nghiệm thu ra sao**.
- `QA/`: trả lời **đã kiểm tra bằng cách nào và kết quả thực tế là gì**.
- `Governance/`: trả lời **nguồn code/asset đến từ đâu và được phép sử dụng thế nào**.
- Tài liệu implementation/QA/design phát sinh sau này phải vào thư mục riêng tương ứng, không đưa trở lại `Roadmap/`.
