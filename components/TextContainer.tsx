import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '../variants';

const TextContainer = () => {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="textContainer"
    >
      {/* upper */}
      <div className="textContainer-top">
        <motion.span variants={fadeIn()} className="text-purple-600 ">
          TO
        </motion.span>
      </div>
      {/* //text */}
      <div className="textContainer-middle">
        <motion.span variants={fadeIn()} initial="initial" animate="animate">
          WELCOME
        </motion.span>
      </div>
      {/* lower */}
      <div className="textContainer-bottom">
        <motion.span variants={fadeIn()} />
        <motion.p variants={fadeIn()}>
          STUDENT <span> FOR </span> STUDENT!
        </motion.p>
      </div>
    </motion.div>
  );
};

export default TextContainer;
