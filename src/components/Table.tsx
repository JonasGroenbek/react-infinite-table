import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { scrollToCurrent } from './scroll'
import IconX from './IconX'

interface TableContainer {
    nested: boolean
    scrollable: boolean
}
const TableContainer = styled.div<TableContainer>`
${({ nested }) =>
  nested &&
  `
`};
`

interface Row {
    expanded?: boolean
}
const Row = styled.div<Row>`
  ${({ expanded }) =>
    expanded &&
    `
    `};
`

interface Column {
    width: number
    expander: boolean
}
const Column = styled.div<Column>`
   ${({ width }) => `flex-shrink: ${width ? '0' : '1'}`};
   ${({ width }) => width && `flex-basis: ${width}px;`}
   ${({ expander }) => expander && 'cursor: pointer;'}
`

interface HeaderColumn {
    width: number
}

const HeaderColumn = styled.div<HeaderColumn>`
     ${({ width }) => `flex-shrink: ${width ? '0' : '1'}`};
     ${({ width }) => width && `flex-basis: ${width}px;`}
`

const Button = styled.button.attrs({
  className: 'myClass'
})``

const PaginationContainer = styled.div`
`
const PaginationButtonContainer = styled.div`
`
const PaginationText = styled.p`
`

interface ExpandConfig {
    columns: any[]
    datasourceIndex: string
    scrollable: boolean
    expandConfig?: ExpandConfig
}

interface InfinityScrollConfig {
    gap: number;
}

