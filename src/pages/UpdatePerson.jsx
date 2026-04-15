import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import {doc, getDoc, updateDoc} from "firebase/firestore"
import { useParams, useNavigate} from "react-router-dom"
import { db } from '../firebase/firebase'

export default function UpdatePerson() {


const {id} = useParams()

const navigate = useNavigate()

    const [navn, setNavn] = useState("")
    const [alder, setAlder] = useState("")
    const [kjonn, setKjonn] = useState("")
    const [bilde, setBilde] = useState("")
    const [studieprogram, setStudieprogram] = useState("")


    useEffect(()=>{
        const fetchPerson = async () =>{
            const docRef = doc(db, "personer", id)
            const docSnap = await getDoc(docRef)

            if(docSnap.exists()){
                const personData = docSnap.data()
                
                setNavn(personData.navn)
                setAlder(personData.alder)
                setKjonn(personData.kjonn)
                setBilde(personData.bilde)
                setStudieprogram(personData.studieprogram)
            }

        }
        fetchPerson()
    },[id])

    const updatePerson = async (e) => {
        e.preventDefault()

        const docRef = doc(db, "personer", id)
        await updateDoc(docRef,{
            navn:navn,
            alder:alder,
            kjonn:kjonn,
            bilde:bilde,
            studieprogram:studieprogram
        })

        navigate("/")
    }



return (
    <StyledForm>

    <h1>Legg til en person</h1>

<form onSubmit={updatePerson}>
    <input 
        type='text'
        placeholder="Navn"
        value={navn}
        onChange={ (e) => setNavn(e.target.value) }
    />

        <input 
        type='number'
        placeholder="Alder"
        value={alder}
        onChange={ (e) => setAlder(e.target.value) }
    />

        <select 

        name="kjønn"
        value={kjonn}
        onChange={ (e) => setKjonn(e.target.value) }>

        <option value="">Velg kjønn</option>
        <option value="Mann">Mann</option>
        <option value="Kvinne">Kvinnen</option>
        <option value="Annet">Annet</option>
        </select>

        <input 
        type='text'
        placeholder="lim in bildeadresse her..."
        value={bilde}
        onChange={ (e) => setBilde(e.target.value) }
    />

            <input 
        type='text'
        placeholder="Studieprogram"
        value={studieprogram}
        onChange={ (e) => setStudieprogram(e.target.value) }
    />

<button type="submit">Oppdater personinfo</button>
</form>



    </StyledForm>
  )
}

const StyledForm = styled.div`
max-width:400px;
margin: 40px auto;
padding: 20px;

h1{
    margin-bottom: 20px;
    text-align: center;
}


form{
    display: flex;
    flex-direction: column;
    gap:15px;
}

input{
    padding: 12px;
    font-size: 16px;
}

select{
      padding: 12px;
    font-size: 16px;
}


  button {
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
  }

`