import React from 'react'

function Button({variant,color,style,label}) {

    const getVariant=()=>{
        if(!variant){
            return ""
        }
        return `-${variant}`
    }

  return (
    <button type="button" className={`btn btn${getVariant()}-${color}`} style={style}>{label}</button>
  )
}

export default Button
