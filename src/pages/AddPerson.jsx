import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { collection, addDoc } from 'firebase/firestore'
import { db, auth, storage } from '../firebase/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useNavigate } from 'react-router-dom'

export default function AddPerson() {
  const [navn, setNavn] = useState("")
  const [alder, setAlder] = useState("")
  const [kjonn, setKjonn] = useState("")
  const [bilde, setBilde] = useState("")
  const [bildeFil, setBildeFil] = useState(null)
  const [bildeUrl, setBildeUrl] = useState("")
  const [studieprogram, setStudieprogram] = useState("")
  const [user, setUser] = useState(null)

  const navigate = useNavigate()

  const DEFAULTIMAGE =
    "https://firebasestorage.googleapis.com/v0/b/reactuit.firebasestorage.app/o/default.png?alt=media&token=20d300c7-9470-4f76-9e89-1f9a6ce21ba1"

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login")
        return
      }
      setUser(currentUser)
    })

    return () => unsubscribe()
  }, [navigate])

  const addPerson = async (e) => {
    e.preventDefault()

    if (!user) {
      alert("Du må være logget inn for å legge til en person.")
      navigate("/login")
      return
    }

    try {
      let endeligBildeUrl = "no image"

      if (bildeFil) {
        const filnavn = `${Date.now()}-${bildeFil.name}`
        const imageRef = ref(storage, `personImages/${user.uid}/${filnavn}`)

        await uploadBytes(imageRef, bildeFil)
        endeligBildeUrl = await getDownloadURL(imageRef)
      } else if (bilde) {
        endeligBildeUrl = bilde
      }

      const newPerson = {
        navn: navn,
        alder: alder,
        kjonn: kjonn,
        bilde: endeligBildeUrl,
        studieprogram: studieprogram,
        ownerId: user.uid
      }

      await addDoc(collection(db, "personer"), newPerson)

      setNavn("")
      setAlder("")
      setKjonn("")
      setBilde("")
      setBildeFil(null)
      setBildeUrl("")
      setStudieprogram("")

      navigate("/")
    } catch (error) {
      console.log("Feil ved lagring:", error)
      alert("Kunne ikke lagre personen.")
    }
  }

  return (
    <StyledForm>
      <h1>Legg til en person</h1>

      <form onSubmit={addPerson}>
        <input
          type='text'
          placeholder="Navn"
          value={navn}
          onChange={(e) => setNavn(e.target.value)}
        />

        <input
          type='number'
          placeholder="Alder"
          value={alder}
          onChange={(e) => setAlder(e.target.value)}
        />

        <select
          name="kjønn"
          value={kjonn}
          onChange={(e) => setKjonn(e.target.value)}
        >
          <option value="">Velg kjønn</option>
          <option value="Mann">Mann</option>
          <option value="Kvinne">Kvinne</option>
          <option value="Annet">Annet</option>
        </select>

        <input
          type='text'
          placeholder="Lim inn bildeadresse her..."
          value={bilde}
          onChange={(e) => {
            setBilde(e.target.value)
            setBildeUrl(e.target.value)
            setBildeFil(null)
          }}
        />

        <input
          type='file'
          accept='image/*'
          onChange={(e) => {
            const file = e.target.files[0]
            setBildeFil(file)

            if (file) {
              const tempURL = URL.createObjectURL(file)
              setBildeUrl(tempURL)
            }
          }}
        />

        <img
          src={bildeUrl || bilde || DEFAULTIMAGE}
          className='thumbnail'
          alt="bildeThumbnail"
        />

        <input
          type='text'
          placeholder="Studieprogram"
          value={studieprogram}
          onChange={(e) => setStudieprogram(e.target.value)}
        />

        <button type="submit">Legg til person</button>
      </form>
    </StyledForm>
  )
}

const StyledForm = styled.div`
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;

  h1 {
    margin-bottom: 20px;
    text-align: center;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  input {
    padding: 12px;
    font-size: 16px;
  }

  select {
    padding: 12px;
    font-size: 16px;
  }

  button {
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
  }

  .thumbnail {
    width: 300px;
    height: 300px;
    object-fit: cover;
    border-radius: 8px;
  }
`