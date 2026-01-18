import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function BlogCard({
  id,
  title,
  excerpt,
  category,
  author,
  authorInitials,
  authorProfilePic,
  date,
  readTime,
  featured = false,
  coverImage,
}) {
  return (
    <Link href={`/blog/${id}`} className="no-underline" style={{ textDecoration: 'none' }}>
      <motion.div whileHover={{ y: -6, scale: 1.01 }} transition={{ type: 'spring', stiffness: 300 }}>
        <Card
          className={`overflow-hidden hover-elevate active-elevate-2 transition-all duration-300 hover:-translate-y-1 group h-[400px] flex flex-col justify-between ${featured ? "lg:col-span-2 lg:row-span-2" : ""
            }`}
          data-testid={`card-blog-${id}`}
        >
          <div className="relative overflow-hidden w-full h-[160px]">
            {coverImage ? (
              <>
                <img
                  src={coverImage}
                  alt={title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
              </>
            ) : (
              <>
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
              </>
            )}
            <Badge className="absolute top-4 left-4" data-testid={`badge-category-${id}`}>
              {category}
            </Badge>
          </div>

          <div className="p-6">
            <h3
              className={`font-bold mb-3 ${featured ? "text-2xl line-clamp-2" : "text-xl line-clamp-1"}`}
              style={{ display: '-webkit-box', WebkitLineClamp: featured ? 2 : 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
              data-testid={`text-blog-title-${id}`}
            >
              {title}
            </h3>

            <p
              className={`text-muted-foreground mb-4 ${featured ? "line-clamp-3" : "line-clamp-2"}`}
              style={{ display: '-webkit-box', WebkitLineClamp: featured ? 3 : 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
              data-testid={`text-blog-excerpt-${id}`}
            >
              {excerpt}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={authorProfilePic} alt={author} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {authorInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium" data-testid={`text-author-${id}`}>{author}</span>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span data-testid={`text-date-${id}`}>{date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span data-testid={`text-readtime-${id}`}>{readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
}
