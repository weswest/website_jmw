# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal resume/portfolio website built with Hugo static site generator, using the hugo-resume theme. The site is deployed on Netlify and showcases professional experience, publications, projects, and blog posts.

**Site URL**: https://loquacious-cocada-a527d9.netlify.app/
**Theme**: hugo-resume (from https://github.com/eddiewebb/hugo-resume)

## Development Commands

### Local Development
```bash
# Start development server (accessible at http://localhost:1313)
hugo server

# Start server with drafts visible
hugo server -D

# Build site for production
hugo

# Check Hugo version
hugo version
```

### Content Creation
```bash
# Create new blog post
hugo new blog/post-name.md

# Create new project (creation - original work)
hugo new projects/creations/project-name.md

# Create new project (contribution - collaborative work)
hugo new projects/contributions/project-name.md

# Create new publication
hugo new publications/publication-name.md
```

## Architecture

### Content Organization

The site uses a hybrid content model combining markdown files and JSON data files:

**Markdown Content** (`content/`):
- `_index.md` - Homepage bio/summary with front matter controlling site outputs
- `blog/` - Blog posts and thoughts
- `projects/creations/` - Original projects (indicates originator role)
- `projects/contributions/` - Collaborative projects (indicates collaborator role)
- `publications/` - Papers, speaking engagements, articles

**JSON Data Files** (`data/`):
- `experience.json` - Work history with role, company, summary, date range
- `education.json` - Educational background
- `skills.json` - Technical skills
- `certifications.json` - Professional certifications

### Configuration

**Site Configuration** (`config.toml`):
- Personal information (name, email, address, profile image)
- Social media handles (LinkedIn, GitHub)
- Section visibility controls via `params.sections` array
- Current sections: `["publications","creations","experience","education","blog"]`
- Google Analytics configuration
- QR code toggle (`showQr` currently disabled due to error)

### Theme Structure

The site uses the hugo-resume theme as a git submodule in `themes/hugo-resume/`. The theme provides:
- Single-page layout with auto-scrolling navigation
- Dedicated detail pages for projects/publications
- Client-side search powered by fuse.js at `/search`
- Netlify CMS integration at `/admin` endpoint

### Static Assets

- `static/img/` - Images including profile photo (Headshot.jpg)
- `static/admin/` - Netlify CMS configuration (`config.yml`)
- `static/favicon.ico` - Site favicon

### Theme Archetypes

Available archetypes in `themes/hugo-resume/archetypes/`:
- `blog-post` - Blog post template
- `projects.md` - Project template
- `publications.md` - Publication template

### Content Front Matter

Projects and publications require these fields:
- `title`, `date`, `featured`, `link`, `image`, `description`
- `tags` (optional), `fact` (optional fun stat)
- `weight` (lower = more visibility)
- `sitemap.weight` (SEO priority)

## Deployment

Site is configured for Netlify deployment. The main branch is `main`. The GitHub repository is at `weswest/website_jmw`.

## Netlify CMS

The site includes a working Netlify CMS integration providing a WYSIWYG editor for content management without direct file editing. Access at `/admin` when deployed. The CMS configuration is in `static/admin/config.yml` and supports editing:
- Blog posts
- Projects (creations and contributions)
- Publications
- Site settings (config.toml)

## Project Management

**Outstanding work:** https://github.com/weswest/website_jmw/issues

```bash
gh issue list                      # View all open issues
gh issue list --label content      # Filter by label
gh issue view <number>             # View details
gh issue close <number>            # Close when done
```

**Long-term vision:** This site has two purposes:
1. Professional portfolio (resume, publications, projects)
2. Content pipeline for a management book - interview transcripts become blog posts become book chapters

**Key resources in `_meta/`:**
- `_meta/README.md` - Project overview and vision
- `_meta/interviews/questions/` - Interview questions with Q1-Q3 already answered
- `_meta/project-management/` - Historical session notes

## Important Notes

- Hugo version in use: v0.111.3
- Theme is a git submodule - be careful when updating
- `showQr` parameter currently disabled due to rendering error
- Site uses JSON output format for search functionality
- No tests or linting configured in this repository
