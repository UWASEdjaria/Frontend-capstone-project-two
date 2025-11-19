<img width="1538" height="845" alt="posts" src="https://github.com/user-attachments/assets/4367d431-6168-4a1c-8b17-34039437e67c" /># Medium - Publishing Platform

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
   npx<img width="1![Uploa<img width="1542" h<img width="1712" height="909" alt="homepage" src="https://github.com/user-attachments/assets/080c5ed8-339a-4345-a8d7-1a8e0de67a62" />
<img width="1618" height="915" alt="feed" src="https://github.com/user-attachments/assets/4007c490-7a53-40b8-a799-d57e28e93b2a" />
<img width="1618" height="915" alt="feed" src="https://github.com/user-attachments/assets/29e4b1ef-6acc-439b-a0d9-9f62d09a1fb1" />
eight="895" alt="post with footer" src="https://github.com/user-attachments/assets/15d588ae-8b1f-4b2d-a32e-4706e5a91028" />
ding posts.png…]()
469" he<img width="1724" height="907" alt="write" src="https://github.com/user-attachments/assets/9a8b2698-d71a-4951-9197-b4e22270104d" />
ight="898" alt="homepage+footer" src="https://github.com/user-attachments/assets/9ef646d8-1031-40f5-b194-23292d5ce0c7" />
 prisma mig<img width="1712" height="909" alt="homepage" src="https://github.com/user-attachments/assets/1f784bf9-3a70-4716-b8e5-2fad11d32480" />
rate dev
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
