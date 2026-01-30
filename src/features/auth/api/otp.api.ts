import { verifyOtp as verifyOtpInternal } from './auth.api';
import type { VerifyOtpRequest } from './auth.api';
export const verifyOtp = (req: VerifyOtpRequest) => verifyOtpInternal(req);
