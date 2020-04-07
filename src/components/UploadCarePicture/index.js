import React from 'react'
import PropTypes from 'prop-types'

const UploadCarePicture = ({ src, size, alt }) => {
  let imageSrc = src
  if (size) imageSrc = `${src}-/resize/${size}/`
  return (
    <picture>
      <source type='image/webp' srcSet={`${imageSrc}-/format/webp/-/progressive/yes/`} />
      <img src={imageSrc} alt={alt} />
    </picture>
  )
}

UploadCarePicture.propTypes = {
  src: PropTypes.string.isRequired,
  size: PropTypes.number,
  alt: PropTypes.string.isRequired
}

UploadCarePicture.defaultProps = {
  lazy: true
}

export default UploadCarePicture
