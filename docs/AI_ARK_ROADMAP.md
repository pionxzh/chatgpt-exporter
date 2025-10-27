# AI Ark Implementation Roadmap
## From ChatGPT Exporter to Universal Knowledge Base

**Vision:** Transform ChatGPT Exporter from a single-platform tool into the foundation of a universal AI conversation knowledge base.

---

## 🎯 Strategic Overview

### Current State
- ✅ **ChatGPT Exporter:** Mature, working userscript
- ✅ **Security:** 4 CVEs fixed, 1 dev-only remaining
- ✅ **Testing:** Type checking (no runtime tests yet)
- ✅ **Documentation:** Comprehensive analysis complete
- ✅ **Research:** AI Ark vision documented from codex branches

### Target State (12 months)
- 🎯 **Multi-Platform:** 7+ AI platforms supported
- 🎯 **Personal Storage:** iCloud, Dropbox, Google Drive, Mac local
- 🎯 **Unified Schema:** All sources normalized
- 🎯 **Searchable:** Full-text + vector search
- 🎯 **Automated:** 90%+ hands-free capture

---

## 📅 Timeline & Milestones

### Phase 0: Foundation Secured ✅ (Oct 27, 2025)
**Status:** COMPLETED
**Duration:** 1 day

**Achievements:**
- [x] Audited ChatGPT Exporter repository
- [x] Fixed 4 security vulnerabilities
- [x] Updated 14 dependencies
- [x] Created SECURITY.md policy
- [x] Wrote exhaustive analysis (12,000 words)
- [x] Recovered codex branch research
- [x] Documented AI Ark architecture

**Deliverables:**
- EXHAUSTIVE_ANALYSIS.md
- SECURITY.md
- AI_ARK_ARCHITECTURE.md
- AI_ARK_ROADMAP.md (this file)
- Research preserved in docs/research/

---

### Phase 1: ChatGPT Foundation (Nov 2025)
**Goal:** Make ChatGPT Exporter production-ready for AI Ark
**Duration:** 2 weeks
**Effort:** 40 hours

#### Week 1: Testing Infrastructure
- [ ] Install Vitest + Testing Library
- [ ] Configure test environment (jsdom)
- [ ] Write 10 core tests:
  - [ ] API conversation fetching
  - [ ] Markdown export
  - [ ] HTML export
  - [ ] JSON export
  - [ ] Storage operations
  - [ ] Deduplication logic
- [ ] Set up CI test job (GitHub Actions)
- [ ] Document testing approach

**Success Criteria:**
- Tests passing in CI
- 30%+ code coverage
- No regressions

#### Week 2: Plugin Architecture
- [ ] Extract shared export logic to library
- [ ] Create plugin interface for other platforms
- [ ] Refactor ChatGPT-specific code to plugin
- [ ] Document plugin API
- [ ] Create example plugin (skeleton)

**Success Criteria:**
- Plugin system functional
- ChatGPT works as plugin
- API documented

**Deliverables:**
- `packages/shared/` - Shared utilities
- `packages/chatgpt-exporter/` - Refactored as plugin
- Plugin API documentation

---

### Phase 2: Core Infrastructure (Dec 2025 - Jan 2026)
**Goal:** Build the AI Ark ingestion and storage pipeline
**Duration:** 6 weeks
**Effort:** 80 hours

#### Weeks 1-2: Database & Schema
- [ ] Set up PostgreSQL 16 with pgvector
- [ ] Create database schema (conversations, messages, embeddings)
- [ ] Implement unified JSON schema v1.0
- [ ] Create schema validation (ajv)
- [ ] Write migration scripts
- [ ] Set up S3/MinIO for attachments

**Tech Stack:**
- PostgreSQL 16
- pgvector extension
- MinIO (local S3)
- Docker Compose

**Deliverables:**
- `infra/docker/` - Docker setup
- `packages/shared/schema/` - JSON Schema v1.0
- Database migration scripts

