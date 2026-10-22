# A.I Blog Application

A full-stack **MERN** blogging platform with an AI-assisted writing flow. React on the front end,
Express in the middle, MongoDB underneath, and a generation endpoint that drafts a structured
article so you never have to stare at a blank textarea.

Live demo: **coming soon** · Code: [github.com/uvaibhav367-arch/ai-blog-app](https://github.com/uvaibhav367-arch/ai-blog-app)

---

## Highlights

| Area | What it does |
| --- | --- |
| RESTful API | Five CRUD endpoints plus a dedicated AI route, all returning a consistent `{ success, data }` envelope |
| Repository pattern | The controller never touches Mongoose directly - swap the Mongo repository for the in-memory one with a single flag |
| AI drafting | `POST /api/generate` returns a full Markdown draft; uses the OpenAI API when a key is present and a deterministic local writer when it is not |
| Search & tags | Live keyword search across title, content and excerpt, plus tag filtering on the client |
| Responsive UI | Dark, card-based layout built with plain CSS custom properties - no UI framework |
| Production ready | Deployable to Vercel as a single project (SPA + serverless function) with one `vercel.json` |

## Tech stack

- **Frontend** - React 18, React Router 6, Vite 6, hand-written CSS
- **Backend** - Node.js 18+, Express 4, Mongoose 8, CORS, dotenv
- **AI** - OpenAI `chat/completions` API (optional, with a local fallback writer)
- **Tooling** - npm, Vercel, Git/GitHub

---

## Quick start

```bash
# 1. install
npm install
npm install --prefix client

# 2. configure (copy the example and edit it)
cp .env.example .env

# 3. run the API on http://localhost:5000
npm run dev

# 4. in a second terminal, run the client on http://localhost:5173
npm run dev:client
```

The Vite dev server proxies `/api` to `http://localhost:5000`, so the client works with no extra
configuration.

### Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | no | API port, defaults to `5000` |
| `MONGODB_URI` | no | MongoDB connection string. Without it the API falls back to an in-memory store seeded with three sample posts |
| `OPENAI_API_KEY` | no | Enables real AI drafting. Without it a built-in local writer generates the draft |
| `OPENAI_MODEL` | no | Model name, defaults to `gpt-4o-mini` |
| `CLIENT_ORIGIN` | no | Comma separated list of allowed origins, defaults to `*` |
| `USE_MEMORY_STORE` | no | Set to `true` to force the in-memory store even when `MONGODB_URI` is present |

The app is designed to run with **zero configuration**: without a database or an API key it still
boots, serves seeded content and still generates drafts.

---

## API reference

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Service status and the active storage driver |
| `GET` | `/api/posts` | List posts. Supports `?search=`, `?tag=` and `?limit=` |
| `GET` | `/api/posts/:id` | Fetch a single post |
| `POST` | `/api/posts` | Create a post - `{ title, content, excerpt?, tags?, coverColor? }` |
| `PUT` | `/api/posts/:id` | Partial update of a post |
| `DELETE` | `/api/posts/:id` | Delete a post |
| `POST` | `/api/generate` | Draft an article - `{ prompt: "your topic" }` |

Every response follows the same shape:

```json
{ "success": true, "data": { "...": "..." } }
```

Errors return the matching HTTP status plus a readable message:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "field": "title", "message": "Title is required" }]
}
```

### Example

```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello MERN","content":"A post body that is definitely longer than twenty characters."}'
```

---

## Project structure

```
ai-blog-app/
├── api/
│   ├── index.js          # GET /api  - service info
│   └── [...path].js      # serverless entry that mounts the Express app
├── client/
│   ├── public/
│   └── src/
│       ├── api/client.js # fetch wrapper
│       ├── components/   # Navbar, PostCard, PostForm, Loader, EmptyState
│       ├── context/      # PostsContext - data loading and filters
│       └── pages/        # Home, PostDetail, Editor, NotFound
├── server/src/
│   ├── config/           # env handling
│   ├── controllers/      # HTTP layer
│   ├── db/               # mongoose connection
│   ├── middlewares/      # 404 + error handler
│   ├── models/           # Mongoose Post schema
│   ├── repositories/     # mongo + memory implementations behind one interface
│   ├── routes/           # /api/posts and /api routes
│   ├── services/         # AI draft generator
│   ├── utils/            # ApiError, validation, async handler
│   ├── app.js            # express app factory
│   └── server.js         # local dev server
└── vercel.json           # SPA build + rewrite rules
```

### Why the repository pattern?

`server/src/repositories/index.js` picks the implementation at boot time. The Mongo repository talks
to Mongoose; the memory repository keeps posts in a `Map` and seeds three sample articles. Because
both expose the same `list / findById / create / update / remove` interface, the controllers, routes
and the whole React client stay unchanged whether you are running against Atlas, a local
`mongod`, or a zero-config demo.

---

## Deployment

The repository is set up for a single Vercel project that serves both the SPA and the API:

- `client/` is built with Vite and published from `client/dist`
- `api/[...path].js` runs the Express app as a serverless function
- `vercel.json` rewrites every non-API route to `index.html` so client-side routing works on
  refresh

```bash
vercel --prod
```

Set `MONGODB_URI` and `OPENAI_API_KEY` in the project's environment variables to enable MongoDB
persistence and live AI drafting.

---

## What I would build next

- Authentication with JWT so posts can be edited and deleted per user
- Rich text editing with a Markdown preview toggle
- Cover image uploads to Cloudinary instead of the colour swatch
- A reading-stats dashboard and a "most read" page
- Unit and integration tests with Vitest and Supertest

---

## Author

**Vaibhav Upadhyay** - B.Tech in Electronics & Communication Engineering, Jaipur.

- GitHub - [github.com/uvaibhav367-arch](https://github.com/uvaibhav367-arch)
- Portfolio - [uvaibhav367-arch.vercel.app](https://uvaibhav367-arch.vercel.app)
- LinkedIn - [linkedin.com/in/vaibhav-upadhyay-233556297](https://www.linkedin.com/in/vaibhav-upadhyay-233556297)
