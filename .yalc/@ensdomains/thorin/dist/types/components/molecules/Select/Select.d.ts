import * as React from 'react';
import { FieldBaseProps } from '../../atoms/Field';
declare type NativeSelectProps = React.AllHTMLAttributes<HTMLSelectElement>;
declare type OptionProps = {
    value: string;
    label?: string;
    prefix?: React.ReactNode;
    disabled?: boolean;
};
export declare const Select: React.ForwardRefExoticComponent<FieldBaseProps & {
    id?: NativeSelectProps['id'];
    disabled?: boolean | undefined;
    onChange?: ((selected: OptionProps | null) => void) | undefined;
    tabIndex?: NativeSelectProps['tabIndex'];
    onFocus?: NativeSelectProps['onFocus'];
    onBlur?: NativeSelectProps['onBlur'];
    selected?: OptionProps | undefined;
    options: OptionProps[] | OptionProps;
} & React.RefAttributes<HTMLDivElement>>;
export {};
