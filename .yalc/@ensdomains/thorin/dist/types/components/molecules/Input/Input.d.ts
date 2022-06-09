import * as React from 'react';
import { FlattenInterpolation } from 'styled-components';
import { FieldBaseProps } from '../../atoms/Field';
declare type NativeInputProps = React.InputHTMLAttributes<HTMLInputElement>;
declare type BaseProps = FieldBaseProps & {
    /** If the element should attempt to gain focus after it is rendered. */
    autoFocus?: NativeInputProps['autoFocus'];
    /** If the input should display a list of suggested words. */
    autoComplete?: NativeInputProps['autoComplete'];
    /** If the imput should automatically fix spelling errors. */
    autoCorrect?: NativeInputProps['autoCorrect'];
    /** The initial value of the input. Useful for checking if the value of the input has changed. */
    defaultValue?: string | number;
    /** Disables input from receiving user input. */
    disabled?: NativeInputProps['disabled'];
    /** The id attribute of the input element. */
    id?: NativeInputProps['id'];
    /** A hint to the browser of what type of input the input will receive. Allows browsers to display the corresponding keyboard. */
    inputMode?: NativeInputProps['inputMode'];
    /** The name attribute of the input element. */
    name?: NativeInputProps['name'];
    /** The placeholder attribute of the input element. */
    placeholder?: NativeInputProps['placeholder'];
    /** A string or component inserted in front of the input element. */
    prefix?: React.ReactNode;
    /** Sets the input in read only mode. */
    readOnly?: NativeInputProps['readOnly'];
    /** If the input will mark spelling errors in the text. */
    spellCheck?: NativeInputProps['spellCheck'];
    /** A string or component inserted at the end of the input. */
    suffix?: React.ReactNode;
    /** The tabindex attribute of the input element. */
    tabIndex?: NativeInputProps['tabIndex'];
    /** The data type the input. */
    type?: 'number' | 'text' | 'email';
    /** Inserts text after the input text. */
    units?: string;
    /** The value attribute of the input element. */
    value?: string | number;
    /** A handler for blur events. */
    onBlur?: NativeInputProps['onBlur'];
    /** A handler for change events. */
    onChange?: NativeInputProps['onChange'];
    /** A handler for focus events. */
    onFocus?: NativeInputProps['onFocus'];
    /** A handler for keydown events. */
    onKeyDown?: NativeInputProps['onKeyDown'];
    /** Sets the height of the input element. */
    size?: 'medium' | 'large' | 'extraLarge';
    /** Set of styles  */
    parentStyles?: FlattenInterpolation<any>;
} & Omit<NativeInputProps, 'size' | 'prefix' | 'children' | 'value' | 'defaultValue' | 'type' | 'aria-invalid' | 'onInput' | 'onKeyDown' | 'onWheel'>;
declare type WithTypeEmail = {
    type?: 'email';
};
declare type WithTypeText = {
    type?: 'text';
    maxLength?: NativeInputProps['maxLength'];
};
declare type WithTypeNumber = {
    type?: 'number';
    /** Sets the max value of number type inputs as well as a tag to the label and a mx button at the end of the input element. */
    max?: NativeInputProps['max'];
    /** Sets the min value of number type inputs. */
    min?: NativeInputProps['min'];
};
declare type Props = BaseProps & (WithTypeEmail | WithTypeText | WithTypeNumber);
export declare const Input: React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLInputElement>>;
export {};
