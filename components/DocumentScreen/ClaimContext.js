import React, { createContext } from 'react';

// Create a context with an initial value (an object)
const claimContext = createContext({
  VcClaims: {
  },
  updateClaims: () => {}, // Placeholder function
});

export default claimContext;