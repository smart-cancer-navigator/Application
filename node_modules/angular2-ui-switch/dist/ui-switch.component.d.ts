import { EventEmitter } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
export declare class UiSwitchComponent implements ControlValueAccessor {
    private onTouchedCallback;
    private onChangeCallback;
    private _checked;
    private _disabled;
    private _reverse;
    checked: boolean;
    disabled: boolean;
    reverse: boolean;
    size: string;
    change: EventEmitter<boolean>;
    color: string;
    switchOffColor: string;
    switchColor: string;
    defaultBgColor: string;
    defaultBoColor: string;
    getColor(flag: any): string;
    onToggle(): void;
    writeValue(obj: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
}
