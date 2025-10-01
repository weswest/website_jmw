# _meta Directory

This directory contains project management content that is NOT part of the live Hugo site.

## Structure

### `/interviews`
- `questions/` - Interview question templates and prompts
- `transcripts/` - Raw interview transcripts (**gitignored** - contains sensitive info)

### `/book`
- Book outline, chapter ideas, and story catalog for future management book

### `/blog-pipeline`
- `ideas.md` - Blog post ideas and rough concepts
- `in-progress/` - Drafts currently being written
- `ready-for-scheduling/` - Polished drafts ready to move to content/blog/

### `/project-management`
- Project todos, status files, and working notes

## What Goes Here vs. Hugo Content

**_meta/** (this directory):
- Interview transcripts
- Book planning
- Blog ideas/drafts before they're ready
- Project management files
- Anything not meant for the live site

**content/blog/** (Hugo content):
- Blog posts ready to publish (even if `draft: true` or future `publishDate`)
- These will eventually be live on the site

## Privacy Note

`_meta/interviews/transcripts/` is gitignored because it may contain:
- Client names
- Sensitive work stories
- Unfiltered thoughts

Everything else in `_meta/` is committed to git for version control and AI assistance.
