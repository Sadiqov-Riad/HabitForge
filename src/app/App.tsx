import HeroPage from "@/pages/HeroPage";
import "../App.css";
import DefaultLayout from "@/shared/layouts/DefaultLayout";
import { Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import SetPasswordPage from "@/pages/SetPasswordPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import UserProfilePage from "@/pages/UserProfilePage";
import SubscriptionPlanPage from "@/pages/SubscriptionPlanPage";
import AddHabitPage from "@/pages/AddHabitPage";
import HabitPlanPage from "@/pages/HabitPlanPage";
import TodaysPlanPage from "@/pages/TodaysPlanPage";
import AddHabitFromSuggestionPage from "@/pages/AddHabitFromSuggestionPage";
import { useEffect } from "react";
import { captureTokensFromUrl } from "@/features/auth/lib/token";
import DashboardLayout from "@/shared/layouts/DashboardLayout";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
function App() {
    useEffect(() => {
        captureTokensFromUrl();
    }, []);
    return (<Routes>
      <Route path="/" element={<DefaultLayout>
            <HeroPage />
          </DefaultLayout>}/>
      <Route path="/login" element={<LoginPage />}/>
      <Route path="/signup" element={<SignupPage />}/>
      <Route path="/set-password" element={<SetPasswordPage />}/>
      <Route path="/forgot-password" element={<ForgotPasswordPage />}/>
      <Route path="/profile" element={<UserProfilePage />}/>
      <Route path="/subscription" element={<SubscriptionPlanPage />}/>
      <Route path="/today-plan" element={<ProtectedRoute>
            <DashboardLayout>
              <TodaysPlanPage />
            </DashboardLayout>
          </ProtectedRoute>}/>
      <Route path="/add-habit" element={<ProtectedRoute>
            <DashboardLayout>
              <AddHabitPage />
            </DashboardLayout>
          </ProtectedRoute>}/>
      <Route path="/add-habit-from-suggestion" element={<ProtectedRoute>
            <DashboardLayout>
              <AddHabitFromSuggestionPage />
            </DashboardLayout>
          </ProtectedRoute>}/>
      <Route path="/habits/:id" element={<ProtectedRoute>
            <DashboardLayout>
              <HabitPlanPage />
            </DashboardLayout>
          </ProtectedRoute>}/>
    </Routes>);
}
export default App;
