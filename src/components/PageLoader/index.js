import React from 'react'
import Loader from '../Loader'
import styled from 'styled-components'

const Container = styled.div`
  display: inline-block;
  left: 50%;
  position: relative;
  transform: translateX(-50%);
`

const PageLoader = () => (
  <Container>
    <Loader />
  </Container>
)

export default PageLoader
