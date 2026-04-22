import React, { useState } from "react";
import styled from "styled-components";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password || !confirmPassword) {
      setError("Du må fylle ut alle feltene.");
      return;
    }

    if (password.length < 6) {
      setError("Passordet må være minst 6 tegn.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passordene er ikke like.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess("Bruker opprettet!");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Denne e-posten er allerede i bruk.");
      } else if (err.code === "auth/invalid-email") {
        setError("Ugyldig e-postadresse.");
      } else if (err.code === "auth/weak-password") {
        setError("Passordet er for svakt.");
      } else {
        setError("Noe gikk galt. Prøv igjen.");
      }
    }
  };

  return (
    <Wrapper>
      <FormCard>
        <h1>Opprett bruker</h1>

        <form onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="E-post"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Passord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Bekreft passord"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <button type="submit">Registrer deg</button>
        </form>

        <p className="bottomText">
          Har du allerede bruker? <Link to="/login">Logg inn</Link>
        </p>
      </FormCard>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f4f4f4;
  padding: 20px;
`;

const FormCard = styled.div`
  width: 100%;
  max-width: 400px;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);

  h1 {
    text-align: center;
    margin-bottom: 25px;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  input {
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 16px;
  }

  button {
    padding: 12px;
    border: none;
    background-color: #222;
    color: white;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
  }

  button:hover {
    background-color: #444;
  }

  .error {
    color: red;
    font-size: 14px;
    margin: 0;
  }

  .success {
    color: green;
    font-size: 14px;
    margin: 0;
  }

  .bottomText {
    text-align: center;
    margin-top: 20px;
    font-size: 14px;
  }
`;