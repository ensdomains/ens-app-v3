import * as React from 'react';
import { FlattenInterpolation } from 'styled-components';
import { FieldBaseProps } from '../../atoms/Field';
import { Space } from '../../../tokens/index';
type NativeInputProps = React.InputHTMLAttributes<HTMLInputElement>;
type BaseProps = Omit<FieldBaseProps, 'inline'> & {
    /** If the element should attempt to gain focus after it is rendered. */
    autoFocus?: NativeInputProps['autoFocus'];
    /** If the input should display a list of suggested words. */
    autoComplete?: NativeInputProps['autoComplete'];
    /** If the imput should automatically fix spelling errors. */
    autoCorrect?: NativeInputProps['autoCorrect'];
    clearable?: boolean;
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
    /** An icon that leads the input. */
    icon?: React.ReactNode;
    /** A custom width for the icon component */
    iconWidth?: Space;
    /** An icon that trails the input. By default is the clear icon. */
    actionIcon?: React.ReactNode;
    /** If true, will not hide the action or clear button when the input is empty */
    alwaysShowAction?: boolean;
    /** Set the element type that wraps the prefix. Useful when you do not want clicks on the prefix to cause the input to focus */
    prefixAs?: 'div';
    /** Sets the input in read only mode. */
    readOnly?: NativeInputProps['readOnly'];
    /** If the input will mark spelling errors in the text. */
    spellCheck?: NativeInputProps['spellCheck'];
    /** A string or component inserted at the end of the input. */
    suffix?: React.ReactNode;
    /** Set the element type that wraps the suffix. Useful when you do not want clicks on the suffix to cause the input to focus */
    suffixAs?: 'div';
    /** The tabindex attribute of the input element. */
    tabIndex?: NativeInputProps['tabIndex'];
    /** The data type the input. */
    type?: 'number' | 'text' | 'email' | 'date' | 'datetime-local';
    /** Inserts text after the input text. */
    units?: string;
    /** The value attribute of the input element. */
    value?: string | number;
    /** If true, the input has changes */
    validated?: boolean;
    /** If true, the value has been validated */
    showDot?: boolean;
    /** A handler for blur events. */
    onBlur?: NativeInputProps['onBlur'];
    /** A handler for change events. */
    onChange?: NativeInputProps['onChange'];
    /** A handler for focus events. */
    onFocus?: NativeInputProps['onFocus'];
    /** A handler for keydown events. */
    onKeyDown?: NativeInputProps['onKeyDown'];
    /** A handler for clicking the action icon */
    onClickAction?: () => void;
    /** Sets the height of the input element. */
    size?: 'small' | 'medium' | 'large' | 'extraLarge';
    /** Set of styles  */
    parentStyles?: FlattenInterpolation<any>;
} & Omit<NativeInputProps, 'size' | 'prefix' | 'children' | 'value' | 'defaultValue' | 'type' | 'aria-invalid' | 'onInput' | 'onKeyDown' | 'onWheel'>;
type WithTypeEmail = {
    type?: 'email';
};
type WithTypeText = {
    type?: 'text';
    maxLength?: NativeInputProps['maxLength'];
};
type WithTypeDateTimeLocal = {
    type?: 'datetime-local';
};
type Props = BaseProps & (WithTypeEmail | WithTypeText | WithTypeDateTimeLocal);
export declare const Input: React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLInputElement>>;
export {};
