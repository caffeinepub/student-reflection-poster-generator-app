import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import AppLayout from "./components/AppLayout";
import AuthGate from "./components/AuthGate";
import ProfileSetupDialog from "./components/ProfileSetupDialog";
import { useGetCallerUserProfile } from "./hooks/queries/useUserProfile";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import GeneratorPage from "./pages/GeneratorPage";
import PortfolioPage from "./pages/PortfolioPage";
import ReflectionEditorPage from "./pages/ReflectionEditorPage";

type Page = "reflections" | "generator" | "portfolio";

export default function App() {
  const { identity } = useInternetIdentity();
  const [currentPage, setCurrentPage] = useState<Page>("reflections");
  const isAuthenticated = !!identity;

  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();

  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (!isAuthenticated) {
    return (
      <>
        <AuthGate />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <AppLayout currentPage={currentPage} onNavigate={setCurrentPage}>
        {currentPage === "reflections" && <ReflectionEditorPage />}
        {currentPage === "generator" && <GeneratorPage />}
        {currentPage === "portfolio" && <PortfolioPage />}
      </AppLayout>
      {showProfileSetup && <ProfileSetupDialog />}
      <Toaster />
    </>
  );
}
