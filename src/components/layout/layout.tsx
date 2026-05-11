import { Outlet, Link, useLocation } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { logoutUser } from "@/redux/slices/authSlice";
import { config } from "@/lib/config";

const routeTitles: Array<{ href: string; title: string }> = [
  { href: "/", title: "Dashboard" },
  { href: "/inquiries", title: "Inquiries" },
  { href: "/media", title: "Media" },
  { href: "/testimonials", title: "Testimonials" },
  { href: "/team", title: "Team" },
  { href: "/portfolio", title: "Portfolio" },
  { href: "/portfolio-categories", title: "Categories" },
  { href: "/analytics", title: "Analytics" },
  { href: "/settings", title: "Settings" },
  { href: "/profile", title: "Profile" },
];

export function Layout() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.auth);

  const currentTitle =
    routeTitles.find((r) => r.href === location.pathname)?.title ?? "Admin";

  const displayName =
    [currentUser?.first_name, currentUser?.last_name]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    currentUser?.email ||
    "User";

  const avatarInitial = (
    currentUser?.first_name?.charAt(0) ||
    currentUser?.email?.charAt(0) ||
    "?"
  ).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem(config.tokenKey);
    localStorage.removeItem(config.userKey);
    dispatch(logoutUser());
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-muted/30">
        <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
            <div className="min-w-0">
              <h1 className="text-lg font-semibold truncate">{currentTitle}</h1>
            </div>

            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-10 px-2">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                        {currentUser.avatar_url ? (
                          <img
                            src={currentUser.avatar_url}
                            alt={displayName}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-medium text-primary">
                            {avatarInitial}
                          </span>
                        )}
                      </div>
                      <div className="hidden sm:block text-left leading-tight">
                        <p className="text-sm font-medium max-w-[220px] truncate">
                          {displayName}
                        </p>
                        <p className="text-xs text-muted-foreground max-w-[220px] truncate">
                          {currentUser.email}
                        </p>
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {displayName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {currentUser.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </header>

        <div className="container mx-auto max-w-7xl p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
