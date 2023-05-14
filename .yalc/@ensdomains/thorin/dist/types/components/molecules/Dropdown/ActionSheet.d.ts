import * as React from 'react';
import type { DropdownItem } from './Dropdown';
export declare const ActionSheet: ({ isOpen, screenSize, items, setIsOpen, DropdownChild, }: {
    isOpen: boolean;
    screenSize: number;
    items: DropdownItem[];
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    DropdownChild: React.FC<{
        setIsOpen: (isOpen: boolean) => void;
        item: React.ReactElement<React.PropsWithRef<any>>;
    }>;
}) => JSX.Element;
