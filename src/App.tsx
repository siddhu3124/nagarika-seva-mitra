
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import CitizenFeedbackForm from "./pages/citizen/FeedbackForm";
import MyFeedbacks from "./pages/citizen/MyFeedbacks";
import NearbyFeedback from "./pages/citizen/NearbyFeedback";
import MessagesFromOfficials from "./pages/citizen/MessagesFromOfficials";
import AnalyticsDashboard from "./pages/official/AnalyticsDashboard";
import SendMessages from "./pages/official/SendMessages";
import DistrictSummary from "./pages/official/DistrictSummary";
import ThankYouPage from "./pages/ThankYouPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/login" element={<LoginPage />} />
              
              {/* Citizen Routes */}
              <Route path="/citizen" element={
                <ProtectedRoute allowedRoles={["citizen"]}>
                  <CitizenFeedbackForm />
                </ProtectedRoute>
              } />
              <Route path="/citizen/feedback" element={
                <ProtectedRoute allowedRoles={["citizen"]}>
                  <CitizenFeedbackForm />
                </ProtectedRoute>
              } />
              <Route path="/citizen/my-feedbacks" element={
                <ProtectedRoute allowedRoles={["citizen"]}>
                  <MyFeedbacks />
                </ProtectedRoute>
              } />
              <Route path="/citizen/nearby" element={
                <ProtectedRoute allowedRoles={["citizen"]}>
                  <NearbyFeedback />
                </ProtectedRoute>
              } />
              <Route path="/citizen/messages" element={
                <ProtectedRoute allowedRoles={["citizen"]}>
                  <MessagesFromOfficials />
                </ProtectedRoute>
              } />
              <Route path="/thank-you" element={
                <ProtectedRoute allowedRoles={["citizen"]}>
                  <ThankYouPage />
                </ProtectedRoute>
              } />
              
              {/* Official Routes */}
              <Route path="/official" element={
                <ProtectedRoute allowedRoles={["official"]}>
                  <AnalyticsDashboard />
                </ProtectedRoute>
              } />
              <Route path="/official/dashboard" element={
                <ProtectedRoute allowedRoles={["official"]}>
                  <AnalyticsDashboard />
                </ProtectedRoute>
              } />
              <Route path="/official/send-messages" element={
                <ProtectedRoute allowedRoles={["official"]}>
                  <SendMessages />
                </ProtectedRoute>
              } />
              <Route path="/official/district-summary" element={
                <ProtectedRoute allowedRoles={["official"]}>
                  <DistrictSummary />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
