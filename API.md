# API & Integration Specification (API.md)

# 🌙 Lumo's Dream Delivery Service
**Document Version:** 1.0.0  
**Status:** Approved for Implementation / API Source of Truth  
**Target Delivery Platform:** Modern Web (Desktop & Mobile Responsive, Zero-Build Static with Edge API Extensions)  
**Author:** Senior Backend Architect & API Integration Engineer  

---

## 1. Overview & API Design Principles

The API layer for **Lumo's Dream Delivery Service** governs how the web application communicates internally between its modular client subsystems and externally with edge services, databases, and third-party networks.

### 1.1 Core API Principles
1. **Zero Secret Exposure Client-Side:** No API keys, database credentials, or secret salts are ever bundled into client JavaScript.
2. **Defensive Graceful Degradation:** All remote API calls are treated as optional enhancements. If an edge endpoint returns `5xx`, times out, or the client is offline, the application seamlessly falls back to `localStorage` without blocking the user journey.
3. **Privacy-First Anonymization:** Endpoints never persist raw IP addresses, user identifiers, or tracking cookies. Rate limiting uses one-way salted SHA-256 hashes computed exclusively in edge memory.
4. **Predictable JSON Envelopes:** All responses adhere to a uniform payload contract with standard HTTP status codes.

---

## 2. API Conventions & Standard Response Envelopes

### 2.1 Base URLs
* **Production Base URL:** `https://lumo-dreams.edge/api/v1`
* **Local Development Base URL:** `http://localhost:8080/api/v1`

### 2.2 Success Response Envelope (HTTP 200 / 201)
```json
{
  "success": true,
  "data": {},
  "meta": {
    "timestamp": 1729267200000,
    "requestId": "req_starlight_01j8x..."
  }
}
```

### 2.3 Error Response Envelope (HTTP 4xx / 5xx)
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Patience, sleepy friend! Please wait a moment before sending another dream wish.",
    "details": []
  },
  "meta": {
    "timestamp": 1729267200000,
    "requestId": "req_starlight_01j8x..."
  }
}
```

---

## 3. REST API Endpoint Specifications

### 3.1 Guestbook Subsystem

#### 3.1.1 Fetch Published Wishes (`GET /guestbook`)
Retrieves a paginated list of approved community bedtime wishes.

* **Method:** `GET`
* **Authentication:** None (Public)
* **Query Parameters:**
  * `limit` *(integer, optional, default: 20, max: 50)*: Number of entries to retrieve.
  * `cursor` *(string, optional)*: ISO timestamp or ULID cursor for backwards pagination.
* **Request Headers:**
  * `Accept: application/json`
* **Response (HTTP 200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "e6f42c12-38b7-4b10-8bfa-79f97945d8b1",
      "authorName": "Star-Gazer Maya",
      "wishText": "May tonight bring deep rest to all restless thinkers. ✨",
      "badgeColor": "yellow",
      "createdAt": 1729263600000
    },
    {
      "id": "9bc31a22-21a4-4f93-b682-1201dc65fa09",
      "authorName": "Grandma Nora",
      "wishText": "Soft blankets and sweet warm dreams to my little ones. 💛",
      "badgeColor": "pink",
      "createdAt": 1729260000000
    }
  ],
  "meta": {
    "count": 2,
    "hasMore": true,
    "nextCursor": "1729260000000"
  }
}
```

---

#### 3.1.2 Submit Bedtime Wish (`POST /guestbook`)
Pins a new validated bedtime wish to the community cloud board.

* **Method:** `POST`
* **Authentication:** None (Public; protected by Edge Rate Limiting)
* **Request Headers:**
  * `Content-Type: application/json`
* **Request Body:**
```json
{
  "authorName": "Sleepy Traveler",
  "wishText": "Hoping the gentle rain brings sweet dreams to everyone tonight. 🌧️✨",
  "badgeColor": "mint"
}
```
* **Validation Rules:**
  * `authorName`: String, trimmed, 1–30 characters, HTML tags stripped.
  * `wishText`: String, trimmed, 1–140 characters, HTML tags stripped, profanity filtered.
  * `badgeColor`: Enum (`yellow` | `pink` | `mint` | `peach`).
