import * as React from 'react';
import { FieldBaseProps } from '../../atoms/Field';
declare type NativeInputProps = React.AllHTMLAttributes<HTMLInputElement>;
export declare const RadioButton: React.ForwardRefExoticComponent<FieldBaseProps & {
    /** A string or component that represents the input item. */
    label: React.ReactNode;
    /** The name attribute for input elements. */
    name: NativeInputProps['name'];
    /** The value attribute of input elements. */
    value: NativeInputProps['value'];
    /** If true, the radio button is selected. */
    checked?: NativeInputProps['checked'];
    /** The id attribute of input element. */
    id?: NativeInputProps['id'];
    /** If true, the input is unable to receive user input. */
    disabled?: boolean | undefined;
    /** The handler for change events. */
    onChange?: ((e: React.ChangeEvent<HTMLInputElement>) => void) | undefined;
    /** The tabindex attribute for input elements. */
    tabIndex?: NativeInputProps['tabIndex'];
    /** The handler for focus events. */
    onFocus?: NativeInputProps['onFocus'];
    /** The handler for blur events. */
    onBlur?: NativeInputProps['onBlur'];
} & React.RefAttributes<HTMLInputElement>>;
export {};
