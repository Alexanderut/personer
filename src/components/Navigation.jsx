import React from 'react'
import styled from 'styled-components'
import {Link} from "react-router-dom"

export default function Navigation() {


  return (
    <StyledDiv>

    <div className='navWrapper'>
        <a href="/"><div className='navItems'>Hjem</div></a>
        <Link><div className='navItems'>Personer</div></Link>
        <Link to="/add"><div className='navItems'>+ legg til person</div></Link>

    </div>
    
    
    </StyledDiv>
  )
}



const StyledDiv = styled.div`

width: 100%;
height:60px;
background-color: #bb6af1;
color: white;
font-size: 24px;
font-weight: bold;

.navWrapper{
    display: flex;
    justify-content: space-evenly;
    height: 100%;
    align-items: center;

}

`