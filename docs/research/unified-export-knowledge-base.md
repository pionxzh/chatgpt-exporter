# Unified AI Conversation Export & Personal Knowledge Base Guide

This guide consolidates prior research on the ChatGPT Exporter userscript, compares it with other AI conversation export options, and outlines how to unify data from multiple personal storage providers into a deduplicated knowledge base.

## ChatGPT Exporter Capabilities
- **Purpose**: GreasyFork/Tampermonkey userscript tailored for OpenAI ChatGPT web clients, injecting UI elements to archive conversation history for later reuse.
- **Ingestion flow**: Observes DOM mutations (via `sentinel-js`) to insert a sidebar menu, discovers the active conversation using ChatGPT's `/backend-api` endpoints, and appends per-message timestamps during retrieval.
- **Network handling**: Maps the current origin to the appropriate ChatGPT backend host, reuses the authenticated browser session for API calls, and iterates through conversation catalogs (including “projects”/gizmos) for bulk exports.
- **Normalization**: Produces linear user/assistant exchanges enriched with model metadata while hiding system/internal nodes to keep transcripts readable.
- **Export surface**: Offers one-click exports to plain text, HTML, Markdown, PNG, OpenAI JSON, TavernAI/SillyTavern JSONL, and oobabooga formats, alongside bulk-download tooling.
- **UI & settings**: Injected menu adapts between desktop/mobile layouts, with toggles for timestamp styles and metadata capture.
- **Localization**: Bundles i18next translations for English, Spanish, French, Indonesian, Japanese, Russian, Turkish, Simplified Chinese, and Traditional Chinese, persisting language choice via Tampermonkey storage and honoring browser/OpenAI locale hints.
- **Coverage scope**: Hard-codes OpenAI API hosts and model mappings; external providers (Grok, Gemini, Microsoft Copilot, Anthropic Claude, etc.) require new adapters before ingestion/export works.

## Survey of Alternative AI Chat Exporters
- **Browser extensions/userscripts**
  - *ChatGPT Exporter* (this project) for flexible downloads.
  - *ChatGPT to Notion*, *ChatGPT History Exporter*, *ChatGPT Prompt Genius* reuse ChatGPT's APIs but push transcripts into Notion/Markdown or provide search enhancements.
  - *ShareGPT* and *ChatGPT Saver* publish conversations to hosted catalogs for sharing through unique URLs.
- **Cross-provider desktop clients**
  - *OpenAI ChatGPT Desktop* forks, *Raycast AI*, *AnythingLLM*, and *ChatALL* log chats locally by intercepting requests; many support OpenAI, Anthropic, Gemini, and Claude with user-supplied API keys.
  - *LocalSend* and *LlamaIndex Playground* import transcripts (converted to JSONL) from multiple providers.
- **Cloud automation platforms**
  - Zapier, Make (Integromat), and n8n provide connectors to OpenAI, Anthropic, Google AI Studio, etc., so prompts/responses can be archived in Airtable, Notion, or Google Sheets.
  - SaaS offerings like *RetentionEngine* and *Superwhisper* target customer-support bots across GPT, Claude, and other LLMs.
- **CLI/API-focused tooling**
  - *LangSmith* and *OpenPipe* capture prompts/responses via SDK hooks for any LLM call.
  - *Sema4.ai Transcript Extractor* turns exported chat HTML/JSON into JSONL for fine-tuning or vector indexing.
  - Self-hosted UIs such as *ChatGPT-Next-Web* maintain local IndexedDB/SQLite histories that can be exported as JSON.

## Unified JSON Schema Recommendations
- **Core fields**: `conversation_id`, ISO-8601 `timestamp`, `source` identifier, `participants`, and a `messages` array containing `id`, `role`, `content`, `attachments`, and `metadata`.
- **Model provenance**: Store `model`, `temperature`, `top_p`, and other parameters when available.
- **Formats**: Favor JSON Lines (JSONL) for streaming/vector DB ingestion while also supporting hierarchical JSON for nested metadata.
- **Schema enforcement**: Maintain a JSON Schema (Draft 7+) and validate via tools such as `ajv`, Python's `jsonschema`, or TypeScript's `spectypes`.
- **Metadata extensions**: Reserve slots for embeddings, NLP-derived `entities`, user-defined `tags`, and `source_uri` references back to original storage paths.

