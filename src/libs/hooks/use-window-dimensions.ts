import { useState, useEffect, useMemo } from 'react';

/**
 * It returns an object with two properties, width and height, which are assigned the values of the
 * innerWidth and innerHeight properties of the global window object
 * @returns An object with two properties, width and height.
 */
function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;

  return {
    width,
    height,
  };
}

/**
 * It returns the window dimensions, and it updates the window dimensions when the window is resized
 * @returns A value = {width, height} of window
 */
export function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const memorizedWindowDimensions = useMemo(() => windowDimensions, [windowDimensions]);

  return memorizedWindowDimensions;
}
