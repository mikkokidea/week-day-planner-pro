import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
  const linkCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-muted text-primary"
      : "hover:bg-muted/60";

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <NavLink to="/" className="font-semibold tracking-tight">
          Päivä & Viikko
        </NavLink>
        <nav className="flex gap-2">
          <Button variant="ghost" asChild>
            <NavLink to="/viikko" className={linkCls}>
              Viikkosuunnittelu
            </NavLink>
          </Button>
          <Button variant="default" asChild>
            <NavLink to="/paiva" className={linkCls}>
              Päiväsuunnittelu
            </NavLink>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
