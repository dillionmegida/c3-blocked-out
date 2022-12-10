import { useState } from "react"
import styled from "styled-components"
import { isJsonString } from "./utils/json"

const Container = styled.div`
  padding: 1rem;

  textarea {
    width: 100%;
    height: 300px;
    padding: 1rem;
  }

  button {
    width: 80px;
    height: 40px;
    background-color: black;
    color: white;
    border: none;
    cursor: pointer;
  }
`

export default function GetData({
  display,
}: {
  display: any
}) {
  const [raw, setRaw] = useState("")
  function onSubmit() {
    if (raw.length === 0) return alert("Please enter data")

    const isJson = isJsonString(raw)

    if (!isJson) return alert("The raw text is invalid")

    display(isJson)
  }

  return (
    <Container>
      <p>Enter raw data</p>
      <textarea
        onChange={(e) => {
          setRaw(e.target.value)
        }}
      />
      <button onClick={onSubmit}>Submit</button>
    </Container>
  )
}