## Collecting Historical Data Across Storage Providers
1. **Mac local content**
   - Query Spotlight indexes (`~/Library/Metadata/CoreSpotlight`) or app-specific SQLite stores (Notes, Messages) using AppleScript or `sqlite3`.
   - Mirror key directories with `rsync` or ChronoSync; convert `.rtf`, `.pages`, and `.numbers` via `textutil` or `libreoffice` CLI to produce text-friendly formats.
2. **iCloud Drive**
   - Enable "Download originals" and script exports with `rclone` or `icloudpd`.
   - Use `icloudexport` or `apple-notes-exporter` to dump Notes/Reminders as JSON or Markdown.
3. **Dropbox**
   - Leverage `rclone`'s Dropbox backend for selective sync; collect metadata using `rclone lsjson`.
   - Export Dropbox Paper documents through the API (`/docs/list` + `/docs/download`) to Markdown/JSON.
4. **Google Drive**
   - Use Google Takeout for comprehensive archives (Docs→HTML/ODT, Sheets→CSV) and `rclone` or the `drive` CLI for ongoing sync.
   - Convert Google Docs to Markdown with `pandoc` post-export.
5. **AI chat services**
   - **ChatGPT**: Employ this userscript or the official Settings → Data Controls export for JSON archives.
   - **Claude**: Download workspace archives from Anthropic's `/beta/account/export` endpoint.
   - **Gemini**: Pull conversations through Google Takeout's "AI Studio conversations" option.
   - **Copilot**: Request data via Microsoft's Privacy Dashboard exports (CSV/JSON).
   - Normalize every source into the shared schema with targeted ETL scripts.

## Mobile AI App Integration (Based on Attached iOS Stack)
- **Inventory snapshot**: The provided "AI_CHAT" folder shows ChatGPT, Inflection Pi, Google Gemini, Microsoft Copilot (M365), Anthropic Claude, Perplexity, Poe, and **MATH** (likely an AI math solver). Treat the screenshot as the ground truth list when scoping exports.
- **ChatGPT (iOS)**
  - Use the built-in "Share" option on each thread to send to the ChatGPT web client for capture by this exporter, or trigger Settings → Data Controls → Export Data from the mobile app; the export arrives via email as a JSON archive compatible with the unified schema.
  - Automate: create an iOS Shortcut that invokes the `https://chat.openai.com/backend-api/conversation/{id}` endpoint via `Get Contents of URL` using the mobile session cookie (`__Secure-next-auth.session-token`) saved in iCloud Keychain, then drop the JSON response into Files → `AI-KB/inbox/chatgpt/`.
- **Inflection Pi**
  - Pi supports conversation export via the mobile app menu (`⋯` → "Share chat"); choose "Save to Files" to deposit Markdown/HTML into the knowledge base inbox.
  - For bulk pulls, use Pi's email export (`help@pi.ai`) requesting a GDPR data export; once received, run a normalization script that maps Pi's `speaker` → `role` and `body` → `content` fields.
- **Google Gemini**
  - Initiate Google Takeout, selecting "AI Studio conversations" and "Gemini Activity"; schedule a monthly Takeout via Google Takeout Automations and deliver the ZIP to Google Drive → `Takeout/`.
  - Script extraction on Mac using `gdrive download --recursive Takeout` followed by `gsutil cat` for large archives, normalize JSON transcripts to the shared schema, and push into `processed/gemini/`.
- **Microsoft Copilot / M365**
  - Visit the Microsoft Privacy dashboard (`https://account.microsoft.com/privacy/export`), request "Apps and services → Copilot" data, and subscribe to the completion email.
  - For day-to-day capture, leverage the Copilot iOS share sheet: share conversation → "Save to OneDrive". A background job using `rclone copy onedrive:AI/Copilot/ inbox/copilot/` ingests new files nightly.
