# Branch Cleanup Required

**Date:** October 27, 2025
**Issue:** Unrelated branches polluting repository

## Summary

7 branches contain content unrelated to the ChatGPT Exporter project and should be deleted by repository administrators.

## Branches to Delete

### Unrelated Documentation Branches (6)

All created 2-3 days ago by malformed git author: `-- - -4_B100m-',..._..._._ . .,' •`

1. `codex/add-ai-app-capture-playbook-2025-10-2506-16-14`
2. `codex/add-ai-app-capture-playbook-2025-10-2507-51-58`
3. `codex/add-ai-app-capture-playbook-2025-10-2507-52-29`
4. `codex/investigate-ai-tools-for-project-2025-10-2406-31-07`
5. `codex/investigate-ai-tools-for-project-2025-10-2505-37-40`
6. `codex/investigate-ai-tools-for-project-2025-10-2505-50-24`

**Content:** AI-generated documentation for a "unified knowledge base" system that captures conversations from multiple AI platforms (ChatGPT, Claude, Gemini, Perplexity, Microsoft Copilot).

**Files Added:**
- `docs/ai-app-capture-playbook.md`
- `docs/unified-export-knowledge-base.md`
- `AI_App_Capture_Playbook.md`
- `PRC01_Deduplicated_Compile_Process.md`

**Analysis:** These appear to be created in the wrong repository by mistake, likely through an automated process with improper git configuration.

### Stale Feature Branch (1)

7. `gpt-4o` (last commit: 1 year, 5 months ago)
   - **Version:** 2.24.0 (master is 2.29.1)
   - **Commits:** 409 total
   - **Status:** 5 minor versions behind
   - **Analysis:** Changes already integrated into master (French/Russian locales, etc.)

## Deletion Commands

```bash
# Delete unrelated codex branches
git push origin --delete \
  codex/add-ai-app-capture-playbook-2025-10-2506-16-14 \
  codex/add-ai-app-capture-playbook-2025-10-2507-51-58 \
  codex/add-ai-app-capture-playbook-2025-10-2507-52-29 \
  codex/investigate-ai-tools-for-project-2025-10-2406-31-07 \
  codex/investigate-ai-tools-for-project-2025-10-2505-37-40 \
  codex/investigate-ai-tools-for-project-2025-10-2505-50-24

# Delete stale feature branch
git push origin --delete gpt-4o

# Clean up local references
git fetch --prune
```

## Permissions Issue

**Attempted deletion failed with 403 Forbidden**, indicating proper branch protection is in place. Repository administrators will need to delete these branches manually.

## Prevention

To prevent similar issues in the future:

1. **Git Configuration Audit:**
   - Check all automation tools for proper git config
   - Ensure author name/email are properly set
   - Test git operations in isolated environments

2. **Branch Naming Policy:**
   - Enforce branch naming conventions
   - Use CI checks to validate branch names
   - Document naming standards in CONTRIBUTING.md

3. **Repository Access:**
   - Review who has push access
   - Consider requiring PR reviews for new branches
   - Enable GitHub branch protection rules

## Verification

After deletion, verify branches are gone:

```bash
# List all remote branches
git branch -r | grep -E "(codex|gpt-4o)"

# Should return empty
```

---

**Action Required:** Repository administrator must delete these branches
**Urgency:** Low (cosmetic issue, no security impact)
**Tracked In:** See EXHAUSTIVE_ANALYSIS.md Section 4
