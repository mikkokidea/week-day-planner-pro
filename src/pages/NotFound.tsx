import { useLocation, NavLink } from "react-router-dom";
import { useEffect } from "react";
import PageContainer from "@/components/PageContainer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Sivua ei löytynyt
        </p>
        <NavLink
          to="/"
          className="text-[hsl(var(--brand))] font-medium hover:underline underline-offset-4"
        >
          Palaa etusivulle
        </NavLink>
      </div>
    </PageContainer>
  );
};

export default NotFound;