interface TableProps {
    columns: any[];
    paginationConfig?: any;
    expandConfig?: ExpandConfig,
    nested?: boolean;
    scrollable?: boolean;
    infinityScrollConfig?: InfinityScrollConfig;
    minWidth?: number;
    datasource: any[];
}
export default function Table({
    paginationConfig,
    expandConfig,
    nested,
    scrollable,
    infinityScrollConfig,
    datasource,
    columns,
    minWidth,
}: TableProps) {

  const [expandedRow, setExpandedRow] = useState(undefined)
  const [paginationStart, setPaginationStart] = useState(0)
  const [infinityScrollEnd, setInfinityScrollEnd] = useState(
    infinityScrollConfig ? infinityScrollConfig.gap : null
  )
  const [filterText, setFilterText] = useState('')
  const [filterColumn, setFilterColumn] = useState('*')
  const [scrollY, setScrollY] = useState(0)
  const [sortConfig, setSortConfig] = useState(undefined)
  const rowRefs = useRef([])
  const tableRef = useRef<HTMLDivElement>(null)

  const isDropdownSelectSelected = (columnSortConfig, name) => {
    if (sortConfig?.key !== columnSortConfig.key) {
      return false
    }
    if (sortConfig?.name === name) {
      return true
    }
    if (!sortConfig && columnSortConfig.defaultText === name) {
      return true
    }
    return false
  }

  const updateScrollY = () => setScrollY(window.pageYOffset)

  useEffect(() => {
    if (infinityScrollConfig && !paginationConfig) {
      if (tableRef.current.getBoundingClientRect().bottom < scrollY) {
        setInfinityScrollEnd(infinityScrollEnd + infinityScrollConfig.gap)
      }
    }
  }, [infinityScrollConfig, infinityScrollEnd, paginationConfig, scrollY])

  useEffect(() => {
    if (infinityScrollConfig && !paginationConfig) {
      const listenScroll = () => {
        window.addEventListener('scroll', updateScrollY)
      }
      listenScroll()
      return () => {
        window.removeEventListener('scroll', updateScrollY)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const generatePaginationComponent = () =>
    paginationConfig && (
      <PaginationContainer>
        <PaginationText>
          {`${paginationStart}-${
            paginationStart + paginationConfig.limit > datasource.length
              ? datasource.length
              : paginationStart + paginationConfig.limit
          } / ${datasource.length}`}
        </PaginationText>
        <PaginationButtonContainer>
          {paginationStart > 0 && (
            <Button
              onClick={() => {
                setExpandedRow(undefined)
                setPaginationStart(paginationStart - paginationConfig.limit)
              }}
            >
              Tilbage
            </Button>
          )}
          {paginationStart + paginationConfig.limit <
            datasource.length && (
            <Button
              onClick={() => {
                setExpandedRow(undefined)
                setPaginationStart(paginationStart + paginationConfig.limit)
              }}
            >
              Videre
            </Button>
          )}
        </PaginationButtonContainer>
      </PaginationContainer>
    )

  const shouldExpandRow = id => expandedRow === id && expandConfig !== undefined

  const expandedContent = element => {
    if (
      element[expandConfig.datasourceIndex] === undefined ||
      element[expandConfig.datasourceIndex].length === 0
    ) {
      return <p>Der er intet indhold</p>
    } else {
      return (
        <div className="nested-table">
          <div className="nested-table--content">
            <div className="nested-table-options">
              <div
                className="row-close"
                onClick={() => setExpandedRow(undefined)}
              >
                <IconX />
              </div>
              <div className="parent-row-info">
                <p>{expandConfig.datasourceIndex}</p>
              </div>
            </div>
            <Table columns={columns} datasource={[element]} />
            <Table
            
              columns={expandConfig.columns}
              scrollable={expandConfig.scrollable}
              datasource={element[expandConfig.datasourceIndex]}
              expandConfig={expandConfig.expandConfig}
              //paginationConfig={expandConfig.paginationConfig}
              nested={true}
            />
          </div>
        </div>
      )
    }
  }

  const generateColumns = element => {
    return columns.map((column, i) => {
      return (
        <Column
          {...column.style}
          amountOfColumns={columns.length}
          width={column.width}
          expander={column.expander}
          key={column.key}
          className="mtr-column"
          onClick={() => {
            if (column.onClick !== undefined) {
              column.onClick(element.id)
            }
            if (column.expander) {
              if (expandedRow === element.id) {
                setExpandedRow(undefined)
              } else {
                if (scrollable) {
                  scrollToCurrent(rowRefs.current[element.id])
                }
                setExpandedRow(element.id)
              }
            }
          }}
        >
          {column.component(column.index ? element[column.index] : element)}
        </Column>
      )
    })
  }

  //should sort here
  const generateRows = () => {
    let elements = datasource

    if (elements === undefined) {
      return
    }

    //sorting
    if (sortConfig && sortConfig.sorter) {
      elements = elements.sort(sortConfig.sorter)
    }

    //pagination
    if (paginationConfig) {
      elements = elements.slice(
        paginationStart,
        paginationStart + paginationConfig.limit
      )
    }
    if (infinityScrollConfig && !paginationConfig) {
      elements = elements.slice(0, infinityScrollEnd + infinityScrollConfig.gap)
    }

    return elements.map(element => {
      return (
        <>
          <Row
            ref={ref => {
              if (!rowRefs.current[element.id] && scrollable) {
                rowRefs.current[element.id] = ref
              }
            }}
            expanded={expandedRow === element.id}
            key={element.id}
            className="mtr-row"
          >
            {generateColumns(element)}
          </Row>
          {shouldExpandRow(element.id) && expandedContent(element)}
        </>
      )
    })
  }

  const generateHeader = () => {
    return (
      <Row className="mtr-row mtr-header-row">
        {columns.map(column => {
          return (
            <HeaderColumn
              width={column.width}
              className="mtr-column mtr-header-column"
            >
              <div className="cell-content">
                {/** udkommenter nedenstående 3 linjer */}
                <label>{column.headerText}</label>
              </div>
            </HeaderColumn>
          )
        })}
      </Row>
    )
  }

  return (
    <TableContainer
      scrollable={scrollable}
      ref={ref => (tableRef.current = ref)}
      nested={nested}
    >
      <div className="mtr-table-container">
        <div className="mtr-table">
          {generateHeader()}
          {generateRows()}
        </div>
        {generatePaginationComponent()}
      </div>
    </TableContainer>
  )
}