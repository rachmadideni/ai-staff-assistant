#!/usr/bin/env bash
set -euo pipefail

# ─── Ralph Loop — AI Staff Assistant MVP ───────────────────────────────
# Cross-platform (Windows Git Bash / Linux / macOS)
#
# Usage:
#   bash ralph.sh              # Run one iteration (manual or opencode)
#   bash ralph.sh --auto       # Run all remaining stories autonomously
#   bash ralph.sh --status     # Show completion status
#   bash ralph.sh --next       # Show next incomplete story
#   bash ralph.sh --check <id> # Mark story as completed after manual impl
# ─────────────────────────────────────────────────────────────────────────

PRD_FILE="prd.json"
PROGRESS_FILE="progress.txt"
PROMPT_FILE="prompt.md"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

status()  { echo -e "${BLUE}▶${NC} $1"; }
success() { echo -e "${GREEN}✓${NC} $1"; }
warn()    { echo -e "${YELLOW}⚠${NC} $1"; }
error()   { echo -e "${RED}✗${NC} $1"; }

# ─── Node helpers (env var, NOT stdin — works on Windows) ──────────────

json_field() {
  local json=$1 field=$2
  STORY_JSON="$json" node -e "console.log(JSON.parse(process.env.STORY_JSON).$field)"
}

json_checks() {
  local json=$1
  STORY_JSON="$json" node -e "JSON.parse(process.env.STORY_JSON).checks.forEach(c => console.log(c))"
}

json_details() {
  local json=$1
  STORY_JSON="$json" node -e "
    const d = JSON.parse(process.env.STORY_JSON);
    console.log('Title:', d.title);
    console.log('Description:', d.description);
  "
}

json_checks_bullets() {
  local json=$1
  STORY_JSON="$json" node -e "
    JSON.parse(process.env.STORY_JSON).checks.forEach(c => console.log('- ' + c))
  "
}

# ─── Core helpers ──────────────────────────────────────────────────────

get_incomplete_story() {
  node -e "
    const prd = require('./${PRD_FILE}');
    const story = prd.stories.find(s => s.passes === false);
    console.log(story ? JSON.stringify(story) : 'ALL_COMPLETE');
  "
}

mark_complete() {
  local id=$1
  node -e "
    const fs = require('fs');
    const prd = JSON.parse(fs.readFileSync('${PRD_FILE}', 'utf8'));
    const story = prd.stories.find(s => s.id === ${id});
    if (story) {
      story.passes = true;
      fs.writeFileSync('${PRD_FILE}', JSON.stringify(prd, null, 2) + '\n');
    }
  "
}

run_typecheck() {
  npx tsc --noEmit 2>/dev/null
}

run_tests() {
  npx vitest run --reporter=verbose 2>/dev/null
}

log_progress() {
  local date
  date=$(date +%Y-%m-%d)
  echo "[$date] story-$1: $2 | $3 | $4" >> "$PROGRESS_FILE"
}

show_story_prompt() {
  local story=$1
  local id title description

  id=$(json_field "$story" "id")
  title=$(json_field "$story" "title")
  description=$(json_field "$story" "description")

  echo ""
  echo "╔══════════════════════════════════════════════════════════════╗"
  echo "║            RALPH ITERATION — Story $id                          ║"
  echo "╚══════════════════════════════════════════════════════════════╝"
  echo ""
  echo -e "${YELLOW}Title:${NC}       $title"
  echo -e "${YELLOW}Description:${NC} $description"
  echo ""
  echo -e "${YELLOW}Acceptance Checks:${NC}"
  json_checks "$story" | while IFS= read -r check; do
    echo "  ☐ $check"
  done
  echo ""
  echo -e "${YELLOW}Rules:${NC} Read prompt.md for project constraints"
  echo -e "${YELLOW}Previous:${NC} Check progress.txt and git log for context"
  echo ""
}

# ─── Commands ──────────────────────────────────────────────────────────

