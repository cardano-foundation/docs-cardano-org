import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import UploadCarePicture from '../UploadCarePicture'

const isUploadeCareImage = src => !!src.match(/^(https?:)?(\/\/)?ucarecdn\.com\/.*$/)

const Image = (props) => {
  const isUploadCare = isUploadeCareImage(props.src)
  return (
    <Fragment>
      {isUploadCare &&
        <UploadCarePicture {...props} />
      }
      {!isUploadCare &&
        <img {...props} />
      }
    </Fragment>
  )
}

Image.propTypes = {
  src: PropTypes.string.isRequired
}

export default Image
