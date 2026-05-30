package com.cocos.admob.proto;

/**
 * @zh
 * UMP 完成通知
 * Android 平台不需要 UMP，此通知用于兼容 iOS 的 UMP 流程。
 * @en
 * UMP Complete Notification
 * Android platform doesn't need UMP, this notification is for compatibility with iOS UMP flow.
 */
public class UMPCompleteNTF extends Base {
    public String status;
    public boolean result;

    public UMPCompleteNTF(String unitId, String status, boolean result) {
        super(unitId);
        this.status = status;
        this.result = result;
    }
}
