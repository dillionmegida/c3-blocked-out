import { useState } from "react"
import DatePicker from "react-date-picker"
import styled from "styled-components"

const Container = styled.div`
  padding: 2rem 1rem 0.5rem;

  .date-picker {
    display: grid;
    grid-template-columns: 200px 20px 200px;
    column-gap: 10px;
    align-items: center;
  }

  .react-date-picker__calendar {
    position: relative;
    z-index: 2;
  }
`

type Props = {
  fromDate: Date
  toDate: Date
  onSetFromDate: (date: Date) => void
  onSetToDate: (date: Date) => void
}

export default function DateRange({
  fromDate,
  toDate,
  onSetFromDate,
  onSetToDate,
}: Props) {
  return (
    <Container>
      <div className="date-picker">
        <DatePicker
          onChange={onSetFromDate}
          value={fromDate}
        />
        <span>To</span>
        <DatePicker onChange={onSetToDate} value={toDate} />
      </div>
    </Container>
  )
}
