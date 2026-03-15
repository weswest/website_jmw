# Blog Pipeline

Drafts are staged here before moving to `content/blog/` for publication.

## Workflow

1. **`in-progress/`** - Drafts being written or revised
2. **`ready-for-scheduling/`** - Polished, approved, ready to publish
3. **`content/blog/`** - Move here when ready to go live (with `draft: false` and `publishDate`)

## Naming Convention

`topic-slug.md` (e.g., `culture-turnaround-from-box-checking-to-strategic-powerhouse.md`)

## Draft Status Tags

Include at top of each draft:
- **Status:** Draft v1, Draft v2, Ready for review, Approved
- **LinkedIn ready:** Yes/No
- **Target length:** word count goal

## Moving to Production

When ready to publish:
1. Move from `ready-for-scheduling/` to `content/blog/`
2. Add Hugo front matter (title, date, tags, description)
3. Remove editorial notes section
4. Set `draft: false` and appropriate `publishDate`
