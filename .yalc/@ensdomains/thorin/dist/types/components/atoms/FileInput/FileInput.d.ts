import * as React from 'react';
import { ReactNodeNoStrings } from '../../../types';
declare type State = {
    droppable?: boolean;
    file?: File;
    focused?: boolean;
    name?: string;
    previewUrl?: string;
    type?: string;
};
declare type NativeInputProps = React.AllHTMLAttributes<HTMLInputElement>;
export declare type Props = {
    accept?: NativeInputProps['accept'];
    autoFocus?: NativeInputProps['autoFocus'];
    children: (context: State & {
        reset(event: React.MouseEvent<HTMLElement>): void;
    }) => ReactNodeNoStrings;
    defaultValue?: {
        name?: string;
        type: string;
        url: string;
    };
    disabled?: NativeInputProps['disabled'];
    error?: boolean | React.ReactNode;
    id?: NativeInputProps['id'];
    /** Size in megabytes */
    maxSize?: number;
    name?: string;
    required?: NativeInputProps['required'];
    tabIndex?: NativeInputProps['tabIndex'];
    onBlur?: NativeInputProps['onBlur'];
    onError?(error: string): void;
    onChange?(file: File): void;
    onFocus?: NativeInputProps['onFocus'];
    onReset?(): void;
};
export declare const FileInput: React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLElement>>;
export {};
