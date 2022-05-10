import * as React from 'react';
import { FieldBaseProps } from '../../atoms/Field';
declare type NativeInputProps = React.AllHTMLAttributes<HTMLInputElement>;
export declare const RadioButton: React.ForwardRefExoticComponent<FieldBaseProps & {
    label: NativeInputProps['label'];
    name: NativeInputProps['name'];
    value: NativeInputProps['value'];
    checked?: NativeInputProps['checked'];
    id?: NativeInputProps['id'];
    disabled?: boolean | undefined;
    onChange?: ((e: React.ChangeEvent<HTMLInputElement>) => void) | undefined;
    tabIndex?: NativeInputProps['tabIndex'];
    onFocus?: NativeInputProps['onFocus'];
    onBlur?: NativeInputProps['onBlur'];
} & React.RefAttributes<HTMLInputElement>>;
export {};
