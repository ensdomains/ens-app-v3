import * as React from 'react';
import { FieldBaseProps } from '../../atoms/Field';
declare type NativeTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;
export declare const Textarea: React.ForwardRefExoticComponent<Omit<FieldBaseProps, "inline"> & {
    /** If true, the input will automatically correct words it marks as spelling errors. */
    autoCorrect?: NativeTextareaProps['autoCorrect'];
    /** If true, the component will attempt to get focus after it is rendered. */
    autoFocus?: NativeTextareaProps['autoFocus'];
    /** The initial value. Useful for detecting changes in value. */
    defaultValue?: string | number | undefined;
    /** If true, prevents user interaction. */
    disabled?: NativeTextareaProps['disabled'];
    /** The id attribute of the textarea element. */
    id?: NativeTextareaProps['id'];
    /** The name attribute of the textarea element. */
    name?: NativeTextareaProps['name'];
    /** The maximum number of characters allowed. */
    maxLength?: NativeTextareaProps['maxLength'];
    /** The placeholder attribute for textarea. */
    placeholder?: NativeTextareaProps['placeholder'];
    /** The readOnly attribute for textarea.  */
    readOnly?: NativeTextareaProps['readOnly'];
    /** Specifies the height of the text area in rows. */
    rows?: NativeTextareaProps['rows'];
    /** Textarea will mark words which it thinks are misspellings. */
    spellCheck?: NativeTextareaProps['spellCheck'];
    /** The tabindex attribute of textarea. */
    tabIndex?: NativeTextareaProps['tabIndex'];
    /** The value attribute of textarea. */
    value?: string | number | undefined;
    /** The handler for change events. */
    onChange?: NativeTextareaProps['onChange'];
    /** The handler for blur events. */
    onBlur?: NativeTextareaProps['onBlur'];
    /** The handler for focus events. */
    onFocus?: NativeTextareaProps['onFocus'];
} & Omit<NativeTextareaProps, "aria-invalid" | "children" | "defaultValue" | "value"> & React.RefAttributes<HTMLTextAreaElement>>;
export {};
