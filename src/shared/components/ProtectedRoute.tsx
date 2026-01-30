import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '@/features/auth/model/auth';
import type { PropsWithChildren } from 'react';
export function ProtectedRoute({ children }: PropsWithChildren) {
    const location = useLocation();
    const isAuth = isAuthenticated();
    if (!isAuth) {
        return <Navigate to="/login" state={{ from: location }} replace/>;
    }
    return <>{children}</>;
}
