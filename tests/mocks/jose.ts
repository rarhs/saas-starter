// tests/mocks/jose.ts
export const jwtVerify = jest.fn();
export const SignJWT = jest.fn().mockReturnThis(); // Chainable mock
export const importJWK = jest.fn();

// Mock the chainable methods for SignJWT if needed
SignJWT.prototype.setProtectedHeader = jest.fn().mockReturnThis();
SignJWT.prototype.setIssuedAt = jest.fn().mockReturnThis();
SignJWT.prototype.setExpirationTime = jest.fn().mockReturnThis();
SignJWT.prototype.sign = jest.fn().mockResolvedValue('mocked-jwt-token');
