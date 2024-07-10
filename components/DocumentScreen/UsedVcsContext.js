import React, { createContext } from 'react';

// Create a context with an initial value (an object)
const usedVcsContext = createContext({
  usedVCs: {},
  updateUsedVcs: () => {}, // Placeholder function
});

export default usedVcsContext;