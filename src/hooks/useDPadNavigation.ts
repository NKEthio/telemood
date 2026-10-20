import { useState, useEffect, useCallback, useRef } from 'react';

export type FocusArea = 'NAV_BAR' | 'SHOW_GRID' | 'MODAL_MOODS' | 'MODAL_ITINERARY' | 'SHOW_MODAL';

interface NavigationState {
  focusArea: FocusArea;
  navBarIndex: number;
  gridIndex: number;
  modalMoodIndex: number;
  modalActionIndex: number;
  showModalActionIndex: number;
}

export function useDPadNavigation(
  gridCount: number,
  moodsCount: number,
  gridColumns: number = 3,
  onSelectGridItem?: (index: number) => void,
  onSelectMood?: (index: number) => void,
  onOpenMoodModal?: () => void,
  onCloseModals?: () => void
) {
  const [navState, setNavState] = useState<NavigationState>({
    focusArea: 'SHOW_GRID',
    navBarIndex: 0, // 0: Panic Mood Button, 1: Category/Filter button if needed
    gridIndex: 0,
    modalMoodIndex: 0,
    modalActionIndex: 0,
    showModalActionIndex: 0
  });

  // Keep a ref to callbacks so useEffect event listener doesn't need re-binding continuously
  const callbacksRef = useRef({
    gridCount,
    moodsCount,
    gridColumns,
    onSelectGridItem,
    onSelectMood,
    onOpenMoodModal,
    onCloseModals
  });

  useEffect(() => {
    callbacksRef.current = {
      gridCount,
      moodsCount,
      gridColumns,
      onSelectGridItem,
      onSelectMood,
      onOpenMoodModal,
      onCloseModals
    };
  }, [gridCount, moodsCount, gridColumns, onSelectGridItem, onSelectMood, onOpenMoodModal, onCloseModals]);

  const setFocusArea = useCallback((area: FocusArea) => {
    setNavState(prev => ({ ...prev, focusArea: area }));
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const { key } = e;
    const { gridCount: gCount, moodsCount: mCount, gridColumns: cols } = callbacksRef.current;

    // Standard D-pad remote mapping
    const isUp = key === 'ArrowUp';
    const isDown = key === 'ArrowDown';
    const isLeft = key === 'ArrowLeft';
    const isRight = key === 'ArrowRight';
    const isEnter = key === 'Enter' || key === ' ';
    const isBack = key === 'Escape' || key === 'Backspace' || key === 'BrowserBack';

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', ' '].includes(key)) {
      e.preventDefault(); // Prevent scrolling page with arrow keys on webview
    }

    setNavState((prev) => {
      const { focusArea, navBarIndex, gridIndex, modalMoodIndex, modalActionIndex, showModalActionIndex } = prev;

      // Handle Back/Escape
      if (isBack) {
        if (focusArea !== 'SHOW_GRID' && focusArea !== 'NAV_BAR') {
          callbacksRef.current.onCloseModals?.();
          return { ...prev, focusArea: 'SHOW_GRID' };
        }
        return prev;
      }

      // NAV BAR FOCUS AREA (Header buttons, e.g., Panic Mood Generator)
      if (focusArea === 'NAV_BAR') {
        if (isDown) {
          return { ...prev, focusArea: 'SHOW_GRID', gridIndex: Math.min(prev.gridIndex, Math.max(0, gCount - 1)) };
        }
        if (isEnter) {
          if (navBarIndex === 0) {
            callbacksRef.current.onOpenMoodModal?.();
            return { ...prev, focusArea: 'MODAL_MOODS', modalMoodIndex: 0 };
          }
        }
        return prev;
      }

      // MAIN SHOW GRID FOCUS AREA
      if (focusArea === 'SHOW_GRID') {
        if (isUp) {
          if (gridIndex < cols) {
            // Jump to Nav Bar
            return { ...prev, focusArea: 'NAV_BAR', navBarIndex: 0 };
          }
          return { ...prev, gridIndex: Math.max(0, gridIndex - cols) };
        }
        if (isDown) {
          return { ...prev, gridIndex: Math.min(gCount - 1, gridIndex + cols) };
        }
        if (isLeft) {
          if (gridIndex % cols !== 0) {
            return { ...prev, gridIndex: gridIndex - 1 };
          }
          return prev;
        }
        if (isRight) {
          if (gridIndex % cols !== cols - 1 && gridIndex + 1 < gCount) {
            return { ...prev, gridIndex: gridIndex + 1 };
          }
          return prev;
        }
        if (isEnter) {
          callbacksRef.current.onSelectGridItem?.(gridIndex);
          return prev;
        }
      }

      // MODAL MOODS SELECTION AREA
      if (focusArea === 'MODAL_MOODS') {
        if (isUp) {
          return { ...prev, modalMoodIndex: Math.max(0, modalMoodIndex - 1) };
        }
        if (isDown) {
          return { ...prev, modalMoodIndex: Math.min(mCount - 1, modalMoodIndex + 1) };
        }
        if (isEnter) {
          callbacksRef.current.onSelectMood?.(modalMoodIndex);
          return { ...prev, focusArea: 'MODAL_ITINERARY', modalActionIndex: 0 };
        }
      }

      // MODAL ITINERARY RESULT AREA
      if (focusArea === 'MODAL_ITINERARY') {
        if (isUp || isDown || isLeft || isRight) {
          // Toggle action buttons inside itinerary view if multiple
          return prev;
        }
        if (isEnter) {
          callbacksRef.current.onCloseModals?.();
          return { ...prev, focusArea: 'SHOW_GRID' };
        }
      }

      // SHOW DETAIL MODAL AREA
      if (focusArea === 'SHOW_MODAL') {
        if (isEnter || isBack) {
          callbacksRef.current.onCloseModals?.();
          return { ...prev, focusArea: 'SHOW_GRID' };
        }
      }

      return prev;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    navState,
    setNavState,
    setFocusArea
  };
}
