import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { db } from '../Firebase/firebase'

export default function Person() {
  const { id } = useParams()
  const [person, setPerson] = useState(null)

  useEffect(() => {
    const fetchPerson = async () => {
      const docRef = doc(db, 'personer', id)
      const docSnap = await getDoc(docRef)
      console.log(docSnap)

      if (docSnap.exists()) {
        setPerson({
          id: docSnap.id,
          ...docSnap.data()
        })
      }
    }

    fetchPerson()
  }, [id])

  if (!person) {
    return <StyleWrapper><p>Laster person...</p></StyleWrapper>
  }

  return (
    <StyleWrapper>
      <div className="personCard">
        <img
          src={
            !person.bilde || person.bilde === 'no image'
              ? 'https://www.shutterstock.com/image-vector/avatar-photo-default-user-icon-600nw-2558759027.jpg'
              : person.bilde
          }
          alt={person.navn}
        />

        <h1>{person.navn}</h1>
        <p>Alder: {person.alder}</p>
        <p>Kjønn: {person.kjonn}</p>
        <p>Studieprogram: {person.studieprogram}</p>
      </div>
    </StyleWrapper>
  )
}

const StyleWrapper = styled.div`
  padding: 30px;
  display: flex;
  justify-content: center;

  .personCard {
    width: 320px;
    background: #f4f4f4;
    border-radius: 10px;
    padding: 20px;
  }

  .personCard img {
    width: 100%;
    height: 280px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 15px;
  }

  .personCard h1 {
    margin-bottom: 10px;
  }

  .personCard p {
    margin: 6px 0;
  }
`