#### Weeks 3-4: Ingestion Pipeline
- [ ] Build file watcher (watchdog)
- [ ] Create platform detection logic
- [ ] Implement base parser interface
- [ ] Build ChatGPT parser (JSON, HTML, Markdown)
- [ ] Create normalization pipeline
- [ ] Implement checksum tracking

**Tech Stack:**
- Python 3.11+
- watchdog (file monitoring)
- pydantic (validation)
- SQLAlchemy (ORM)

**Deliverables:**
- `packages/ingestion/` - Python pipeline
- `packages/ingestion/parsers/` - Parser modules
- Configuration file (YAML)

#### Weeks 5-6: Deduplication & Testing
- [ ] Implement PRC01 6-pass process
- [ ] Build content hashing (SHA-256)
- [ ] Add semantic similarity detection
- [ ] Create temporal clustering (±5 sec)
- [ ] Write integration tests
- [ ] Set up monitoring (Grafana + Prometheus)

**Deliverables:**
- `packages/ingestion/dedupe/` - Deduplication engine
- Test suite for ingestion
- Monitoring dashboard

**Success Criteria:**
- ChatGPT conversations ingested successfully
- <5% duplicate rate
- Processing >1000 messages/minute
- All tests passing

---

### Phase 3: Multi-Platform Exporters (Feb - Apr 2026)
**Goal:** Build exporters for all major AI platforms
**Duration:** 12 weeks
**Effort:** 160 hours

#### Week 1-2: Claude Exporter
- [ ] Research Claude web app DOM structure
- [ ] Build browser extension (Manifest V3)
- [ ] Implement export menu injection
- [ ] Create JSON export function
- [ ] Add Markdown export
- [ ] Build API client for bulk exports
- [ ] Create iOS Shortcut integration
- [ ] Write tests

**Tech Stack:**
- Browser extension (Chrome/Firefox)
- TypeScript
- Sentinel.js (DOM watching)

**Deliverables:**
- `packages/claude-exporter/` - Extension code
- Chrome Web Store listing
- iOS Shortcut template

#### Week 3-4: Gemini Exporter
- [ ] Research Google Takeout format
- [ ] Build Takeout parser
- [ ] Create browser extension for real-time capture
- [ ] Implement text export
- [ ] Add Android Tasker automation
- [ ] Build monthly Takeout scheduler
- [ ] Write tests

**Deliverables:**
- `packages/gemini-exporter/` - Extension + parser
- Tasker profile (Android)
- Takeout automation script

#### Week 5-6: Grok Exporter
- [ ] Research X Data Export format
- [ ] Build JSONL parser
- [ ] Create email-based export automation
- [ ] Implement API scraping (if available)
- [ ] Add weekly scheduling
- [ ] Write tests

**Deliverables:**
- `packages/grok-exporter/` - Parser + automation
- Email monitoring script
- cron job templates

#### Week 7-8: Copilot Exporter
- [ ] Research M365 Compliance Search
- [ ] Build Power Automate flow
- [ ] Create PST parser
- [ ] Add JSON export support
- [ ] Implement SharePoint integration
- [ ] Write tests

**Deliverables:**
- `packages/copilot-exporter/` - Parser + automation
- Power Automate template
- PowerShell scripts

#### Week 9-10: Perplexity Exporter
- [ ] Research Perplexity web app
- [ ] Build browser extension
- [ ] Implement Markdown export
- [ ] Create API client (if available)
- [ ] Add macOS Shortcuts automation
- [ ] Write tests

**Deliverables:**
- `packages/perplexity-exporter/` - Extension
- macOS Shortcut template

#### Week 11-12: Poe Exporter
- [ ] Research Poe mobile app
- [ ] Build iOS Shortcuts integration
- [ ] Create JSON/CSV parser
- [ ] Implement share sheet automation
- [ ] Write tests

**Deliverables:**
- `packages/poe-exporter/` - Parser
- iOS Shortcut template

**Success Criteria:**
- All 6 new exporters functional
- Conversations successfully ingested
- Tests passing
- Documentation complete

---

