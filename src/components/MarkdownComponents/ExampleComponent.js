import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: block;
  text-align: center;
  margin: 2rem 0;
  padding: 2rem;
  border: 0.1rem solid ${({ theme }) => theme.palette.text.primary};
`

export default () => (
  <Container>
    <h3>Example custom component</h3>
    <p><code>src/MarkdownComponents/ExampleComponent</code> being rendered within markdown.</p>
  </Container>
)
