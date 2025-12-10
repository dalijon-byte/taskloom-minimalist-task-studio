# Taskloom — Minimalist Task Studio

Taskloom is a visually exquisite, minimalist task/list manager built with modern web technologies. It provides a single-page, production-polished frontend that feels like a native app: fast, micro-interactive, responsive, and delightful. Users can create tasks, edit them, reorder via drag & drop, mark as complete, set due dates, add tags, filter by status, search, and export/import their lists. Persistence starts with localStorage for immediate usability, designed for seamless backend integration later.

## Key Features

- **Intuitive Task Management**: Add, edit, delete, and toggle task completion with smooth animations.
- **Drag & Drop Reordering**: Easily rearrange tasks using intuitive drag handles.
- **Due Dates & Tags**: Set deadlines with date pickers and add customizable tags for organization.
- **Search & Filters**: Quickly find tasks by text or filter by status (e.g., active, completed).
- **Export/Import**: Backup and restore task lists as JSON files.
- **Responsive Design**: Works flawlessly on desktop, tablet, and mobile devices.
- **Visual Excellence**: Minimalist design with generous whitespace, warm gradients, and subtle glassmorphism effects.
- **Offline-First**: Local persistence via localStorage, with hooks prepared for server-side sync.
- **Polished Interactions**: Micro-animations, hover states, loading skeletons, and toast notifications for delightful UX.

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite for fast development.
- **UI & Styling**: Tailwind CSS v3, shadcn/ui components, Lucide React icons.
- **Interactions**: Framer Motion for animations, @dnd-kit for drag & drop.
- **State & Forms**: Zustand for lightweight state management, React Hook Form for forms.
- **Utilities**: Date-fns for date handling, Sonner for toasts.
- **Backend**: Cloudflare Workers with Hono routing, Durable Objects for scalable persistence.
- **Data**: Shared types for frontend-backend consistency, localStorage fallback.

## Quick Start

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/dalijon-byte/taskloom-minimalist-task-studio)

Get started instantly by deploying to Cloudflare Workers or running locally.

## Installation

Taskloom uses Bun as the package manager for faster installs and development. Ensure Bun is installed on your system ([install Bun](https://bun.sh/docs/installation)).

1. Clone the repository:
   ```
   git clone <your-repo-url>
   cd taskloom
   ```

2. Install dependencies:
   ```
   bun install
   ```

3. (Optional) Generate Cloudflare Worker types:
   ```
   bun run cf-typegen
   ```

## Usage

### Running Locally

Start the development server:

```
bun run dev
```

The app will be available at `http://localhost:3000` (or the port specified in your environment).

### Key Interactions

- **Add a Task**: Type in the composer input and click "Add" or press Enter. Quick-tag chips for common tags.
- **Reorder Tasks**: Drag the handle icon on the left of any task to reorder the list.
- **Edit Task**: Click the pencil icon to inline-edit the title.
- **Set Due Date**: Use the calendar icon to pick a date; overdue tasks highlight subtly.
- **Toggle Complete**: Check the box to mark done—completed tasks dim and move to a collapsible section.
- **Search & Filter**: Use the search bar or open the filters sheet (right panel on desktop, bottom sheet on mobile) to refine views.
- **Settings**: Click the settings icon in the header to access export/import JSON and layout preferences (compact vs. comfortable spacing).
- **Empty State**: On first load, enjoy the onboarding with example tasks to get started.

All changes persist to localStorage automatically. For production, the app is optimized for Cloudflare Workers.

## Development

### Scripts

- `bun run dev`: Start development server with hot reload.
- `bun run build`: Build for production (outputs to `dist/`).
- `bun run lint`: Run ESLint for code quality.
- `bun run preview`: Preview the built app locally.
- `bun run deploy`: Build and deploy to Cloudflare Workers.

### Project Structure

- `src/`: React frontend source.
  - `pages/`: Main views (e.g., `HomePage.tsx` for the task list).
  - `components/ui/`: shadcn/ui primitives.
  - `hooks/`: Custom hooks (e.g., `use-tasks.ts` for task management).
- `worker/`: Cloudflare Workers backend.
  - `index.ts`: Main worker entrypoint.
  - `user-routes.ts`: Add custom API routes here.
  - `entities.ts`: Durable Object entities (extend for custom data models).
- `shared/`: Shared types between frontend and backend.
- `tailwind.config.js`: Tailwind configuration (extend colors and themes safely).

### Extending the App

- **Add Features**: Follow the phase roadmap—Phase 1 is frontend-complete; extend with server sync in Phase 2.
- **Custom Styling**: Use Tailwind utilities and extend `tailwind.config.js` without overriding core classes.
- **Testing**: Add unit tests with Vitest (not included by default).
- **API Integration**: Use `src/lib/api-client.ts` for Worker endpoints. LocalStorage hooks in `src/hooks/use-tasks.ts` are swappable.

### Best Practices

- Use shadcn/ui components for consistency.
- Follow the UI non-negotiables: Root wrappers with proper gutters, responsive padding.
- Avoid infinite loops: Select Zustand primitives individually (e.g., `useStore(s => s.count)`).
- Ensure accessibility: All interactive elements have focus states and ARIA labels.

## Deployment

Deploy to Cloudflare Workers for global edge performance and Durable Object persistence. No server management required.

1. Ensure you have a Cloudflare account and Wrangler CLI installed (`npm i -g wrangler` or via Bun).
2. Authenticate: `wrangler login`.
3. Build the project: `bun run build`.
4. Deploy: `bun run deploy` (or `wrangler deploy`).

The app will be live at `https://<project-name>.<subdomain>.workers.dev`. Configure custom domains in the Cloudflare dashboard.

For one-click deployment:

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/dalijon-byte/taskloom-minimalist-task-studio)

### Environment Variables

No env vars required for basic setup. For production, add secrets via Wrangler:

```
wrangler secret put API_KEY
```

### Production Notes

- Assets are served via Cloudflare's edge cache.
- Monitor via Cloudflare's observability tools (enabled in `wrangler.jsonc`).
- Scaling: Durable Objects handle state automatically; no sharding needed.

## Contributing

Contributions are welcome! Fork the repo, create a feature branch, and submit a pull request. Ensure code passes linting and tests. Focus on visual polish and adherence to the minimalist design language.

For major changes, open an issue first to discuss.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.