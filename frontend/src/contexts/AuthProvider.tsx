import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { LoginType, RegisterType } from "@/schemes/auth.schema.ts";
import type { UserProfile } from "@/schemes/user.schema.ts";
import type { IAuthService } from "@/services/auth/IAuthService.ts";

interface AuthContextType {
  currentUser: UserProfile | null;
  isLoading: boolean;
  login: (data: LoginType) => Promise<UserProfile>;
  register: (data: RegisterType) => Promise<UserProfile>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  authService: IAuthService;
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({
  authService,
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const user = authService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Failed to get current user:", error);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkCurrentUser();
  }, [authService]);

  const handleLogin = async (data: LoginType): Promise<UserProfile> => {
    try {
      setIsLoading(true);
      const user = await authService.login(data);
      setCurrentUser(user);
      return user;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegisterType): Promise<UserProfile> => {
    try {
      setIsLoading(true);
      const user = await authService.register(data);
      setCurrentUser(user);
      return user;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.logout();
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // The value that will be provided to consumers of the context
  const contextValue: AuthContextType = {
    currentUser,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
