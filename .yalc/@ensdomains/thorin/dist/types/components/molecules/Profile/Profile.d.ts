import { Props as AvatarProps } from '../../atoms/Avatar';
import { DropdownItem } from '../Dropdown/Dropdown';
declare type Size = 'small' | 'medium' | 'large';
declare type BaseProps = {
    /** The url of the avatar icon. */
    avatar?: AvatarProps['src'];
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
};
declare type Props = BaseProps;
export declare const Profile: {
    ({ size, avatar, dropdownItems, address, ensName, alignDropdown, }: Props): JSX.Element;
    displayName: string;
};
export {};
