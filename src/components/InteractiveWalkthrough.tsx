import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Compass,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Play,
  RotateCcw,
  Check,
  Search,
  Eye,
  Layers,
  Ruler,
  Table,
  FlaskConical,
  BookOpen,
} from 'lucide-react';

import { OrbitalColorScheme } from '../types/chemistry';

export interface WalkthroughStep {
  id: string;
  badge: string;
  title: string;
  description: string;
  tip?: string;
  targetSelector?: string;
  preferredPlacement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  onAction?: () => void;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentPage?: 'workbench' | 'periodic-table' | 'about';
  onNavigate?: (page: 'workbench' | 'periodic-table' | 'about') => void;
  onNavigatePage?: (page: 'workbench' | 'periodic-table' | 'about') => void;
  onLoadMolecule: (formula: string) => void;
  onToggle2D: () => void;
  is2DActive?: boolean;
  orbitalColorScheme?: OrbitalColorScheme;
  onChangeOrbitalColorScheme?: (scheme: OrbitalColorScheme) => void;
  onToggleQuantumColors?: () => void;
  isSnapToOrbit?: boolean;
  onToggleSnapToOrbit?: () => void;
  onOpenReactionPredictor?: () => void;
  onOpenPeriodicTable?: () => void;
}

export const InteractiveWalkthrough: React.FC<Props> = ({
  isOpen,
  onClose,
  currentPage,
  onNavigate,
  onNavigatePage,
  onLoadMolecule,
  onToggle2D,
  is2DActive,
  orbitalColorScheme,
  onChangeOrbitalColorScheme,
  onToggleQuantumColors,
  isSnapToOrbit,
  onToggleSnapToOrbit,
  onOpenReactionPredictor,
  onOpenPeriodicTable,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [actionDone, setActionDone] = useState<Record<string, boolean>>({});

  const navigateTo = useCallback((page: 'workbench' | 'periodic-table' | 'about') => {
    if (onNavigate) {
      onNavigate(page);
    } else if (onNavigatePage) {
      onNavigatePage(page);
    }
  }, [onNavigate, onNavigatePage]);

  const toggleQuantum = useCallback(() => {
    if (onToggleQuantumColors) {
      onToggleQuantumColors();
    } else if (onChangeOrbitalColorScheme) {
      onChangeOrbitalColorScheme(orbitalColorScheme === 'quantum_numbers' ? 'phase' : 'quantum_numbers');
    }
  }, [onToggleQuantumColors, onChangeOrbitalColorScheme, orbitalColorScheme]);

  // Define comprehensive steps for the interactive tour
  const steps: WalkthroughStep[] = useMemo(
    () => [
      {
        id: 'welcome',
        badge: 'Step 1 of 8 · Welcome to Orbitalis',
        title: 'Interactive Guided Walkthrough',
        description:
          'Welcome to Orbitalis — the next-generation 3D Molecular & Quantum Dynamics Workbench. This interactive tutorial guides you through searching chemical structures, manipulating photorealistic 3D molecules, visualizing quantum orbitals, snapping to standardized symmetry axes, and measuring bond angles.',
        tip: 'Click the action button below to enter the 3D Molecular Workbench, or navigate using Next / Back or keyboard arrow keys (← / →). Press Escape to exit at any time.',
        targetSelector: '#about-hero, #about-header, #header-search-container',
        preferredPlacement: 'bottom',
        actionLabel: '🚀 Launch 3D Workbench & Start Tour',
        actionIcon: <Play className="w-3.5 h-3.5 text-amber-300" />,
        onAction: () => {
          navigateTo('workbench');
          onLoadMolecule('H2O');
          setCurrentStepIndex(1);
        },
      },
      {
        id: 'search',
        badge: 'Step 2 of 8 · Molecular Ingestion',
        title: 'Instant 3D Molecular Search & Quick Chips',
        description:
          'Search any chemical formula (e.g. SF6, C6H6, Caffeine, Aspirin) or select one of the curated Quick-Try chips. Orbitalis instantly computes 3D Cartesian coordinates, VSEPR geometries, and thermodynamic properties.',
        tip: 'Type a formula and click "Render" or click one of the preset chips below the search bar.',
        targetSelector: '#header-search-container',
        preferredPlacement: 'bottom',
        actionLabel: 'Try Loading Benzene (C₆H₆)',
        actionIcon: <Search className="w-3.5 h-3.5 text-blue-400" />,
        onAction: () => {
          navigateTo('workbench');
          onLoadMolecule('C6H6');
        },
      },
      {
        id: 'canvas',
        badge: 'Step 3 of 8 · 3D Interactive Viewport',
        title: 'Photorealistic Studio PBR 3D Canvas',
        description:
          'Explore molecules with physically-based materials (PBR) and ACES Filmic tonemapping. Left-click and drag to orbit, right-click to rotate, and mouse scroll to zoom. Zooming is strictly isolated to the 3D viewer without scrolling the webpage!',
        tip: 'Use the bottom cinema dock to switch representations (Ball & Stick, Space-Filling vdW, Stick, Wireframe, ESP Map).',
        targetSelector: '#canvas-container',
        preferredPlacement: 'top',
        actionLabel: 'Center View & Load Methane (CH₄)',
        actionIcon: <Eye className="w-3.5 h-3.5 text-cyan-400" />,
        onAction: () => {
          navigateTo('workbench');
          onLoadMolecule('CH4');
        },
      },
      {
        id: 'quantum-orbitals',
        badge: 'Step 4 of 8 · Quantum Chemistry & Standard Axes',
        title: 'Quantum Numbers (n, l, m) & Snap-to-Orbit',
        description:
          'Visualize electron probability clouds! Toggle between classic Wavefunction Phase (+ / −) and the new Quantum Numbers (n, l, m) Energy Level Color-Coding, and use Snap-to-Orbit to lock orbital lobes to standardized mathematical symmetry axes for comparative analysis.',
        tip: 'Click "⚡ (n,l,m) Energy" or "📐 Snap-to-Orbit" in the bottom dock or Orbitals inspector tab to align hybrid lobes to ideal parent geometries.',
        targetSelector: '#snap-to-orbit-hud, #quantum-color-toggle, #canvas-container',
        preferredPlacement: 'top',
        actionLabel: 'Toggle Snap-to-Orbit Ideal Axes',
        actionIcon: <Compass className="w-3.5 h-3.5 text-sky-400" />,
        onAction: () => {
          navigateTo('workbench');
          if (onToggleSnapToOrbit) {
            onToggleSnapToOrbit();
          } else {
            toggleQuantum();
          }
        },
      },
      {
        id: 'measurement-tool',
        badge: 'Step 5 of 8 · Precision Caliper',
        title: 'Point-and-Click 3D Bond Angle Caliper',
        description:
          'Click any 2 atoms to measure interatomic distance (Å & pm). Click any 3 atoms to automatically detect the central vertex atom and render a glowing 3D arc, translucent sector wedge, and floating angle badge with real-time VSEPR ideal geometry comparison!',
        tip: 'The 3D angle badge hovers directly at the vertex atom in 3D space and rotates with camera orbit.',
        targetSelector: '#canvas-container',
        preferredPlacement: 'top',
        actionLabel: 'Load Water (H₂O) for Angle Caliper',
        actionIcon: <Ruler className="w-3.5 h-3.5 text-emerald-400" />,
        onAction: () => {
          navigateTo('workbench');
          onLoadMolecule('H2O');
        },
      },
      {
        id: '2d-chemview',
        badge: 'Step 6 of 8 · Planar Projection',
        title: '📐 2D Planar ChemView for All Molecules',
        description:
          'Switch seamlessly from 3D spheres to clean 2D Planar ChemView. In 2D mode, 3D sphere meshes, cylindrical bonds, and shadows are cleanly removed, rendering flat circular atomic tokens and bond lines perpendicular to the molecular plane.',
        tip: 'Available on every molecule from H₂O to Aspirin and Caffeine!',
        targetSelector: '#sidebar-2d-toggle',
        preferredPlacement: 'right',
        actionLabel: 'Toggle 2D / 3D Mode',
        actionIcon: <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />,
        onAction: () => {
          navigateTo('workbench');
          onToggle2D();
        },
      },
      {
        id: 'sidebar-nav',
        badge: 'Step 7 of 8 · Global Navigation',
        title: 'Persistent Floating Sidebar Menu',
        description:
          'Your persistent command dock! Jump instantaneously between the 3D Molecular Workbench, the full 118-element IUPAC Periodic Table, the Chemical Reaction Predictor, and the VSEPR Theory Solver.',
        tip: 'The sidebar is smoothly elevated on the left edge with dedicated clearance so it never overlaps page content.',
        targetSelector: '#floating-sidebar',
        preferredPlacement: 'right',
        actionLabel: 'Explore 118 Periodic Table',
        actionIcon: <Table className="w-3.5 h-3.5 text-teal-400" />,
        onAction: () => {
          if (onOpenPeriodicTable) onOpenPeriodicTable();
          else navigateTo('periodic-table');
        },
      },
      {
        id: 'notebook',
        badge: 'Step 8 of 8 · Scientific Notebook',
        title: 'Capture 3D States in Your Lab Notebook',
        description:
          'Record experiment observations and capture 1-click snapshots of active vibration modes, measured bond angles, thermal temperatures, and dipole moments. Export to Markdown or restore past molecular states with 1 click.',
        tip: 'Click "Lab Notebook" in the inspector to review observations and export publication-ready reports.',
        targetSelector: '#property-inspector-tabs, #canvas-container',
        preferredPlacement: 'left',
        actionLabel: 'Complete Tour & Start Exploring',
        actionIcon: <Check className="w-3.5 h-3.5 text-emerald-400" />,
        onAction: () => {
          navigateTo('workbench');
          onClose();
        },
      },
    ],
    [
      onLoadMolecule,
      navigateTo,
      onToggle2D,
      toggleQuantum,
      onToggleSnapToOrbit,
      onOpenPeriodicTable,
      onClose,
    ]
  );

  const currentStep = steps[currentStepIndex];

  // Auto-navigate to workbench if we progress past the landing page step while on 'about'
  useEffect(() => {
    if (!isOpen) return;
    if (currentStepIndex >= 1 && currentPage === 'about') {
      navigateTo('workbench');
    }
  }, [isOpen, currentStepIndex, currentPage, navigateTo]);

  // Update target element bounding rectangle when step changes or window resizes
  const updateTargetRect = useCallback(() => {
    if (!isOpen || !currentStep?.targetSelector) {
      setTargetRect(null);
      return;
    }
    const selectors = currentStep.targetSelector.split(',').map((s) => s.trim());
    let el: Element | null = null;
    for (const sel of selectors) {
      el = document.querySelector(sel);
      if (el) break;
    }
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
    } else {
      setTargetRect(null);
    }
  }, [isOpen, currentStep]);

  useEffect(() => {
    updateTargetRect();
    // Re-check after small delays to accommodate transitions and DOM mounting
    const timer1 = setTimeout(updateTargetRect, 60);
    const timer2 = setTimeout(updateTargetRect, 200);

    const handleResize = () => updateTargetRect();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [updateTargetRect, currentPage]);

  // Keyboard navigation: Left/Right arrows, Escape to exit
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        if (currentStepIndex < steps.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentStepIndex > 0) {
          setCurrentStepIndex((prev) => prev - 1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStepIndex, steps.length, onClose]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      try {
        localStorage.setItem('orbitalis_walkthrough_seen', 'true');
      } catch {
        // Ignore localStorage quota errors
      }
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleExecuteAction = () => {
    if (currentStep.onAction) {
      currentStep.onAction();
      setActionDone((prev) => ({ ...prev, [currentStep.id]: true }));
    }
  };

  // Calculate Popover Position relative to Target Rect
  const calculatePopoverStyle = (): React.CSSProperties => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (!targetRect || isMobile) {
      return {
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(440px, 92vw)',
        zIndex: 60,
      };
    }

    const margin = 16;
    const popoverWidth = 420;
    const popoverHeight = 290;
    const placement = currentStep.preferredPlacement || 'bottom';

    let top = 0;
    let left = 0;

    if (placement === 'bottom') {
      top = targetRect.bottom + margin;
      left = Math.max(20, Math.min(window.innerWidth - popoverWidth - 20, targetRect.left + (targetRect.width - popoverWidth) / 2));
    } else if (placement === 'top') {
      top = Math.max(20, targetRect.top - popoverHeight - margin);
      left = Math.max(20, Math.min(window.innerWidth - popoverWidth - 20, targetRect.left + (targetRect.width - popoverWidth) / 2));
    } else if (placement === 'right') {
      top = Math.max(20, Math.min(window.innerHeight - popoverHeight - 20, targetRect.top + (targetRect.height - popoverHeight) / 2));
      left = targetRect.right + margin;
    } else if (placement === 'left') {
      top = Math.max(20, Math.min(window.innerHeight - popoverHeight - 20, targetRect.top + (targetRect.height - popoverHeight) / 2));
      left = Math.max(20, targetRect.left - popoverWidth - margin);
    } else {
      top = (window.innerHeight - popoverHeight) / 2;
      left = (window.innerWidth - popoverWidth) / 2;
    }

    // Ensure within viewport
    top = Math.max(16, Math.min(window.innerHeight - popoverHeight - 16, top));
    left = Math.max(16, Math.min(window.innerWidth - popoverWidth - 16, left));

    return {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      width: `${popoverWidth}px`,
      zIndex: 60,
    };
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none pointer-events-auto">
      {/* Semi-transparent Backdrop with Target Element Highlight Cutout */}
      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px] transition-all duration-300">
        {targetRect && (
          <div
            className="absolute rounded-2xl border-2 border-cyan-400 ring-4 ring-cyan-400/25 pointer-events-none transition-all duration-300 shadow-2xl"
            style={{
              top: `${Math.max(0, targetRect.top - 6)}px`,
              left: `${Math.max(0, targetRect.left - 6)}px`,
              width: `${targetRect.width + 12}px`,
              height: `${targetRect.height + 12}px`,
              boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.65)',
            }}
          />
        )}
      </div>

      {/* Floating Contextual Tour Card */}
      <div
        style={calculatePopoverStyle()}
        className="rounded-2xl bg-slate-900 border border-cyan-500/50 shadow-2xl text-slate-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Top Progress Bar */}
        <div className="w-full bg-slate-800 h-1">
          <div
            className="bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 h-1 transition-all duration-300"
            style={{
              width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
            }}
          />
        </div>

        {/* Header Bar */}
        <div className="p-4 pb-2 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/20 text-cyan-400 border border-blue-500/30">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block font-mono">
                {currentStep.badge}
              </span>
              <h3 className="text-sm font-bold text-white leading-tight">
                {currentStep.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            title="Skip Walkthrough (Esc)"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-3 text-xs">
          <p className="text-slate-300 leading-relaxed text-[11px] sm:text-xs">
            {currentStep.description}
          </p>

          {currentStep.tip && (
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300 flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>{currentStep.tip}</span>
            </div>
          )}

          {/* Interactive Feature Trigger Action */}
          {currentStep.actionLabel && (
            <div className="pt-1">
              <button
                onClick={handleExecuteAction}
                className="w-full py-2 px-3 rounded-xl bg-blue-600/90 hover:bg-blue-600 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 active:scale-98 cursor-pointer"
              >
                {currentStep.actionIcon || <Play className="w-3.5 h-3.5" />}
                <span>{currentStep.actionLabel}</span>
                {actionDone[currentStep.id] && (
                  <Check className="w-3.5 h-3.5 text-emerald-300 ml-1" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Footer Navigation Controls */}
        <div className="p-3 bg-slate-950/70 border-t border-slate-800 flex items-center justify-between gap-2">
          {/* Step Dots */}
          <div className="flex items-center gap-1.5">
            {steps.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentStepIndex(idx)}
                title={`Go to ${s.title}`}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  currentStepIndex === idx
                    ? 'w-5 bg-cyan-400 shadow-sm'
                    : 'w-1.5 bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>

          {/* Buttons: Back / Next */}
          <div className="flex items-center gap-2">
            {currentStepIndex > 0 && (
              <button
                onClick={handlePrev}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px] transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
            >
              <span>{currentStepIndex === steps.length - 1 ? 'Finish Tour' : 'Next'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
