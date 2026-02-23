# Webelong Post System Structural Audit

## Primary Objective
Discover, document, and map all post types, states, rendering paths, business logic, and user interaction flows within the Webelong ecosystem.

---

## SECTION 1: IDENTIFY ALL POST TYPES

In Webelong, there is no single generic "Post" table. Instead, posts are strictly segregated by interaction domains and intent, utilizing distinct MongoDB schema models spread across specialized microservices.

### 1. Holding Space Post (Internally: `Share`)
- **Type Name**: Share
- **Database Table/Collection**: `shares` (MongoDB `Share` model, managed by `holding-space-service`)
- **Frontend Type**: `ShareDTO` (residing in `packages/types/src/index.ts`)
- **Rendering Component**: `FeedPostCard.tsx` (in `apps/frontend/src/components/home/`)
- **Creation Component**: `CheckInComposer.tsx`

### 2. Sanctuary Post (Internally: `Vent`)
- **Type Name**: Vent
- **Database Table/Collection**: `vents` (MongoDB `Vent` model, managed by `chat-service`)
- **Frontend Type**: `Vent` (interface defined directly in `apps/frontend/src/components/sanctuary/vent-card.tsx`)
- **Rendering Component**: `vent-card.tsx`
- **Creation Component**: `create-vent.tsx`

### 3. Reply / Comment
- **Type Name**: Comment
- **Database Table/Collection**: `comments` (MongoDB `Comment` model, tied to `Share`)
- **Frontend Type**: `CommentDTO`
- **Rendering Component**: `CommentSection.tsx`

### 4. Other Entities (Verification Check)
- **Circle Post**: Not a discrete post type. Circles appear to be managed as real-time messaging entities via `Conversation` and `Message` models in the `chat-service`.
- **System Post, Onboarding Post, Verification Post, Draft Post**: These do not exist as distinct database models or dedicated TypeScript interfaces in the core system. If they exist UI-side, they are specialized variants of `Message` or hardcoded informational banners, failing to map to a true DB post schema. "Drafts" are locally managed component state, with no backend schema.

---

## SECTION 2: IDENTIFY ALL POST VISIBILITY STATES

### 1. `Share` States (Holding Space)
- **Visibility Toggle**: Controlled by the `visibility` enum field (`'public'` | `'followers'`).
- **Anonymity**: Controlled by `anonymous: boolean` flag or by setting `authorId` to `'anonymous'`.
- **Ghost/Limited Mode**: Controlled by `isShadowLimited: boolean` (a platform-level moderation flag restricting reach without notifying the author).
- **Edited**: No dedicated "edited" timeline array, but `updatedAt` tracks modifications.
- **Sensitive (Hidden behind Reveal)**: Post is wrapped in `<SensitivityBlurWrapper>` if `sensitivityTags` array contains content warnings.

### 2. `Vent` States (Sanctuary)
- **Ghost/Anonymous**: Vents are inherently 100% anonymous. The `author` block consists of strictly non-identifying data (`pseudonym` and `color`).
- **Deleted/Expired**: Vents contain an `expiresAt` `Date` field mapped to a MongoDB TTL index causing automatic deletion after 24 hours.

---

## SECTION 3: IDENTIFY POST CONTENT STRUCTURE

### `Share` Schema (Holding Space)
- `id` / `_id`: ObjectId
- `authorId`: String (required).
- `content`: String (min: 1, max: 2000 chars).
- `visibility`: Enum ('public', 'followers').
- `anonymous`: Boolean (default: false).
- `commentsEnabled`: Boolean (default: true).
- `sensitivityTags`: Array of strings [].
- `isShadowLimited`: Boolean (default: false).
- `createdAt` / `updatedAt`: Dates.

### `Vent` Schema (Sanctuary)
- `id` / `_id`: ObjectId
- `author`: JSON Object `{ id: String, pseudonym: String, color: String }`.
- `content`: String (max: 280 chars).
- `mood`: String (Optional).
- `expiresAt`: Date (triggers TTL index).
- `reactions`: Array `{ userId: string, type: Enum['SUPPORT', 'HUG', 'SAME', 'LISTEN'] }`.
- `createdAt`: Date. (No `updatedAt` — Vents are immutable).

### `Comment` Schema
- `shareId`: ObjectId (parent reference).
- `authorId`: String.
- `content`: String (max: 500 chars).
- `anonymous`: Boolean.
- `isShadowLimited`: Boolean.
- `createdAt` / `updatedAt`: Dates.

---

## SECTION 4: TRACE POST CREATION FLOW

### Holding Space (`Share`) Flow
1. **Frontend**: User initiates creation in `CheckInComposer.tsx`.
2. **Form / Payload**: Constructs `CreateShareInput` (content, visibility, anonymous toggle, sensitivityTags).
3. **API Logic**: Request maps to the `holding-space-service`.
4. **Backend**: Instantiates a new MongoDB document via `ShareModel.create()`.
5. **UI Update**: `CheckInComposer` finishes loading, typically invalidates feed cache to pull new `ShareDTO`s.

### Sanctuary (`Vent`) Flow
1. **Frontend**: User initiates passing thoughts in `create-vent.tsx`.
2. **Setup Check**: Fail-open design allows viewing, but requires anonymous profile configuration before posting (pseudonym + color mapping).
3. **API Logic**: Routes to `chat-service` (which handles Vents).
4. **Backend/DB**: Creates a `Vent` document with an automatic `expiresAt` set (+24hrs).

