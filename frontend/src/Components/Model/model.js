import React from 'react'
import ClearIcon from '@mui/icons-material/Clear';
import './Model.css';

const Model = ({handleClose, content, header}) => {
  return (
      <div className='model-overlay'>
          <div className='model-container'>
              <div className='model-header'>
                  <div className='model-title'>{header}</div>
                  <div className='model-close' onClick={()=>handleClose()}>
                    <ClearIcon />
                  </div>
              </div>
              <div className='model-content'>
                  {content}
              </div>
        </div>
      </div>
  )
}

export default Model;