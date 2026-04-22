import React, { useState, useEffect } from 'react'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import styled from 'styled-components'
import { db, auth } from '../firebase/firebase'
import { onAuthStateChanged } from "firebase/auth"
import trash from "../assets/trash.jpg"
import cog from "../assets/cog.png"
import { Link } from "react-router-dom"

export default function Home() {
  const [persons, setPersons] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const fetchPersons = async () => {
      const snapshot = await getDocs(collection(db, "personer"))
      const personsArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      setPersons(personsArray)
    }

    fetchPersons()
  }, [])

  const deletePerson = async (id, ownerId) => {
    if (!user) {
      alert("Du må være logget inn.");
      return;
    }

    if (user.uid !== ownerId) {
      alert("Du kan bare slette personer du selv har opprettet.");
      return;
    }

    try {
      await deleteDoc(doc(db, "personer", id))
      setPersons(persons.filter((person) => person.id !== id))
    } catch (error) {
      console.log("Feil ved sletting:", error)
      alert("Kunne ikke slette personen.")
    }
  }

  return (
    <StyleWrapper>
      <h1>Personer</h1>

      <div className='cardContainer'>
        {persons.map((person) => {
          const isOwner = user && person.ownerId === user.uid

          return (
            <div className='personCard' key={person.id}>
              <Link to={`/person/${person.id}`} className="cardLink">
                <img
                  className='personImage'
                  src={
                    !person.bilde || person.bilde === "no image"
                      ? "https://www.shutterstock.com/image-vector/avatar-photo-default-user-icon-600nw-2558759027.jpg"
                      : person.bilde
                  }
                  alt={person.navn}
                />

                <h2>{person.navn}</h2>
              </Link>

              {isOwner && (
                <Link to={`/updateperson/${person.id}`}>
                  <img className="cogImage" src={cog} alt="Rediger" />
                </Link>
              )}

              <p>Alder: {person.alder}</p>
              <p>Kjønn: {person.kjonn}</p>
              <p>Studieprogram: {person.studieprogram}</p>

              {isOwner && (
                <div className='trachIconContainer'>
                  <img
                    className='trashIcon'
                    src={trash}
                    alt="Slett"
                    onClick={() => deletePerson(person.id, person.ownerId)}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </StyleWrapper>
  )
}

const StyleWrapper = styled.div`
  padding:30px;

  .cardContainer{
    display: flex;
    flex-wrap: wrap;
    gap:20px;
    justify-content: center;
  }

  h1{
    text-align: center;
    margin-bottom: 30px;
  }

  .personCard{
    width:250px;
    background-color: #f4f4f4;
    border-radius: 10px;
    padding: 15px;
    position: relative;
    padding-bottom: 50px;
  }

  .personImage{
    width:100%;
    height:220px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 10px;
    margin-top: 25px;
  }

  .trachIconContainer{
    position: static;
  }

  .trashIcon{
    position:absolute;
    bottom: 15px;
    right:15px;
    width: 30px;
    height: auto;
    cursor: pointer;
  }

  .cogImage{
    position: absolute;
    top: 8px;
    right: 8px;
    width: 23px;
    height: auto;
    cursor: pointer;
  }

  .cardLink {
    text-decoration: none;
    color: inherit;
  }
`;