import * as React from 'react';
import { WithColorStyle } from '../../../types/withColorOrColorStyle';
import { FieldBaseProps } from '../../atoms/Field';
type NativeInputProps = React.InputHTMLAttributes<HTMLInputElement>;
export declare const Checkbox: React.ForwardRefExoticComponent<{
    /** Label content */
    label: React.ReactNode;
    /** The name attribute of input element. */
    name?: NativeInputProps['name'];
    /** The value attribute of input element. */
    value?: string | number | undefined;
    /** The initial value of the input element */
    defaultValue?: string | number | undefined;
    /** The checked attribute of input element */
    checked?: NativeInputProps['checked'];
    /** The initial value for checked of input element */
    defaultChecked?: NativeInputProps['defaultChecked'];
    /** The id attribute of input element. */
    id?: NativeInputProps['id'];
    /** The disabled attribute of input element */
    disabled?: NativeInputProps['disabled'];
    /** The handler for change events. */
    onChange?: NativeInputProps['onChange'];
    /** The tabindex attribute for input element. */
    tabIndex?: NativeInputProps['tabIndex'];
    /** The handler for focus events. */
    onFocus?: NativeInputProps['onFocus'];
    /** The handler for blur events. */
    onBlur?: NativeInputProps['onBlur'];
    /** Set the background color for regular variant. */
    background?: "grey" | "white" | undefined;
    /** Set the input to readonly mode */
    readOnly?: NativeInputProps['readOnly'];
} & Omit<FieldBaseProps, "labelRight"> & Omit<NativeInputProps, "value" | "type" | "color" | "aria-invalid" | "children" | "defaultValue" | "size"> & WithColorStyle & React.RefAttributes<HTMLInputElement>>;
export {};