show_status() {
  echo ""
  node -e "
    const prd = require('./${PRD_FILE}');
    const total = prd.stories.length;
    const done = prd.stories.filter(s => s.passes).length;
    const pct = Math.round((done / total) * 100);
    console.log('━━━ Ralph Status ━━━');
    console.log('  Complete: ' + done + '/' + total + ' (' + pct + '%)');
    console.log('');
    for (const [num, name] of Object.entries(prd.milestones)) {
      const ms = prd.stories.filter(s => s.milestone === parseInt(num));
      const md = ms.filter(s => s.passes).length;
      const bar = '█'.repeat(Math.round((md/ms.length)*20)) + '░'.repeat(Math.round((1-md/ms.length)*20));
      console.log('  M' + num + ' ' + name + ': ' + bar + ' ' + md + '/' + ms.length);
    }
    console.log('');
    const next = prd.stories.find(s => s.passes === false);
    if (next) console.log('  Next up: Story ' + next.id + ' — ' + next.title);
    else console.log('  ✓ ALL STORIES COMPLETE');
    console.log('');
  "
}

show_next() {
  local story
  story=$(get_incomplete_story)
  if [ "$story" = "ALL_COMPLETE" ]; then
    success "All stories complete! 🎉"
    exit 0
  fi
  show_story_prompt "$story"
}

run_iteration() {
  local story
  story=$(get_incomplete_story)

  if [ "$story" = "ALL_COMPLETE" ]; then
    success "All stories complete! 🎉"
    exit 0
  fi

  local id title
  id=$(json_field "$story" "id")
  title=$(json_field "$story" "title")

  show_story_prompt "$story"

  if command -v opencode &>/dev/null; then
    status "Auto-implementing story ${id} with opencode..."

    local details checks
    details=$(json_details "$story")
    checks=$(json_checks_bullets "$story")

    local msg
    msg=$(cat <<EOF
Implement story ${id}: ${title}

Project: AI Staff Assistant MVP (JOB.md)
Stack: Next.js App Router + Supabase + OpenAI + Tailwind + shadcn/ui

RULES (read prompt.md for full details):
- OpenAI API key server-side ONLY
- No individual staff accounts — use business_access_tokens
- RLS on every table
- Documents: draft → approved → archived workflow
- pgvector for vector search filtered by tenant_id

STORY DETAILS:
${details}

ACCEPTANCE CHECKS:
${checks}

After implementing:
1. npm run typecheck (must pass)
2. npm run test (must pass)
3. git add -A && git commit -m "story-${id}: ${title}"
EOF
)
    rtk opencode --model opencode/deepseek-v4-flash-free --prompt "$msg" || {
      warn "opencode implementation failed. Implement manually."
      warn "Then run: bash ralph.sh --check ${id}"
      return 1
    }

    if run_typecheck && run_tests; then
      mark_complete "$id"
      log_progress "$id" "$title" "pass" "Auto-implemented via opencode"
      git add -A && git commit -m "story-${id}: ${title}" || true
      success "Story ${id} complete — typecheck + tests pass"
    else
      warn "Story ${id} implemented but checks failed. Fix and re-run."
      log_progress "$id" "$title" "fail" "Typecheck or tests failed after auto-implement"
      exit 1
    fi
  else
    echo ""
    warn "opencode CLI not found. Manual implementation required."
    echo ""
    echo "Steps:"
    echo "  1. Implement the story above"
    echo "  2. Run: npm run typecheck"
    echo "  3. Run: npm run test"
    echo "  4. Run: bash ralph.sh --check $id"
    echo ""
  fi
}

check_story() {
  local story_id=$1
  status "Running typecheck..."
  run_typecheck || { error "Typecheck failed"; exit 1; }
  success "Typecheck passed"

  status "Running tests..."
  run_tests || { error "Tests failed"; exit 1; }
  success "Tests passed"

  mark_complete "$story_id"
  local title
  title=$(node -e "const prd=require('./${PRD_FILE}');const s=prd.stories.find(s=>s.id===${story_id});console.log(s?s.title:'')")
  log_progress "$story_id" "$title" "pass" "Manually verified — typecheck + tests pass"
  git add -A && git commit -m "story-${story_id}: ${title}" || true
  success "Story ${story_id} verified and committed!"
  show_status
}

run_all() {
  while true; do
    local story
    story=$(get_incomplete_story)
    [ "$story" = "ALL_COMPLETE" ] && { success "All stories complete! 🎉"; exit 0; }
    run_iteration
  done
}

# ─── Main ──────────────────────────────────────────────────────────────

case "${1:-}" in
  --status|-s) show_status ;;
  --next|-n)   show_next ;;
  --check|-c)
    [ -z "${2:-}" ] && { error "Usage: bash ralph.sh --check <story_id>"; exit 1; }
    check_story "$2"
    ;;
  --auto|-a)   run_all ;;
  *)           run_iteration ;;
esac