### Phase 4: Personal Storage Integration (May - Jun 2026)
**Goal:** Capture knowledge from all personal storage sources
**Duration:** 8 weeks
**Effort:** 80 hours

#### Week 1-2: Apple Ecosystem
- [ ] Build Apple Notes exporter (SQLite)
- [ ] Create iCloud Drive sync (rclone)
- [ ] Add Safari bookmarks export
- [ ] Implement Messages export
- [ ] Build Spotlight index integration

**Tech Stack:**
- Python + sqlite3 (Apple Notes DB)
- rclone (iCloud sync)
- macOS APIs (Shortcuts, AppleScript)

**Deliverables:**
- `packages/ingestion/parsers/apple_notes.py`
- `scripts/sync/icloud-sync.sh`
- LaunchAgent plists

#### Week 3-4: Cloud Storage
- [ ] Set up Dropbox sync (rclone)
- [ ] Configure Google Drive sync (rclone)
- [ ] Add OneDrive support
- [ ] Implement Box.com support
- [ ] Create sync scheduler

**Deliverables:**
- `scripts/sync/dropbox-sync.sh`
- `scripts/sync/gdrive-sync.sh`
- rclone configuration templates

#### Week 5-6: Document Processing
- [ ] Implement PDF OCR (Tesseract)
- [ ] Add DOCX parser
- [ ] Create XLSX parser
- [ ] Build Notion export parser
- [ ] Add Evernote import

**Tech Stack:**
- Tesseract OCR
- python-docx
- openpyxl
- Notion API

**Deliverables:**
- `packages/ingestion/parsers/documents/`
- OCR pipeline

#### Week 7-8: Multimedia & Testing
- [ ] Add audio transcription (Whisper)
- [ ] Implement video extraction
- [ ] Create image metadata extraction
- [ ] Write integration tests
- [ ] Build sync monitoring

**Deliverables:**
- Whisper integration
- Multimedia parsers
- Test suite

**Success Criteria:**
- All personal storage sources integrated
- Automated nightly sync
- >95% content captured
- Tests passing

---

### Phase 5: Search & Retrieval (Jul - Aug 2026)
**Goal:** Make everything searchable and queryable
**Duration:** 8 weeks
**Effort:** 100 hours

#### Week 1-2: Search Backend
- [ ] Implement PostgreSQL full-text search
- [ ] Configure pgvector indexing
- [ ] Generate embeddings (OpenAI API)
- [ ] Build vector similarity search
- [ ] Create temporal query support

**Tech Stack:**
- PostgreSQL FTS
- pgvector
- OpenAI text-embedding-3-large
- Python + SQLAlchemy

**Deliverables:**
- `packages/search/fulltext/`
- `packages/search/vector/`
- Embedding generation pipeline

#### Week 3-4: Search API
- [ ] Design REST API (FastAPI)
- [ ] Implement search endpoints
- [ ] Add filtering (source, date, tags)
- [ ] Create aggregations
- [ ] Build pagination
- [ ] Add caching (Redis)

**Tech Stack:**
- FastAPI
- Redis
- Pydantic

**Deliverables:**
- `packages/search/api/`
- OpenAPI specification
- API documentation

#### Week 5-6: Web UI
- [ ] Build Next.js app
- [ ] Create search interface
- [ ] Add filters sidebar
- [ ] Implement conversation viewer
- [ ] Create timeline view
- [ ] Add export functionality

**Tech Stack:**
- Next.js 14
- React 19
- Tailwind CSS
- tRPC

**Deliverables:**
- `packages/web/`
- Web UI deployed locally

#### Week 7-8: RAG & Testing
- [ ] Implement RAG with LangChain
- [ ] Create citation extraction
- [ ] Add confidence scoring
- [ ] Build Q&A interface
- [ ] Write E2E tests
- [ ] Performance optimization

**Deliverables:**
- RAG implementation
- Q&A interface
- Test suite

**Success Criteria:**
- Search latency <100ms p95
- >95% search recall
- Web UI functional
- Tests passing

