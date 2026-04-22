import React, { useState } from "react";
import styled from "styled-components";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Du må fylle ut e-post og passord.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      if (err.code === "auth/invalid-credential") {
        setError("Feil e-post eller passord.");
      } else if (err.code === "auth/invalid-email") {
        setError("Ugyldig e-postadresse.");
      } else {
        setError("Noe gikk galt. Prøv igjen.");
      }
    }
  };

  return (
    <Wrapper>
      <FormCard>
        <h1>Logg inn</h1>

        <form onSubmit={handleLogin}>
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

          {error && <p className="error">{error}</p>}

          <button type="submit">Logg inn</button>
        </form>

        <p className="bottomText">
          Har du ikke bruker? <Link to="/signup">Registrer deg</Link>
        </p>

        <p className="bottomText">
          <Link to="/forgotpassword">Glemt passord?</Link>
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

  .bottomText {
    text-align: center;
    margin-top: 20px;
    font-size: 14px;
  }
`;