# AI Ark: Unified Personal AI Knowledge Base
## Vision & Architecture

**Date:** October 27, 2025
**Author:** Research compiled from codex branches
**Vision:** Create a comprehensive personal knowledge base that captures, unifies, and indexes all AI conversations and personal knowledge across platforms.

---

## 🎯 The Vision: "AI Ark"

### What is AI Ark?

A **unified personal knowledge management system** that:

1. **Captures** conversations from ALL AI platforms (ChatGPT, Claude, Gemini, Grok, Copilot, Perplexity, Poe, etc.)
2. **Integrates** disparate personal storage (iCloud Drive, Dropbox, Google Drive, local Mac files, Apple Notes, etc.)
3. **Normalizes** into a unified schema with deduplication
4. **Indexes** for semantic search and retrieval
5. **Preserves** complete provenance and version history
6. **Enables** cross-platform knowledge synthesis

### Why "AI Ark"?

Like Noah's Ark preserved life, **AI Ark preserves your intellectual life** across the fragmented AI landscape. Every insight, every conversation, every iteration - captured, unified, searchable.

---

## 🏗️ System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     AI Conversation Sources                  │
├──────────┬──────────┬──────────┬──────────┬─────────────────┤
│ ChatGPT  │  Claude  │  Gemini  │   Grok   │ Copilot/Others  │
└─────┬────┴────┬─────┴────┬─────┴────┬─────┴────┬────────────┘
      │         │          │          │          │
      ▼         ▼          ▼          ▼          ▼
┌─────────────────────────────────────────────────────────────┐
│              Platform-Specific Exporters                     │
│  (Browser extensions, mobile shortcuts, API clients)         │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Ingestion Pipeline                         │
│  • Raw file capture (iCloud Drive inbox)                     │
│  • Format detection & validation                             │
│  • Platform-specific parsers                                 │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              Normalization & Deduplication                   │
│  • PRC01 6-pass process                                      │
│  • Unified JSON schema transformation                        │
│  • SHA-256 content hashing                                   │
│  • Timestamp clustering                                      │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Knowledge Base Storage                    │
│  ┌─────────────┬──────────────┬───────────────┐            │
│  │   Primary   │    Vector    │    Object     │            │
│  │   Store     │    Store     │    Storage    │            │
│  │ (SQLite/PG) │  (pgvector)  │  (S3/MinIO)   │            │
│  └─────────────┴──────────────┴───────────────┘            │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                Personal Storage Integration                  │
├──────────┬──────────┬──────────┬──────────┬─────────────────┤
│ iCloud   │ Dropbox  │  Google  │ Mac Local│  Apple Notes    │
│  Drive   │          │  Drive   │  Files   │                 │
└──────────┴──────────┴──────────┴──────────┴─────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Access & Search Layer                     │
│  • Semantic search (vector embeddings)                       │
│  • Full-text search (keyword)                                │
│  • Temporal queries (by date range)                          │
│  • Cross-platform synthesis                                  │
│  • Retrieval-Augmented Generation (RAG)                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Component Breakdown

### 1. Platform-Specific Exporters

#### **ChatGPT Exporter** (Foundation - EXISTING)
- **Repository:** `pionxzh/chatgpt-exporter`
- **Status:** ✅ Mature, actively maintained
- **Capabilities:**
  - Browser userscript (Tampermonkey/GreasyFork)
  - Exports: Markdown, HTML, JSON, PNG, Text, JSONL
  - Bulk export via API
  - i18n support (9 languages)
- **Integration Point:** Outputs to `AI-KB/inbox/chatgpt/`

#### **Claude Exporter** (To Build)
- **Approach:** Browser extension + API client
- **Export Formats:** JSON, Markdown
- **Automation:** Desktop CLI + iOS Shortcuts
- **Target:** `AI-KB/inbox/claude/`

#### **Gemini Exporter** (To Build)
- **Approach:** Google Takeout + browser extension
- **Export Formats:** Text, JSON (via Takeout)
- **Automation:** Monthly scheduled Takeout + manual exports
- **Target:** `AI-KB/inbox/gemini/`

#### **Grok Exporter** (To Build)
- **Approach:** X Data Export + API scraping
- **Export Formats:** JSONL
- **Automation:** Weekly email pull + on-demand
- **Target:** `AI-KB/inbox/grok/`

