import * as React from 'react';
import { FieldBaseProps } from '../../atoms/Field';
declare type Size = 'small' | 'medium';
declare type NativeSelectProps = React.InputHTMLAttributes<HTMLInputElement>;
export declare type SelectOptionProps = {
    value: string;
    label?: string;
    prefix?: React.ReactNode;
    disabled?: boolean;
};
declare type NativeDivProps = React.HTMLAttributes<HTMLDivElement>;
export declare type SelectProps = {
    /** The id attribute of div element. */
    id?: NativeSelectProps['id'];
    /** If true, prevents user interaction with component. */
    disabled?: NativeSelectProps['disabled'];
    /** If the options list will filter options based on text input. */
    autocomplete?: boolean;
    /** Message displayed if there is no available options. */
    emptyListMessage?: string;
    /** If it is possible to create an option if it does not exist in the options list. */
    createable?: boolean;
    /** The string or component to prefix the value in the create value option. */
    createablePrefix?: string;
    /** The handler for change events. */
    onChange?: NativeSelectProps['onChange'];
    /** The tabindex attribute for  */
    tabIndex?: NativeSelectProps['tabIndex'];
    /** The handler for focus events. */
    onFocus?: NativeSelectProps['onFocus'];
    /** The handler for blur events. */
    onBlur?: NativeSelectProps['onBlur'];
    /** A handler for when new values are created */
    onCreate?: (value: string) => void;
    /** The selected option's value. */
    value?: SelectOptionProps['value'];
    /** The name property of an input element. */
    name?: NativeSelectProps['name'];
    /** An arrary of objects conforming to OptionProps interface. */
    options: SelectOptionProps[];
    size?: Size;
} & FieldBaseProps & Omit<NativeDivProps, 'children' | 'id' | 'onChange' | 'tabIndex' | 'onFocus' | 'onBlur' | 'aria-controls' | 'aria-expanded' | 'role' | 'aria-haspopup' | 'aria-invalid' | 'onClick' | 'onKeyDown'>;
export declare const Select: React.ForwardRefExoticComponent<{
    /** The id attribute of div element. */
    id?: NativeSelectProps['id'];
    /** If true, prevents user interaction with component. */
    disabled?: NativeSelectProps['disabled'];
    /** If the options list will filter options based on text input. */
    autocomplete?: boolean | undefined;
    /** Message displayed if there is no available options. */
    emptyListMessage?: string | undefined;
    /** If it is possible to create an option if it does not exist in the options list. */
    createable?: boolean | undefined;
    /** The string or component to prefix the value in the create value option. */
    createablePrefix?: string | undefined;
    /** The handler for change events. */
    onChange?: NativeSelectProps['onChange'];
    /** The tabindex attribute for  */
    tabIndex?: NativeSelectProps['tabIndex'];
    /** The handler for focus events. */
    onFocus?: NativeSelectProps['onFocus'];
    /** The handler for blur events. */
    onBlur?: NativeSelectProps['onBlur'];
    /** A handler for when new values are created */
    onCreate?: ((value: string) => void) | undefined;
    /** The selected option's value. */
    value?: string | undefined;
    /** The name property of an input element. */
    name?: NativeSelectProps['name'];
    /** An arrary of objects conforming to OptionProps interface. */
    options: SelectOptionProps[];
    size?: Size | undefined;
} & FieldBaseProps & Omit<NativeDivProps, "id" | "role" | "tabIndex" | "aria-controls" | "aria-expanded" | "aria-haspopup" | "aria-invalid" | "children" | "onFocus" | "onBlur" | "onChange" | "onKeyDown" | "onClick"> & React.RefAttributes<HTMLInputElement>>;
export {};
