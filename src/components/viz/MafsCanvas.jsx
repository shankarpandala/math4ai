import React, { useRef, useEffect, useState } from 'react';
import {
  Mafs,
  Coordinates,
  Plot,
  Line,
  Circle,
  Point,
  Polygon,
  Text,
  Vector,
  Transform,
  Theme,
  useMovablePoint,
  labelPi,
} from 'mafs';
import 'mafs/core.css';
import 'mafs/font.css';

/**
 * Responsive Mafs canvas wrapper with auto-sizing and dark theme integration.
 *
 * Props:
 *   height    {number}         Canvas height in pixels (default 400)
 *   xRange    {[number,number]} x-axis view range (default [-4, 4])
 *   yRange    {[number,number]} y-axis view range (default [-4, 4])
 *   children  {React.Node}     Mafs child elements (Plot, Line, etc.)
 *   zoom      {bool}           Enable zoom (default false)
 *   pan       {bool}           Enable pan (default false)
 *   className {string}         Additional CSS classes
 */
function MafsCanvas({
  height = 400,
  xRange = [-4, 4],
  yRange = [-4, 4],
  children,
  zoom = false,
  pan = false,
  className = '',
}) {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(600);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width || 600);
      }
    });

    observer.observe(containerRef.current);
    // Set initial width
    setWidth(containerRef.current.offsetWidth || 600);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900 ${className}`}
    >
      <Mafs
        width={width}
        height={height}
        viewBox={{ x: xRange, y: yRange }}
        zoom={zoom}
        pan={pan}
      >
        <Coordinates.Cartesian />
        {children}
      </Mafs>
    </div>
  );
}

// Re-export Mafs primitives for convenience so consumers only need to import
// from this module.
export {
  Mafs,
  Coordinates,
  Plot,
  Line,
  Circle,
  Point,
  Polygon,
  Text,
  Vector,
  Transform,
  Theme,
  useMovablePoint,
  labelPi,
};

export default MafsCanvas;
