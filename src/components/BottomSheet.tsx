import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import type { ReactNode } from "react";

interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
}

export default function BottomSheet({ open, onOpenChange, title, children }: BottomSheetProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh] rounded-t-3xl border border-border border-b-0 bg-card">
        <DrawerHeader className="pb-2">
          <DrawerTitle className="font-display text-lg font-bold">{title}</DrawerTitle>
        </DrawerHeader>
        <div className="px-5 pb-5 pb-[env(safe-area-inset-bottom,20px)] overflow-y-auto">{children}</div>
      </DrawerContent>
    </Drawer>
  );
}
