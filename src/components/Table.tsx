import React, { useState, useRef, useEffect, createRef } from 'react'
import styled, { CSSProperties } from 'styled-components'
import { scrollToCurrent } from './scroll'
import IconX from './IconX'

interface TableContainerProps {
    nested?: boolean
    isScrollable?: boolean
}

const TableContainer = styled.div<TableContainerProps>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    margin-bottom: 30px;
    ${({ nested }) =>
        nested &&
        'padding:2rem; background-color:#f9f9f9;border-left: 1px solid rgba(0, 0, 0, 0.05);border-right: 1px solid rgba(0, 0, 0, 0.05);border-bottom: 1px solid rgba(0, 0, 0, 0.05);'};
`

interface Row {
    expanded?: boolean
}

const Row = styled.div<Row>`
    display: flex;
    flex: 0 100px 1em;
    flex-direction: row;
    flex-wrap: nowrap;
    height: 80px;
    ${({ expanded }) =>
        expanded &&
        'border-bottom: 1px solid rgba(0, 0, 0, 0.05); background-color:#f1f1f1;margin-bottom:0!important;'};
`

interface HeaderColumn {
    width?: number
}

const HeaderColumn = styled.div<HeaderColumn>`
    ${({ width }) => `flex-shrink: ${width ? '0' : '1'}`};
    ${({ width }) => width && `flex-basis: ${width}px;`}
`

interface ExpandConfig<DatasourceEntity> {
    columns: Column<DatasourceEntity>[]
    datasourceIndex: string
    isScrollable: boolean
    expandConfig?: ExpandConfig<DatasourceEntity>
}

interface InfinityScrollConfig {
    gap: number
}

interface Column<DatasourceEntity> extends ColumnComponent {
    index?: string
    width?: number
    style?: CSSProperties
    headerText?: string
    component: (e: unknown) => JSX.Element
    onClick?: (e: DatasourceEntity) => void
}

interface ColumnComponent {
    key: string
    width?: number
    style?: CSSProperties
    expander?: boolean
}

const Column = styled.div<ColumnComponent>`
    ${({ width }) => `flex-shrink: ${width ? '0' : '1'}`};
    ${({ width }) => width && `flex-basis: ${width}px;`}
    ${({ expander }) => expander && 'cursor: pointer;'}
`

interface TableProps<DatasourceEntity> {
    columns: Column<DatasourceEntity>[]
    expandConfig?: ExpandConfig<DatasourceEntity>
    nested?: boolean
    isScrollable?: boolean
    infinityScrollConfig?: InfinityScrollConfig
    minWidth?: number
    datasource: DatasourceEntity[]
}

export default function Table<DatasourceEntity>({
    expandConfig,
    nested,
    isScrollable,
    infinityScrollConfig,
    datasource,
    columns,
}: TableProps<DatasourceEntity>) {
    const [expandedRow, setExpandedRow] = useState<string | null>(null)
    const [infinityScrollEnd, setInfinityScrollEnd] = useState<number>(
        infinityScrollConfig ? infinityScrollConfig.gap : 100
    )
    const [scrollY, setScrollY] = useState<number>(0)
    const [rowRefs, setRowRefs] = useState<Array<React.MutableRefObject<HTMLDivElement>>>([])
    const tableRef = useRef<null | HTMLDivElement>()

    const getRefKey = (index: number) => {
        return rowRefs[index]?.current ? JSON.stringify(rowRefs[index].current) : null
    }

    const isExpanded = (index: number): boolean => {
        return getRefKey(index) !== null && getRefKey(index) === expandedRow
    }

    const updateScrollY = () => setScrollY(window.pageYOffset)

    // when a new row expands, access create the references for scrolling
    useEffect(() => {
        setRowRefs((rowRefs: any) => datasource.map((_, i) => rowRefs[i] || createRef()))
    }, [datasource])

    useEffect(() => {
        if (infinityScrollConfig) {
            if (tableRef?.current && tableRef.current.getBoundingClientRect().bottom < scrollY) {
                setInfinityScrollEnd(infinityScrollEnd + infinityScrollConfig.gap)
            }
        }
    }, [infinityScrollConfig, infinityScrollEnd, scrollY])

    useEffect(() => {
        if (infinityScrollConfig) {
            const listenScroll = () => {
                window.addEventListener('scroll', updateScrollY)
            }
            listenScroll()
            return () => {
                window.removeEventListener('scroll', updateScrollY)
            }
        }
    }, [])

    const shouldExpandRow = (jsonRef: string) =>
        jsonRef ?? (expandedRow === jsonRef && expandConfig !== undefined)

    const expandedContent = (element: any) => {
        if (!expandConfig) {
            return
        }
        if (
            element[expandConfig.datasourceIndex] === undefined ||
            element[expandConfig.datasourceIndex].length === 0
        ) {
            return <p>No content</p>
        } else {
            return (
                <div>
                    <div>
                        <div>
                            <div onClick={() => setExpandedRow(null)}>
                                <IconX height={10} width={10} />
                            </div>
                            <div>
                                <p>{expandConfig.datasourceIndex}</p>
                            </div>
                        </div>
                        <Table columns={columns} datasource={[element]} />
                        <Table
                            columns={expandConfig.columns}
                            isScrollable={expandConfig.isScrollable}
                            datasource={element[expandConfig.datasourceIndex]}
                            expandConfig={expandConfig.expandConfig}
                            nested={true}
                        />
                    </div>
                </div>
            )
        }
    }

    const generateColumns = (element: DatasourceEntity, i: number) => {
        return columns.map((column, i) => {
            return (
                <Column
                    style={column.style}
                    width={column.width}
                    expander={column.expander}
                    key={column.key}
                    onClick={() => {
                        if (column.onClick !== undefined) {
                            column.onClick(element)
                        }
                        if (column.expander && getRefKey(i)) {
                            if (expandedRow === getRefKey(i)) {
                                setExpandedRow(null)
                            } else {
                                if (isScrollable && rowRefs[i]) {
                                    scrollToCurrent(rowRefs[i])
                                }
                                setExpandedRow(getRefKey(i))
                            }
                        }
                    }}
                >
                    {column.component(
                        column.index !== undefined
                            ? element[column.index as keyof DatasourceEntity]
                            : element
                    )}
                </Column>
            )
        })
    }

    const generateRows = () => {
        let elements = datasource

        if (elements === undefined) {
            return
        }

        if (infinityScrollConfig) {
            elements = elements.slice(0, infinityScrollEnd + infinityScrollConfig.gap)
        }

        return elements.map((element, i) => {
            return (
                <>
                    <Row key={i} ref={rowRefs[i]} expanded={isExpanded(i)}>
                        {generateColumns(element, i)}
                    </Row>
                    {isExpanded(i) && expandedContent(element)}
                </>
            )
        })
    }

    const generateHeader = () => {
        return (
            <Row>
                {columns.map((column, i) => {
                    return (
                        <HeaderColumn key={i} width={column.width}>
                            <div>
                                <label>{column.headerText}</label>
                            </div>
                        </HeaderColumn>
                    )
                })}
            </Row>
        )
    }

    return (
        <TableContainer isScrollable={isScrollable} ref={() => tableRef} nested={nested}>
            {generateHeader()}
            {generateRows()}
        </TableContainer>
    )
}