* **Response (HTTP 201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    "authorName": "Sleepy Traveler",
    "wishText": "Hoping the gentle rain brings sweet dreams to everyone tonight. 🌧️✨",
    "badgeColor": "mint",
    "status": "published",
    "createdAt": 1729267205000
  }
}
```
* **Error Responses:**
  * `422 Unprocessable Entity`: Input validation failure (e.g. empty wish or name > 30 chars).
  * `429 Too Many Requests`: Submissions made faster than 1 per 4 seconds.

---

#### 3.1.3 Moderate Bedtime Wish (`PATCH /guestbook/:id`)
Enables administrative moderation to hide or archive flagged entries.

* **Method:** `PATCH`
* **Authentication:** Bearer Token (`Authorization: Bearer <ADMIN_SECRET_KEY>`)
* **Request Body:**
```json
{
  "status": "archived"
}
```
* **Response (HTTP 200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    "status": "archived"
  }
}
```

---

### 3.2 Delivery Metrics & Odometer Subsystem

#### 3.2.1 Get Worldwide Delivery Count (`GET /metrics`)
Fetches the synchronized rolling delivery count for the mechanical counter and marquee.

* **Method:** `GET`
* **Authentication:** None (Public)
* **Response (HTTP 200 OK):**
```json
{
  "success": true,
  "data": {
    "totalDelivered": 1205,
    "totalOrigamiPacked": 87,
    "totalRouteCompletions": 143,
    "updatedAt": 1729267200000
  }
}
```

---

#### 3.2.2 Atomically Increment Delivery Count (`POST /metrics/increment`)
Increments the global delivery odometer following user journey milestones.

* **Method:** `POST`
* **Authentication:** None (Public; tokenless client rate limit)
* **Request Body:**
```json
{
  "action": "route_completion"
}
```
* **Allowed Actions:** `session_visit` | `route_completion` | `origami_pack` | `parcel_ship`
* **Response (HTTP 200 OK):**
```json
{
  "success": true,
  "data": {
    "totalDelivered": 1206,
    "action": "route_completion"
  }
}
```

---

### 3.3 Custom Dream Keepsakes Subsystem

#### 3.3.1 Generate & Save Folded Dream Card (`POST /dreams`)
Saves a generated origami dream keepsake for cross-device bookmarking or URL sharing.

* **Method:** `POST`
* **Request Body:**
```json
{
  "recipientName": "Leo",
  "vesselType": "paper_boat",
  "destinationTown": "Sunrise Cove",
  "blessingText": "May your evening drift on sweet marshmallow clouds and starry breezes."
}
```
* **Response (HTTP 201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "drm_78910abc",
    "shareableUrl": "https://lumo-dreams.edge/#dream=drm_78910abc",
    "waxSeal": "gold_crescent"
  }
}
```

---

### 3.4 System Health & Diagnostics (`GET /health`)
Lightweight health probe utilized by CDN edge runners and uptime monitors.

* **Method:** `GET`
* **Response (HTTP 200 OK):**
```json
{
  "status": "healthy",
  "service": "lumo-edge-api",
  "uptimeSeconds": 86420
}
```

---

## 4. Rate Limiting Architecture

Edge rate limiting protects serverless resources against abusive traffic spikes and automated spam:

| Endpoint | Method | Rate Limit Window | Max Requests | Enforcement Strategy |
| :--- | :--- | :--- | :--- | :--- |
| `/guestbook` | `POST` | **4 Seconds** | **1 Request** | Salted IP Hash Sliding Window |
| `/guestbook` | `GET` | **1 Minute** | **60 Requests** | Anycast Edge CDN Cache |
| `/metrics/increment` | `POST` | **1 Minute** | **10 Requests** | Salted IP Hash Counter |
| `/dreams` | `POST` | **1 Minute** | **5 Requests** | IP Hash Burst Throttle |

### Standard Rate Limit Response Headers
```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: 4
X-RateLimit-Limit: 1
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1729267204
```

---

## 5. External APIs & Third-Party Integrations

```mermaid
flowchart LR
    A[Client Browser] -->|HTML/CSS/JS| B[Global Edge CDN]
    A -->|WOFF2 Web Fonts| C[Google Fonts API]
    A -->|GSAP Animation CDN| D[Cloudflare CDNJS]
    A -->|Procedural Synthesis| E[W3C Web Audio API]
    A -->|One-Click Share| F[Navigator Clipboard API]
    B -->|REST Sync Optional| G[Edge Serverless Workers]
    G -->|SQL Queries| H[(Cloudflare D1 / PostgreSQL)]
