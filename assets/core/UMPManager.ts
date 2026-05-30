import { log } from "cc";
import { route } from "./Route";
import { UMPCompleteNTF } from "../proto/UMPComplete";
import { js } from "cc";

const module = "[UMPManager]";

/**
 * @zh
 * UMP 管理器，用于处理 GDPR 同意流程完成后的回调。
 * 支持以下边界情况：
 * 1. UMP 未完成时监听 → 等待完成后触发
 * 2. UMP 已完成后监听 → 立刻触发
 * 3. Android 无 UMP → 注册后立即触发
 * @en
 * UMP Manager for handling callbacks after GDPR consent flow completes.
 * Supports the following edge cases:
 * 1. Listen before UMP completes → triggers after completion
 * 2. Listen after UMP completes → triggers immediately
 * 3. Android without UMP → triggers immediately upon registration
 */
export class UMPManager {
    private static _instance: UMPManager;

    private _isComplete: boolean = false;
    private _lastResult: boolean = false;
    private _callbacks: ((result: boolean) => void)[] = [];

    static get instance(): UMPManager {
        if (!UMPManager._instance) {
            UMPManager._instance = new UMPManager();
        }
        return UMPManager._instance;
    }

    private constructor() {

    }

    /**
     * @zh
     * 注册 UMP 完成回调
     * @en
     * Register UMP completion callback
     */
    onCompleteOnce(callback: (result: boolean) => void): void {
        log(module, "onCompleteOnce called, isComplete:", this._isComplete);

        if (this._isComplete) {
            // UMP 已经完成，立刻执行（传入上一次的 result）
            callback(this._lastResult);
        } else {
            // UMP 还未完成，加入等待队列
            this._callbacks.push(callback);
        }
    }

    /**
     * @zh
     * 标记 UMP 已完成，触发所有等待的回调
     * @en
     * Mark UMP as complete and trigger all waiting callbacks
     */
    markComplete(result: boolean): void {
        log(module, "markComplete called, result:", result);

        this._lastResult = result;

        if (this._isComplete) {
            return; // 已经标记过了
        }

        this._isComplete = true;

        // 执行并清空回调队列
        while (this._callbacks.length > 0) {
            const callback = this._callbacks.shift();
            if (callback) {
                callback(result);
            }
        }
    }
}
