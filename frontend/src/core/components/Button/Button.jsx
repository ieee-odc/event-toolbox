import React from 'react'

function Button({variant,color,style}) {

    const getVariant=()=>{
        if(!variant){
            return ""
        }
        return `-${variant}`
    }

  return (
    <button type="button" className={`btn btn${getVariant()}-${color}`} style={style}>Sign in</button>
  )
}

export default Button