#### **Copilot Exporter** (To Build)
- **Approach:** M365 Compliance Search + Power Automate
- **Export Formats:** JSON, PST bundles
- **Automation:** Daily Power Automate flow
- **Target:** `AI-KB/inbox/copilot/`

#### **Perplexity Exporter** (To Build)
- **Approach:** Browser extension + API
- **Export Formats:** Markdown
- **Automation:** macOS Shortcuts + folder watcher
- **Target:** `AI-KB/inbox/perplexity/`

#### **Poe Exporter** (To Build)
- **Approach:** Mobile share sheet + API
- **Export Formats:** JSON, CSV
- **Automation:** iOS Shortcuts
- **Target:** `AI-KB/inbox/poe/`

### 2. Ingestion Pipeline

**Technology:** Python + watchdog + Luigi/Airflow

**Flow:**
```python
# Pseudocode
1. Monitor inbox folders: watch('AI-KB/inbox/**/*')
2. Detect new file → identify platform (chatgpt|claude|gemini...)
3. Route to platform-specific parser
4. Validate against platform schema
5. Queue for normalization
```

**Parser Architecture:**
```
parsers/
├── base.py           # Abstract parser interface
├── chatgpt.py        # ChatGPT JSON/HTML parser
├── claude.py         # Claude JSON parser
├── gemini.py         # Gemini text/Takeout parser
├── grok.py           # Grok JSONL parser
├── copilot.py        # M365 PST/JSON parser
├── perplexity.py     # Perplexity Markdown parser
├── poe.py            # Poe JSON/CSV parser
└── generic.py        # Fallback for unknown formats
```

### 3. Unified Schema

**JSON Schema (Draft 7+):**

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["conversation_id", "source", "timestamp", "messages"],
  "properties": {
    "conversation_id": {
      "type": "string",
      "description": "Globally unique conversation identifier"
    },
    "source": {
      "type": "string",
      "enum": ["chatgpt", "claude", "gemini", "grok", "copilot", "perplexity", "poe", "other"]
    },
    "timestamp": {
      "type": "string",
      "format": "date-time",
      "description": "ISO-8601 UTC timestamp of conversation start"
    },
    "title": {
      "type": "string",
      "description": "Conversation title or subject"
    },
    "participants": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "role": {
            "type": "string",
            "enum": ["user", "assistant", "system", "tool"]
          },
          "name": {
            "type": "string"
          },
          "model": {
            "type": "string",
            "description": "AI model identifier (e.g., gpt-4, claude-3-opus)"
          }
        }
      }
    },
    "messages": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "role", "content", "timestamp"],
        "properties": {
          "id": {
            "type": "string"
          },
          "role": {
            "type": "string",
            "enum": ["user", "assistant", "system", "tool"]
          },
          "content": {
            "type": "string",
            "description": "Message text content"
          },
          "timestamp": {
            "type": "string",
            "format": "date-time"
          },
          "attachments": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "type": {
                  "type": "string",
                  "enum": ["image", "file", "audio", "video", "code"]
                },
                "uri": {
                  "type": "string",
                  "format": "uri"
                },
                "mime_type": {
                  "type": "string"
                },
                "size_bytes": {
                  "type": "integer"
                }
              }
            }
          },
          "metadata": {
            "type": "object",
            "properties": {
              "model": {
                "type": "string"
              },
              "temperature": {
                "type": "number"
              },
              "tokens": {
                "type": "object",
                "properties": {
                  "prompt": { "type": "integer" },
                  "completion": { "type": "integer" },
                  "total": { "type": "integer" }
                }
              },
              "citations": {
                "type": "array"
              }
            }
          }
        }
      }
    },
    "metadata": {
      "type": "object",
      "properties": {
        "source_platform": {
          "type": "string"
        },
        "source_uri": {
          "type": "string",
          "description": "Original file path or URL"
        },
        "ingested_at": {
          "type": "string",
          "format": "date-time"
        },
        "ingest_version": {
          "type": "string"
        },
        "checksum": {
          "type": "string",
          "description": "SHA-256 hash of source content"
        },
        "tags": {
          "type": "array",
          "items": { "type": "string" }
        },
        "entities": {
          "type": "array",
          "description": "NLP-extracted entities"
        },
        "embedding_model": {
          "type": "string"
        }
      }
    }
  }
}
```

### 4. PRC01 Deduplication Process

**6-Pass Workflow:**

```
Pass 1: INGEST
└─> Input: Raw exports
└─> Output: Canonical Full Snapshot (CFS)
└─> Action: Archive unmodified originals

