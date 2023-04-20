import type { WithColorStyle } from '../../../types';
import type { FieldBaseProps } from '../../atoms/Field';
import * as React from 'react';
import { RadioButton } from '../../../components';
type NativeDivProps = React.HTMLAttributes<HTMLDivElement>;
type NativeInputProps = React.InputHTMLAttributes<HTMLInputElement>;
export type Props = {
    /** Display the radio buttons in a row */
    inline?: boolean;
    /** The children of the component that conform to the basic input attributes  */
    children?: React.ReactElement<typeof RadioButton>[] | React.ReactElement<typeof RadioButton>;
    /** The value for the radio group */
    value?: string;
    /** The handler for the change event. */
    onChange?: NativeInputProps['onChange'];
    /** The handler for the blur event. */
    onBlur?: NativeInputProps['onBlur'];
} & Omit<NativeDivProps, 'onFocus' | 'onChange' | 'onBlur'>;
export declare const RadioButtonGroup: React.ForwardRefExoticComponent<{
    /** Display the radio buttons in a row */
    inline?: boolean | undefined;
    /** The children of the component that conform to the basic input attributes  */
    children?: React.ReactElement<React.ForwardRefExoticComponent<{
        label: React.ReactNode;
        name: string | undefined;
        value: string;
        defaultValue?: string | undefined;
        checked?: boolean | undefined;
        id?: string | undefined;
        disabled?: boolean | undefined;
        onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
        tabIndex?: number | undefined;
        onFocus?: React.FocusEventHandler<HTMLInputElement> | undefined;
        onBlur?: React.FocusEventHandler<HTMLInputElement> | undefined;
    } & Omit<FieldBaseProps, "labelRight"> & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "type" | "role" | "aria-invalid" | "children" | "defaultValue"> & WithColorStyle & React.RefAttributes<HTMLInputElement>>, string | React.JSXElementConstructor<any>> | React.ReactElement<React.ForwardRefExoticComponent<{
        label: React.ReactNode;
        name: string | undefined;
        value: string;
        defaultValue?: string | undefined;
        checked?: boolean | undefined;
        id?: string | undefined;
        disabled?: boolean | undefined;
        onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
        tabIndex?: number | undefined;
        onFocus?: React.FocusEventHandler<HTMLInputElement> | undefined;
        onBlur?: React.FocusEventHandler<HTMLInputElement> | undefined;
    } & Omit<FieldBaseProps, "labelRight"> & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "type" | "role" | "aria-invalid" | "children" | "defaultValue"> & WithColorStyle & React.RefAttributes<HTMLInputElement>>, string | React.JSXElementConstructor<any>>[] | undefined;
    /** The value for the radio group */
    value?: string | undefined;
    /** The handler for the change event. */
    onChange?: NativeInputProps['onChange'];
    /** The handler for the blur event. */
    onBlur?: NativeInputProps['onBlur'];
} & Omit<NativeDivProps, "onFocus" | "onBlur" | "onChange"> & React.RefAttributes<HTMLDivElement>>;
export {};
