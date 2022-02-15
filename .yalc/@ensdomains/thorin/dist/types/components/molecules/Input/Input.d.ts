import * as React from 'react';
import { BoxProps } from '../..';
import { FieldBaseProps } from '../../atoms/Field';
import * as styles from './styles.css';
declare type NativeInputProps = React.AllHTMLAttributes<HTMLInputElement>;
declare type BaseProps = FieldBaseProps & {
    autoFocus?: NativeInputProps['autoFocus'];
    autoComplete?: NativeInputProps['autoComplete'];
    autoCorrect?: NativeInputProps['autoCorrect'];
    defaultValue?: string | number;
    disabled?: boolean;
    id?: NativeInputProps['id'];
    inputMode?: NativeInputProps['inputMode'];
    name?: string;
    placeholder?: NativeInputProps['placeholder'];
    prefix?: React.ReactNode;
    readOnly?: NativeInputProps['readOnly'];
    spellCheck?: NativeInputProps['spellCheck'];
    suffix?: React.ReactNode;
    tabIndex?: NativeInputProps['tabIndex'];
    textTransform?: BoxProps['textTransform'];
    type?: 'email' | 'number' | 'text';
    units?: string;
    value?: string | number;
    onBlur?: NativeInputProps['onBlur'];
    onChange?: React.EventHandler<React.ChangeEvent<HTMLInputElement>>;
    onFocus?: NativeInputProps['onFocus'];
    onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
    size?: styles.Size;
    backgroundColor?: BoxProps['backgroundColor'];
    borderRadius?: BoxProps['borderRadius'];
};
declare type WithTypeEmail = {
    type?: 'email';
};
declare type WithTypeText = {
    type?: 'text';
    maxLength?: NativeInputProps['maxLength'];
};
declare type WithTypeNumber = {
    type?: 'number';
    max?: NativeInputProps['max'];
    min?: NativeInputProps['min'];
};
declare type Props = BaseProps & (WithTypeEmail | WithTypeText | WithTypeNumber);
export declare const Input: React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLInputElement>>;
export {};
