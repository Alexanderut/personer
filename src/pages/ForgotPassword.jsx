import React, { useState } from "react";
import styled from "styled-components";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Du må skrive inn e-postadressen din.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("E-post for tilbakestilling av passord er sendt til "+ email);
      setEmail("");
    } catch (err) {
      if (err.code === "auth/invalid-email") {
        setError("Ugyldig e-postadresse.");
      } else if (err.code === "auth/user-not-found") {
        setError("Fant ingen bruker med denne e-posten.");
      } else {
        setError("Noe gikk galt. Prøv igjen.");
      }
    }
  };

  return (
    <Wrapper>
      <FormCard>
        <h1>Glemt passord</h1>

        <form onSubmit={handleResetPassword}>
          <input
            type="email"
            placeholder="Skriv inn e-post"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <button type="submit">Send reset-lenke</button>
        </form>

        <p className="bottomText">
          Tilbake til <Link to="/login">logg inn</Link>
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