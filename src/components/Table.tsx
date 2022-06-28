import React, { useState, useRef, useEffect, createRef } from 'react'
import styled from 'styled-components'
import { scrollToCurrent } from './scroll'
import IconX from './IconX'

interface TableContainerProps {
    nested?: boolean
    isScrollable?: boolean
}

const TableContainer = styled.div<TableContainerProps>``

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


interface ExpandConfig {
    columns: any[]
    datasourceIndex: string
    isScrollable: boolean
    expandConfig?: ExpandConfig
}

interface InfinityScrollConfig {
    gap: number;
}

interface TableProps {
    columns: any[];
    expandConfig?: ExpandConfig,
    nested?: boolean;
    isScrollable?: boolean;
    infinityScrollConfig?: InfinityScrollConfig;
    minWidth?: number;
    datasource: any[];
}
export default function Table({
    expandConfig,
    nested,
    isScrollable,
    infinityScrollConfig,
    datasource,
    columns,
}: TableProps) {
  console.log('in')
  const [expandedRow, setExpandedRow] = useState<number>()
  console.log('out')
  const [infinityScrollEnd, setInfinityScrollEnd] = useState<number>(
    infinityScrollConfig ? infinityScrollConfig.gap : 100
  )
  const [scrollY, setScrollY] = useState<number>(0)
  const [rowRefs, setRowRefs] = useState<Array<React.MutableRefObject<HTMLDivElement>>>([])
  const tableRef = useRef<null | HTMLDivElement>()

  const updateScrollY = () => setScrollY(window.pageYOffset)

  //when a new row expands, access create the references for scrolling
  useEffect(() => {
    setRowRefs((rowRefs: any) =>
    datasource
      .map((_, i) => rowRefs[i] || createRef()),
  );
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

  const shouldExpandRow = (id: number)=> expandedRow === id && expandConfig !== undefined

  const expandedContent = (element: any) => {
    if(!expandConfig){
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
              <div
                onClick={() => setExpandedRow(undefined)}
              >
                <IconX />
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

  const generateColumns = (element: any) => {
    return columns.map((column, i) => {
      return (
        <Column
          {...column.style}
          amountOfColumns={columns.length}
          width={column.width}
          expander={column.expander}
          key={column.key}
          onClick={() => {
            if (column.onClick !== undefined) {
              column.onClick(element.id)
            }
            if (column.expander) {
              if (expandedRow === element.id) {
                setExpandedRow(undefined)
              } else {
                if (isScrollable && rowRefs[i]) {
                  scrollToCurrent(rowRefs[i])
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

    if (infinityScrollConfig) {
      elements = elements.slice(0, infinityScrollEnd + infinityScrollConfig.gap)
    }

    return elements.map(element => {
      return (
        <>
          <Row
            ref={() => rowRefs[element.id] ?? null}
            expanded={expandedRow === element.id}
            key={element.id}
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
      <Row>
        {columns.map(column => {
          return (
            <HeaderColumn
              width={column.width}
            >
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
    <TableContainer
      isScrollable={isScrollable}
      ref={() => tableRef}
      nested={nested}
    >
      <div>
        <div>
          {generateHeader()}
          {generateRows()}
        </div>
      </div>
    </TableContainer>
  )
}