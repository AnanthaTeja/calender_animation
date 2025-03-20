// useGestureDetector.js - Custom hook for gesture detection
import { useState, useCallback, useRef } from "react";

export function useGestureDetector({ onPinchIn, onPinchOut }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const touchStartRef = useRef(null);
  const pinchThresholdRef = useRef(0.2); // Adjust sensitivity (lower = more sensitive)
  const touchTimeoutRef = useRef(null);
  const lastPinchTimeRef = useRef(0);
  const pinchCooldownRef = useRef(500); // ms before another pinch can be detected

  // Calculate distance between two touch points
  const getDistance = useCallback((touches) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  // Handle touch start for pinch detection
  const handleTouchStart = useCallback(
    (e) => {
      if (e.touches.length === 2) {
        const distance = getDistance(e.touches);
        touchStartRef.current = {
          distance,
          time: Date.now(),
        };

        // Get the midpoint of the two touch points
        const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        setMousePosition({ x: midX, y: midY });

        // Clear any existing timeout
        if (touchTimeoutRef.current) {
          clearTimeout(touchTimeoutRef.current);
        }
      }
    },
    [getDistance]
  );

  // Handle touch move for pinch detection
  const handleTouchMove = useCallback(
    (e) => {
      if (e.touches.length !== 2 || !touchStartRef.current) return;

      // Get the midpoint of the two touch points
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      setMousePosition({ x: midX, y: midY });

      const currentDistance = getDistance(e.touches);
      const startDistance = touchStartRef.current.distance;
      const pinchRatio = currentDistance / startDistance;

      // Check if we're outside the cooldown period
      const now = Date.now();
      if (now - lastPinchTimeRef.current < pinchCooldownRef.current) {
        return;
      }

      // Determine if it's a pinch-in or pinch-out
      if (pinchRatio < 1 - pinchThresholdRef.current) {
        // Pinch in (fingers moving together)
        if (onPinchIn) {
          onPinchIn();
          lastPinchTimeRef.current = now;
          touchStartRef.current = null;
        }
      } else if (pinchRatio > 1 + pinchThresholdRef.current) {
        // Pinch out (fingers moving apart)
        if (onPinchOut) {
          onPinchOut();
          lastPinchTimeRef.current = now;
          touchStartRef.current = null;
        }
      }
    },
    [getDistance, onPinchIn, onPinchOut]
  );

  // Handle touch end
  const handleTouchEnd = useCallback(() => {
    touchStartRef.current = null;
  }, []);

  // Handle mouse wheel for desktop pinch simulation
  const handleWheel = useCallback(
    (e) => {
      if (e.ctrlKey) {
        e.preventDefault();

        // Check if we're outside the cooldown period
        const now = Date.now();
        if (now - lastPinchTimeRef.current < pinchCooldownRef.current) {
          return;
        }

        if (e.deltaY > 0) {
          // Pinch in (zoom out)
          if (onPinchIn) {
            onPinchIn();
            lastPinchTimeRef.current = now;
          }
        } else {
          // Pinch out (zoom in)
          if (onPinchOut) {
            onPinchOut();
            lastPinchTimeRef.current = now;
          }
        }
      }
    },
    [onPinchIn, onPinchOut]
  );

  // Update mouse position on mouse move
  const handleMouseMove = useCallback((e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  // Add gesture event listeners to an element
  const addGestureListeners = useCallback(
    (element) => {
      if (element) {
        element.addEventListener("wheel", handleWheel, { passive: false });
        element.addEventListener("mousemove", handleMouseMove);
        element.addEventListener("touchstart", handleTouchStart, {
          passive: false,
        });
        element.addEventListener("touchmove", handleTouchMove, {
          passive: false,
        });
        element.addEventListener("touchend", handleTouchEnd);
        element.addEventListener("touchcancel", handleTouchEnd);
      }
    },
    [
      handleWheel,
      handleMouseMove,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
    ]
  );

  // Remove gesture event listeners from an element
  const removeGestureListeners = useCallback(
    (element) => {
      if (element) {
        element.removeEventListener("wheel", handleWheel);
        element.removeEventListener("mousemove", handleMouseMove);
        element.removeEventListener("touchstart", handleTouchStart);
        element.removeEventListener("touchmove", handleTouchMove);
        element.removeEventListener("touchend", handleTouchEnd);
        element.removeEventListener("touchcancel", handleTouchEnd);
      }
    },
    [
      handleWheel,
      handleMouseMove,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
    ]
  );

  return {
    mousePosition,
    addGestureListeners,
    removeGestureListeners,
  };
}
