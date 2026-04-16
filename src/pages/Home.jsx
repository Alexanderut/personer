import React, { useState, useEffect } from 'react'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import styled from 'styled-components'
import { db } from '../firebase/firebase'
import trash from "../assets/trash.jpg"
import cog from "../assets/cog.png"
import {Link} from "react-router-dom"

export default function Home() {
  const [persons, setPersons] = useState([])

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
    console.log(persons)
  }, [])


  const deletePerson = async (id) =>{
    await deleteDoc(doc(db, "personer", id))

    setPersons(persons.filter((person)=>person.id !== id))
  }

  return (
    <StyleWrapper>
      <h1>Personer</h1>

      <div className='cardContainer'>
        {persons.map((person) => (
            <Link to={`/person/${person.id}`} key={person.id} className="cardLink"><div className='personCard' key={person.id}>


          
         <img className='personImage'
  src={
    !person.bilde || person.bilde === "no image"
      ? "https://www.shutterstock.com/image-vector/avatar-photo-default-user-icon-600nw-2558759027.jpg"
      : person.bilde
  }
  alt={person.navn}
/>
          
            <h2>{person.navn}</h2>

<Link to={`/updateperson/${person.id}`}><img className="cogImage" src={cog}/></Link>


            <p>Alder: {person.alder}</p>
            <p>Kjønn: {person.kjonn}</p>
            <p>Studieprogram: {person.studieprogram}</p>
            <div className='trachIconContainer'>
            <img className='trashIcon' src={trash} onClick= {()=>deletePerson(person.id)} />
            </div>
          </div></Link>
        ))}
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
`