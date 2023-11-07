import * as React from 'react';
import type { DropdownItem } from './Dropdown';
type Props = {
    isOpen: boolean;
    screenSize: number;
    items: DropdownItem[];
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    DropdownChild: React.FC<{
        setIsOpen: (isOpen: boolean) => void;
        item: React.ReactElement<React.PropsWithRef<any>>;
    }>;
    cancelLabel?: string;
};
export declare const ActionSheet: React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLDivElement>>;
export {};
