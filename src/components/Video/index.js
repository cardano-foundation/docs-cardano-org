import React, { useCallback, useEffect, useState, createRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import YouTube from 'react-youtube'
import Loader from '../Loader'
import { LanguageConsumer } from '../../state'
import { addEventListener, removeEventListener, getScrollOffset, getInnerHeight } from '../../helpers/dom'

const Container = styled.div`
  overflow: hidden;
  position: relative;
  width: 100%;
  height: ${({ height }) => height}px;
`

const LoaderContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
`

const Video = ({ id, height, lazyLoad }) => {
  const containerRef = createRef()
  const [ showVideo, setShowVideo ] = useState(!lazyLoad)
  const onScroll = useCallback(() => {
    if (!containerRef.current) return
    const { y } = getScrollOffset()
    const { top } = containerRef.current.getBoundingClientRect()
    const innerHeight = getInnerHeight()
    if (innerHeight + y >= top) {
      setShowVideo(true)
      removeEventListeners()
    }
  })

  const addEventListeners = () => {
    if (!lazyLoad) return
    addEventListener('scroll', onScroll)
    addEventListener('touchmove', onScroll)
  }

  const removeEventListeners = () => {
    removeEventListener('scroll', onScroll)
    removeEventListener('touchmove', onScroll)
  }

  useEffect(() => {
    removeEventListeners()
    addEventListeners()
    setTimeout(onScroll, 500)

    return () => removeEventListeners()
  })

  return (
    <LanguageConsumer>
      {({ lang }) => (
        <Container height={height} ref={containerRef}>
          <LoaderContainer>
            <Loader />
          </LoaderContainer>
          {showVideo &&
            <YouTube
              videoId={id}
              id={id}
              opts={{
                width: '100%',
                height,
                playerVars: {
                  cc_load_policy: +(lang !== 'en'),
                  cc_lang_pref: lang,
                  modestbranding: 1
                }
              }}
            />
          }
        </Container>
      )}
    </LanguageConsumer>
  )
}

Video.propTypes = {
  id: PropTypes.string.isRequired,
  height: PropTypes.number,
  lazyLoad: PropTypes.bool
}

Video.defaultProps = {
  height: 300,
  lazyLoad: true
}

export default Video
