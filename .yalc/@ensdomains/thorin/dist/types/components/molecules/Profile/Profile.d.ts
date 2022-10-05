import * as React from 'react';
import { Props as AvatarProps } from '../../atoms/Avatar';
import { DropdownItem } from '../Dropdown/Dropdown';
declare type Size = 'small' | 'medium' | 'large';
declare type NativeDivProps = React.HTMLAttributes<HTMLDivElement>;
declare type BaseProps = {
    /** The url of the avatar icon, or the avatar props to passthrough */
    avatar?: AvatarProps['src'] | Omit<AvatarProps, 'label'>;
    /** An array of objects conforming to the DropdownItem interface. */
    dropdownItems?: DropdownItem[];
    /** The ethereum address of the profiled user. */
    address: string;
    /** The ENS name associated with the address. */
    ensName?: string;
    /** The alignment of the dropdown menu in relation to the profile button. */
    alignDropdown?: 'left' | 'right';
    /** The size and styling of the profile button. */
    size?: Size;
} & Omit<NativeDivProps, 'children'>;
declare type Props = BaseProps;
export declare const Profile: {
    ({ size, avatar, dropdownItems, address, ensName, alignDropdown, ...props }: Props): JSX.Element;
    displayName: string;
};
export {};
