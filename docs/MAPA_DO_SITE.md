# 📖 Technical Site Map
## TMGL - Traditional Medicine Global Library

**Version:** 1.0  
**Date:** 2024  
**Project:** Next.js Frontend

---

## 📋 Table of Contents

| Section | Page |
|---------|------|
| 🏠 [Main Pages](#-main-pages) | 2 |
| 📚 [Content Sections](#-content-sections) | 3 |
| 🌍 [Regional Routes](#-regional-routes) | 6 |
| 📄 [Detail Pages](#-detail-pages) | 7 |
| 🔧 [Utility Pages](#-utility-pages) | 8 |
| 🔌 [APIs](#-apis) | 9 |
| 🧭 [Navigation Structure](#-navigation-structure) | 10 |
| 🎨 [Main Components](#-main-components) | 11 |
| 🔍 [Common Filters](#-common-filters) | 12 |
| 📱 [Features](#-features) | 13 |
| 🗂️ [File Structure](#️-file-structure) | 14 |

---

<div style="page-break-after: always;"></div>

## 🏠 Main Pages

### Global Homepage

| Property | Value |
|----------|-------|
| **Route** | `/` |
| **File** | `src/pages/index.tsx` |
| **Type** | Main Page |

**Description:**  
Global homepage of TMGL with all main sections of the site.

**Main Components:**
- ✅ Hero slider with integrated search
- ✅ Traditional Medicine Dimensions section
- ✅ Thematic Pages
- ✅ Recent Literature Reviews (slider)
- ✅ Featured stories
- ✅ Events
- ✅ News from WHO
- ✅ Newsletter subscription
- ✅ Videos/Multimedia

---

### Regional Homepage

| Property | Value |
|----------|-------|
| **Route** | `/[region]` |
| **File** | `src/pages/[region]/index.tsx` |
| **Type** | Regional Page |
| **Examples** | `/afro`, `/amro`, `/emro` |

**Description:**  
Customized homepage for each WHO region.

**Specific Features:**
- ✅ Regional hero slider
- ✅ Customized regional resources
- ✅ Regional Dimensions
- ✅ Collaboration Network
- ✅ Recent Literature Review
- ✅ Regional Featured stories
- ✅ Regional Events
- ✅ Regional News
- ✅ Newsletter

---

<div style="page-break-after: always;"></div>

## 📚 Content Sections

### 1. Dimensions

| Property | Value |
|----------|-------|
| **Listing** | `/dimensions` |
| **Listing File** | `src/pages/dimensions/index.tsx` |
| **Detail** | `/dimensions/[slug]` |
| **Detail File** | `src/pages/dimensions/[slug].tsx` |
| **Description** | Traditional Medicine Dimensions |

**Features:**
- Visualization of traditional medicine dimensions
- Detail pages for each dimension
- Integration with search system

---

### 2. News

| Property | Value |
|----------|-------|
| **Listing** | `/news` |
| **Listing File** | `src/pages/news/index.tsx` |
| **Detail** | `/news/[slug]` |
| **Detail File** | `src/pages/news/[slug].tsx` |
| **Filters** | `?country=`, `?region=`, `?thematicArea=` |
| **Description** | News from WHO GTMC |

**Features:**
- News listing with pagination
- Filters by country, region and thematic area
- Grid or list view
- Complete detail pages

---

### 3. Events

| Property | Value |
|----------|-------|
| **Listing** | `/events` |
| **Listing File** | `src/pages/events/index.tsx` |
| **Detail** | `/events/[slug]` |
| **Detail File** | `src/pages/events/[slug].tsx` |
| **Filters** | `?country=`, `?region=`, `?thematicArea=` |
| **Description** | Events related to Traditional Medicine |

**Features:**
- Events calendar
- Advanced filters
- Complete details for each event

---

### 4. Journals

| Property | Value |
|----------|-------|
| **Listing** | `/journals` |
| **Listing File** | `src/pages/journals/index.tsx` |
| **Detail** | `/journals/[id]` |
| **Detail File** | `src/pages/journals/[id].tsx` |
| **Filters** | `?country=`, `?region=`, `?thematicArea=` |
| **Description** | Scientific journals |

**Features:**
- Journals catalog
- Search and filters
- Detailed information for each journal

---

### 5. Multimedia

| Property | Value |
|----------|-------|
| **Listing** | `/multimedia` |
| **Listing File** | `src/pages/multimedia/index.tsx` |
| **Filters** | `?country=`, `?region=`, `?thematicArea=`, `?mediaType=` |
| **Description** | Multimedia content (videos, images, etc.) |

**Features:**
- Videos and images gallery
- Filters by media type
- Integrated video player

---

### 6. Featured stories

| Property | Value |
|----------|-------|
| **Listing** | `/featured-stories` |
| **Listing File** | `src/pages/featured-stories/index.tsx` |
| **Detail** | `/featured-stories/[slug]` |
| **Detail File** | `src/pages/featured-stories/[slug].tsx` |
| **Filters** | `?country=`, `?region=`, `?thematicArea=` |
| **Description** | Featured stories |

**Features:**
- Featured stories
- Visual narratives
- Social sharing

---

### 7. Recent Literature Reviews

| Property | Value |
|----------|-------|
| **Listing** | `/recent-literature-reviews` |
| **Listing File** | `src/pages/recent-literature-reviews/index.tsx` |
| **Detail** | `/recent-literature-reviews/[slug]` |
| **Detail File** | `src/pages/recent-literature-reviews/[slug].tsx` |
| **Filters** | `?filter=` |
| **Description** | Recent literature reviews |

**Features:**
- Systematic reviews
- Category filters
- Access to complete documents

---

### 8. Thematic Pages

| Property | Value |
|----------|-------|
| **Listing** | `/thematic-page` |
| **Listing File** | `src/pages/thematic-page/index.tsx` |
| **Detail** | `/thematic-page/[slug]` |
| **Detail File** | `src/pages/thematic-page/[slug]/index.tsx` |
| **Description** | Thematic pages on different topics |

**Features:**
- Dynamic thematic pages
- Rich and interactive content
- Hierarchical navigation

---

### 9. Databases and Repositories

| Property | Value |
|----------|-------|
| **Listing** | `/databases-and-repositories` |
| **Listing File** | `src/pages/databases-and-repositories/index.tsx` |
| **Filters** | `?country=`, `?region=`, `?thematicArea=` |
| **Description** | Databases and repositories |

**Features:**
- Databases catalog
- Links to external repositories
- Search and filters

---

### 10. Evidence Maps

| Property | Value |
|----------|-------|
| **Listing** | `/evidence-maps` |
| **Listing File** | `src/pages/evidence-maps/index.tsx` |
| **Detail** | `/evidence-maps/[id]` |
| **Detail File** | `src/pages/evidence-maps/[id].tsx` |
| **Filters** | `?country=`, `?region=`, `?thematicArea=` |
| **Description** | Evidence maps |

**Features:**
- Evidence maps visualization
- Interactivity
- Data export

---

### 11. Regulations and Policies

| Property | Value |
|----------|-------|
| **Listing** | `/regulations-and-policies` |
| **Listing File** | `src/pages/regulations-and-policies/index.tsx` |
| **Filters** | `?country=`, `?region=`, `?thematicArea=` |
| **Description** | Regulations and policies |

**Features:**
- Regulations database
- Filters by region/country
- Legal documents

---

### 12. Global Summit

| Property | Value |
|----------|-------|
| **Listing** | `/global-summit` |
| **Listing File** | `src/pages/global-summit/index.tsx` |
| **Filters** | `?country=`, `?region=`, `?thematicArea=` |
| **Description** | WHO TM Global Summit |

**Features:**
- Global Summit information
- Schedule and speakers
- Resources and materials

---

<div style="page-break-after: always;"></div>

## 🌍 Regional Routes

### Regional Homepage

| Property | Value |
|----------|-------|
| **Route** | `/[region]` |
| **Examples** | `/afro`, `/amro`, `/emro` |
| **File** | `src/pages/[region]/index.tsx` |

---

### Regional Content

| Property | Value |
|----------|-------|
| **Route** | `/[region]/content/[slug]` |
| **File** | `src/pages/[region]/content/[slug].tsx` |
| **Description** | Region-specific content pages |

---

### Regional Dimensions

| Property | Value |
|----------|-------|
| **Route** | `/[region]/dimensions/[slug]` |
| **File** | `src/pages/[region]/dimensions/[slug].tsx` |

---

### Regional Featured stories

| Property | Value |
|----------|-------|
| **Listing** | `/[region]/featured-stories` |
| **Listing File** | `src/pages/[region]/featured-stories/index.tsx` |
| **Detail** | `/[region]/featured-stories/[slug]` |
| **Detail File** | `src/pages/[region]/featured-stories/[slug].tsx` |

---

### Custom Regional Routes

| Property | Value |
|----------|-------|
| **Route** | `/[region]/[...customRoute]` |
| **File** | `src/pages/[region]/[...customRoute]/index.tsx` |
| **Description** | Dynamic routes that redirect to `/content/[slug]` |

---

### Country

| Property | Value |
|----------|-------|
| **Route** | `/[region]/[country]` |
| **File** | `src/pages/[region]/[country]/index.tsx` |
| **Description** | Homepage for a specific country |

---

### Country with Language

| Property | Value |
|----------|-------|
| **Route** | `/[region]/[country]/[lang]` |
| **File** | `src/pages/[region]/[country]/[lang]/index.tsx` |
| **Description** | Country page with specific language |

---

<div style="page-break-after: always;"></div>

## 📄 Detail Pages

### Content (Generic Content)

| Property | Value |
|----------|-------|
| **Route** | `/content/[slug]` |
| **File** | `src/pages/content/[slug].tsx` |
| **Description** | Dynamic content pages loaded from WordPress |

**Available Features:**
- ✅ Navigation breadcrumbs
- ✅ Social sharing
- ✅ Print function
- ✅ Related articles
- ✅ Multitabs (when available)

---

<div style="page-break-after: always;"></div>

## 🔧 Utility Pages

### Subscription

| Property | Value |
|----------|-------|
| **Route** | `/subscription` |
| **File** | `src/pages/subscription.tsx` |
| **Description** | Newsletter subscription confirmation page |

---

### 404 (Page Not Found)

| Property | Value |
|----------|-------|
| **Route** | `/404` |
| **File** | `src/pages/404.tsx` |
| **Description** | Custom 404 error page |

---

<div style="page-break-after: always;"></div>

## 🔌 APIs

All APIs are located in `src/pages/api/`:

| Endpoint | Description |
|----------|-------------|
| `/api/bibliographic` | Bibliographic search |
| `/api/check-thumbnails` | Thumbnail verification |
| `/api/direve` | Direve integration |
| `/api/evidencemaps` | Evidence maps |
| `/api/journals` | Journals |
| `/api/legislations` | Legislations |
| `/api/lis` | LIS (Library Information System) |
| `/api/multimedia` | Multimedia |
| `/api/pdf-image` | PDF image generation |
| `/api/proxy-pdf` | PDF proxy |
| `/api/rssfeed` | RSS feed |
| `/api/subscribe` | Newsletter subscription |
| `/api/video-thumbnail` | Video thumbnails |

---

<div style="page-break-after: always;"></div>

## 🧭 Navigation Structure

### Header

| Property | Value |
|----------|-------|
| **File** | `src/components/layout/header.tsx` |

**Components:**
- ✅ TMGL Logo
- ✅ Global Menu (About Us, User Support)
- ✅ Regional Menu (dynamic via API)
- ✅ Mega Menu (hierarchical navigation)
- ✅ Responsive Menu

---

### Footer

| Property | Value |
|----------|-------|
| **File** | `src/components/layout/footer.tsx` |

**Components:**
- ✅ Footer Left (left menu)
- ✅ Footer Center (center menu)
- ✅ Footer Right (right menu)
- ✅ Partner images
- ✅ Copyright and terms

---

### Menus (via API)

| Menu | Identifier |
|------|------------|
| **Global Menu** | `global-menu` |
| **Regional Menu** | `regional-menu` |
| **Footer Left** | `footer-left` |
| **Footer Center** | `footer-center` |
| **Footer Right** | `footer-right` |

---

<div style="page-break-after: always;"></div>

## 🎨 Main Components

### Homepage Sections

| Component | Description |
|-----------|-------------|
| `HeroSlider` | Main slider |
| `SearchForm` | Search form |
| `DimensionsSection` | Dimensions section |
| `NewsSection` | News section |
| `EventsSection` | Events section |
| `StoriesSection` | Stories section |
| `NewsletterSection` | Newsletter section |
| `TrendingSlider` | Trending topics slider |

---

### Feeds (Listings)

| Component | Description |
|-----------|-------------|
| `NewsFeed` | News feed |
| `EventsFeed` | Events feed |
| `JournalsFeed` | Journals feed |
| `MultimediaFeed` | Multimedia feed |
| `StoriesFeed` | Stories feed |
| `DimensionsFeed` | Dimensions feed |
| `ThematicPagesFeed` | Thematic pages feed |
| `DatabaseAndRepositoriesFeed` | Databases and repositories feed |
| `EvidenceMapsFeed` | Evidence maps feed |
| `RegulationsAndPolicesFeed` | Regulations feed |
| `GlobalSummitFeed` | Global Summit feed |

---

### Utilities

| Component | Description |
|-----------|-------------|
| `BreadCrumbs` | Structural navigation |
| `ShareModal` | Sharing modal |
| `GptWidget` | GPT widget |
| `PdfView` | PDF viewer |
| `Video` | Video player |

---

<div style="page-break-after: always;"></div>

## 🔍 Common Filters

Most listing pages support the following filters via query parameters:

| Filter | Description | Pages |
|--------|-------------|-------|
| `?country=` | Filter by country | All listings |
| `?region=` | Filter by region | All listings |
| `?thematicArea=` | Filter by thematic area | All listings |
| `?mediaType=` | Filter by media type | Multimedia only |
| `?filter=` | Generic filter | Recent Literature Reviews only |

---

<div style="page-break-after: always;"></div>

## 📱 Features

### Visualization

| Type | Description |
|------|-------------|
| **Grid View** | Grid view (default) |
| **List View** | List view |
| **Toggle** | Toggle between views available on most pages |

---

### Search

- ✅ Global search on homepage
- ✅ Advanced filters on listing pages
- ✅ Keyword search
- ✅ Combined filters

---

### Sharing

- ✅ Sharing modal on content pages
- ✅ Social links (Facebook, Twitter, LinkedIn, etc.)
- ✅ Email sharing
- ✅ Direct link to copy

---

### Responsiveness

- ✅ Responsive design for mobile, tablet and desktop
- ✅ Responsive menu with adaptive navigation
- ✅ Adaptive layouts
- ✅ Responsive images

---

## 🗂️ File Structure

```
src/pages/
├── index.tsx                          # Global homepage
├── 404.tsx                            # 404 page
├── subscription.tsx                   # Subscription page
├── content/
│   └── [slug].tsx                     # Dynamic content
├── dimensions/
│   ├── index.tsx                      # Dimensions list
│   └── [slug].tsx                     # Dimension detail
├── news/
│   ├── index.tsx                      # News list
│   └── [slug].tsx                     # News detail
├── events/
│   ├── index.tsx                      # Events list
│   └── [slug].tsx                     # Event detail
├── journals/
│   ├── index.tsx                      # Journals list
│   └── [id].tsx                       # Journal detail
├── multimedia/
│   └── index.tsx                      # Multimedia list
├── featured-stories/
│   ├── index.tsx                      # Stories list
│   └── [slug].tsx                     # Story detail
├── recent-literature-reviews/
│   ├── index.tsx                      # Reviews list
│   └── [slug].tsx                     # Review detail
├── thematic-page/
│   ├── index.tsx                      # Thematic pages list
│   └── [slug]/
│       └── index.tsx                  # Thematic page detail
├── databases-and-repositories/
│   └── index.tsx                      # Databases list
├── evidence-maps/
│   ├── index.tsx                      # Maps list
│   └── [id].tsx                       # Map detail
├── regulations-and-policies/
│   └── index.tsx                      # Regulations list
├── global-summit/
│   └── index.tsx                      # Global Summit
└── [region]/                          # Regional routes
    ├── index.tsx                      # Regional homepage
    ├── [...customRoute]/
    │   └── index.tsx                  # Custom routes
    ├── [country]/
    │   ├── index.tsx                  # Country homepage
    │   └── [lang]/
    │       └── index.tsx              # Country with language
    ├── content/
    │   └── [slug].tsx                 # Regional content
    ├── dimensions/
    │   └── [slug].tsx                 # Regional dimension
    └── featured-stories/
        ├── index.tsx                  # Regional stories
        └── [slug].tsx                 # Regional detail
```

---

## 📝 Important Notes

1. **Dynamic Routes:** Next.js uses file-based routing, so routes are defined by the folder structure.

2. **Regions:** Regions are configured dynamically via `globalConfig` and validated in the middleware.

3. **Content:** Content is loaded dynamically from WordPress via REST API.

4. **Filters:** Most listing pages support filters by country, region and thematic area.

5. **Breadcrumbs:** Structural navigation present on most pages.

6. **Layout:** All pages share the same layout (Header + Content + Footer) defined in `_app.tsx`.

---

**Last update:** Based on current code structure  
**Version:** 1.0
