/// <reference types="react" />
import { CSSProperties } from 'styled-components';
interface ExpandConfig<DatasourceEntity> {
    columns: Column<DatasourceEntity>[];
    datasourceIndex: string;
    isScrollable: boolean;
    expandConfig?: ExpandConfig<DatasourceEntity>;
}
interface InfinityScrollConfig {
    gap: number;
}
interface Column<DatasourceEntity> extends ColumnComponent {
    index?: string;
    width?: number;
    style?: CSSProperties;
    headerText?: string;
    component: (e: unknown) => JSX.Element;
    onClick?: (e: DatasourceEntity) => void;
}
interface ColumnComponent {
    key: string;
    width?: number;
    style?: CSSProperties;
    expander?: boolean;
}
declare const Column: import("styled-components").StyledComponent<"div", any, ColumnComponent, never>;
interface TableProps<DatasourceEntity> {
    columns: Column<DatasourceEntity>[];
    expandConfig?: ExpandConfig<DatasourceEntity>;
    nested?: boolean;
    isScrollable?: boolean;
    infinityScrollConfig?: InfinityScrollConfig;
    minWidth?: number;
    datasource: DatasourceEntity[];
}
export default function Table<DatasourceEntity>({ expandConfig, nested, isScrollable, infinityScrollConfig, datasource, columns, }: TableProps<DatasourceEntity>): JSX.Element;
export {};
