import { Props as AvatarProps } from '../../atoms/Avatar';
import { DropdownItem } from '../Dropdown/Dropdown';
declare type Size = 'small' | 'medium' | 'large';
declare type BaseProps = {
    avatar?: AvatarProps['src'];
    avatarAs?: AvatarProps['as'];
    dropdownItems?: DropdownItem[];
    address: string;
    ensName?: string;
    alignDropdown?: 'left' | 'right';
    size?: Size;
};
declare type Props = BaseProps;
export declare const Profile: ({ size, avatar, avatarAs, dropdownItems, address, ensName, alignDropdown, }: Props) => JSX.Element;
export {};
