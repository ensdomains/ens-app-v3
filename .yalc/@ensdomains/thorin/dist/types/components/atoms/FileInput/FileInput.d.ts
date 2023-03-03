import * as React from 'react';
import { ReactNodeNoStrings } from '../../../types';
type Context = {
    droppable?: boolean;
    file?: File;
    focused?: boolean;
    name?: string;
    previewUrl?: string;
    type?: string;
    reset?: (event: React.MouseEvent<HTMLInputElement>) => void;
};
type NativeInputProps = React.InputHTMLAttributes<HTMLInputElement>;
export type Props = {
    /** The accept attribute of input element */
    accept?: NativeInputProps['accept'];
    /** The autoFocus attribute of input element */
    autoFocus?: NativeInputProps['autoFocus'];
    /** A function that receives a context object and return a react element. The context object is made of the following properties droppable, focused, file, name, previewUrl, type and reset. */
    children: (context: Context) => ReactNodeNoStrings;
    /** Preloads the file input file to submit. */
    defaultValue?: {
        name?: string;
        type: string;
        url: string;
    };
    /** The disabled attribute of input element. */
    disabled?: NativeInputProps['disabled'];
    /** Error text or react element */
    error?: boolean | React.ReactNode;
    /** The id attribute of input element */
    id?: NativeInputProps['id'];
    /** Size in megabytes */
    maxSize?: number;
    /** The name attribute of input element. */
    name?: NativeInputProps['name'];
    /** The required attribute of input element */
    required?: NativeInputProps['required'];
    /** The tabindex attribute of input element */
    tabIndex?: NativeInputProps['tabIndex'];
    /** An event handler that is fired after blur events. Wrap this function in useCallback to maintian referenctial equality.  */
    onBlur?: NativeInputProps['onBlur'];
    /** An event handler that is fired after error events. Wrap this function in useCallback to maintian referenctial equality.  */
    onError?(error: string): void;
    /** An event handler that is fired after change events. Wrap this function in useCallback to maintian referenctial equality.  */
    onChange?(file: File): void;
    /** An event handler that is fired after focus events. Wrap this function in useCallback to maintian referenctial equality.  */
    onFocus?: NativeInputProps['onFocus'];
    /** An event handler that is fired after the context.reset function is fired. Wrap this function in useCAllback to maintain referential equality. */
    onReset?(): void;
} & Omit<NativeInputProps, 'onReset' | 'onChange' | 'onError' | 'defaultValue' | 'children' | 'type'>;
export declare const FileInput: React.ForwardRefExoticComponent<{
    /** The accept attribute of input element */
    accept?: NativeInputProps['accept'];
    /** The autoFocus attribute of input element */
    autoFocus?: NativeInputProps['autoFocus'];
    /** A function that receives a context object and return a react element. The context object is made of the following properties droppable, focused, file, name, previewUrl, type and reset. */
    children: (context: Context) => ReactNodeNoStrings;
    /** Preloads the file input file to submit. */
    defaultValue?: {
        name?: string | undefined;
        type: string;
        url: string;
    } | undefined;
    /** The disabled attribute of input element. */
    disabled?: NativeInputProps['disabled'];
    /** Error text or react element */
    error?: boolean | React.ReactNode;
    /** The id attribute of input element */
    id?: NativeInputProps['id'];
    /** Size in megabytes */
    maxSize?: number | undefined;
    /** The name attribute of input element. */
    name?: NativeInputProps['name'];
    /** The required attribute of input element */
    required?: NativeInputProps['required'];
    /** The tabindex attribute of input element */
    tabIndex?: NativeInputProps['tabIndex'];
    /** An event handler that is fired after blur events. Wrap this function in useCallback to maintian referenctial equality.  */
    onBlur?: NativeInputProps['onBlur'];
    /** An event handler that is fired after error events. Wrap this function in useCallback to maintian referenctial equality.  */
    onError?(error: string): void;
    /** An event handler that is fired after change events. Wrap this function in useCallback to maintian referenctial equality.  */
    onChange?(file: File): void;
    /** An event handler that is fired after focus events. Wrap this function in useCallback to maintian referenctial equality.  */
    onFocus?: NativeInputProps['onFocus'];
    /** An event handler that is fired after the context.reset function is fired. Wrap this function in useCAllback to maintain referential equality. */
    onReset?(): void;
} & Omit<NativeInputProps, "type" | "children" | "onChange" | "onReset" | "onError" | "defaultValue"> & React.RefAttributes<HTMLDivElement>>;
export {};
