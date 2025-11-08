import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function AnimatedSection({ children, className = "", delay = 0, animation = "fadeUp" }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const animations = {
    fadeUp: {
      hidden: { opacity: 0, y: 40 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.8,
          delay: delay / 1000,
          ease: [0.25, 0.1, 0.25, 1.0]
        }
      }
    },
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: {
          duration: 0.6,
          delay: delay / 1000,
        }
      }
    },
    scaleIn: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: {
          duration: 0.6,
          delay: delay / 1000,
          ease: [0.34, 1.56, 0.64, 1]
        }
      }
    },
    slideLeft: {
      hidden: { opacity: 0, x: -60 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: {
          duration: 0.8,
          delay: delay / 1000,
          ease: [0.25, 0.1, 0.25, 1.0]
        }
      }
    },
    slideRight: {
      hidden: { opacity: 0, x: 60 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: {
          duration: 0.8,
          delay: delay / 1000,
          ease: [0.25, 0.1, 0.25, 1.0]
        }
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={animations[animation]}
      className={className}
    >
      {children}
    </motion.div>
  );
}
