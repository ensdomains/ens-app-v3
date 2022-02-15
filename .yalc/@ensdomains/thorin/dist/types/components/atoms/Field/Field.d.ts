import * as React from 'react';
import { ReactNodeNoStrings } from '../../../types';
import { useFieldIds } from '../../../hooks';
import { BoxProps } from '../Box';
declare type State = ReturnType<typeof useFieldIds> | undefined;
declare type NativeFormProps = React.AllHTMLAttributes<HTMLFormElement>;
export declare type FieldBaseProps = {
    description?: React.ReactNode;
    error?: React.ReactNode;
    hideLabel?: boolean;
    label: React.ReactNode;
    labelSecondary?: React.ReactNode;
    required?: NativeFormProps['required'];
    inline?: boolean;
    width?: BoxProps['width'];
};
declare type Props = FieldBaseProps & {
    children: React.ReactElement | ((context: State) => ReactNodeNoStrings);
    id?: NativeFormProps['id'];
};
export declare const Field: ({ children, description, error, hideLabel, id, label, labelSecondary, required, inline, width, }: Props) => JSX.Element;
export {};
