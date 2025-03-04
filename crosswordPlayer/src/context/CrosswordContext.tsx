// // context/CrosswordContext.tsx
// import React, { createContext, useContext } from 'react';
// import { useCrossword } from '../hooks/useCrossword';

// const CrosswordContext = createContext(null);

// export const CrosswordProvider = ({ children }: { children: React.ReactNode }) => {
//   const crosswordState = useCrossword();
  
//   return (
//     <CrosswordContext.Provider value={crosswordState}>
//       {children}
//     </CrosswordContext.Provider>
//   );
// };

// export const useCrosswordContext = () => useContext(CrosswordContext);