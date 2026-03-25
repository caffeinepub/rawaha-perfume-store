import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShoppingCart,
  Tag,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { UserRole } from "../backend";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsAdmin } from "../hooks/useQueries";
import AdminCategories from "./AdminCategories";
import AdminDashboard from "./AdminDashboard";
import AdminOrders from "./AdminOrders";
import AdminProducts from "./AdminProducts";

type AdminSection = "dashboard" | "products" | "categories" | "orders";

interface AdminPageProps {
  onNavigate: (path: string) => void;
  section?: AdminSection;
}

const navItems = [
  {
    id: "dashboard" as AdminSection,
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin",
  },
  {
    id: "products" as AdminSection,
    label: "Products",
    icon: Package,
    path: "/admin/products",
  },
  {
    id: "categories" as AdminSection,
    label: "Categories",
    icon: Tag,
    path: "/admin/categories",
  },
  {
    id: "orders" as AdminSection,
    label: "Orders",
    icon: ShoppingCart,
    path: "/admin/orders",
  },
];

export default function AdminPage({
  onNavigate,
  section = "dashboard",
}: AdminPageProps) {
  const { login, clear, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin();
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);

  const isLoggedIn = loginStatus === "success" && !!identity;

  const handleClaimAdmin = async () => {
    if (!actor || !identity) return;
    setClaiming(true);
    setClaimError(null);
    try {
      await actor.assignCallerUserRole(identity.getPrincipal(), UserRole.admin);
      await queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
    } catch (err: any) {
      setClaimError(err?.message ?? "Failed to claim admin access.");
    } finally {
      setClaiming(false);
    }
  };

  if (isInitializing || (isLoggedIn && checkingAdmin)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-gold" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-6">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold uppercase tracking-luxury text-foreground">
            Admin Portal
          </h1>
          <p className="mt-3 text-muted-foreground">
            Sign in to manage your store
          </p>
        </div>
        <div className="w-full max-w-sm rounded-lg border border-border bg-card p-8">
          <Button
            data-ocid="admin.primary_button"
            onClick={login}
            disabled={loginStatus === "logging-in"}
            className="w-full bg-gold py-6 text-sm font-semibold uppercase tracking-luxury text-primary-foreground hover:bg-gold/90"
          >
            {loginStatus === "logging-in"
              ? "Signing In..."
              : "Sign In with Internet Identity"}
          </Button>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Secure authentication powered by Internet Computer
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold uppercase tracking-luxury text-foreground">
            {claimError ? "Access Denied" : "First Time Setup"}
          </h1>
          <p className="mt-3 text-muted-foreground">
            {claimError
              ? claimError
              : "You're logged in but not yet an admin. Click below to claim admin access."}
          </p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Button
            data-ocid="admin.primary_button"
            onClick={handleClaimAdmin}
            disabled={claiming}
            className="bg-gold px-8 py-5 text-sm font-semibold uppercase tracking-luxury text-primary-foreground hover:bg-gold/90"
          >
            {claiming ? "Claiming..." : "Claim Admin Access"}
          </Button>
          <Button
            data-ocid="admin.secondary_button"
            onClick={clear}
            variant="outline"
            className="border-border bg-transparent text-foreground hover:border-gold hover:text-gold"
          >
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  const handleNavigation = (path: string) => {
    onNavigate(path);
    setMobileNavOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-sidebar lg:flex">
        <div className="border-b border-border px-5 py-6">
          <p className="font-display text-lg font-bold uppercase tracking-luxury text-gold">
            RAWAHA
          </p>
          <p className="text-xs text-muted-foreground">Admin</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {navItems.map((item) => (
            <button
              type="button"
              key={item.id}
              data-ocid="admin_nav.link"
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                section === item.id
                  ? "bg-gold/10 text-gold"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <button
            type="button"
            onClick={clear}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between border-b border-border bg-sidebar px-4 py-3 lg:hidden">
        <p className="font-display font-bold uppercase tracking-luxury text-gold">
          RAWAHA Admin
        </p>
        <button
          type="button"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="text-foreground"
        >
          {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile nav drawer */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            className="fixed inset-y-0 left-0 z-50 w-56 border-r border-border bg-sidebar pt-14 lg:hidden"
          >
            <nav className="flex flex-col gap-1 p-3">
              {navItems.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                    section === item.id
                      ? "bg-gold/10 text-gold"
                      : "text-muted-foreground"
                  }`}
                >
                  <item.icon size={16} />
                  {item.label}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-1 overflow-auto p-6 pt-6 lg:pt-6 mt-14 lg:mt-0">
        {section === "dashboard" && <AdminDashboard onNavigate={onNavigate} />}
        {section === "products" && <AdminProducts onNavigate={onNavigate} />}
        {section === "categories" && (
          <AdminCategories onNavigate={onNavigate} />
        )}
        {section === "orders" && <AdminOrders onNavigate={onNavigate} />}
      </main>
    </div>
  );
}
