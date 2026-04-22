import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function MyProfile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login");
        return;
      }
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.log("Feil ved logout:", error);
    }
  };

  return (
    <Wrapper>
      <ProfileCard>
        <h1>Min profil</h1>

        <div className="infoBox">
          <p><strong>E-post:</strong></p>
          <p>{user?.email}</p>
        </div>

        <button onClick={handleLogout}>Logg ut</button>
      </ProfileCard>
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

const ProfileCard = styled.div`
  width: 100%;
  max-width: 420px;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);

  h1 {
    text-align: center;
    margin-bottom: 25px;
  }

  .infoBox {
    background: #f8f8f8;
    border-radius: 10px;
    padding: 16px;
    margin-bottom: 20px;
  }

  .infoBox p {
    margin: 4px 0;
    word-break: break-word;
  }

  button {
    width: 100%;
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
`;