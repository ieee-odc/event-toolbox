import React from 'react'

function Button({variant,color,style}) {

    const getVariant=()=>{
        if(!variant){
            return ""
        }
        return `-${variant}`
    }

  return (
    <button type="button" class={`btn btn${getVariant()}-${color}`} style={style}>Primary</button>
  )
}

export default Button