Pass 2: TOKENIZE
└─> Input: CFS
└─> Output: Structured Unit Inventory (SUI)
└─> Action: Break into atomic units with IDs

Pass 3: DEDUPE
└─> Input: SUI
└─> Output: Deduplicated Content Map (DCM)
└─> Action: Hash-based + semantic deduplication

Pass 4: FUSE
└─> Input: DCM
└─> Output: Fused Iterative Document (FID)
└─> Action: Merge related content, preserve timeline

Pass 5: COMMENT (Optional)
└─> Input: FID
└─> Output: Annotated Version Trail (AVT)
└─> Action: Side-by-side diffs, change rationale

Pass 6: EXPORT
└─> Input: FID + AVT
└─> Output: Final normalized JSON + indexes
└─> Action: Validate against schema, write to DB
```

**Deduplication Algorithm:**

```python
def deduplicate_conversation(messages):
    """
    Deduplicate messages using multi-tier hashing
    """
    seen_hashes = set()
    deduplicated = []

    for msg in messages:
        # Tier 1: Exact content hash
        content_hash = hashlib.sha256(
            f"{msg['role']}:{msg['content']}".encode()
        ).hexdigest()

        if content_hash in seen_hashes:
            continue

        # Tier 2: Semantic similarity (for near-duplicates)
        if has_semantic_duplicate(msg, deduplicated):
            continue

        # Tier 3: Timestamp clustering (±5 seconds)
        if has_temporal_duplicate(msg, deduplicated, window=5):
            continue

        seen_hashes.add(content_hash)
        deduplicated.append(msg)

    return deduplicated
