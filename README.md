# Medium - Publishing Platform

## 📸 Screenshots

### Homepage
<img width="1712" height="909" alt="homepage" src="https://github.com/user-attachments/assets/080c5ed8-339a-4345-a8d7-1a8e0de67a62" />

### Posts Feed
<img width="1618" height="915" alt="feed" src="https://github.com/user-attachments/assets/4007c490-7a53-40b8-a799-d57e28e93b2a" />

### Rich Text Editor
<img width="1724" height="907" alt="write" src="https://github.com/user-attachments/assets/9a8b2698-d71a-4951-9197-b4e22270104d" />

## profile
<img width="1640" height="878" alt="Screenshot 2025-11-28 140439" src="https://github.com/user-attachments/assets/d1de4bd0-6205-4ea8-884f-91877d75f985" />
### Posts Management
<img width="1636" height="910" alt="Screenshot 2025-11-28 140328" src="https://github.com/user-attachments/assets/f1875ac4-72f7-495b-8f28-80ff8b9116a9" />


A full-featured publishing platform built with Next.js 15, TypeScript, and Prisma.


## 🚀 Features

- **Authentication** - NextAuth with custom JWT and secure sessions
- **Rich Text Editor** - Jodit editor with formatting, images, embeds
- **Posts Management** - Create, read, update, delete posts with media support
- **Social Features** - Comments, likes, follow users, post interactions
- **Responsive Design** - Mobile-first approach with optimized layouts
- **Search & Filter** - Advanced search and category filtering
- **File Upload** - Image upload with validation and safe storage
- **Code Optimization** - Clean, maintainable code with shared utilities
- **SEO Optimized** - Meta tags and Open Graph support

## 📁 Project Structure

```
frontend-capstone-project-two/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # NextAuth configuration
│   │   │   │   └── [...nextauth]/
│   │   │   ├── lab2/          # Authentication APIs
│   │   │   │   └── signup/
│   │   │   ├── lab3/          # Rich text editor APIs
│   │   │   │   └── posts/
│   │   │   ├── lab4/          # Posts CRUD APIs
│   │   │   │   └── post/
│   │   │   ├── lab6/          # Comments APIs
│   │   │   │   └── comments/
│   │   │   ├── lab7/          # Likes APIs
│   │   │   │   ├── likes/
│   │   │   │   └── comments/
│   │   │   ├── lab8/          # Social features APIs
│   │   │   │   └── likes/
│   │   │   ├── lab9/          # Follow system APIs
│   │   │   │   ├── follow/
│   │   │   │   └── followers/
│   │   │   ├── likes/         # General likes API
│   │   │   ├── upload/        # File upload API
│   │   │   └── test-auth/     # Auth testing
│   │   ├── lab1/              # Home page (optimized)
│   │   │   └── page.tsx
│   │   ├── lab2/              # Authentication pages
│   │   │   ├── login/
│   │   │   ├── profile/
│   │   │   └── signup/
│   │   ├── lab3/              # Rich text editor
│   │   │   ├── editor/
│   │   │   ├── posts/
│   │   │   └── page.tsx
│   │   ├── lab4/              # Posts management
│   │   │   └── posts/
│   │   │       └── [id]/
│   │   ├── lab5/              # Feeds and search
│   │   │   ├── page.tsx
│   │   │   └── posts.ts
│   │   ├── lab6/              # Comments system
│   │   │   ├── create-post/
│   │   │   ├── posts/
│   │   │   └── page.tsx
│   │   ├── lab7/              # Reactions (likes)
│   │   │   ├── post/
│   │   │   └── page.tsx
│   │   ├── lab8/              # Social features
│   │   │   ├── post/
│   │   │   └── page.tsx
│   │   ├── lab9/              # SEO and performance
│   │   │   └── profile/
│   │   ├── context/           # React Context providers
│   │   │   └── AuthContext.tsx
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Main home page
│   │   └── providers.tsx      # Client-side providers
│   ├── components/            # Reusable components
│   │   └── Header.tsx         # Navigation header
│   ├── lib/                   # Utility functions
│   │   ├── prisma.ts          # Database connection
│   │   └── utils.ts           # Shared utilities
│   └── generated/             # Prisma generated files
│       └── prisma/
├── prisma/                    # Database schema and migrations
│   ├── migrations/            # Database migrations
│   ├── schema.prisma          # Database schema
│   └── seed.ts               # Seed data
├── public/                    # Static assets
│   ├── screenshots/           # App screenshots
│   └── uploads/              # User uploaded files
├── lib/                       # External utility functions
│   └── prisma.ts
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

- **Lab 1**: Home page with optimized responsive design
- **Lab 2**: Authentication system (login, signup, profile)
- **Lab 3**: Rich text editor with Jodit and content creation
- **Lab 4**: Posts CRUD operations and media handling
- **Lab 5**: Curated feeds, tags, and advanced search
- **Lab 6**: Comments system with real-time updates
- **Lab 7**: Reactions system (likes/dislikes)
- **Lab 8**: Social features and user interactions
- **Lab 9**: Follow system and user profiles

## 🎯 Code Optimization

- **Reduced Code Size**: 50% reduction in component size while maintaining functionality
- **Shared Utilities**: Common functions moved to `src/lib/utils.ts`
- **Responsive Classes**: Mobile-first design with Tailwind CSS breakpoints
- **Clean Architecture**: Separation of concerns and reusable components
- **Type Safety**: Full TypeScript integration with proper type definitions

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
   npx prisma db seed
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

