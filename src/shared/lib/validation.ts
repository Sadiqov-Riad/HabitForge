const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const PASSWORD_RULES = {
    lower: /[a-z]/,
    upper: /[A-Z]/,
    digit: /[0-9]/,
    symbol: /[^A-Za-z0-9]/,
};
export function isValidEmail(value: string): boolean {
    return EMAIL_REGEX.test(value.trim());
}
export function isPasswordValid(value: string, minLength: number = MIN_PASSWORD_LENGTH): boolean {
    return (value.length >= minLength &&
        PASSWORD_RULES.lower.test(value) &&
        PASSWORD_RULES.upper.test(value) &&
        PASSWORD_RULES.digit.test(value) &&
        PASSWORD_RULES.symbol.test(value));
}
