import { cn } from "@/lib/utils";
import { LucideChevronsLeft } from "lucide-react";
import { useEffect, useState } from "react";

type RightMenuProps = {
  selectedItemId: string | null;
  setSelectedItemId: (id: string | null) => void;
};

const ANIMATION_DURATION = 200;

export default function RightMenu({
  selectedItemId,
  setSelectedItemId,
}: RightMenuProps) {
  const [isVisible, setIsVisible] = useState(!!selectedItemId);

  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    if (selectedItemId) {
      animateIn();
    }

    if (!selectedItemId) {
      animateOut();
    }
  }, [selectedItemId]);

  const animateIn = () => {
    setIsAnimatingIn(true);
    setIsVisible(true);

    setTimeout(() => {
      setIsAnimatingIn(false);
    }, ANIMATION_DURATION);
  };

  const animateOut = () => {
    setIsAnimatingOut(true);

    setTimeout(() => {
      setIsVisible(false);
      setIsAnimatingOut(false);
    }, ANIMATION_DURATION);
  };

  return (
    <div
      className={cn(
        `bg-slate-900
         shadow
         h-full
         w-[400px]
         absolute
         top-0
         right-0
         z-50
         text-white
         p-4
         flex
         flex-col
         gap-4
         pt-12

         transition-all
       `,
        isVisible ? "visible" : "invisible",
        isAnimatingIn && "custom-slide-in-from-right",
        isAnimatingOut && "custom-slide-out-to-right"
      )}
      style={{
        animationDuration: `${ANIMATION_DURATION}ms`,
      }}
    >
      <div
        className="absolute top-2 left-2 p-2 cursor-pointer hover:bg-slate-700 rounded-full transition-colors"
        onClick={() => setSelectedItemId(null)}
      >
        <LucideChevronsLeft />
      </div>

      <h2 className="text-lg">Selected Item</h2>
      <div>Selected Item: {selectedItemId}</div>
    </div>
  );
}
