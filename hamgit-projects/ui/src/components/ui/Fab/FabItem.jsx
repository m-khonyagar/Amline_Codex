import { createElement } from 'react'

import classes from './Fab.module.scss'

function FabItem({ label, icon, onClick = () => {}, ...props }) {
  return (
    <button type="button" className={classes['fab-item']} onClick={onClick} {...props}>
      <div className={classes['fab-item__icon']}>{icon && createElement(icon, { size: 28 })}</div>
      <span className={classes['fab-item__label']}>{label}</span>
    </button>
  )
}

export default FabItem