---

### Phase 6: Advanced Features (Sep 2026 - Ongoing)
**Goal:** Evolution and optimization
**Duration:** Ongoing
**Effort:** Variable

#### High Priority
- [ ] Automated tagging (spaCy NLP)
- [ ] Entity extraction
- [ ] Topic modeling (LDA)
- [ ] Conversation threading
- [ ] Export templates
- [ ] Bulk reprocessing
- [ ] Performance profiling

#### Medium Priority
- [ ] Mobile companion app (React Native)
- [ ] Knowledge graph visualization
- [ ] Collaborative features (multi-user)
- [ ] Obsidian plugin
- [ ] Notion integration
- [ ] API webhooks

#### Low Priority
- [ ] AI-powered summarization
- [ ] Predictive search
- [ ] Cross-platform threading
- [ ] Personal AI assistant
- [ ] Voice interface

---

## 🛠️ Development Setup

### Prerequisites
```bash
# System requirements
- macOS 13+ (for Apple ecosystem integration)
- Docker Desktop
- Node.js 20+
- Python 3.11+
- PostgreSQL 16+
- pnpm 8+

# Install dependencies
brew install docker postgresql@16 python@3.11 node pnpm rclone tesseract
```

### Initial Setup
```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/ai-ark.git
cd ai-ark

# Install dependencies
pnpm install

# Set up database
docker-compose up -d postgres pgadmin minio

# Run migrations
cd packages/ingestion
python -m alembic upgrade head

# Start development
pnpm dev
```

---

## 📊 Progress Tracking

### Current Status: Phase 0 Complete ✅

| Phase | Status | Progress | Start Date | End Date | Effort |
|-------|--------|----------|------------|----------|--------|
| 0: Foundation | ✅ Complete | 100% | Oct 27 | Oct 27 | 8h |
| 1: ChatGPT Foundation | 🔲 Planned | 0% | Nov 1 | Nov 15 | 40h |
| 2: Core Infrastructure | 🔲 Planned | 0% | Dec 1 | Jan 15 | 80h |
| 3: Multi-Platform | 🔲 Planned | 0% | Feb 1 | Apr 30 | 160h |
| 4: Personal Storage | 🔲 Planned | 0% | May 1 | Jun 30 | 80h |
| 5: Search & Retrieval | 🔲 Planned | 0% | Jul 1 | Aug 31 | 100h |
| 6: Advanced Features | 🔲 Ongoing | 0% | Sep 1 | - | Variable |

**Total Planned Effort:** ~460 hours over 12 months

---

## 🎯 Key Decision Points

### Decision 1: Monorepo vs Multi-Repo
**Recommendation:** Monorepo (pnpm workspaces)

**Pros:**
- Shared code easily
- Atomic commits across packages
- Unified CI/CD
- Easier dependency management

**Cons:**
- Larger repository
- Longer clone times

**Decision:** Use monorepo with pnpm workspaces

### Decision 2: ChatGPT Exporter Integration
**Options:**
1. Fork and maintain separately
2. Integrate as git submodule
3. Copy and refactor into monorepo

**Recommendation:** Option 3 - Copy and refactor

**Rationale:**
- Full control over codebase
- Can refactor for plugin architecture
- Easier to maintain
- Can contribute improvements back upstream

### Decision 3: Database Choice
**Options:**
1. SQLite (simple, local)
2. PostgreSQL (powerful, scalable)
3. MongoDB (flexible schema)

**Recommendation:** PostgreSQL 16 + pgvector

**Rationale:**
- pgvector for semantic search
- JSONB for flexible metadata
- FTS for full-text search
- Production-ready scaling
- Better data integrity

### Decision 4: Embedding Model
**Options:**
1. OpenAI text-embedding-3-large ($0.13/1M tokens)
2. Cohere embed-multilingual-v3 ($0.10/1M tokens)
3. Local model (Instructor-large, free)

**Recommendation:** Start with OpenAI, migrate to local

