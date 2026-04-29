import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { useParams, useNavigate } from "react-router-dom"
import { db, auth, storage } from '../firebase/firebase'
import { onAuthStateChanged } from 'firebase/auth'

export default function UpdatePerson() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [navn, setNavn] = useState("")
  const [alder, setAlder] = useState("")
  const [kjonn, setKjonn] = useState("")
  const [bilde, setBilde] = useState("")
  const [bildeFil, setBildeFil] = useState(null)
  const [bildeUrl, setBildeUrl] = useState("")
  const [studieprogram, setStudieprogram] = useState("")
  const [ownerId, setOwnerId] = useState("")
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

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

  useEffect(() => {
    const fetchPerson = async () => {
      if (!user) return

      try {
        const docRef = doc(db, "personer", id)
        const docSnap = await getDoc(docRef)

        if (!docSnap.exists()) {
          alert("Fant ikke personen.")
          navigate("/")
          return
        }

        const personData = docSnap.data()

        if (personData.ownerId !== user.uid) {
          alert("Du har ikke tilgang til å redigere denne personen.")
          navigate("/")
          return
        }

        setNavn(personData.navn || "")
        setAlder(personData.alder || "")
        setKjonn(personData.kjonn || "")
        setBilde(personData.bilde || "")
        setBildeUrl(personData.bilde || "")
        setStudieprogram(personData.studieprogram || "")
        setOwnerId(personData.ownerId || "")
      } catch (error) {
        console.log("Feil ved henting av person:", error)
        alert("Kunne ikke hente personen.")
        navigate("/")
      } finally {
        setLoading(false)
      }
    }

    fetchPerson()
  }, [id, user, navigate])

  const updatePerson = async (e) => {
    e.preventDefault()

    if (!user) {
      alert("Du må være logget inn.")
      navigate("/login")
      return
    }

    if (ownerId !== user.uid) {
      alert("Du har ikke tilgang til å oppdatere denne personen.")
      navigate("/")
      return
    }

    try {
      let endeligBildeUrl = bilde

      if (bildeFil) {
        const filnavn = `${Date.now()}-${bildeFil.name}`
        const imageRef = ref(storage, `personImages/${user.uid}/${filnavn}`)

        await uploadBytes(imageRef, bildeFil)
        endeligBildeUrl = await getDownloadURL(imageRef)
      }

      const docRef = doc(db, "personer", id)

      await updateDoc(docRef, {
        navn: navn,
        alder: alder,
        kjonn: kjonn,
        bilde: endeligBildeUrl,
        studieprogram: studieprogram,
        ownerId: ownerId
      })

      navigate("/")
    } catch (error) {
      console.log("Feil ved oppdatering:", error)
      alert("Kunne ikke oppdatere personen.")
    }
  }

  if (loading) {
    return (
      <StyledForm>
        <h1>Laster...</h1>
      </StyledForm>
    )
  }

  return (
    <StyledForm>
      <h1>Oppdater person</h1>

      <form onSubmit={updatePerson}>
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

        <button type="submit">Oppdater personinfo</button>
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