import React from 'react'
import { render } from '@testing-library/react'
import Table from './Table'

describe('Table', () => {
    test('renders the Table component with no columns and empty datasource', () => {
        render(<Table columns={[]} datasource={[]} />)
    })
})
