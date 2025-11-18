# DjariaBlog - Medium Clone

A full-featured publishing platform built with Next.js 15, TypeScript, and Prisma.

## 🚀 Features

- **Authentication** - NextAuth with custom JWT
- **Rich Text Editor** - Jodit editor with formatting, images, embeds
- **Posts Management** - Create, read, update, delete posts
- **Social Features** - Comments, likes, sharing
- **Responsive Design** - Mobile-first approach
- **SEO Optimized** - Meta tags and Open Graph

## 📁 Project Structure

```
frontend-capstone-project-two/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # NextAuth configuration
│   │   │   ├── lab3/          # Rich text editor APIs
│   │   │   ├── lab4/          # Posts CRUD APIs
│   │   │   ├── lab6/          # Comments APIs
│   │   │   ├── lab7/          # Likes APIs
│   │   │   └── lab8/          # Social features APIs
│   │   ├── lab1/              # Project setup
│   │   ├── lab2/              # Authentication pages
│   │   ├── lab3/              # Rich text editor
│   │   ├── lab4/              # Posts management
│   │   ├── lab5/              # Feeds and search
│   │   ├── lab6/              # Comments system
│   │   ├── lab7/              # Reactions (likes)
│   │   ├── lab8/              # Social features
│   │   ├── lab9/              # SEO and performance
│   │   ├── context/           # React Context providers
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── providers.tsx      # Client-side providers
│   ├── components/            # Reusable components
│   │   └── Header.tsx         # Navigation header
│   └── generated/             # Prisma generated files
├── prisma/                    # Database schema and migrations
├── lib/                       # Utility functions
├── public/                    # Static assets
├── .env                       # Environment variables
├── next.config.ts             # Next.js configuration
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript configuration
└── README.md                  # Project documentation
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Rich Text**: Jodit Editor
- **Deployment**: Vercel

## 📋 Lab Structure

Each lab represents a specific feature implementation:

- **Lab 1**: Project setup and routing
- **Lab 2**: Authentication and user profiles
- **Lab 3**: Rich text editor and content creation
- **Lab 4**: Posts CRUD and media handling
- **Lab 5**: Feeds, tags, and search
- **Lab 6**: Comments system
- **Lab 7**: Reactions and likes
- **Lab 8**: Social features and following
- **Lab 9**: SEO, performance, and SSG/SSR

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/UWASEdjaria/Frontend-capstone-project-two.git
   cd frontend-capstone-project-two
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Add your database URL and other required variables
   ```

4. **Set up database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🌐 Deployment

The application is configured for deployment on Vercel:

1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

## 📝 Environment Variables

```env
DATABASE_URL="your-database-url"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.