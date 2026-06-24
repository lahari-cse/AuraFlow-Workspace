# AuraFlow - Glassmorphic Workspace Optimizer

AuraFlow is a modern, responsive landing page featuring an interactive task flow workspace built with a high-fidelity glassmorphic aesthetic. It provides a stunning user interface to manage tasks, visualize workflow data dynamically, and seamlessly transition between deep space dark mode and frosted pastel light mode.

## Features

- **Glassmorphic Design**: Beautiful translucent cards utilizing backdrop-filters, subtle gradients, and custom shadows.
- **Dynamic Themes**: Instant toggling between Dark Mode and Light Mode with consistent styling.
- **Interactive Kanban Board**: Fully functional client-side task management board (To Do, In Progress, Under Review, Completed) with drag-and-drop feeling buttons.
- **Real-time Analytics**: Integrated Chart.js doughnut chart that automatically updates its visual representation based on task completion statuses.
- **Responsive Layout**: Carefully tuned CSS grid and flexbox logic for desktop, tablet, and mobile viewing.

## Technologies Used

- **HTML5**: Semantic document structure.
- **CSS3**: Custom design tokens, glassmorphism utilities, CSS Grid, and custom animations.
- **Vanilla JavaScript**: DOM manipulation, interactive workflows, theme state management via LocalStorage.
- **Chart.js**: (via CDN) for dynamic workflow visual analytics.

## Local Development

To run this project locally:

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Because the project consists of static files without a build step, simply open `index.html` in any modern web browser (e.g., Chrome, Firefox, Edge).
   - Alternatively, you can use a local web server (like VS Code Live Server extension or `npx serve`) for automatic reloading during development.

## Deployment

This is a static website and can be deployed easily on free static hosting services like **GitHub Pages**, **Vercel**, or **Netlify**.

### Deploying to GitHub Pages

1. Push this repository to GitHub.
2. Go to your repository **Settings** on GitHub.
3. In the left sidebar, click on **Pages**.
4. Under "Build and deployment", set the **Source** to "Deploy from a branch".
5. Select your `main` or `master` branch and set the folder to `/ (root)`.
6. Click **Save**. Your site will be published at `https://<your-username>.github.io/<repository-name>/` within a few minutes.
