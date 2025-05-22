# Next.js SaaS Starter

This is a starter template for building a SaaS application using **Next.js** with support for authentication, Stripe integration for payments, and a dashboard for logged-in users.

**Demo: [https://next-saas-start.vercel.app/](https://next-saas-start.vercel.app/)**

## Features

- Marketing landing page (`/`) with animated Terminal element
- Pricing page (`/pricing`) which connects to Stripe Checkout
- Dashboard pages with CRUD operations on users/teams
- Basic RBAC with Owner and Member roles
- Subscription management with Stripe Customer Portal
- Email/password authentication with JWTs stored to cookies
- Global middleware to protect logged-in routes
- Local middleware to protect Server Actions or validate Zod schemas
- Activity logging system for any user events
- **Code Snippets with AI Search**: Store, manage, and share code snippets with private, team, or public visibility, and find them easily with AI-powered semantic search.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Database**: [Postgres](https://www.postgresql.org/)
- **ORM**: [Drizzle](https://orm.drizzle.team/)
- **Payments**: [Stripe](https://stripe.com/)
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/)
- **AI Embeddings**: [`@xenova/transformers`](https://github.com/xenova/transformers.js) for client-side embedding generation

## Code Snippets with AI Search: Your Smart Code Library

Ever struggle to find that perfect piece of code you wrote a while ago? This feature turns your collection of code snippets into a smart, searchable library, making it easy to save, organize, and find your code when you need it.

### What Can You Do?

*   **Save Your Code Easily:** Keep all your useful code snippets in one place. Add a title, the code itself, the programming language, a quick description, and even some tags (like "javascript" or "database query").
*   **Control Who Sees Your Snippets:**
    *   **Private:** Keep it just for your eyes.
    *   **Team:** Share it with your team members. (You'll see this option if you're part of a team).
    *   **Public:** Make it available for anyone to see (useful if you want to share a snippet more broadly).
*   **Find Code with Smart Search:** This is where the magic happens! Instead of just matching exact words, our AI-powered search understands what your snippets *mean*. So, you can type things like "how to connect to the database" or "loop through list items," and it will find relevant code even if the words aren't an exact match.

### How to Manage Your Snippets

1.  **Go to Snippets:** Look for the "Snippets" link in the dashboard menu to get to your snippet library.
2.  **Create a New Snippet:**
    *   Click the "Create New Snippet" button.
    *   A form will pop up. Here’s what to fill in:
        *   **Title:** Give your snippet a clear, memorable name.
        *   **Code:** Paste or type your code here.
        *   **Language:** Pick the language (like Python, JavaScript, etc.). This helps with how it looks and how the search finds it.
        *   **Description (Optional but Recommended!):** Briefly explain what the code does or why it's useful. This helps you (and others) later!
        *   **Tags (Optional):** Add a few keywords, separated by commas (e.g., `animation, css, helper function`). This gives you another way to organize.
        *   **Visibility:** Choose who can see this snippet:
            *   `Private`: Just for you.
            *   `Team`: For you and your team members. (This option appears if you belong to a team in the app.)
            *   `Public`: Anyone can see it.
    *   Hit "Save". When you save, our AI automatically analyzes your snippet to make it ready for smart searching.
3.  **See Your Snippets:** Your snippets will appear as cards in a list. Click on any card to see the full details and code.
4.  **Change a Snippet:** If you made a mistake or want to update something, you can edit snippets you own. The AI will re-analyze it if you change important parts.
5.  **Remove a Snippet:** You can also delete snippets you own.

### Using the AI-Powered Smart Search

*   **Find the Search Bar:** It's usually at the top of the Snippets page.
*   **Type What You Need:** Don't just think keywords. Ask a question or describe the code's purpose. For example:
    *   "javascript function to send email"
    *   "python script for reading files"
    *   "css for a centered button"
*   **See the Results:** The search will show you the snippets that best match the *meaning* of your query. This is much smarter than a simple text search!

### A Little About the Tech (Simplified)

*   **Smart Search Brains:** To make the search "smart," we use a cool AI technique. When you save a snippet, we create a special numerical fingerprint (called an "embedding") that represents its meaning. The search then compares the fingerprint of your query with the fingerprints of your snippets. This is done using a helpful open-source library called `@xenova/transformers`.
*   **Where Snippets Live:** Your snippets are stored securely in a PostgreSQL database.
*   **Looks Good, Feels Good:** The interface is built with modern tools like `shadcn/ui` to make it easy and pleasant to use.

## Getting Started

```bash
git clone https://github.com/nextjs/saas-starter
cd saas-starter
pnpm install
```

## Running Locally

Use the included setup script to create your `.env` file:

```bash
pnpm db:setup
```

Then, run the database migrations and seed the database with a default user and team:

```bash
pnpm db:migrate
pnpm db:seed
```

This will create the following user and team:

- User: `test@test.com`
- Password: `admin123`

You can, of course, create new users as well through `/sign-up`.

Finally, run the Next.js development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action.

Optionally, you can listen for Stripe webhooks locally through their CLI to handle subscription change events:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Testing Payments

To test Stripe payments, use the following test card details:

- Card Number: `4242 4242 4242 4242`
- Expiration: Any future date
- CVC: Any 3-digit number

## Going to Production

When you're ready to deploy your SaaS application to production, follow these steps:

### Set up a production Stripe webhook

1. Go to the Stripe Dashboard and create a new webhook for your production environment.
2. Set the endpoint URL to your production API route (e.g., `https://yourdomain.com/api/stripe/webhook`).
3. Select the events you want to listen for (e.g., `checkout.session.completed`, `customer.subscription.updated`).

### Deploy to Vercel

1. Push your code to a GitHub repository.
2. Connect your repository to [Vercel](https://vercel.com/) and deploy it.
3. Follow the Vercel deployment process, which will guide you through setting up your project.

### Add environment variables

In your Vercel project settings (or during deployment), add all the necessary environment variables. Make sure to update the values for the production environment, including:

1. `BASE_URL`: Set this to your production domain.
2. `STRIPE_SECRET_KEY`: Use your Stripe secret key for the production environment.
3. `STRIPE_WEBHOOK_SECRET`: Use the webhook secret from the production webhook you created in step 1.
4. `POSTGRES_URL`: Set this to your production database URL.
5. `AUTH_SECRET`: Set this to a random string. `openssl rand -base64 32` will generate one.

## Other Templates

While this template is intentionally minimal and to be used as a learning resource, there are other paid versions in the community which are more full-featured:

- https://achromatic.dev
- https://shipfa.st
- https://makerkit.dev
