/// <reference types="react" />
interface ExpandConfig {
    columns: any[];
    datasourceIndex: string;
    isScrollable: boolean;
    expandConfig?: ExpandConfig;
}
interface InfinityScrollConfig {
    gap: number;
}
interface TableProps {
    columns: any[];
    expandConfig?: ExpandConfig;
    nested?: boolean;
    isScrollable?: boolean;
    infinityScrollConfig?: InfinityScrollConfig;
    minWidth?: number;
    datasource: any[];
}
export default function Table({ expandConfig, nested, isScrollable, infinityScrollConfig, datasource, columns, }: TableProps): JSX.Element;
export {};
