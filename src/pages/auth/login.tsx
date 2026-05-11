import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { loginSchema, LoginFormData } from "@/lib/schemas/validation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  loginStarted,
  loginFinished,
  loginError,
  clearError,
} from "@/redux/slices/authSlice";
import { LOGIN_USER } from "@/lib/graphql/mutations";
import { config } from "@/lib/config";
import { User, UserRole } from "@/lib/types/api";

function normalizeAuthUser(u: {
  id: string | number;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  role: string;
  avatar_url?: string | null;
  is_active: boolean;
  last_login_at?: string | null;
  createdAt?: string | null;
  updated_at?: string | null;
  updatedAt?: string | null;
}): User {
  const now = new Date().toISOString();
  return {
    id: String(u.id),
    email: u.email,
    first_name: u.first_name ?? "",
    last_name: u.last_name ?? "",
    role: u.role as UserRole,
    avatar_url: u.avatar_url ?? undefined,
    is_active: u.is_active,
    last_login_at: u.last_login_at ?? undefined,
    createdAt: u.createdAt ?? now,
    updated_at: u.updated_at ?? u.updatedAt ?? now,
  };
}

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.auth);

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  const [loginMutation, { loading: mutationLoading }] = useMutation(LOGIN_USER);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    dispatch(clearError());
    dispatch(loginStarted());

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await loginMutation({
        variables: {
          email: data.email,
          password: data.password,
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      if (result.data?.loginUser?.success) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const { user, token } = result.data.loginUser as {
          user: Parameters<typeof normalizeAuthUser>[0];
          token: string;
        };
        const normalizedUser = normalizeAuthUser(user);

        // Only allow admin logins into the admin app
        if (normalizedUser.role !== UserRole.ADMIN) {
          dispatch(loginError());
          toast({
            title: "Access denied",
            description: "This account does not have admin access.",
            variant: "destructive",
          });
          return;
        }

        // Save to localStorage
        localStorage.setItem(config.tokenKey, token);
        localStorage.setItem(config.userKey, JSON.stringify(normalizedUser));

        dispatch(loginFinished({ user: normalizedUser, token }));

        toast({
          title: "Welcome back!",
          description: "You've been logged in successfully.",
        });
        navigate(from, { replace: true });
      } else {
        const message =
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          (result.data?.loginUser?.message as string | undefined) ||
          "Invalid email or password.";
        dispatch(loginError());
        toast({
          title: "Sign in failed",
          description: message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      dispatch(loginError());
      toast({
        title: "Sign in failed",
        description:
          error instanceof Error ? error.message : "Unexpected login error.",
        variant: "destructive",
      });
    }
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (currentUser) {
      navigate(from, { replace: true });
    }
  }, [currentUser, navigate, from]);

  const isLoading = mutationLoading;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.18),transparent_55%),radial-gradient(ellipse_at_bottom,hsl(var(--ring)/0.10),transparent_50%)]" />
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
              <Lock className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Sign in to your Zohar Media Admin account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleSubmit(onSubmit)(e);
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  {...register("password")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                />
                <Label
                  htmlFor="remember"
                  className="text-sm text-muted-foreground"
                >
                  Remember me
                </Label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