- **Anthropic Claude**
  - Use Claude's workspace export (`https://claude.ai/settings/export`) to receive a `.zip` with JSONL conversations. Extract on Mac and queue through the normalization pipeline (mapping `role`, `content`, `attachments`).
  - On iOS, the share menu copies chat text; combine with an iOS Shortcut that appends metadata (timestamp, workspace) before sending to `AI-KB/inbox/claude/` via iCloud Drive.
- **Perplexity**
  - Each Perplexity thread exposes a `Share` button → "Export" (Markdown/PDF). Configure an iOS Shortcut that automatically picks Markdown, renames the file using `YYYY-MM-DD_perplexity_{slug}.md`, and saves to Files.
  - API alternative: enable the Perplexity developer API and log all queries server-side via your own proxy, ensuring identical transcripts flow into the central store.
- **Poe**
  - In the Poe app, open a chat → tap `⋯` → "Export chat" to email or share as `.json`. Route exports to a dedicated inbox (e.g., `AI-KB/inbox/poe/`).
  - For automation, Poe supports account data export upon request; once the ZIP arrives, convert `messages.csv` into JSONL and ingest.
- **Math/solver apps**
  - If the math solver lacks built-in export, rely on the iOS share sheet to save transcripts as PDFs via "Print" → pinch-out gesture → "Save to Files". OCR PDFs with Tesseract before embedding into the knowledge base.
- **iOS Shortcut automation layer**
  - Build a master Shortcut named "Archive AI Chat" that detects the source app via the `Shortcut Input` metadata, injects a provider tag, and writes the normalized payload to `AI-KB/inbox/{provider}/`.
  - Combine with Focus modes or widgets so long-pressing the home screen folder triggers the Shortcut, reinforcing consistent archiving.
- **Sync cadence & monitoring**
  - Schedule a nightly Mac LaunchAgent that scans `~/Library/Mobile Documents/com~apple~CloudDocs/AI-KB/inbox/**` for new files, runs provider-specific normalization scripts, hashes content for dedupe, and commits summaries to Git/DVC.
  - Log every mobile ingestion with `source_app`, `shortcut_version`, and `device_id` so you can trace regressions when app updates change export formats.

## Deduplication and Canonicalization Strategy
- **Hashing**: Compute normalized SHA-256 hashes over text plus metadata (timestamp, participants) and store them in a `dedupe_index` (SQLite table or Redis set) to prevent re-imports.
- **Thread reconciliation**: Merge overlapping exports using shared `conversation_id` when possible; otherwise cluster by timestamp proximity (±5 seconds) and text similarity. Apply simhash or minHash for near-duplicate long-form documents.
- **Version control**: Preserve originals; write processed outputs to a `processed/` directory with manifest JSON referencing source paths/hashes, and version datasets with Git or DVC for historical diffing.

## Expansive Logic Check, Risk Review & Evolution Pathways
- **Acquisition blindspots**
  - *Disconnected sources*: Audit for devices or accounts that are offline or use alternative storage (external drives, secondary cloud tenants). Schedule quarterly inventories with `rclone listremotes` and OS-specific volume scans to keep scope complete.
  - *Ephemeral chats*: Some providers purge history quickly (Slack Canvas, temporary Claude chats). Automate exports via APIs/webhooks immediately after session completion to avoid data loss.
  - *Binary payload gaps*: Voice notes, inline images, or tool call outputs may be referenced but not exported. Extend ETL to capture attachment URLs, download assets, and link them via `attachments[].uri` fields.
- **Normalization integrity checks**
  - Validate every transformed record against the JSON Schema and reject/queue items with missing mandatory fields. Maintain a quarantine queue (e.g., `quarantine/` folder with failure manifests) so nothing silently drops.
  - Implement round-trip tests: rehydrate normalized JSON back into provider-specific formats in staging to confirm no semantic drift (roles, timestamps, threading).
  - Record provenance metadata (`extracted_at`, `transform_version`, `checksum`) to trace how each entry was produced and to reproduce defects.