```

### 5. Storage Layer

#### **Primary Store: PostgreSQL**

```sql
CREATE TABLE conversations (
    id UUID PRIMARY KEY,
    source VARCHAR(50) NOT NULL,
    title TEXT,
    started_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    message_count INT,
    metadata JSONB,
    checksum VARCHAR(64) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE messages (
    id UUID PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id),
    role VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    attachments JSONB,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE dedupe_index (
    content_hash VARCHAR(64) PRIMARY KEY,
    message_id UUID REFERENCES messages(id),
    first_seen TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_conversations_source ON conversations(source);
CREATE INDEX idx_conversations_started_at ON conversations(started_at);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_timestamp ON messages(timestamp);
```

#### **Vector Store: pgvector**

```sql
CREATE EXTENSION vector;

CREATE TABLE message_embeddings (
    message_id UUID PRIMARY KEY REFERENCES messages(id),
    embedding vector(1536),  -- OpenAI text-embedding-3-large
    model VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX ON message_embeddings
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

#### **Object Storage: S3/MinIO**

```
s3://ai-ark/
├── raw/
│   ├── chatgpt/
│   ├── claude/
│   ├── gemini/
│   ├── grok/
│   ├── copilot/
│   ├── perplexity/
│   └── poe/
├── processed/
│   └── {year}/{month}/{day}/
│       └── {source}_{conversation_id}.json
├── attachments/
│   └── {conversation_id}/
│       ├── image_001.png
│       ├── file_002.pdf
│       └── audio_003.mp3
└── backups/
    └── {date}/
        └── postgres_dump.sql.gz
```

### 6. Personal Storage Integration

**macOS Integration:**

```python
# Scan Apple Notes
def export_apple_notes():
    """Export all Apple Notes to AI-KB"""
    notes_db = "~/Library/Group Containers/group.com.apple.notes/NoteStore.sqlite"
    conn = sqlite3.connect(notes_db)
    notes = conn.execute("""
        SELECT z_pk, ztitle, ztext, zcreationdate
        FROM ziccloudsyncingobject
        WHERE ztitle IS NOT NULL
    """).fetchall()

    for note in notes:
        save_to_inbox(
            content=note[2],
            title=note[1],
            source='apple_notes',
            timestamp=cocoa_to_unix(note[3])
        )

# Sync iCloud Drive
def sync_icloud_drive():
    """Sync iCloud Drive documents"""
    icloud_path = "~/Library/Mobile Documents/com~apple~CloudDocs"
    for root, dirs, files in os.walk(icloud_path):
        for file in files:
            if file.endswith(('.md', '.txt', '.pdf')):
                process_document(os.path.join(root, file))

# Sync Dropbox
def sync_dropbox():
    """Sync Dropbox using rclone"""
    subprocess.run([
        'rclone', 'sync',
        'dropbox:/', 'AI-KB/dropbox/',
        '--filter', '+ *.{md,txt,pdf}',
        '--filter', '- *'
    ])

# Sync Google Drive
def sync_google_drive():
    """Sync Google Drive using rclone"""
    subprocess.run([
        'rclone', 'sync',
        'gdrive:/', 'AI-KB/gdrive/',
        '--drive-export-formats', 'txt,md'
    ])
```

**iOS Shortcuts Integration:**

```
Shortcut: "Archive AI Chat"
├─ Receive: Any with Share Sheet
├─ Get Variable: Shortcut Input
├─ Get Name: App Name
├─ If: App Name contains "ChatGPT"
│  └─ Save File to iCloud: AI-KB/inbox/chatgpt/
├─ Otherwise If: App Name contains "Claude"
│  └─ Save File to iCloud: AI-KB/inbox/claude/
├─ Otherwise If: App Name contains "Gemini"
│  └─ Save File to iCloud: AI-KB/inbox/gemini/
└─ End If
```

---

## 🚀 Implementation Roadmap

### Phase 0: Foundation (COMPLETED ✅)
- [x] Audit ChatGPT Exporter repository
- [x] Fix security vulnerabilities
- [x] Update dependencies
- [x] Document architecture
- [x] Recover codex branch research

### Phase 1: ChatGPT Foundation (2 weeks)
**Goal:** Solidify ChatGPT Exporter as the reference implementation

- [ ] Add test infrastructure (Vitest)
- [ ] Achieve 50% test coverage
- [ ] Create plugin architecture for other platforms
- [ ] Extract common export logic to shared library
- [ ] Document API for other exporters

### Phase 2: Core Infrastructure (1 month)
**Goal:** Build the ingestion and storage pipeline

- [ ] Set up PostgreSQL + pgvector
- [ ] Create unified schema v1.0
- [ ] Build ingestion pipeline (Python)
- [ ] Implement PRC01 deduplication
- [ ] Set up S3/MinIO object storage
- [ ] Create monitoring dashboard

### Phase 3: Multi-Platform Exports (3 months)
**Goal:** Build exporters for all major platforms

- [ ] **Claude Exporter** (browser extension)
  - DOM injection similar to ChatGPT Exporter
  - API client for bulk exports
  - iOS Shortcuts integration

- [ ] **Gemini Exporter** (Takeout + extension)
  - Google Takeout automation
  - Browser extension for real-time capture
  - Android Tasker integration

- [ ] **Grok Exporter** (API + email)
  - X Data Export automation
  - JSONL parser
  - Weekly scheduling

- [ ] **Copilot Exporter** (M365 integration)
  - Power Automate flows
  - Compliance Search integration
  - PST parser

- [ ] **Perplexity Exporter** (extension)
  - Markdown export automation
  - API client

- [ ] **Poe Exporter** (mobile)
  - iOS Shortcuts
  - CSV/JSON parser

### Phase 4: Personal Storage (2 months)
**Goal:** Integrate all personal knowledge sources

- [ ] Apple Notes exporter
- [ ] iCloud Drive sync (rclone)
- [ ] Dropbox sync (rclone)
- [ ] Google Drive sync (rclone)
- [ ] Spotlight index integration
- [ ] Safari bookmarks/reading list
- [ ] Mac Messages export

### Phase 5: Search & Retrieval (2 months)
**Goal:** Make everything searchable and queryable

- [ ] Full-text search (PostgreSQL FTS)
- [ ] Vector search (pgvector + embeddings)
- [ ] Temporal queries (date ranges)
- [ ] Tag-based filtering
- [ ] Cross-platform synthesis
- [ ] Web UI (Next.js + tRPC)
- [ ] RAG implementation (LangChain)

### Phase 6: Advanced Features (ongoing)
**Goal:** Evolution and optimization

- [ ] Automated tagging (NLP)
- [ ] Entity extraction (spaCy)
- [ ] Topic modeling
- [ ] Conversation threading
- [ ] Export templates
- [ ] Bulk reprocessing
- [ ] Performance optimization
- [ ] Mobile apps

---

## 📂 Repository Structure

### Monorepo Approach (Recommended)

```
ai-ark/
├── packages/
│   ├── chatgpt-exporter/          # Fork of pionxzh/chatgpt-exporter
│   ├── claude-exporter/            # New: Claude browser extension
│   ├── gemini-exporter/            # New: Gemini Takeout + extension
│   ├── grok-exporter/              # New: Grok API client
│   ├── copilot-exporter/           # New: M365 integration
│   ├── perplexity-exporter/        # New: Perplexity extension
│   ├── poe-exporter/               # New: Poe mobile
│   ├── shared/                     # Shared utilities
│   │   ├── schema/                 # Unified JSON schema
│   │   ├── parser/                 # Base parser classes
│   │   ├── types/                  # TypeScript types
│   │   └── utils/                  # Common utilities
│   ├── ingestion/                  # Python ingestion pipeline
│   │   ├── parsers/                # Platform-specific parsers
│   │   ├── dedupe/                 # PRC01 implementation
│   │   ├── storage/                # DB/S3 interfaces
│   │   └── monitoring/             # Health checks
│   ├── search/                     # Search & retrieval layer
│   │   ├── vector/                 # Vector search
│   │   ├── fulltext/               # Full-text search
│   │   └── api/                    # Search API
│   └── web/                        # Web UI
│       ├── app/                    # Next.js app
│       └── components/             # React components
├── docs/
│   ├── ARCHITECTURE.md             # This file
│   ├── AI_ARK_VISION.md            # Vision document
│   ├── PLATFORM_GUIDES/            # Per-platform docs
│   │   ├── chatgpt.md
│   │   ├── claude.md
│   │   ├── gemini.md
│   │   └── ...
│   └── API.md                      # API documentation
├── scripts/
│   ├── setup/                      # Setup scripts
│   ├── sync/                       # Sync scripts (rclone)
│   └── backup/                     # Backup scripts
├── infra/
│   ├── docker/                     # Docker configs
│   ├── k8s/                        # Kubernetes (if needed)
│   └── terraform/                  # Infrastructure as code
├── .github/
│   └── workflows/                  # CI/CD
├── package.json                    # Monorepo root
├── pnpm-workspace.yaml             # PNPM workspace config
└── README.md                       # Project overview
```

---

## 🔐 Security & Privacy

### Data Protection
- **Encryption at rest:** AES-256 for all stored data
- **Encryption in transit:** TLS 1.3 for all network traffic
- **API keys:** Stored in macOS Keychain / 1Password
- **OAuth tokens:** Rotated every 90 days

### Access Control
- **Database:** Role-based access (read-only, read-write)
- **S3 Buckets:** IAM policies, object locking
- **Web UI:** JWT authentication, MFA optional

### Compliance
- **GDPR:** Right to erasure implemented
- **CCPA:** Data export on demand
- **Audit logs:** All access logged for 1 year

### Backup Strategy
- **PostgreSQL:** Daily dumps to S3, 30-day retention
- **Object storage:** Versioning enabled, lifecycle policies
- **Time Machine:** macOS local backups
- **Offsite:** Backblaze B2 for disaster recovery

---

## 📊 Success Metrics

### Technical Metrics
- **Ingestion rate:** >1000 messages/minute
- **Deduplication ratio:** <5% duplicates
- **Search latency:** <100ms p95
- **Uptime:** 99.9% availability
- **Storage efficiency:** <10GB per 100k messages

### User Experience Metrics
- **Export coverage:** 100% of active AI platforms
- **Automation rate:** >90% hands-free capture
- **Search recall:** >95% relevant results
- **Time to insight:** <30 seconds from query to answer

---

## 🌱 Future Evolution

### Near-Term (6 months)
- Add support for new AI platforms as they emerge
- Implement real-time sync (webhooks, websockets)
- Build mobile companion app
- Add collaborative features (shared knowledge bases)

### Mid-Term (1 year)
- Multi-user support (family, team)
- Knowledge graph visualization
- Automated insights and summaries
- Integration with Obsidian, Notion, Roam

### Long-Term (2+ years)
- AI-powered knowledge synthesis
- Predictive search (anticipate needs)
- Cross-platform conversation threading
- Personal AI assistant trained on your knowledge base

---

**This is your intellectual life. Preserved. Unified. Accessible.**

---

*Architecture compiled from codex branch research, October 2025*
