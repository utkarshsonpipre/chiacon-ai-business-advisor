# Chiacon - AI Consulting Prototype

A production-quality prototype for **Chiacon**, an AI consulting company, built with a modern full-stack architecture. The site includes a professional landing page and a working AI feature: an **AI Use Case Generator** that turns business problems into actionable AI opportunities.

## 1) Project Overview

Chiacon helps organizations identify and implement practical AI solutions. This prototype demonstrates:

- A polished, responsive SaaS-style marketing page
- Clear messaging around Chiacon's AI consulting capabilities
- A live AI demo where users enter a business challenge and receive structured recommendations
- End-to-end architecture with typed frontend/backend contracts and robust validation

### Core Value Demonstrated

Given an input like:

> "Retail company struggling with inventory forecasting"

The application returns structured output:

- **Problem Summary**
- **AI Opportunities** (2-3 bullets)
- **Expected Business Impact**

---

## 2) Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI System:** shadcn-style reusable components (`button`, `card`, `input`)
- **Backend:** Node.js runtime API route (`app/api/...`)
- **AI:** Groq API
- **Validation:** Zod (client and server input/output validation)

---

## 3) Architecture

### High-Level

- **Frontend (App Router pages + components):**
  - Renders landing page sections (Hero, About AI, Use Cases, Demo)
  - Captures user business problem input
  - Calls backend endpoint and renders AI result

- **Backend API Route (`/api/generate-usecase`):**
  - Validates input with Zod
  - Sends engineered prompt to Groq
  - Enforces structured JSON output
  - Validates AI response shape with Zod
  - Returns clean typed payload to frontend

- **Shared Layer (`/lib`, `/api`):**
  - Shared TypeScript types
  - Input/response validation schemas
  - Prompt construction utilities

### Key Reliability Decisions

1. **Schema-first contracts** via `zod` on both request and model response
2. **Prompt constraints** requiring strict JSON shape
3. **Graceful error handling** for payload, model, parsing, and runtime errors
4. **Node.js runtime pinning** for predictable Groq SDK behavior on Vercel

---

## 4) Project Structure

```text
chiacon/
├─ app/
│  ├─ api/
│  │  └─ generate-usecase/
│  │     └─ route.ts
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ components/
│  ├─ ui/
│  │  ├─ button.tsx
│  │  ├─ card.tsx
│  │  ├─ input.tsx
│  │  └─ spinner.tsx
│  ├─ ai-generator.tsx
│  ├─ ai-result-card.tsx
│  ├─ section-header.tsx
│  └─ use-case-card.tsx
├─ lib/
│  ├─ types.ts
│  ├─ utils.ts
│  └─ validation.ts
├─ api/
│  └─ prompt.ts
├─ styles/
│  └─ animations.css
├─ .env.example
├─ package.json
├─ tailwind.config.ts
└─ README.md
```

---

## 5) Frontend Flow

1. User opens landing page (`app/page.tsx`)
2. User reads company sections:
   - Hero
   - About AI
   - AI Use Cases
3. In **AI Demo**, user enters a business problem
4. User clicks **Generate AI Opportunities**
5. Frontend performs client-side validation:
   - Minimum 20 chars
   - Maximum 600 chars
6. UI enters loading state (spinner + disabled controls)
7. `POST /api/generate-usecase` request is sent
8. On success, structured result card is displayed
9. On failure, user sees clear error message

---

## 6) Backend Flow

Endpoint: `POST /api/generate-usecase`

1. Validate environment (`GROQ_API_KEY` exists)
2. Parse JSON request body
3. Validate request with `generateUseCaseRequestSchema`
4. Build AI messages using:
   - `SYSTEM_PROMPT`
   - `buildUserPrompt(businessProblem)`
5. Call Groq Chat Completions API
6. Parse returned content as JSON
7. Validate with `useCaseInsightSchema`
8. Return `{ data: ... }` to client

Error paths handled:

- Missing API key
- Invalid JSON payload
- Invalid user input
- Empty model response
- Invalid JSON from model
- Response schema mismatch
- Upstream/model exceptions

---

## 7) AI Prompt Design

Prompt engineering is centralized in `api/prompt.ts`.

### Design Goals

- Guarantee predictable structure for UI rendering
- Minimize hallucinated fields
- Keep output concise and business-relevant

### Strategy

- **System prompt** defines exact JSON schema and strict rules:
  - no markdown
  - no extra keys
  - 2-3 actionable AI opportunities
- **User prompt** injects business context cleanly
- Groq call uses `response_format: { type: "json_object" }`
- Final response is schema-validated with Zod

This layered approach (prompt + JSON response mime type + schema validation) improves reliability for production prototypes.

---

## 8) Setup & Installation

### Prerequisites

- Node.js 18.18+ (recommended: 20+)
- npm 9+
- Groq API key

### Install

```bash
npm install
```

### Environment Variables

Copy and edit:

```bash
cp .env.example .env.local
```

Set:

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-8b-instant
```

### Run Development Server

```bash
npm run dev
```

Open `http://localhost:3000`.

### Production Build

```bash
npm run build
npm run start
```

---

## 9) Deployment on Vercel

### Option A: Git-based Deployment (Recommended)

1. Push repository to GitHub
2. Import project in Vercel
3. Configure environment variables in Vercel:
  - `GROQ_API_KEY`
  - `GROQ_MODEL` (optional, defaults to `llama-3.1-8b-instant`)
4. Deploy

### Option B: Vercel CLI

```bash
npm i -g vercel
vercel
```

Then add environment variables in Vercel dashboard or via CLI.

### Vercel Notes

- API route runs on Node.js runtime (`export const runtime = "nodejs"`)
- No additional server configuration required
- Next.js App Router is fully supported out of the box

---

## 10) Production Readiness Notes

- Typed contracts across client and server
- Defensive input and output validation
- UI loading and error states for better UX
- Reusable component architecture for easy extension
- Clear separation of concerns (`app`, `components`, `lib`, `api`, `styles`)

---

## 11) Potential Next Iterations

- Persist generated opportunities to a database
- Add auth and tenant-aware personalization
- Add analytics for demo usage and conversion
- Support downloadable one-page AI strategy brief

---

## 12) License

Prototype/demo project for evaluation and interview use.
# chiacon-ai-business-advisor
