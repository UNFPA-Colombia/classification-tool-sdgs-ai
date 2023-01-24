import React from 'react'
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { BsInfoCircleFill } from "react-icons/bs";

function InfoButton(props) {
  return (
    <OverlayTrigger
      placement={props.placement}
      delay={{ show: 250, hide: 400 }}
      overlay=
      {
        <Tooltip id="button-tooltip" {...props}>
          {props.message}
        </Tooltip>
      }
    >
      <Button variant="success" ><BsInfoCircleFill size={25} /></Button>
    </OverlayTrigger>
  )
}

export default InfoButton