# _meta Directory

This directory contains project management content that is NOT part of the live Hugo site.

**GitHub Issues are the source of truth for outstanding work:** https://github.com/weswest/website_jmw/issues

---

## Project Vision

This website serves two purposes:
1. **Professional portfolio** - Resume, publications, projects showcasing analytics leadership experience
2. **Long-term content pipeline** - Management blog series that will eventually become a book

### The Book Pipeline
Interview transcripts → Blog posts → Book chapters

The goal is to record answers to targeted questions (15-30 min each), transform them into polished blog posts, and over 12-24 months accumulate enough material for a management book tentatively titled *"Leading Through Analytics: Lessons from 15 Years in Banking"*.

---

## Directory Structure

### `/interviews`
- `questions/interview-questions.md` - 10 interview questions with recording tips
- `transcripts/` - Raw voice-to-text transcripts (**gitignored** - contains names/sensitive info)

**Status:** Q1-Q3 answered (Model Factory, Huntington turnaround, Negative rates project). Q4-Q10 pending.

### `/book` *(create when ready)*
- Book outline, chapter ideas, and story catalog
- Maps blog posts to book chapters

### `/blog-pipeline` *(create when ready)*
- `ideas.md` - Blog post ideas and rough concepts
- `in-progress/` - Drafts currently being written
- `ready-for-scheduling/` - Polished drafts ready to move to content/blog/

### `/project-management`
- `status-2025-10-01.md` - Historical session notes from October 2025

---

## What Goes Here vs. Hugo Content

| Location | Purpose |
|----------|---------|
| `_meta/interviews/` | Raw transcripts, question templates |
| `_meta/project-management/` | Session notes, historical context |
| `content/blog/` | Published or draft blog posts (even with `draft: true`) |
| `content/publications/` | Finished publication entries |
| `content/projects/` | Project showcase entries |

---

## Privacy Note

`_meta/interviews/transcripts/` is gitignored because it may contain:
- Client names
- Sensitive work stories
- Unfiltered thoughts

Everything else in `_meta/` is committed to git for version control and AI assistance.

---

## Quick Reference

```bash
# View outstanding work
gh issue list

# View specific issue
gh issue view <number>

# Start local dev server
hugo server

# Build site
hugo
```
