import { motion } from 'framer-motion';

const animations = {
  initial: { opacity: 0, y: 100 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -100 },
};

interface AnimatedPageProps {
  children: React.ReactNode;
}

export const AnimatedPage = ({ children }: AnimatedPageProps) => (
  <motion.div
    variants={animations}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 1 }}
  >
    {children}
  </motion.div>
);