- **Deduplication shatterpoints**
  - Similar but distinct answers (e.g., temperature variance) can hash identically if only text is considered. Include model identifier, completion parameters, and conversation-level context in the hash input to prevent overzealous merges.
  - Clock drift between devices can break timestamp clustering. Normalize to UTC and, when conflicts remain, fall back to lexical similarity scores before deduping.
  - Multi-speaker threads imported from platforms like Slack may reorder due to async exports; enforce ordering by provider sequence IDs where available.
- **Security & compliance hardening**
  - Apply least-privilege OAuth scopes for cloud APIs; rotate tokens periodically and log access with audit trails (CloudTrail, Google Workspace audit). Monitor for unauthorized access attempts.
  - Encrypt processed archives separately from raw exports to compartmentalize breaches. Use `age`/`sops` for key management and integrate with hardware tokens (YubiKey) when feasible.
  - Map data residency obligations (GDPR, CCPA) and tag records with jurisdiction metadata. Implement deletion workflows that cascade through raw, processed, vector, and backup layers when a data subject invokes rights.
- **Operational resilience**
  - Build automated regression tests for ETL scripts (unit + integration) using fixture transcripts that cover edge cases: multiline messages, tool calls, streaming deltas, and malformed JSON.
  - Monitor pipeline health with metrics (ingest latency, error rates, dedupe collisions). Set thresholds that trigger alerts and fallback to last-known-good exports when anomalies arise.
  - Document runbooks for incident response detailing how to rebuild indexes, restore from backups, and re-ingest data without duplicating entries.
- **Evolution roadmap**
  - Introduce active learning loops where retrieval feedback (accepted/rejected search hits) retrains tagging and embedding strategies.
  - Evaluate incremental model upgrades (e.g., migrating to multilingual embedding models) by running A/B search quality tests before full rollout.
  - Maintain a backlog of provider-specific enhancements (support for new AI chat platforms, message reaction capture, code interpreter artifacts) prioritized by usage analytics.

## Building the Knowledge Base
1. **Ingestion pipeline**
   - Assemble an ETL workflow (Airflow, Dagster, or cron + scripts) covering discovery → extraction → normalization → dedupe → persistence.
   - Use type-safe validation (`pydantic`, TypeScript interfaces) at each stage.
2. **Storage layers**
   - Primary relational store: SQLite or PostgreSQL for transcripts and metadata.
   - Vector store: Weaviate, Pinecone, Chroma, or PostgreSQL with `pgvector` for semantic search.
   - Object storage: S3-compatible bucket (or local MinIO) for binaries (PDF, audio).
3. **Indexing & enrichment**
   - Run OCR with Tesseract on images/PDFs and transcribe audio via Whisper or macOS dictation APIs.
   - Generate embeddings using OpenAI `text-embedding-3-large`, Cohere `embed-multilingual-v3`, or local models like `Instructor-large`.
   - Apply spaCy or similar NLP pipelines for entity extraction, summarization, and topic tagging.
4. **Access interface**
   - Build a search UI (Next.js, Retool, Streamlit) supporting keyword, tag, and vector queries.
   - Layer retrieval-augmented generation (LangChain, LlamaIndex) for Q&A, returning source citations, timestamps, and confidence scores.
5. **Automation & upkeep**
   - Schedule nightly sync jobs for each provider; monitor with logs and alerts.
   - Use checksum manifests to spot drift between local and cloud copies.
   - Recompute embeddings as model quality improves, versioning them by model identifier.

## Privacy, Security, and Compliance Considerations
- Encrypt storage volumes (FileVault on Mac, encrypted archives for backups).
- Manage API keys/secrets via 1Password or macOS Keychain.
- Restrict sharing permissions and enforce MFA across all connected services.
- Pair Time Machine or Backblaze backups with Git/DVC history for the knowledge base to guard against accidental deletions.

