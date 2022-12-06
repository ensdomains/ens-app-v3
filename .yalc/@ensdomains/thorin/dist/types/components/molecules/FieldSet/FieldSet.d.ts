import * as React from 'react';
import { ReactNodeNoStrings } from '../../../types';
import { TagProps } from '../../atoms/Tag';
declare type NativeFieldSetProps = React.FieldsetHTMLAttributes<HTMLFieldSetElement>;
export declare type Props = {
    children: ReactNodeNoStrings;
    /** Description content */
    description?: string | React.ReactNode;
    /** The disabled attribute of the fieldset element. */
    disabled?: NativeFieldSetProps['disabled'];
    /** The form attribute of the fieldset element. */
    form?: NativeFieldSetProps['form'];
    /** The name attribute of the fieldset element. */
    name?: NativeFieldSetProps['name'];
    /** The title for the group of elements */
    legend: string;
    /** An optional Tag component next to the legend. */
    status?: 'required' | 'optional' | 'pending' | 'complete' | {
        name: string;
        tone: TagProps['tone'];
    };
} & Omit<NativeFieldSetProps, 'children'>;
export declare const FieldSet: {
    ({ children, description, disabled, form, legend, name, status, ...props }: Props): JSX.Element;
    displayName: string;
};
export {};
