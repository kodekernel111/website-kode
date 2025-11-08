import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  date,
  readTime,
  featured = false,
}) {
  return (
    <Link href={`/blog/${id}`}>
      <motion.div whileHover={{ y: -6, scale: 1.01 }} transition={{ type: 'spring', stiffness: 300 }}>
        <Card
          className={`overflow-hidden hover-elevate active-elevate-2 transition-all duration-300 hover:-translate-y-1 group h-full ${
            featured ? "lg:col-span-2 lg:row-span-2" : ""
          }`}
          data-testid={`card-blog-${id}`}
        >
        <div className={`relative overflow-hidden ${featured ? "aspect-[2/1]" : "aspect-video"}`}>
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
          <Badge className="absolute top-4 left-4" data-testid={`badge-category-${id}`}>
            {category}
          </Badge>
        </div>

        <div className="p-6">
          <h3 className={`font-bold mb-3 line-clamp-2 ${featured ? "text-2xl" : "text-xl"}`} data-testid={`text-blog-title-${id}`}>
            {title}
          </h3>

          <p className={`text-muted-foreground mb-4 ${featured ? "line-clamp-3" : "line-clamp-2"}`} data-testid={`text-blog-excerpt-${id}`}>
            {excerpt}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
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
