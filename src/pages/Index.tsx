import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Helmet>
        <title>Päivä- ja viikkosuunnittelu | Tehokas suunnittelija</title>
        <meta name="description" content="Luo viikkosuunnitelma ja päiväsuunnitelma helposti puhelimella. Aseta 3 viikon päätavoitetta ja pilko päiväsi töihin." />
        <link rel="canonical" href="/" />
      </Helmet>
      <div className="text-center px-6">
        <h1 className="text-4xl font-bold mb-4">Suunnittele viikko ja päiväsi</h1>
        <p className="text-lg text-muted-foreground mb-8">Aseta viikon 3 tärkeintä tavoitetta ja tee päivän suunnitelma projektien ympärille.</p>
        <div className="flex gap-3 justify-center">
          <Button variant="hero" asChild>
            <NavLink to="/viikko">Aloita viikkosuunnittelulla</NavLink>
          </Button>
          <Button variant="secondary" asChild>
            <NavLink to="/paiva">Suoraan päivän suunnitelmaan</NavLink>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
