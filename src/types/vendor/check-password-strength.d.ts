declare module 'check-password-strength' {
  type Contains = 'lowercase' | 'uppercase' | 'symbol' | 'number';

  export interface PasswordStrengthResult {
    id: 0 | 1 | 2 | 3;
    value: 'Too weak' | 'Weak' | 'Medium' | 'Strong';
    contains: Contains[];
    length: number;
  }

  export function passwordStrength(password: string);
}
