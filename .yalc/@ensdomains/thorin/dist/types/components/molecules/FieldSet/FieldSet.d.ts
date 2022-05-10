import * as React from 'react';
import { ReactNodeNoStrings } from '../../../types';
import { TagProps } from '../../atoms/Tag';
declare type NativeFieldSetProps = React.AllHTMLAttributes<HTMLFieldSetElement>;
export declare type Props = {
    children: ReactNodeNoStrings;
    description?: string | React.ReactNode;
    disabled?: NativeFieldSetProps['disabled'];
    form?: NativeFieldSetProps['form'];
    name?: NativeFieldSetProps['name'];
    legend: string;
    status?: 'required' | 'optional' | 'pending' | 'complete' | {
        name: string;
        tone: TagProps['tone'];
    };
};
export declare const FieldSet: ({ children, description, disabled, form, legend, name, status, }: Props) => JSX.Element;
export {};
