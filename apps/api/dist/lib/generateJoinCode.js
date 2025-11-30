import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
// Characters to use for join code (excluding confusing chars like 0, O, I, l)
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
/**
 * Generates a unique 6-character join code for a session
 * Uses uppercase letters and numbers, excluding confusing characters
 * @returns A unique 6-character join code
 */
export async function generateUniqueJoinCode() {
    let attempts = 0;
    const maxAttempts = 10;
    while (attempts < maxAttempts) {
        // Generate random 6-character code
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
        }
        // Check if code already exists
        const existingSession = await prisma.session.findUnique({
            where: { joinCode: code }
        });
        if (!existingSession) {
            return code;
        }
        attempts++;
    }
    // Fallback: if we can't find a unique code after 10 attempts, append timestamp
    const code = Array.from({ length: 6 }, () => CHARS.charAt(Math.floor(Math.random() * CHARS.length))).join('');
    return code + Date.now().toString().slice(-2);
}
/**
 * Formats a join code for display (adds hyphen in middle)
 * Example: ABC123 -> ABC-123
 */
export function formatJoinCode(code) {
    if (code.length === 6) {
        return `${code.slice(0, 3)}-${code.slice(3)}`;
    }
    return code;
}
//# sourceMappingURL=generateJoinCode.js.map