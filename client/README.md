# Client (Frontend)

This directory contains the React frontend (Vite) for the project.

Recommended quick commands (from the project root):

- Install dependencies (if not installed yet):

```bash
npm install
```

- Start the client dev server (runs Vite):

```bash
npm run client:dev
```

- Build the client for production:

```bash
npm run client:build
```

- Preview a production build locally:

```bash
npm run client:preview
```

Notes:
- The Vite config is at the repo root (`vite.config.js`) and is already set with `root: "client"`, so commands run from the repo root work.
- If you prefer to treat the client as an independent project, create a `client/package.json` and install dependencies inside the `client` folder.