```

### 5.1 W3C Web Audio API (Native Client Engine)
* **Purpose:** Real-time synthesis of lullaby chimes, tickle laughs, piano notes, and wind chimes.
* **Integration Spec:** Instantiated via `new (window.AudioContext || window.webkitAudioContext)()`. Starts suspended until first user gesture (`click`, `touchstart`, `keydown`). Zero external audio bandwidth required.

### 5.2 Google Fonts API
* **Host:** `fonts.googleapis.com` & `fonts.gstatic.com`
* **Fonts Loaded:** *Fredoka* (weights 500, 600, 700), *Nunito* (weights 400, 600, 700), *VT323* (weight 400).
* **Delivery:** `display=swap` parameter ensures zero Flash of Invisible Text (FOIT).

### 5.3 GreenSock GSAP CDN (Cloudflare CDNJS)
* **Host:** `cdnjs.cloudflare.com`
* **Assets:** `gsap/3.12.5/gsap.min.js` and `gsap/3.12.5/ScrollTrigger.min.js`.
* **Security:** Sub-resource Integrity (SRI) hashes prevent script tampering.

### 5.4 Retro Webring Link Exchange Protocol
* **Standard:** Standard HTML anchor tags linking to certified friendly indie bedtimes sites with bidirectional webring badge navigation (`[< Back] [Random] [Next >]`).

---

## 6. Webhooks & CI/CD Deployment Verification

Continuous deployment is triggered via secure git webhooks:

### 6.1 GitHub to Edge Hosting Webhook (`POST /webhooks/deploy`)
* **Trigger:** Push to `main` branch.
* **Payload Verification:** HMAC-SHA256 signature in `X-Hub-Signature-256`.
* **Verification Algorithm:**
```
computedSignature = "sha256=" + HMAC_SHA256(rawRequestBody, WEBHOOK_SECRET)
assert(timingSafeEqual(computedSignature, headerSignature))
```
* **Actions Executed:**
  1. Validates HTML5 and CSS syntax.
  2. Runs headless browser assertions at 390px and 1280px.
  3. Deploys static files to worldwide edge nodes with zero downtime.

---

## 7. Environment Variables & Secret Management

All environment variables are strictly segregated:

### 7.1 Server / Edge Runtime Variables (Never Exposed to Client)
```env
# Edge Database Configuration
DATABASE_URL=postgresql://lumo_user:secret_pass@db.edge.internal:5432/lumo_production
CLOUDFLARE_D1_BINDING=DB

# Cryptographic Salt for Privacy-Safe IP Hashing
IP_HASH_SALT=c8f49e0b231d77a834b69d1204e5781a93b4f6208a1c

# Administrative Content Moderation Secret
ADMIN_SECRET_KEY=starlight_sec_8849204184910248

# Webhook Verification Secret
WEBHOOK_SECRET=whsec_starlight_deploy_key_991823
```

### 7.2 Client-Side Environment
* **Variables:** Zero (`0`). The client bundle is 100% static and requires zero build-time environment injection, preventing secret leak risks entirely.

---

## 8. Data Privacy, Safety & Failure Handling

### 8.1 Data Sanitization & Moderation Pipeline
Every incoming wish submitted to `POST /guestbook` traverses a 3-stage validation pipeline:
1. **HTML Stripping:** Replaces `<`, `>`, `&`, `"`, `'`, `/`, `\` with escaped equivalents to neutralize XSS attacks.
2. **Length Enforcement:** Strict checks ensure `authorName` ≤ 30 characters and `wishText` ≤ 140 characters.
3. **Wholesome Filter:** A regex engine identifies hostile or non-cozy vocabulary and converts them into soft emojis (`💛✨`) rather than discarding the entry with a harsh error screen.

### 8.2 Client Failure Handling & Circuit Breaker Pattern
```
             [Client Action: Submit Wish]
                          │
                          ▼
             [Attempt Edge API Request]
                          │
            ┌─────────────┴─────────────┐
            ▼                           ▼
      [HTTP 200/201]             [Network Error / 5xx]
            │                           │
            ▼                           ▼
    [Persist in Cloud]          [Fallback to LocalStorage]
            │                           │
            └─────────────┬─────────────┘
                          ▼
            [Render Sticky Note in DOM]
            [Play Procedural Sound Chime]
            [Display Wholesome Success Toast]
```
* **Zero Disruption Guarantee:** If the remote API is completely unreachable, the user's wish is immediately stored in `localStorage` and pinned to their screen. The user experience is 100% uninterrupted.

---

*End of API & Integration Specification (API.md)*