**Rationale:**
- OpenAI quality is excellent
- Easy to start
- Can migrate to local later for cost savings
- Keep embeddings versioned for migration

---

## 🔄 Iteration Strategy

### Weekly Cycle
**Monday:**
- Plan week's work
- Set goals and milestones

**Tuesday-Thursday:**
- Development and testing
- Daily progress updates

**Friday:**
- Code review
- Documentation
- Retrospective

### Monthly Cycle
**Week 4:**
- Demo to stakeholders
- Gather feedback
- Adjust roadmap

### Quarterly Cycle
**Month 3:**
- Major milestone review
- Architecture decisions
- Dependency updates
- Security audit

---

## 📈 Success Metrics

### Technical KPIs
- **Test Coverage:** Target 80%
- **Ingestion Rate:** >1000 messages/min
- **Deduplication:** <5% duplicates
- **Search Latency:** <100ms p95
- **Uptime:** >99.9%
- **Storage Efficiency:** <10GB per 100k messages

### User Experience KPIs
- **Platform Coverage:** 7+ AI platforms
- **Automation Rate:** >90% hands-free
- **Search Recall:** >95% relevant results
- **Time to Insight:** <30 seconds
- **Export Success:** >99% successful exports

### Business KPIs
- **Active Users:** 1 (you!) → expand to family/friends
- **Total Conversations:** >10,000 in year 1
- **Total Messages:** >100,000 in year 1
- **Storage Used:** <100GB in year 1

---

## 🚨 Risks & Mitigation

### Technical Risks

**Risk 1: AI Platform API Changes**
- **Probability:** HIGH
- **Impact:** HIGH
- **Mitigation:**
  - Monitor platform changes weekly
  - Build adapter pattern for easy updates
  - Maintain fallback to manual exports
  - Community monitoring (GitHub issues)

**Risk 2: Scale Issues**
- **Probability:** MEDIUM
- **Impact:** MEDIUM
- **Mitigation:**
  - Performance testing from day 1
  - Indexing optimization
  - Caching strategy
  - Horizontal scaling plan

**Risk 3: Data Loss**
- **Probability:** LOW
- **Impact:** CRITICAL
- **Mitigation:**
  - Immutable raw storage (never delete)
  - Daily backups to S3
  - Offsite backups (Backblaze)
  - Checksum verification
  - Version control for configs

### Resource Risks

**Risk 4: Time Constraints**
- **Probability:** HIGH
- **Impact:** MEDIUM
- **Mitigation:**
  - Phased approach (ship incrementally)
  - Focus on core features first
  - Defer nice-to-haves
  - Community contributions

**Risk 5: Cost Overrun (Embeddings)**
- **Probability:** MEDIUM
- **Impact:** LOW
- **Mitigation:**
  - Start with local models
  - Batch embeddings
  - Cache results
  - Incremental processing

---

## 🤝 Community & Contribution

### Open Source Strategy
- Keep core platform (AI Ark) open source
- Individual exporters as separate repos
- Encourage community exporters for new platforms
- Maintain plugin registry

### Contribution Guidelines
- See CONTRIBUTING.md in each package
- Follow code style (ESLint + Prettier)
- Write tests for new features
- Document API changes

---

## 📚 Resources & References

### Documentation
- [AI Ark Architecture](./AI_ARK_ARCHITECTURE.md)
- [Exhaustive Analysis](../EXHAUSTIVE_ANALYSIS.md)
- [Security Policy](../SECURITY.md)
- [Research Documents](./research/)

### Research Sources
- codex/investigate-ai-tools-for-project branches
- codex/add-ai-app-capture-playbook branches
- ChatGPT Exporter source code
- Community tools survey

### Inspiration
- Notion (unified workspace)
- Obsidian (personal knowledge)
- Mem.ai (AI-powered notes)
- Recall.ai (meeting transcripts)

---

**Next Action:** Begin Phase 1 (ChatGPT Foundation) - Week of November 1, 2025

---

*Roadmap compiled October 27, 2025*
*Last updated: October 27, 2025*
