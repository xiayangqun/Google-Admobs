/**
 * Google AdMob Extension - Main Process
 */

export const methods: { [key: string]: (...any: any[]) => any } = {
    openPanel() {
        Editor.Panel.open("admob.admob-panel");
    },
};

export function load() {
    console.log("[AdMob] Extension loaded");
}

export function unload() {
    console.log("[AdMob] Extension unloaded");
}
