import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Container = styled.blockquote`
  display: flex;
  margin: 2rem auto;
  max-width: 80rem;
  padding: 0 2rem;
`

const Quote = styled.div`
  position: relative;
  font-size: 6rem;
  opacity: 0.6;

  &:before {
    content: '${({ isEnd }) => isEnd ? '„' : '“'}';
    position: absolute;
    top: ${({ isEnd }) => isEnd ? 'auto' : 0};
    right: ${({ isEnd }) => isEnd ? 'auto' : 0};
    bottom: ${({ isEnd }) => isEnd ? 0 : 'auto'};
    left: ${({ isEnd }) => isEnd ? 0 : 'auto'};
  }
`

const Content = styled.div`
  flex: 1;
  padding: 0 1rem;
  font-style: italic;
  font-size: 1.8rem;
  text-align: center;
`

const Blockquote = (props) => (
  <Container>
    <Quote />
    <Content>
      {props.children}
    </Content>
    <Quote isEnd />
  </Container>
)

Blockquote.propTypes = {
  children: PropTypes.node.isRequired
}

export default Blockquote
