/* import KarutaContextProvider from "@/context/KarutaContext";
import React, { useState } from "react";
import ViewCards from "./Vista";
import AlbumsPage from "./ListaAlbum";
import { ToggleButton } from "primereact/togglebutton";
import { Button } from "primereact/button";

const Principal = () => {
  const [checked, setChecked] = useState(false);
  return (
    <KarutaContextProvider>
      <link id="theme-link" rel="stylesheet" href={"/icons/tema/theme.css"} />
      <div className="card flex justify-content-center">
        <Button
          label={checked ? "Albumes" : "Cartas"}
          onClick={(e) => {
            e.preventDefault();
            setChecked(!checked);
          }}
        />
      </div>
      {!checked ? <ViewCards /> : <AlbumsPage />}
    </KarutaContextProvider>
  );
};
export default Principal; */
/* import KarutaContextProvider from "@/context/KarutaContext";
import React, { useState } from "react";
import ViewCards from "./Vista";
import AlbumsPage from "./ListaAlbum";
import { Button } from "primereact/button";
import { CSSTransition } from "react-transition-group";

const Principal = () => {
  const [checked, setChecked] = useState(false);

  return (
    <KarutaContextProvider>
      <link id="theme-link" rel="stylesheet" href={"/icons/tema/theme.css"} />
      <div className="KarutaC-container">
        <div className="KarutaC-header">
          <h1 className="KarutaC-title">¡Explora tus Cartas y Álbumes!</h1>
          <Button
            label={checked ? "Ver Cartas" : "Ver Álbumes"}
            icon={checked ? "pi pi-book" : "pi pi-images"}
            className={`KarutaC-toggle-button ${
              checked ? "KarutaC-button-album" : "KarutaC-button-card"
            }`}
            onClick={() => setChecked(!checked)}
          />
        </div>
        <CSSTransition
          in={!checked}
          timeout={500}
          classNames="KarutaC-view"
          unmountOnExit
        >
          <div className="KarutaC-content">
            <ViewCards />
          </div>
        </CSSTransition>
        <CSSTransition
          in={checked}
          timeout={500}
          classNames="KarutaC-view"
          unmountOnExit
        >
          <div className="KarutaC-content">
            <AlbumsPage />
          </div>
        </CSSTransition>
      </div>
    </KarutaContextProvider>
  );
};

export default Principal; */
/* import KarutaContextProvider from "@/context/KarutaContext";
import React, { useState } from "react";
import ViewCards from "./Vista";
import AlbumsPage from "./ListaAlbum";

const Principal = () => {
  const [checked, setChecked] = useState(false);

  return (
    <KarutaContextProvider>
      <link id="theme-link" rel="stylesheet" href={"/icons/tema/theme.css"} />
      <div className="KarutaC-container">
        <div className="KarutaC-header">
          <h1 className="KarutaC-title">¡Explora tus Cartas y Álbumes!</h1>
          <div
            className={`KarutaC-switch ${checked ? "active" : ""}`}
            onClick={() => setChecked(!checked)}
          >
            <span className="KarutaC-indicator">
              {checked ? "Álbumes" : "Cartas"}
            </span>
          </div>
        </div>
        <div className="KarutaC-content">
          {checked ? <AlbumsPage /> : <ViewCards />}
        </div>
      </div>
    </KarutaContextProvider>
  );
};

export default Principal; */
import KarutaContextProvider from "@/context/KarutaContext";
import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";
import ViewCards from "./Vista";
import AlbumsPage from "./ListaAlbum";
import Buscadas from "../Buscadas/Vista";

const Principal = () => {
  const [checked, setChecked] = useState(false);

  return (
    <KarutaContextProvider>
      <link id="theme-link" rel="stylesheet" href={"/icons/tema/theme.css"} />
      
      <div className="KarutaC-container">
        <center>
          <div className="KarutaC-header">
            <h1 className="KarutaC-title">¡Explora tus Cartas y Álbumes!</h1>
            <div
              className={`KarutaC-switch ${checked ? "active" : ""}`}
              onClick={() => setChecked(!checked)}
            >
              <span className="KarutaC-indicator">
                {checked ? "Álbumes" : "Cartas"}
              </span>
            </div>
          </div>
        </center>
        {/* Animaciones con CSSTransition */}
        <CSSTransition
          in={!checked}
          timeout={500}
          classNames="KarutaC-view"
          unmountOnExit
          mountOnEnter
        >
          <div className="KarutaC-content">
            <ViewCards />
          </div>
        </CSSTransition>
        <CSSTransition
          in={checked}
          timeout={500}
          classNames="KarutaC-view"
          unmountOnExit
          mountOnEnter
        >
          <div className="KarutaC-content">
            <AlbumsPage />
          </div>
        </CSSTransition>
      </div>
    </KarutaContextProvider>
  );
};

export default Principal;
