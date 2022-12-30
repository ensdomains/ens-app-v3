import * as React from 'react';
import { FieldBaseProps } from '../../atoms/Field';
declare type NativeInputProps = React.InputHTMLAttributes<HTMLInputElement>;
export declare type Props = FieldBaseProps & {
    /** The initial value. Useful for detecting changes in value. */
    defaultValue?: string | number;
    /** If true, prevents user interaction. */
    disabled?: NativeInputProps['disabled'];
    /** The id attribute of input. */
    id?: NativeInputProps['id'];
    /** The name attribute of input. */
    name?: NativeInputProps['name'];
    /** The readOnly attribute of input.  */
    readOnly?: NativeInputProps['readOnly'];
    /** The tabindex attribute of input. */
    tabIndex?: NativeInputProps['tabIndex'];
    /** The value attribute of slider. */
    value?: number;
    /** The min value of slider. */
    min?: number;
    /** The max value of slider. */
    max?: number;
    /** The handler for change events. */
    onChange?: NativeInputProps['onChange'];
    /** The handler for blur events. */
    onBlur?: NativeInputProps['onBlur'];
    /** The handler for focus events. */
    onFocus?: NativeInputProps['onFocus'];
} & Omit<NativeInputProps, 'children' | 'value' | 'defaultValue' | 'aria-invalid' | 'type'>;
export declare const Slider: React.ForwardRefExoticComponent<FieldBaseProps & {
    /** The initial value. Useful for detecting changes in value. */
    defaultValue?: string | number | undefined;
    /** If true, prevents user interaction. */
    disabled?: NativeInputProps['disabled'];
    /** The id attribute of input. */
    id?: NativeInputProps['id'];
    /** The name attribute of input. */
    name?: NativeInputProps['name'];
    /** The readOnly attribute of input.  */
    readOnly?: NativeInputProps['readOnly'];
    /** The tabindex attribute of input. */
    tabIndex?: NativeInputProps['tabIndex'];
    /** The value attribute of slider. */
    value?: number | undefined;
    /** The min value of slider. */
    min?: number | undefined;
    /** The max value of slider. */
    max?: number | undefined;
    /** The handler for change events. */
    onChange?: NativeInputProps['onChange'];
    /** The handler for blur events. */
    onBlur?: NativeInputProps['onBlur'];
    /** The handler for focus events. */
    onFocus?: NativeInputProps['onFocus'];
} & Omit<NativeInputProps, "type" | "children" | "aria-invalid" | "defaultValue" | "value"> & React.RefAttributes<HTMLInputElement>>;
export {};
