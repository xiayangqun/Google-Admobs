/**
 * PlistBuddy utility functions for modifying iOS plist files
 */

import { execSync } from 'child_process';

const PLISTBUDDY = '/usr/libexec/PlistBuddy';

export class PlistUtils {
    /**
     * Set a string value in plist
     */
    static setString(plistPath: string, key: string, value: string): void {
        const escapedValue = value.replace(/"/g, '\\"');
        try {
            execSync(`${PLISTBUDDY} -c "Set :${key} ${escapedValue}" "${plistPath}"`, { stdio: 'pipe' });
        } catch {
            execSync(`${PLISTBUDDY} -c "Add :${key} string ${escapedValue}" "${plistPath}"`, { stdio: 'pipe' });
        }
    }

    /**
     * Set a boolean value in plist
     */
    static setBool(plistPath: string, key: string, value: boolean): void {
        const strValue = value ? 'YES' : 'NO';
        try {
            execSync(`${PLISTBUDDY} -c "Set :${key} ${strValue}" "${plistPath}"`, { stdio: 'pipe' });
        } catch {
            execSync(`${PLISTBUDDY} -c "Add :${key} bool ${strValue}" "${plistPath}"`, { stdio: 'pipe' });
        }
    }

    /**
     * Set an integer value in plist
     */
    static setInteger(plistPath: string, key: string, value: number): void {
        try {
            execSync(`${PLISTBUDDY} -c "Set :${key} ${value}" "${plistPath}"`, { stdio: 'pipe' });
        } catch {
            execSync(`${PLISTBUDDY} -c "Add :${key} integer ${value}" "${plistPath}"`, { stdio: 'pipe' });
        }
    }

    /**
     * Delete a key from plist
     */
    static delete(plistPath: string, key: string): void {
        try {
            execSync(`${PLISTBUDDY} -c "Delete :${key}" "${plistPath}"`, { stdio: 'pipe' });
        } catch {
            // Key doesn't exist, ignore
        }
    }

    /**
     * Set SKAdNetworkItems array in plist
     */
    static setSKAdNetworkItems(plistPath: string, identifiers: string[]): void {
        // Delete existing array
        this.delete(plistPath, 'SKAdNetworkItems');

        // Create array
        execSync(`${PLISTBUDDY} -c "Add :SKAdNetworkItems array" "${plistPath}"`, { stdio: 'pipe' });

        // Add each item
        identifiers.forEach((id, index) => {
            execSync(`${PLISTBUDDY} -c "Add :SKAdNetworkItems:${index} dict" "${plistPath}"`, { stdio: 'pipe' });
            execSync(`${PLISTBUDDY} -c "Add :SKAdNetworkItems:${index}:SKAdNetworkIdentifier string ${id}" "${plistPath}"`, { stdio: 'pipe' });
        });
    }

    /**
     * Check if a key exists in plist
     */
    static hasKey(plistPath: string, key: string): boolean {
        try {
            execSync(`${PLISTBUDDY} -c "Print :${key}" "${plistPath}"`, { stdio: 'pipe' });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Read a value from plist
     */
    static read(plistPath: string, key: string): string | null {
        try {
            const result = execSync(`${PLISTBUDDY} -c "Print :${key}" "${plistPath}"`, { stdio: 'pipe' });
            return result.toString().trim();
        } catch {
            return null;
        }
    }
}
