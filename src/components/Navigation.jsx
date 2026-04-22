import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Link } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase/firebase"

export default function Navigation() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

    return () => unsubscribe()
  }, [])

  const shortEmail = user?.email
    ? user.email.split("@")[0] + "..."
    : ""

  return (
    <StyledDiv>
      <div className='navWrapper'>
        <div className='leftNav'>
          <a href="/" className="navLink">
            <div className='navItems'>Hjem</div>
          </a>
        </div>

        <div className='centerNav'>
          <Link to="/add" className="navLink">
            <div className='navItems'>+ legg til person</div>
          </Link>
        </div>

        <div className='rightNav'>
          {!user ? (
            <>
              <Link to="/login" className="navLink">
                <div className='navItems'>Login</div>
              </Link>

              <Link to="/signup" className="navLink">
                <div className='navItems'>Register</div>
              </Link>
            </>
          ) : (
            <Link to="myprofile" className='navLink'>
            <div className='navItems userEmail'>{shortEmail}</div>
            </Link>
          )}
        </div>
      </div>
    </StyledDiv>
  )
}

const StyledDiv = styled.div`
  width: 100%;
  height: 60px;
  background-color: #bb6af1;
  color: white;
  font-size: 24px;
  font-weight: bold;

  .navWrapper {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
    height: 100%;
    padding: 0 30px;
  }

  .leftNav {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .centerNav {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .rightNav {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 20px;
  }

  .navItems {
    cursor: pointer;
  }

  .navLink {
    text-decoration: none;
    color: white;
  }

  .userEmail {
    background-color: rgba(255,255,255,0.15);
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 18px;
  }
`