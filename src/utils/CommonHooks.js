import { useEffect, useState } from "react";

/**
 * Custom state hook that automatically reinitializes state when dependencies change
 *
 * @param {() => T} valueFn Function that returns the initial value of the state
 * @param {Array} dependencies Dependencies to watch for changes
 *
 * @returns {[T, React.Dispatch<React.SetStateAction<T>>]}
 *
 * @template T
 */
export const useDependentState = (valueFn, dependencies) => {
  const state = useState(valueFn);

  useEffect(() => {
    state[1](valueFn);
  }, dependencies);

  return state;
};
