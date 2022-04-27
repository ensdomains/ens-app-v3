import { ENSArgs } from '..';
declare type Subname = {
    id: string;
    labelName: string | null;
    truncatedName?: string;
    labelhash: string;
    isMigrated: boolean;
    name: string;
    owner: {
        id: string;
    };
};
declare const getSubnames: ({ gqlInstance }: ENSArgs<'gqlInstance'>, name: string) => Promise<Subname[]>;
export default getSubnames;
