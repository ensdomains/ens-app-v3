import * as React from 'react';
import { Colors, Space } from '../../../tokens';
import { FieldBaseProps } from '../../atoms/Field';
type Size = 'small' | 'medium';
type NativeSelectProps = React.InputHTMLAttributes<HTMLInputElement>;
export type SelectOptionProps = {
    value: string;
    label?: string;
    node?: React.ReactNode;
    prefix?: React.ReactNode;
    disabled?: boolean;
    color?: Colors;
};
type Direction = 'up' | 'down';
type NativeDivProps = React.HTMLAttributes<HTMLDivElement>;
export type SelectProps = {
    /** The id attribute of div element. */
    id?: NativeSelectProps['id'];
    /** If true, prevents user interaction with component. */
    disabled?: NativeSelectProps['disabled'];
    /** If the options list will filter options based on text input. */
    autocomplete?: boolean;
    /** Message displayed if there is no available options. */
    emptyListMessage?: string;
    /** If it is possible to create an option if it does not exist in the options list. */
    createable?: boolean;
    /** If the menu opens up top or bottom. */
    direction?: Direction;
    /** The string or component to prefix the value in the create value option. */
    createablePrefix?: string;
    /** The handler for change events. */
    onChange?: NativeSelectProps['onChange'];
    /** The tabindex attribute for  */
    tabIndex?: NativeSelectProps['tabIndex'];
    /** The handler for focus events. */
    onFocus?: NativeSelectProps['onFocus'];
    /** The handler for blur events. */
    onBlur?: NativeSelectProps['onBlur'];
    /** A handler for when new values are created */
    onCreate?: (value: string) => void;
    /** The selected option's value. */
    value?: SelectOptionProps['value'];
    /** The name property of an input element. */
    name?: NativeSelectProps['name'];
    /** An arrary of objects conforming to OptionProps interface. */
    options: SelectOptionProps[];
    /** The approximate number of rows to display on menu. */
    rows?: number;
    /** Preset size spacing settings */
    size?: Size;
    /** Overide the padding setting of the element */
    padding?: Space | {
        outer?: Space;
        inner?: Space;
    };
    /** The size attribute for input element. Useful for controlling input size in flexboxes. */
    inputSize?: number | {
        max?: number;
        min?: number;
    };
    /** If true, show a border around the select component **/
    showBorder?: boolean;
    /** If the option list is wider than the select, which  */
    align?: 'left' | 'right';
    /** If true will show the indicator dot */
    showDot?: boolean;
    /** If true and showDot is true, will show a green indicator */
    validated?: boolean;
    /** If true, sets the select component into read only mode */
    readOnly?: boolean;
} & FieldBaseProps & Omit<NativeDivProps, 'children' | 'id' | 'onChange' | 'tabIndex' | 'onFocus' | 'onBlur' | 'aria-controls' | 'aria-expanded' | 'role' | 'aria-haspopup' | 'aria-invalid' | 'onClick' | 'onKeyDown'>;
export declare const Select: React.ForwardRefExoticComponent<{
    /** The id attribute of div element. */
    id?: NativeSelectProps['id'];
    /** If true, prevents user interaction with component. */
    disabled?: NativeSelectProps['disabled'];
    /** If the options list will filter options based on text input. */
    autocomplete?: boolean | undefined;
    /** Message displayed if there is no available options. */
    emptyListMessage?: string | undefined;
    /** If it is possible to create an option if it does not exist in the options list. */
    createable?: boolean | undefined;
    /** If the menu opens up top or bottom. */
    direction?: Direction | undefined;
    /** The string or component to prefix the value in the create value option. */
    createablePrefix?: string | undefined;
    /** The handler for change events. */
    onChange?: NativeSelectProps['onChange'];
    /** The tabindex attribute for  */
    tabIndex?: NativeSelectProps['tabIndex'];
    /** The handler for focus events. */
    onFocus?: NativeSelectProps['onFocus'];
    /** The handler for blur events. */
    onBlur?: NativeSelectProps['onBlur'];
    /** A handler for when new values are created */
    onCreate?: ((value: string) => void) | undefined;
    /** The selected option's value. */
    value?: string | undefined;
    /** The name property of an input element. */
    name?: NativeSelectProps['name'];
    /** An arrary of objects conforming to OptionProps interface. */
    options: SelectOptionProps[];
    /** The approximate number of rows to display on menu. */
    rows?: number | undefined;
    /** Preset size spacing settings */
    size?: Size | undefined;
    /** Overide the padding setting of the element */
    padding?: "none" | "0" | "0.5" | "auto" | "0.25" | "1" | "max" | "min" | "2" | "3" | "4" | "6" | "px" | "0.75" | "1.25" | "1.5" | "1.75" | "2.5" | "3.5" | "4.5" | "5" | "5.5" | "7" | "7.5" | "8" | "8.5" | "9" | "10" | "11" | "12" | "13" | "14" | "15" | "16" | "18" | "20" | "22.5" | "24" | "26" | "28" | "30" | "32" | "36" | "40" | "44" | "45" | "48" | "52" | "56" | "60" | "64" | "72" | "80" | "96" | "112" | "128" | "144" | "168" | "192" | "224" | "256" | "288" | "320" | "1/4" | "1/3" | "1/2" | "2/3" | "3/4" | "full" | "fit" | "viewHeight" | "viewWidth" | {
        outer?: "none" | "0" | "0.5" | "auto" | "0.25" | "1" | "max" | "min" | "2" | "3" | "4" | "6" | "px" | "0.75" | "1.25" | "1.5" | "1.75" | "2.5" | "3.5" | "4.5" | "5" | "5.5" | "7" | "7.5" | "8" | "8.5" | "9" | "10" | "11" | "12" | "13" | "14" | "15" | "16" | "18" | "20" | "22.5" | "24" | "26" | "28" | "30" | "32" | "36" | "40" | "44" | "45" | "48" | "52" | "56" | "60" | "64" | "72" | "80" | "96" | "112" | "128" | "144" | "168" | "192" | "224" | "256" | "288" | "320" | "1/4" | "1/3" | "1/2" | "2/3" | "3/4" | "full" | "fit" | "viewHeight" | "viewWidth" | undefined;
        inner?: "none" | "0" | "0.5" | "auto" | "0.25" | "1" | "max" | "min" | "2" | "3" | "4" | "6" | "px" | "0.75" | "1.25" | "1.5" | "1.75" | "2.5" | "3.5" | "4.5" | "5" | "5.5" | "7" | "7.5" | "8" | "8.5" | "9" | "10" | "11" | "12" | "13" | "14" | "15" | "16" | "18" | "20" | "22.5" | "24" | "26" | "28" | "30" | "32" | "36" | "40" | "44" | "45" | "48" | "52" | "56" | "60" | "64" | "72" | "80" | "96" | "112" | "128" | "144" | "168" | "192" | "224" | "256" | "288" | "320" | "1/4" | "1/3" | "1/2" | "2/3" | "3/4" | "full" | "fit" | "viewHeight" | "viewWidth" | undefined;
    } | undefined;
    /** The size attribute for input element. Useful for controlling input size in flexboxes. */
    inputSize?: number | {
        max?: number | undefined;
        min?: number | undefined;
    } | undefined;
    /** If true, show a border around the select component **/
    showBorder?: boolean | undefined;
    /** If the option list is wider than the select, which  */
    align?: "left" | "right" | undefined;
    /** If true will show the indicator dot */
    showDot?: boolean | undefined;
    /** If true and showDot is true, will show a green indicator */
    validated?: boolean | undefined;
    /** If true, sets the select component into read only mode */
    readOnly?: boolean | undefined;
} & FieldBaseProps & Omit<NativeDivProps, "id" | "role" | "tabIndex" | "aria-controls" | "aria-expanded" | "aria-haspopup" | "aria-invalid" | "children" | "onFocus" | "onBlur" | "onChange" | "onKeyDown" | "onClick"> & React.RefAttributes<HTMLInputElement>>;
export {};
