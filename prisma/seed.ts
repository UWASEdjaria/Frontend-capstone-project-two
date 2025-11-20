import prisma from '../src/lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  // Create a default user with hashed password
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      id: '1',
      name: 'Demo User',
      email: 'demo@example.com',
      password: hashedPassword,
    },
  })

  // Create tags first
  const tags = [
    { name: 'Welcome' },
    { name: 'Tutorial' },
    { name: 'Guidelines' },
    { name: 'Technology' },
    { name: 'Writing' }
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { name: tag.name },
      update: {},
      create: tag,
    });
  }

  // Create initial posts
  const posts = [
    {
      title: 'Welcome to Medium Clone',
      slug: 'welcome-to-medium-clone',
      content: '<p>Welcome to our Medium clone! This is your first post. You can create, edit, and share your thoughts here.</p><p>Features include:</p><ul><li>Rich text editing</li><li>Comments and likes</li><li>User profiles</li><li>Social features</li></ul>',
      excerpt: 'Welcome to our Medium clone platform',
      published: true,
      publishedAt: new Date(),
      tags: ['Welcome', 'Technology']
    },
    {
      title: 'Getting Started with Writing',
      slug: 'getting-started-with-writing',
      content: '<p>Ready to start writing? Click on the "Write" button in the navigation to create your first post.</p><p>Our rich text editor supports:</p><ul><li>Bold and italic text</li><li>Lists and links</li><li>Images and media</li><li>Code blocks</li></ul><p>Happy writing!</p>',
      excerpt: 'Learn how to create your first post',
      published: true,
      publishedAt: new Date(),
      tags: ['Tutorial', 'Writing']
    },
    {
      title: 'Community Guidelines',
      slug: 'community-guidelines',
      content: '<p>Our community thrives on respectful and engaging content. Please follow these guidelines:</p><ul><li>Be respectful to other users</li><li>Share original and valuable content</li><li>Engage meaningfully with comments</li><li>Report inappropriate content</li></ul><p>Thank you for being part of our community!</p>',
      excerpt: 'Guidelines for our writing community',
      published: true,
      publishedAt: new Date(),
      tags: ['Guidelines']
    }
  ]

  for (const post of posts) {
    const { tags: postTags, ...postData } = post;
    
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        ...postData,
        authorId: user.id,
        tags: {
          connect: postTags.map(tagName => ({ name: tagName }))
        }
      },
    })
  }

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })