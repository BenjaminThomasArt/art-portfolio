import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Shop from "./pages/Shop";
import ArtworkDetail from "./pages/ArtworkDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Upcycles from "./pages/Upcycles";
import InSituGallery from "./pages/InSituGallery";

function Router() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-16">
        <Switch>
          <Route path={"/"} component={Home} />
          <Route path="/gallery" component={Gallery} />
          <Route path="/shop" component={Shop} />
          <Route path="/upcycles" component={Upcycles} />
          <Route path="/in-situ" component={InSituGallery} />
          <Route path="/artwork/:id" component={ArtworkDetail} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path={"/404"} component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
