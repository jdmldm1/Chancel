/**
 * Generates a unique 6-character join code for a session
 * Uses uppercase letters and numbers, excluding confusing characters
 * @returns A unique 6-character join code
 */
export declare function generateUniqueJoinCode(): Promise<string>;
/**
 * Formats a join code for display (adds hyphen in middle)
 * Example: ABC123 -> ABC-123
 */
export declare function formatJoinCode(code: string): string;
//# sourceMappingURL=generateJoinCode.d.ts.map