---

## SECTION 5: TRACE POST RENDERING FLOW

### Holding Space Feed
1. **Container**: `Feed.tsx` (or similar feed loop mapped from global data).
2. **Component**: `FeedPostCard.tsx` accepts `share: ShareDTO`.
3. **Subcomponents**: Sub-renders `ProfileAvatar` OR `AnonymousAvatar` based on the anonymity flag. Evaluates `SensitivityBlurWrapper`. Renders text. Optionally mounts `CommentSection` upon click.

### Sanctuary Feed
1. **Container**: `/app/(app)/sanctuary/feed/page.tsx` fetches list of `Vent` objects.
2. **Component**: `vent-card.tsx`.
3. **Subcomponents**: Derives `AnonymousAvatar` purely via `avatarSeed` logic mapped to the Vent's generated `author.color` and `author.pseudonym` initials. Renders specific emoji reaction triggers.

---

## SECTION 6: TRACE POST INTERACTION SYSTEM

### 1. Resonate (Support)
- **Holding Space**: Click the `Heart` icon -> triggers `toggleSupport(shareId, SupportType.HEARD)` -> records `SupportDTO` linking `userId` to `shareId` -> UI toggles local `hasResonated` state.
- **Sanctuary**: Clicks on explicit Emoji (`SUPPORT`, `HUG`, `SAME`) -> executes `onReact` updating the immutable Vent's internal `reactions` array exception.

### 2. Reply (Comment)
- Only available on `Shares` (Holding Space). `FeedPostCard.tsx`'s `MessageCircle` uncollapses `<CommentSection shareId={share.id} />`.

### 3. Share
- Triggers Web Share API `navigator.share()` for mobile routing, or fallbacks to `navigator.clipboard.writeText(url)` on desktop formatting a static Permalink.

### 4. Edit / Delete
- Checked via `const isAuthor = !!share.isOwner;`.
- Reveals the `MoreVertical` dropdown icon.
- `Edit`: Replaces content block with `<Textarea>` locally, fires `onUpdate`, syncs back.
- `Delete`: Triggers a full `<AlertTriangle>` destructive confirmation card sequence mapping back through DB delete hook.

---

## SECTION 7: IDENTIFY ALL POST UI VARIANTS

1. **Named Standard Feed Post**: Renders `ProfileAvatar` with real Account displayName. Interactivity fully enabled (Resonate, Comment, Share).
2. **Anonymous Feed Post**: `ProfileAvatar` is swapped for `AnonymousAvatar` utilizing an ID-based hex seed so rendering is visually randomized but consistent. Name replaced fully with `'Anonymous'`.
3. **Sensitive Content Post**: Wrapped recursively in `SensitivityBlurWrapper`. Replaces content with interactive blur stating the derived tag warnings (e.g. "Trigger Warning"). User manually clicks to reveal the inner text elements.
4. **Author's Own Post**: Renders Edit/Delete Kebab menu.
5. **Sanctuary Vent Card**: A distinct visual treatment (gray bounds, smaller footprints, distinct timestamps "X hrs ago", footer locked to only emojis & flagging icon). No concept of Profile avatars.

---

## SECTION 8: IDENTIFY BUSINESS RULES

1. **Metrics Prohibition**: Emotional safety is Webelong's core architectural principle. Schema files declare `STRICTLY NO: likeCount, commentCount, viewCount, engagementScore`. The system fundamentally prohibits quantifiable feedback.
2. **Sanctuary Immutability**: `Vents` are heavily time-restricted (TTL index enforced `expiresAt`) and inherently immutable (`updatedAt: false`).
3. **Shadow Limiting Control**: Webelong admins utilize `isShadowLimited` across `Share` and `Comment` to silently restrict abusive actor projection scopes without triggering aggressive user retaliation workflows.
4. **Complete Separation of Identity**: Holding space anonymity uses dynamic frontend swaps (`Anonymous`), while Sanctuary completely overwrites user records into abstract models (`pseudonym`, `color`). 

---

## SECTION 9: IDENTIFY PERFORMANCE AND STATE MODEL

1. **Optimistic UI Constraints**: Complex state (Heart toggle, Copy URL feedbacks, comment inputs) uses localized React hooks (`hasResonated`, `isEditing`) immediately reflecting the request state while the asynchronous backend request operates silently behind `isSaving` limits protecting sequential abuse.
2. **Pagination Strategy**: Handled via sparse MongoDB Indexes (e.g., `MessageSchema.index({ conversationId: 1, createdAt: -1 })`) maximizing fast sequential loading in virtualized lists.
3. **Server-Side De-duping / Muting**: Tag-based hiding intersects with user configurations, mapping `ShareDTO.sensitivityTags` directly against user parameters locally offloading query logic.

---

## FINAL SUMMARY
The term "Post" at Webelong is a contextual concept. Within public discourse (Holding Space), it is dynamically managed as an interactive `Share` focusing on measured connectivity. Within emotional safety (Sanctuary), it transforms into an ephemeral `Vent`, enforcing immutable, anonymous, and unquantified behavior structurally guaranteed by the database schemas itself.
