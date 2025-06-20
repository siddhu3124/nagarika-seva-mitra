
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import ThankYouPage from "./pages/ThankYouPage";
import NotFound from "./pages/NotFound";

// Citizen pages
import CitizenFeedbackForm from "./pages/citizen/FeedbackForm";
import MyFeedbacks from "./pages/citizen/MyFeedbacks";
import NearbyFeedback from "./pages/citizen/NearbyFeedback";
import MessagesFromOfficials from "./pages/citizen/MessagesFromOfficials";

// Official pages
import AnalyticsDashboard from "./pages/official/AnalyticsDashboard";
import FeedbackViewer from "./pages/official/FeedbackViewer";
import SendMessages from "./pages/official/SendMessages";
import DistrictSummary from "./pages/official/DistrictSummary";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/thank-you" element={<ThankYouPage />} />
              
              {/* Citizen routes */}
              <Route path="/citizen" element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <CitizenFeedbackForm />
                </ProtectedRoute>
              } />
              <Route path="/citizen/feedback" element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <CitizenFeedbackForm />
                </ProtectedRoute>
              } />
              <Route path="/citizen/my-feedbacks" element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <MyFeedbacks />
                </ProtectedRoute>
              } />
              <Route path="/citizen/nearby-feedback" element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <NearbyFeedback />
                </ProtectedRoute>
              } />
              <Route path="/citizen/messages" element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <MessagesFromOfficials />
                </ProtectedRoute>
              } />
              
              {/* Official routes */}
              <Route path="/official" element={
                <ProtectedRoute allowedRoles={['official']}>
                  <AnalyticsDashboard />
                </ProtectedRoute>
              } />
              <Route path="/official/dashboard" element={
                <ProtectedRoute allowedRoles={['official']}>
                  <AnalyticsDashboard />
                </ProtectedRoute>
              } />
              <Route path="/official/feedback" element={
                <ProtectedRoute allowedRoles={['official']}>
                  <FeedbackViewer />
                </ProtectedRoute>
              } />
              <Route path="/official/send-messages" element={
                <ProtectedRoute allowedRoles={['official']}>
                  <SendMessages />
                </ProtectedRoute>
              } />
              <Route path="/official/district-summary" element={
                <ProtectedRoute allowedRoles={['official']}>
                  <DistrictSummary />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
