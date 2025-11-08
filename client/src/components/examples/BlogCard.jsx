import BlogCard from '../BlogCard'

export default function BlogCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
      <BlogCard
        id="1"
        title="Building Scalable SaaS Applications with Modern Tech Stack"
        excerpt="Learn how to architect and build scalable SaaS applications using React, Node.js, and cloud technologies."
        category="Development"
        author="Sarah Chen"
        authorInitials="SC"
        date="Jan 15, 2025"
        readTime="8 min"
        featured={true}
      />
      <BlogCard
        id="2"
        title="The Future of Web Design in 2025"
        excerpt="Explore upcoming trends in web design including AI-powered layouts and immersive experiences."
        category="Design"
        author="Mike Johnson"
        authorInitials="MJ"
        date="Jan 12, 2025"
        readTime="5 min"
      />
    </div>
  )
}
