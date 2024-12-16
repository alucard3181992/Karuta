/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */

import React, { useState, useContext, useEffect, useRef } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { KarutaContext } from "@/context/KarutaContext";
import EconomyForm from "./RegistrarEconomia";
import { Checkbox } from "primereact/checkbox";
import WorkerForm from "./RegistrarTrabajo";
import { Toast } from "primereact/toast";
import { BlockUI } from "primereact/blockui";
import axios from "axios";
import { Funciones } from "../Esqueleto/Funciones";

const RegisterCard = ({ modificar = false, texto = "" }) => {
  const [rawText, setRawText] = useState(texto);
  const [cardData, setCardData] = useState(null);
  const [imageFile, setImageFile] = useState(null); // Estado para la imagen
  const [imagePreview, setImagePreview] = useState(null); // Estado para previsualizar la imagen
  const { nuevo, nuevaLista, cargar } = useContext(KarutaContext);
  const toast = useRef(null);
  const [bloqueo, setBloqueo] = useState(false);
  const [showEconomyForm, setShowEconomyForm] = useState(false);
  const [economyData, setEconomyData] = useState(null);
  const handleEconomySubmit = (data) => {
    setEconomyData(data);
  };

  const [showWorkerForm, setShowWorkerForm] = useState(false);
  const [workerData, setWorkerData] = useState(null);

  const handleWorkerDataSubmit = (data) => {
    setWorkerData(data); // Guardar los datos del Worker
    //alert("Datos del Worker procesados correctamente.");
  };

  useEffect(() => {
    //console.log("LLAMANDO A USUARIO")
    modificar && processCardText(texto);
  }, []);

  // Función para procesar el texto

  const processCardText = (rawText) => {
    setRawText(rawText);
    if (!rawText.includes("·")) {
      alert("El formato del texto es incorrecto. Por favor, verifica.");
      return;
    }

    const [code, stars, number, version, anime, character] =
      rawText.split(" · ");

    const parsedData = {
      code: code.trim(),
      stars: stars.trim(),
      number: number.trim(),
      version: version.trim(),
      anime: anime.trim(),
      character: character.trim(),
    };

    setCardData(parsedData);
    console.log("Datos procesados:", parsedData);
  };

  // Función para manejar el pegado de imágenes
  const handlePaste = (event) => {
    const items = event.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        //const url = URL.createObjectURL(file);
        // Convertir a WebP respetando la transparencia
        Funciones.convertirWebPConTransparencia(file, 0.8, (convertedFile) => {
          console.log("Archivo WebP listo:", convertedFile);

          const url = URL.createObjectURL(convertedFile);
          setImageFile(convertedFile);
          setImagePreview(url);
        });
        /* setImageFile(file);
        setImagePreview(url); */
        break;
      }
    }
  };
  //mensaje de salida
  const mensajeFlotante = (Sticky, Estado, Titulo, Mensaje, Vida) => {
    toast.current.show({
      sticky: Sticky,
      severity: Estado,
      summary: `${Titulo} `,
      detail: Mensaje,
      life: Vida,
    });
  };

  const handleSave = async () => {
    setBloqueo(true);
    if (!modificar && (!imageFile || !cardData)) {
      alert("Faltan datos o la imagen.");
      setBloqueo(false);
      return;
    }

    try {
      if (modificar) {
        const payload = {
          code: cardData.code,
          stars: cardData.stars,
          card_number: cardData.number,
          version: cardData.version,
          anime_name: cardData.anime,
          character_name: cardData.character,
        };

        // Agregar economía y trabajo solo si existen
        if (economyData) {
          payload.economy = {
            gold: economyData.gold,
            dust: economyData.dust,
            stars: economyData.stars,
          };
        }
        if (workerData) {
          workerData.effortModifiers = JSON.stringify(
            workerData.effortModifiers
          );
          payload.worker = workerData;
          console.log("TRABAJO", workerData); // Worker ya puede ser un objeto JSON
        }

        // Enviar los datos con Axios utilizando PUT
        try {
          const response = await axios.put("/api/karuta/modificar", payload, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (
            response.data.message ===
            "Datos de la carta actualizados exitosamente."
          ) {
            console.log("SI TODO BIEN");
            setCardData(null);
            setImageFile(null);
            setImagePreview(null);
            setEconomyData(null);
            setShowEconomyForm(false);
            setShowWorkerForm(false);
            setWorkerData(null);
            setRawText("");
            setBloqueo(false);
            nuevaLista();
            mensajeFlotante(
              false,
              "success",
              "EXITO",
              "Datos de la carta actualizados exitosamente.",
              4000
            );
          } else {
            alert(`Error: ${response.data.message}`);
          }
          //console.log("Respuesta del servidor:", response.data);
        } catch (error) {
          setBloqueo(false);
          console.error("Error al enviar los datos:", error);
        }
      } else {
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("code", cardData.code);
        formData.append("stars", cardData.stars);
        formData.append("card_number", cardData.number);
        formData.append("version", cardData.version);
        formData.append("anime_name", cardData.anime);
        formData.append("character_name", cardData.character);

        if (economyData) {
          formData.append(
            "economy",
            `💰 ${economyData.gold} Gold ✨ ${economyData.dust} Dust (${economyData.stars})`
          );
        }
        if (workerData) {
          formData.append("worker", JSON.stringify(workerData));
        }
        const res = await nuevo(formData);
        //console.log("LA RESPUESTA ES", res);
        if (res.message === "Carta registrada exitosamente.") {
          setCardData(null);
          setImageFile(null);
          setImagePreview(null);
          setEconomyData(null);
          setShowEconomyForm(false);
          setShowWorkerForm(false);
          setWorkerData(null);
          setRawText("");
          setBloqueo(false);
          nuevaLista();
          mensajeFlotante(
            false,
            "success",
            "EXITO",
            "Carta registrada exitosamente.",
            4000
          );
          //
        } else {
          setBloqueo(false);
          alert(`Error: ${res.message}`);
        }
      }
    } catch (error) {
      setBloqueo(false);
      console.error("Error al guardar la carta:", error);
    }
  };
  const ayuda = {
    code: "Codigo",
    stars: "",
    number: "",
    version: "",
    anime: "Anime",
    character: "Personaje",
  };
  return (
    <div className="p-4 text-center" onPaste={handlePaste}>
      <Toast ref={toast} />
      <BlockUI
        blocked={bloqueo}
        template={cargar("C", `Registro...`)}
        fullScreen={false}
      >
        <h1>Registro de Cartas de Karuta</h1>
        <label htmlFor="rawText">Texto desde Discord</label>
        <div className="p-field">
          <InputTextarea
            className="w-8 text-center"
            id="rawText"
            value={rawText}
            //onChange={(e) => setRawText(e.target.value)}
            onChange={(e) => processCardText(e.target.value)}
            rows={5}
            cols={30}
            placeholder="Ejemplo: vzkqc0d · ★★★☆ · #14868 · ◈4 · Kaichou wa Maid-sama! · Aoi Hyoudou"
          />
        </div>

        {/* <Button
          label="Procesar"
          icon="pi pi-check"
          onClick={processCardText}
          className="p-mt-3"
        /> */}

        {cardData && (
          <>
            <div
              className="grid mt-3"
              style={{
                borderRadius: "4px",
                border: "2px dashed var(--primary-color)",
              }}
            >
              {!modificar && (
                <div className="col-6 centro-total">
                  <div className="p-mt-4">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ maxWidth: "180px", maxHeight: "220px" }}
                      />
                    ) : (
                      <div
                        style={{
                          border: "1px dashed #ccc",
                          padding: "20px",
                          textAlign: "center",
                        }}
                      >
                        <h3>Imagen de la Carta</h3>
                        <p>Pegue la imagen aquí (Ctrl+V):</p>
                        No hay imagen pegada
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="col-6">
                {Object.entries(cardData).map(([key, value]) => (
                  <div key={key} className="mb-3">
                    <div className="font-bold">{ayuda[key]}</div>
                    <div className="font-bold">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Opción para agregar datos de economía */}
        <div
          className="text-center centro-total field mb-5 w-full border-1 surface-border border-round-md py-3 px-4 text-color font-semibold text-lg"
          style={{
            background:
              "-webkit-linear-gradient(top, var(--surface-ground) 0%, var(--surface-card) 100%)",
          }}
        >
          <label>
            <input
              type="checkbox"
              checked={showEconomyForm}
              onChange={(e) => setShowEconomyForm(e.target.checked)}
              style={{ cursor: "pointer" }}
            />
            ¿Agregar economía?
          </label>

          {showEconomyForm && <EconomyForm onSubmit={handleEconomySubmit} />}
        </div>
        {/* Opción para agregar datos de trabajo */}
        <div
          className="text-center centro-total field mb-5 w-full border-1 surface-border border-round-md py-3 px-4 text-color font-semibold text-lg"
          style={{
            background:
              "-webkit-linear-gradient(top, var(--surface-ground) 0%, var(--surface-card) 100%)",
          }}
        >
          <label>
            <input
              type="checkbox"
              checked={showWorkerForm}
              onChange={(e) => setShowWorkerForm(e.target.checked)}
              style={{ cursor: "pointer" }}
            />
            ¿Agregar datos del Worker?
          </label>
          {showWorkerForm && (
            <WorkerForm
              setWorkerData={setWorkerData}
              workerData={workerData}
              onWorkerDataSubmit={handleWorkerDataSubmit}
            />
          )}
        </div>

        {modificar ? (
          <Button
            label="Modificar"
            icon="pi pi-save"
            onClick={handleSave}
            className="p-mt-3"
            disabled={!cardData}
          />
        ) : (
          <Button
            label="Guardar"
            icon="pi pi-save"
            onClick={handleSave}
            className="p-mt-3"
            disabled={!cardData || !imageFile}
          />
        )}
      </BlockUI>
    </div>
  );
};

export default RegisterCard;
