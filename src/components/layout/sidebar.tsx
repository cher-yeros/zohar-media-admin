import { Link, useLocation } from "react-router-dom";
import { ADMIN_DASHBOARD_TAGLINE, LOGO_PATH, SITE_NAME } from "@/lib/branding";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageSquare,
  Image,
  Star,
  BarChart3,
  Sun,
  Users,
  FolderOpen,
  Tag,
  Settings,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/theme-provider";
import { useAppSelector } from "@/redux/hooks";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Inquiries",
    href: "/inquiries",
    icon: MessageSquare,
  },
  {
    name: "Media",
    href: "/media",
    icon: Image,
  },
  {
    name: "Testimonials",
    href: "/testimonials",
    icon: Star,
  },
  {
    name: "Team",
    href: "/team",
    icon: Users,
  },
  {
    name: "Portfolio",
    href: "/portfolio",
    icon: FolderOpen,
  },
  {
    name: "Categories",
    href: "/portfolio-categories",
    icon: Tag,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { currentUser } = useAppSelector((state) => state.auth);

  const displayName =
    [currentUser?.first_name, currentUser?.last_name]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    currentUser?.email ||
    "Admin";

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-5">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img
            src={LOGO_PATH}
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 rounded-md object-contain"
          />
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold tracking-tight">
              {SITE_NAME}
            </h1>
            <p className="truncate text-xs text-muted-foreground">
              {ADMIN_DASHBOARD_TAGLINE}
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navigation.map((item) => {
          const isActive =
            item.href === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent/60 hover:text-accent-foreground",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground",
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground",
                )}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
            {(displayName.charAt(0) || "A").toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{displayName}</p>
            <p className="truncate text-xs text-muted-foreground">
              {currentUser?.email || "Signed in"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border bg-background/60 px-3 py-2">
          <div className="flex items-center gap-2 text-sm">
            <Sun className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Dark mode</span>
          </div>
          <Switch
            checked={theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
        </div>
      </div>
    </aside>
  );
}
