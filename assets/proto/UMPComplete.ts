/**
 * @zh
 * UMP 完成通知
 * @en
 * UMP Complete Notification
 */
import { Base } from "./Base";
import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass("UMPCompleteNTF")
export class UMPCompleteNTF extends Base {
    @property
    status: string;

    @property
    result: boolean;

    constructor(unitId: string, status: string, result: boolean) {
        super(unitId);
        this.status = status;
        this.result = result;
    }
}
