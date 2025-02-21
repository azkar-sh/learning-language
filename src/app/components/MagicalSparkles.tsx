// import React from "react";
// import { motion } from "framer-motion";

// export const MagicalSparkles = () => {
//   return (
//     <div className="absolute inset-0 pointer-events-none overflow-hidden">
//       {[...Array(20)].map((_, i) => (
//         <motion.div
//           key={i}
//           className="absolute w-1 h-1 bg-yellow-300 rounded-full"
//           initial={{
//             opacity: 0,
//             x: Math.random() * window.innerWidth,
//             y: Math.random() * window.innerHeight,
//           }}
//           animate={{
//             opacity: [0, 1, 0],
//             scale: [0, 1.5, 0],
//             y: [null, Math.random() * -100],
//           }}
//           transition={{
//             duration: 2 + Math.random() * 2,
//             repeat: Infinity,
//             repeatDelay: Math.random() * 2,
//           }}
//           style={{
//             left: `${Math.random() * 100}%`,
//             top: `${Math.random() * 100}%`,
//           }}
//         />
//       ))}
//     </div>
//   );
// };
