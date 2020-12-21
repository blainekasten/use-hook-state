import React from 'react'
import { createState } from '../src'
import { render, act } from '@testing-library/react'
jest.useFakeTimers()

describe('implement this', () => {
  it('should work', () => {
    const { Provider, useState } = createState(
      { value: 0, increment: () => void 0 },
      () => {
        const [value, setValue] = React.useState(0)

        return {
          value,
          increment: () => setValue((n) => n + 1),
        }
      }
    )

    function App() {
      const { value, increment } = useState()

      return (
        <div>
          <button onClick={increment} data-testid="button" />
          <div data-testid="value">{value}</div>
        </div>
      )
    }

    const { queryByTestId, rerender } = render(
      <div>
        <Provider />
        <App />
      </div>
    )

    expect(queryByTestId('value')?.innerHTML).toBe('0')

    act(() => {
      queryByTestId('button')?.click()
      jest.runAllTimers()
    })

    expect(queryByTestId('value')?.innerHTML).toBe('1')
  })
})
