"use client";

import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
  AnimatePresence,
} from "framer-motion";
import {
  Children,
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

const DOCK_HEIGHT = 128;
const DEFAULT_MAGNIFICATION = 70;
const DEFAULT_DISTANCE = 140;
const DEFAULT_PANEL_HEIGHT = 64;

type DockOrientation = "horizontal" | "vertical";

type DockProps = {
  children: React.ReactNode;
  className?: string;
  distance?: number;
  panelHeight?: number;
  magnification?: number;
  spring?: SpringOptions;
  orientation?: DockOrientation;
  label?: string;
};
type DockItemProps = {
  className?: string;
  children: React.ReactNode;
};
type DockLabelProps = {
  className?: string;
  children: React.ReactNode;
};
type DockIconProps = {
  className?: string;
  children: React.ReactNode;
};

type DocContextType = {
  mouseX: MotionValue;
  mouseY: MotionValue;
  spring: SpringOptions;
  magnification: number;
  distance: number;
  orientation: DockOrientation;
};
type DockProviderProps = {
  children: React.ReactNode;
  value: DocContextType;
};

const DockContext = createContext<DocContextType | undefined>(undefined);

function DockProvider({ children, value }: DockProviderProps) {
  return <DockContext.Provider value={value}>{children}</DockContext.Provider>;
}

function useDock() {
  const context = useContext(DockContext);
  if (!context) {
    throw new Error("useDock must be used within an DockProvider");
  }
  return context;
}

// Adapted from a community Framer Motion "Apple-style dock" pattern for the
// admin dashboard nav — reskinned to this site's warm beige/paper/teal-deep
// palette (no dark-mode variants; the rest of the site doesn't have one).
function Dock({
  children,
  className,
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  panelHeight = DEFAULT_PANEL_HEIGHT,
  orientation = "horizontal",
  label = "Admin dashboard sections",
}: DockProps) {
  const mouseX = useMotionValue(Infinity);
  const mouseY = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);
  const vertical = orientation === "vertical";

  const maxSize = useMemo(() => {
    return Math.max(DOCK_HEIGHT, magnification + magnification / 2 + 4);
  }, [magnification]);

  const sizeRow = useTransform(isHovered, [0, 1], [panelHeight, maxSize]);
  const size = useSpring(sizeRow, spring);

  return (
    <motion.div
      style={vertical ? { width: size, scrollbarWidth: "none" } : { height: size, scrollbarWidth: "none" }}
      className={vertical ? "my-2 flex max-h-full flex-col items-center overflow-y-auto" : "mx-2 flex max-w-full items-end overflow-x-auto"}
    >
      <motion.div
        onMouseMove={(event) => {
          isHovered.set(1);
          if (vertical) mouseY.set(event.pageY);
          else mouseX.set(event.pageX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
          mouseY.set(Infinity);
        }}
        className={cn(
          vertical
            ? "my-auto flex h-fit flex-col gap-8 rounded-2xl border border-ink/10 bg-paper py-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
            : "mx-auto flex w-fit gap-8 rounded-2xl border border-ink/10 bg-paper px-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)]",
          className,
        )}
        style={vertical ? { width: panelHeight } : { height: panelHeight }}
        role="toolbar"
        aria-label={label}
      >
        <DockProvider value={{ mouseX, mouseY, spring, distance, magnification, orientation }}>
          {children}
        </DockProvider>
      </motion.div>
    </motion.div>
  );
}

function DockItem({ children, className, ...rest }: DockItemProps & { onClick?: () => void; "aria-pressed"?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  const { distance, magnification, mouseX, mouseY, spring, orientation } = useDock();
  const vertical = orientation === "vertical";

  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(vertical ? mouseY : mouseX, (val) => {
    const domRect = ref.current?.getBoundingClientRect() ?? { x: 0, y: 0, width: 0, height: 0 };
    return vertical
      ? val - domRect.y - domRect.height / 2
      : val - domRect.x - domRect.width / 2;
  });

  const sizeTransform = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [40, magnification, 40],
  );

  // Named "width" regardless of axis — DockIcon just halves whatever size
  // it's handed to compute icon size, and every existing DockItem usage is
  // aspect-square, so animating either axis keeps both in sync visually.
  const width = useSpring(sizeTransform, spring);

  return (
    <motion.div
      ref={ref}
      style={vertical ? { height: width } : { width }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      className={cn(
        "relative inline-flex items-center justify-center",
        className,
      )}
      tabIndex={0}
      role="button"
      {...rest}
    >
      {Children.map(children, (child) =>
        cloneElement(child as React.ReactElement, { width, isHovered } as never),
      )}
    </motion.div>
  );
}

function DockLabel({ children, className, ...rest }: DockLabelProps) {
  const { orientation } = useDock();
  const vertical = orientation === "vertical";
  const restProps = rest as Record<string, unknown>;
  const isHovered = restProps["isHovered"] as MotionValue<number>;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = isHovered.on("change", (latest) => {
      setIsVisible(latest === 1);
    });

    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={vertical ? { opacity: 0, x: 0 } : { opacity: 0, y: 0 }}
          animate={vertical ? { opacity: 1, x: 10 } : { opacity: 1, y: -10 }}
          exit={vertical ? { opacity: 0, x: 0 } : { opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            vertical
              ? "absolute left-full top-1/2 ml-2 w-fit whitespace-pre rounded-md border border-ink/10 bg-paper px-2 py-0.5 text-xs text-ink-muted shadow-sm"
              : "absolute -top-6 left-1/2 w-fit whitespace-pre rounded-md border border-ink/10 bg-paper px-2 py-0.5 text-xs text-ink-muted shadow-sm",
            className,
          )}
          role="tooltip"
          style={vertical ? { y: "-50%" } : { x: "-50%" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({ children, className, ...rest }: DockIconProps) {
  const restProps = rest as Record<string, unknown>;
  const width = restProps["width"] as MotionValue<number>;

  const widthTransform = useTransform(width, (val) => val / 2);

  return (
    <motion.div
      style={{ width: widthTransform }}
      className={cn("flex items-center justify-center", className)}
    >
      {children}
    </motion.div>
  );
}

export { Dock, DockIcon, DockItem, DockLabel };
