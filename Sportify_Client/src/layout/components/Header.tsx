import { useEffect, useState } from "react";
import { ChevronDown, LayoutDashboardIcon, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/stores/useAuthStore";
import { buttonVariants } from "../../components/ui/button";
import { Input } from "@/components/ui/input";
import SpotifyLoader from "./SpotifyLoader";

export function Header() {
  const { user: authUser, isAuth, isAdmin, logout } = useAuthStore();

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      const params = new URLSearchParams({
        query: searchQuery.trim(),
      }).toString();

      navigate(`/search?${params}`);
    }
  };

  if (isLoading) {
    return <SpotifyLoader />;
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        <Link to={"/"} className="flex gap-2 items-center cursor-pointer">
          <img src="/spotify.png" className="size-8" alt="Spotify logo" />
          Spotify
        </Link>
      </div>

      <form
        onSubmit={handleSearch}
        className="relative ml-auto flex-1 md:grow-0 md:w-80"
      >
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />

        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-80"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>

      <div className="relative ml-auto flex-1 md:grow-0 md:w-80">
        {isAdmin && (
          <Link
            to={"/admin"}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <LayoutDashboardIcon className="size-4 mr-2 cursor-pointer" />
            Admin Dashboard
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Separator orientation="vertical" className="h-8" />

        {isAuth ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 flex items-center gap-2 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={authUser?.avatarUrl} alt="Avatar" />

                  <AvatarFallback>
                    {authUser?.fullName.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>

                <div className="hidden md:block text-sm font-medium">
                  {authUser?.fullName}
                </div>

                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  to={`/profile/${authUser?.id}`}
                  className="cursor-pointer"
                >
                  Profile
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link to={"/settings"} className="cursor-pointer">
                  Settings
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={logout} asChild>
                <Link to={"/login"} className="cursor-pointer">
                  Logout
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <button>
            <Link to={"/login"}>
              <span>Login</span>
            </Link>
          </button>
        )}
      </div>
    </header>
  );
}
