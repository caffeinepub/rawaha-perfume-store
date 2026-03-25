import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import HomePage from "./pages/HomePage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductsPage from "./pages/ProductsPage";

type Route =
  | { path: "/" }
  | { path: "/products" }
  | { path: "/products/:id"; id: string }
  | { path: "/cart" }
  | { path: "/checkout" }
  | { path: "/order-success" }
  | { path: "/admin" }
  | { path: "/admin/products" }
  | { path: "/admin/categories" }
  | { path: "/admin/orders" }
  | { path: "/collections" }
  | { path: "/gifting" }
  | { path: "/story" };

function parseRoute(pathname: string): Route {
  if (pathname === "/" || pathname === "") return { path: "/" };
  if (pathname === "/products") return { path: "/products" };
  if (pathname.startsWith("/products/")) {
    const id = pathname.slice("/products/".length);
    return { path: "/products/:id", id };
  }
  if (pathname === "/cart") return { path: "/cart" };
  if (pathname === "/checkout") return { path: "/checkout" };
  if (pathname === "/order-success") return { path: "/order-success" };
  if (pathname === "/admin/products") return { path: "/admin/products" };
  if (pathname === "/admin/categories") return { path: "/admin/categories" };
  if (pathname === "/admin/orders") return { path: "/admin/orders" };
  if (pathname === "/admin") return { path: "/admin" };
  if (pathname === "/collections") return { path: "/collections" };
  if (pathname === "/gifting") return { path: "/gifting" };
  if (pathname === "/story") return { path: "/story" };
  return { path: "/" };
}

function isAdminRoute(route: Route): boolean {
  return (
    route.path === "/admin" ||
    route.path === "/admin/products" ||
    route.path === "/admin/categories" ||
    route.path === "/admin/orders"
  );
}

export default function App() {
  const [route, setRoute] = useState<Route>(() =>
    parseRoute(window.location.pathname),
  );

  const navigate = (path: string) => {
    window.history.pushState(null, "", path);
    setRoute(parseRoute(path));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handlePop = () => setRoute(parseRoute(window.location.pathname));
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  const isAdmin = isAdminRoute(route);

  const getAdminSection = () => {
    if (route.path === "/admin/products") return "products" as const;
    if (route.path === "/admin/categories") return "categories" as const;
    if (route.path === "/admin/orders") return "orders" as const;
    return "dashboard" as const;
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {!isAdmin && <Header currentPath={route.path} onNavigate={navigate} />}

      <main className={isAdmin ? "" : "flex-1"}>
        {route.path === "/" && <HomePage onNavigate={navigate} />}
        {route.path === "/products" && <ProductsPage onNavigate={navigate} />}
        {route.path === "/products/:id" && (
          <ProductDetailPage productId={route.id} onNavigate={navigate} />
        )}
        {route.path === "/cart" && <CartPage onNavigate={navigate} />}
        {route.path === "/checkout" && <CheckoutPage onNavigate={navigate} />}
        {route.path === "/order-success" && (
          <OrderSuccessPage onNavigate={navigate} />
        )}
        {(route.path === "/admin" ||
          route.path === "/admin/products" ||
          route.path === "/admin/categories" ||
          route.path === "/admin/orders") && (
          <AdminPage onNavigate={navigate} section={getAdminSection()} />
        )}
        {(route.path === "/collections" ||
          route.path === "/gifting" ||
          route.path === "/story") && <ProductsPage onNavigate={navigate} />}
      </main>

      {!isAdmin && <Footer onNavigate={navigate} />}
      <Toaster richColors position="top-right" />
    </div>
  );
}
