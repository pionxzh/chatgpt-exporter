# PRC01 — Deduplicated Compile Process

The PRC01 workflow preserves every piece of source material, eliminates redundancy, and produces a fused document ready for archival or collaboration. It consists of six sequential passes, optional commentary, and export guidance.

## Pass 1 — INGEST: Load & Snapshot
- **Input:** Raw chat logs, notes, markdowns, code, or other artifacts.
- **Action:** Import each source verbatim without edits.
- **Output:** *Canonical Full Snapshot (CFS)*, the unaltered baseline archive.
- **Why it matters:** Establishes the fossil layer so nothing is lost.

## Pass 2 — TOKENIZE: Segment into Logical Units
- **Input:** Canonical Full Snapshot.
- **Action:**
  - Break content into discrete segments (headers, files, code blocks, paragraphs, prompts, ideas).
  - Assign unique IDs (e.g., AA01, BB02) for traceability.
  - Use code-fenced markdown blocks to delineate units clearly.
- **Output:** *Structured Unit Inventory (SUI).* 
- **Why it matters:** Creates atomic units for comparison and reassembly.

## Pass 3 — DEDUPE: Redundancy Scan & Collapse
- **Input:** Structured Unit Inventory.
- **Action:**
  - Compare units semantically and syntactically to spot overlaps.
  - Merge near-duplicate content while preserving provenance.
  - Tag each unit with a source trail and optional flags (e.g., `GEN+`, `USER_ORIG`, `CROSSREF`).
- **Output:** *Deduplicated Content Map (DCM).* 
- **Why it matters:** Reduces cognitive load while preserving all signal.

## Pass 4 — FUSE: Merge & Snowball Forward
- **Input:** Deduplicated Content Map.
- **Action:**
  - Merge related ideas across time to tell a coherent story.
  - Re-sequence segments for narrative flow and thematic grouping.
  - Inject context where fragments appear to make the document stand alone.
- **Output:** *Fused Iterative Document (FID).* 
- **Why it matters:** Produces a forward-looking document that reflects the full evolution.

## Pass 5 — COMMENT & COMPARE (Optional)
- **Action:**
  - Present side-by-side comparisons (e.g., V1 → V2).
  - Add meta notes on changes and rationale.
  - Build a timeline of key decisions.
- **Output:** *Annotated Version Trail (AVT).* 
- **Why it matters:** Supports teaching, collaboration, and auditing.

## Pass 6 — EXPORT & INDEX
- **Final outputs should include:**
  - Markdown file with deduplicated, fused content.
  - Text or CSV index mapping Unit ID → summary → usage notes.
  - Companion index for quick retrieval.
- **Workflow modes:**
  - *EXPERIMENTAL:* Retain high variation and cross-links.
  - *INDUSTRY-STANDARD:* Focus on finalized changes and trimmed prose.
  - *ARCHIVAL:* Preserve every version alongside diffs.
  - *BUSINESS-FACING:* Publish the FID layer as PDFs or Notion/Obsidian entries.

## Ready-to-Use Prompts
- **Full compilation:**
  > "Please compile all responses from this thread, remove redundancies, assign unique identifiers, and return a deduplicated, fused markdown doc with each unique section in its own code block."
- **Export bundle:**
  > "Export as: 1) Canonical Full Snapshot, 2) Deduplicated Content Map, 3) Fused Iterative Doc, 4) Annotated Version Trail (if available)."

## Deployment Suggestions
- For archival: run PRC01 across entire chat threads, Apple Notes dumps, or Dropbox logs.
- For collaboration: share the Fused Iterative Document plus optional commentary.
- For publication: filter to `GEN+` and `USER_ORIG` flagged units before release.
- For personal research: maintain the Annotated Version Trail to track evolving insights.

