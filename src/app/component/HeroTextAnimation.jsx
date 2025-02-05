import { motion } from "framer-motion";

const HeroTextAnimation = ({ text, className }) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, color: ["#ff6b6b", "#feca57", "#54a0ff", "#ff6b6b"] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      {text}
    </motion.div>
  );
};

export default HeroTextAnimation;
