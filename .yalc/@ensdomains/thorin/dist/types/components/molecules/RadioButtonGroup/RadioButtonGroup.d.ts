import * as React from 'react';
import { RadioButton } from '@/src/components';
declare type NativeDivProps = React.HTMLAttributes<HTMLDivElement>;
declare type NativeInputProps = React.InputHTMLAttributes<HTMLInputElement>;
export declare type Props = {
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
    /** The children of the component that conform to the basic input attributes  */
    children?: React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactElement<any, string | React.JSXElementConstructor<any>>[] | undefined;
    /** The value for the radio group */
    value?: string | undefined;
    /** The handler for the change event. */
    onChange?: NativeInputProps['onChange'];
    /** The handler for the blur event. */
    onBlur?: NativeInputProps['onBlur'];
} & Omit<NativeDivProps, "onFocus" | "onBlur" | "onChange"> & React.RefAttributes<HTMLDivElement>>;
export {};
