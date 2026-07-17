# 08 — Submission, release và vận hành

## Release candidate

- Freeze feature; chỉ nhận blocker/bug fix.
- Tăng version, viết release notes, tạo ZIP từ release branch.
- Diff package với allowlist; full QA và clean-store installation.
- Lưu commit, package hash và evidence.

## Pre-submission audit

Kiểm tra lại official requirements ngay thời điểm submit: originality/eligibility, required features/templates, design/UX, Lighthouse/accessibility, browsers, SEO/structured data, settings terminology, assets/licenses, demo parity, docs/support.

## Submission package

- Clean theme ZIP và metadata chính xác.
- Release notes, listing copy/screenshots.
- Demo URL từng preset.
- Documentation và support-form URLs.
- Declarations Shopify yêu cầu.

## Xử lý review feedback

- Mỗi feedback thành issue có nguồn/severity.
- Tái hiện và đối chiếu requirement trước khi sửa.
- Fix root cause, chạy regression và cập nhật docs/tests.
- Resubmit với mapping `feedback → fix → evidence`.

## Sau approval

- Weekly support/critical triage; monthly platform/docs review.
- Quarterly full regression/Lighthouse/browser matrix.
- Patch cho bug, minor cho feature, major cho breaking change.
- Không đổi/xóa released setting IDs nếu tránh được.
- Test update path trên merchant settings cũ.
- Theo dõi response/resolution time, tickets/100 sales, repeat tickets, defect escape, rating và Lighthouse trend.

## Exit criteria

- [ ] Release gate ký duyệt; không blocker trái requirement.
- [ ] Package version/hash lưu lại.
- [ ] Support rotation và roll-forward process sẵn sàng.
