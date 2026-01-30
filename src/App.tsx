import HeroPage from '@/pages/HeroPage';
import './App.css';
import DefaultLayout from '@/shared/layouts/DefaultLayout';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import UserProfilePage from '@/pages/UserProfilePage';
import SubscriptionPlanPage from '@/pages/SubscriptionPlanPage';
import { useEffect } from 'react';
import { captureTokensFromUrl } from '@/features/auth/lib/token';
function App() {
    useEffect(() => {
        captureTokensFromUrl();
    }, []);
    return (<Routes>
      <Route path="/" element={<DefaultLayout><HeroPage /></DefaultLayout>}/>
      <Route path="/login" element={<LoginPage />}/>
      <Route path="/signup" element={<SignupPage />}/>
      <Route path="/profile" element={<UserProfilePage />}/>
      <Route path="/subscription" element={<SubscriptionPlanPage />}/>
    </Routes>);
}
export default App;
