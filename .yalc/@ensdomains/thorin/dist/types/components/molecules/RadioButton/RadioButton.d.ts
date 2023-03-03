import * as React from 'react';
import { WithColorStyle } from '../../../types/withColorOrColorStyle';
import { FieldBaseProps } from '../../atoms/Field';
type NativeInputProps = React.InputHTMLAttributes<HTMLInputElement>;
export declare const RadioButton: React.ForwardRefExoticComponent<{
    /** A string or component that represents the input item. */
    label: React.ReactNode;
    /** The name attribute for input elements. */
    name: NativeInputProps['name'];
    /** The value attribute of input elements. */
    value: string;
    /** The inital value of input element */
    defaultValue?: string | undefined;
    /** If true, the radio button is selected. */
    checked?: NativeInputProps['checked'];
    /** The id attribute of input element. */
    id?: NativeInputProps['id'];
    /** If true, the input is unable to receive user input. */
    disabled?: NativeInputProps['disabled'];
    /** The handler for change events. */
    onChange?: NativeInputProps['onChange'];
    /** The tabindex attribute for input elements. */
    tabIndex?: NativeInputProps['tabIndex'];
    /** The handler for focus events. */
    onFocus?: NativeInputProps['onFocus'];
    /** The handler for blur events. */
    onBlur?: NativeInputProps['onBlur'];
} & Omit<FieldBaseProps, "labelRight"> & Omit<NativeInputProps, "value" | "type" | "role" | "aria-invalid" | "children" | "defaultValue"> & WithColorStyle & React.RefAttributes<HTMLInputElement>>;
export {};
