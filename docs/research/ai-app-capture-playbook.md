# AI App Capture Playbook

This playbook standardizes how we collect transcripts and artifacts from major AI assistants so they continuously feed the unified knowledge base. Each section outlines device preparation, export mechanics, automation options, and ingestion hooks for the downstream pipeline.

## Shared Preparation Checklist
- **Storage:** Ensure at least 1 GB of free space on the capture device for transcript archives and attachments.
- **Connectivity:** Connect to a secure network with VPN enabled to safeguard exports during transit.
- **Authentication:** Sign in with work accounts and confirm multi-factor authentication where available.
- **Shortcuts Permissions (iOS/iPadOS/macOS):** Grant the Shortcuts app access to Files, iCloud Drive, and third-party app data containers.
- **Webhook Secrets:** Store the ingestion webhook URL and API token in the device password manager for reuse across automations.

## ChatGPT (OpenAI)
**Device Preparation**
- Update ChatGPT to the latest version on mobile or desktop, or confirm browser access supports export features.
- Enable chat history & training in settings so exports include the full conversation context.

**Export Actions**
- Web: Navigate to **Settings → Data controls → Export data** and trigger an export; download the `.zip` package when notified.
- Mobile: Use the share sheet in a conversation to **Share Transcript → Save to Files** as `.html`.

**Shortcuts Automations**
- Shortcut: `ChatGPT Session Capture` pulls the latest HTML transcript from iCloud Drive, converts to Markdown via Shortcuts' **Make Rich Text from HTML**, and posts JSON to the ingestion webhook.
- Schedule the shortcut hourly via **Automation → Time of Day** with network availability checks.

**Ingestion Hooks**
- Drop the exported `.zip` into `s3://ai-capture/chatgpt/raw/` with metadata JSON containing `assistant:"chatgpt"`.
- The ETL job `chatgpt_zip_importer` parses `conversations.json` and pushes normalized records into the `assistant_messages` table.

## Claude (Anthropic)
**Device Preparation**
- Install the Claude desktop app or verify browser support for file downloads.
- Configure **Workspace Sync** to ensure attachments are captured alongside text.

**Export Actions**
- Use the **⋮** menu in a conversation → **Export Conversation** to download `.json`.
- For batch exports, call the internal `claude-export` CLI with `claude-export --format markdown --last 24h`.

**Shortcuts Automations**
- Shortcut: `Claude Daily Export` triggers the CLI via SSH on the capture Mac, then syncs the output folder to iCloud Drive.
- Append automation step **Get Contents of URL** to POST the packaged `.zip` and metadata to the webhook.

**Ingestion Hooks**
- Upload files to `s3://ai-capture/claude/raw/` and tag objects with `source=claude` for downstream routing.
- The `claude_json_ingestor` lambda converts messages into our unified schema with attachment references stored in `assistant_assets`.

## Gemini (Google)
**Device Preparation**
- Ensure Chrome is updated and logged into the managed Google Workspace account.
- Enable **Data Export** in Workspace admin to allow Gemini transcript downloads.

**Export Actions**
- From the Gemini web app, open **Conversation settings → Download transcript** to retrieve `.txt` files per chat.
- For voice interactions on Android, enable **Record & download audio transcripts** in device accessibility settings.

**Shortcuts Automations**
- Android: Use the **Tasker** profile `Gemini Transcript Sync` that watches the `/Download/Gemini` folder and posts new files to the webhook.
- iOS/macOS: Shortcut `Gemini Fetch` hits the internal API `https://capture.internal/gemini/export` (requires OAuth token) and forwards results to the ingestion endpoint.

**Ingestion Hooks**
- Store exports in `gs://ai-capture/gemini/raw/` with lifecycle rules to auto-delete after 90 days.
- The Airflow DAG `gemini_text_import` ingests text files and emits structured messages plus audio references.

## Perplexity
**Device Preparation**
- Confirm Perplexity Pro subscription for bulk export access.
- Enable **Copy to clipboard** support and install the **Perplexity Web Capture** browser extension.

**Export Actions**
- Use the extension to **Export Conversation** as Markdown; saved locally as `.md`.
- API: `POST /v1/history/export` with `?format=markdown&limit=100` retrieves the last 100 sessions.

**Shortcuts Automations**
- macOS: Shortcut `Perplexity Sync` monitors the Downloads folder, converts Markdown to JSON using `jq`, and hits the ingestion webhook.
- iOS: Automation triggered on receiving a `.md` share that immediately uploads the file and metadata.

**Ingestion Hooks**
- Push markdown archives to `s3://ai-capture/perplexity/raw/`.
- The `markdown_normalizer` job strips front matter, converts to HTML, and stores entries in the `assistant_sessions` table.

## Microsoft 365 Copilot
**Device Preparation**
- Ensure Microsoft 365 Apps for Enterprise are updated and **Audit log search** is enabled in the admin center.
- Configure Outlook and Teams retention policies so Copilot interactions remain accessible for 90 days.

**Export Actions**
- Use the **Compliance Content Search** tool to export Copilot interactions across Outlook, Teams, and Word as `.pst` and `.docx` bundles.
- In Word, utilize **File → Share → Export Copilot Context** to download session summaries as `.json`.

**Shortcuts Automations**
- Power Automate flow `Copilot Transcript Export` runs daily, invoking `Export-ComplianceSearch` PowerShell command and pushing archives to SharePoint.
- A Shortcuts automation on macOS mounts the SharePoint drive, zips the latest export, and posts to the ingestion webhook.

**Ingestion Hooks**
- Store compliance exports in `s3://ai-capture/m365-copilot/raw/` with object locking for 30 days.
- The ingestion service `copilot_pst_parser` extracts messages, aligns them with document context, and updates the `assistant_audit` index.

## Grok (xAI)
**Device Preparation**
- Install the Grok mobile app or ensure access via X web with necessary permissions.
- Enable **Data Export** under X privacy settings and verify the capture email address.

**Export Actions**
- Within the Grok interface, open **Conversation menu → Export** to download `.jsonl` transcripts.
- Schedule the **X Data Export** to run weekly, producing `.zip` archives that include Grok chat logs.

**Shortcuts Automations**
- Shortcut `Grok Weekly Pull` fetches the latest `.zip` from the capture email inbox (using **Find Mail**), extracts `grok.jsonl`, and forwards batched payloads to the webhook.
- Use **Run Script over SSH** action to trigger the `grok-export` CLI on the capture server for on-demand exports.

**Ingestion Hooks**
- Upload JSONL files to `s3://ai-capture/grok/raw/` with partition keys `dt=<export-date>`.
- The streaming job `grok_jsonl_stream` processes each line, enriches with sentiment metadata, and inserts into the `assistant_messages` warehouse table.

## Operational Notes
- Every automation posts to `https://collector.internal/api/v1/ingest` with headers `X-Assistant-Source` and `X-Ingest-Token`.
- Monitor ingestion health via the dashboard `Unified Capture → Pipeline Health` (Grafana) and alert on failure rates above 2%.
- Review exports weekly to retire unused automations and rotate webhook credentials quarterly.

