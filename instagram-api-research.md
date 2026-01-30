# Instagram API Research Findings

## Current Status (January 2026)

**Instagram Basic Display API**: DEPRECATED as of December 4, 2024. All requests now return errors.

## Available Options

### 1. Instagram API with Instagram Login (Requires Business/Creator Account)
- Allows access to Instagram Business and Creator account data
- Can get and publish media, manage comments, identify @mentions
- **Requirement**: Instagram Business or Creator Account
- Best for: Apps that need full API access

### 2. Instagram API with Facebook Login (Requires Business/Creator + Facebook Page)
- Similar to above but requires Facebook Page linkage
- Can get/publish media, manage comments, find hashtagged media
- **Requirement**: Instagram Business/Creator Account linked to Facebook Page

### 3. Instagram Messaging API via Messenger API
- For managing Instagram messages
- **Requirement**: Instagram Business/Creator Account linked to Facebook Page

### 4. Embedding (oEmbed)
- Simple embedding of individual Instagram posts
- No authentication required
- Public posts can be embedded directly
- Limited to individual post embeds, not full feed

## Recommendation for This Project

Given that we need to display a feed from @__benjaminthomas:

**Option A (Preferred)**: Use **oEmbed** for embedding individual posts
- No API authentication needed
- Simple implementation
- Works for public Instagram accounts
- Can manually curate which posts to display

**Option B (Alternative)**: Manual upload system
- Artist uploads artwork directly to the website
- Full control over presentation
- No dependency on Instagram API
- Can still link to Instagram profile

**Option C (Advanced)**: Instagram API with Business Login
- Requires the artist to have Instagram Business/Creator account
- Requires app review and approval from Meta
- More complex setup but automatic feed sync

## Implementation Decision

For MVP, we'll implement **Option A + Option B hybrid**:
1. Manual artwork upload system (primary gallery)
2. Optional Instagram embed section showing recent posts via oEmbed
3. Prominent Instagram link in social section

This gives full control while still showcasing Instagram presence.
