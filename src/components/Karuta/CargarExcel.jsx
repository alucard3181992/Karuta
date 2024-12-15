import React, { useState, useContext } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import { KarutaContext } from "@/context/KarutaContext";
import { Ripple } from "primereact/ripple";
import { Panel } from "primereact/panel";

const KarutaUploader = ({ mensajeFlotante, setbloqueo }) => {
  const { nuevaLista, karuta, economia, trabajo } = useContext(KarutaContext);
  const [file, setFile] = useState(null);
  const [previewCards, setPreviewCards] = useState([]);
  const [previewEconomy, setPreviewEconomy] = useState([]);
  const [previewWork, setPreviewWork] = useState([]);
  const [errors, setErrors] = useState([]);

  // Leer el archivo Excel
  const handleFileChange = (event) => {
    console.log("MI LLAMAN SIIUUU");
    const selectedFile = event.files[0] || event.target.files[0];
    setFile(selectedFile);
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Procesar cartas
      const processedCards = jsonData.map((row) => ({
        code: row["code"], // Columna A
        stars: convertStars(row["quality"]), // Columna F convertido a ★★★☆
        card_number: row["number"], // Columna C
        version: row["edition"], // Columna D
        anime_name: row["series"], // Columna E
        character_name: row["character"], // Columna D
        image_path: "Vacio", // Imagen predeterminada
      }));

      // Procesar economía
      const processedEconomy = jsonData.map((row) => ({
        card_id: row["code"], // Columna A
        gold: parseInt(row["burnValue"], 10) || 0, // Columna I
        dust: 1, // Constante
        stars: convertStars(row["quality"]), // Columna F convertido a ★★★☆
      }));

      const processedWork = jsonData.map((row) => ({
        card_id: row["code"], // Columna A
        character_details: row["character"], // Detalles del personaje
        effort: parseInt(row["worker.effort"], 10) || 0, // Esfuerzo
        health_status: "Healthy", // Valor por defecto
        effort_modifiers: "{}", // JSON vacío por defecto
      }));

      setPreviewCards(processedCards);
      setPreviewEconomy(processedEconomy);
      setPreviewWork(processedWork);
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  // Conversión de estrellas (número a formato ★★★☆)
  const convertStars = (quality) => {
    return "★".repeat(quality) + "☆".repeat(4 - quality);
  };

  const handleUploadCards = async () => {
    try {
      await axios.post("/api/karuta/excel/cards", { data: previewCards });
      alert("Cartas subidas exitosamente.");
    } catch (error) {
      console.error(error);
      setErrors([...errors, `Error al subir cartas: ${error.message}`]);
    }
  };

  // Subir economía al backend
  const handleUploadEconomy = async () => {
    try {
      await axios.post("/api/karuta/excel/economy", { data: previewEconomy });
      alert("Economía subida exitosamente.");
    } catch (error) {
      console.error(error);
      setErrors([...errors, `Error al subir economía: ${error.message}`]);
    }
  };

  // Subir trabajo al backend
  const handleUploadWork = async () => {
    try {
      await axios.post("/api/karuta/excel/work", { data: previewWork });
      alert("Datos de trabajo subidos exitosamente.");
    } catch (error) {
      console.error(error);
      setErrors([...errors, `Error al subir trabajo: ${error.message}`]);
    }
  };

  /* const handleUpload = async () => {
    try {
      // Subir cartas
      const cardResponse = await axios.post("/api/karuta/excel/cards", {
        data: previewCards,
      });

      console.log("Cartas procesadas:", cardResponse.data.message);

      // Subir economía
      const economyResponse = await axios.post("/api/karuta/excel/economy", {
        data: previewEconomy,
      });

      console.log("Economía procesada:", economyResponse.data.message);

      // Subir trabajo
      const workResponse = await axios.post("/api/karuta/excel/work", {
        data: previewWork,
      });

      console.log("Trabajo procesado:", workResponse.data.message);
      nuevaLista();
      alert("Datos subidos exitosamente.");
    } catch (error) {
      console.error("Error al subir datos:", error);
      setErrors([...errors, error.message]);
    }
  }; */
  const handleUpload = async () => {
    setbloqueo(true);
    try {
      // Filtrar cartas nuevas
      const newCards = previewCards.filter(
        (card) =>
          !karuta.some(
            (existingCard) =>
              existingCard.code === card.code &&
              JSON.stringify(existingCard) === JSON.stringify(card)
          )
      );

      // Filtrar economía nueva o modificada
      const newEconomy = previewEconomy.filter(
        (economy) =>
          !economia.some(
            (existingEconomy) =>
              existingEconomy.id === economy.id &&
              JSON.stringify(existingEconomy) === JSON.stringify(economy)
          )
      );

      // Filtrar trabajo nuevo o modificado
      const newWork = previewWork.filter(
        (work) =>
          !trabajo.some(
            (existingWork) =>
              existingWork.id === work.id &&
              JSON.stringify(existingWork) === JSON.stringify(work)
          )
      );

      // Verificar si hay algo que enviar
      if (
        newCards.length === 0 &&
        newEconomy.length === 0 &&
        newWork.length === 0
      ) {
        alert("No hay datos nuevos o modificados para procesar.");
        return;
      }
      let men = [];
      // Subir cartas nuevas
      if (newCards.length > 0) {
        const cardResponse = await axios.post("/api/karuta/excel/cards", {
          data: newCards,
        });
        if (cardResponse.data.message === "Cartas procesadas exitosamente.") {
          men.push("Cartas procesadas exitosamente.");
        } else {
          men.push("Error al insertar las cartas");
        }
        //console.log("Cartas procesadas:", cardResponse.data.message);
      }

      // Subir economía nueva o modificada
      if (newEconomy.length > 0) {
        const economyResponse = await axios.post("/api/karuta/excel/economy", {
          data: newEconomy,
        });
        if (
          economyResponse.data.message === "Economía procesada exitosamente."
        ) {
          men.push("Economía procesada exitosamente.");
        } else {
          men.push("Error al insertar la economia");
        }
        //console.log("Economía procesada:", economyResponse.data.message);
      }

      // Subir trabajo nuevo o modificado
      if (newWork.length > 0) {
        const workResponse = await axios.post("/api/karuta/excel/work", {
          data: newWork,
        });
        if (workResponse.data.message === "Trabajo procesado exitosamente.") {
          men.push("Trabajo procesado exitosamente.");
        } else {
          men.push("Error al insertar el effort");
        }
        //console.log("Trabajo procesado:", workResponse.data.message);
      }

      // Actualizar las listas en el contexto
      nuevaLista();
      setbloqueo(false);
      //validacion.mens.join(",\n")
      mensajeFlotante(false, "error", "********", men.join(",\n"), 4000);
      //alert("Datos subidos exitosamente.");
    } catch (error) {
      setbloqueo(false);
      console.error("Error al subir datos:", error);
      setErrors([...errors, error.message]);
    }
  };

  const headerTemplate = (options) => {
    const { className, chooseButton } = options;
    return (
      <div
        className={className}
        style={{
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
        }}
      >
        {chooseButton}
        <Button
          rounded
          icon="pi pi-check"
          outlined
          raised
          onClick={handleUpload}
        ></Button>
      </div>
    );
  };
  const chooseOptions = {
    icon: "pi pi-fw pi-file",
    iconOnly: true,
    className: "custom-choose-btn p-button-rounded p-button-outlined",
  };
  const template = (options) => {
    const toggleIcon = options.collapsed
      ? "pi pi-chevron-down"
      : "pi pi-chevron-up";
    const className = `${options.className} justify-content-start`;
    const titleClassName = `${options.titleClassName} ml-2 text-primary`;
    const style = { fontSize: "1.25rem" };

    return (
      <div className={className}>
        <button
          className={options.togglerClassName}
          onClick={options.onTogglerClick}
        >
          <span className={toggleIcon}></span>
          <Ripple />
        </button>
        <span className={titleClassName} style={style}>
          Cargar Datos Del Excel
        </span>
      </div>
    );
  };

  return (
    <div className="karuta-uploader">
      <Panel headerTemplate={template} toggleable collapsed>
        <h2>Cargar Cartas y Economía</h2>
        <FileUpload
          mode="advanced"
          name="invoice"
          accept=".xlsx, .xls"
          customUpload={true}
          auto={true}
          uploadHandler={handleFileChange}
          chooseOptions={chooseOptions}
          headerTemplate={headerTemplate}
          chooseLabel="Seleccionar archivo"
          uploadLabel="Cargar datos"
          cancelLabel="Cancelar"
        ></FileUpload>
        {/* <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} /> */}
        {/*{previewCards.length > 0 && (
        <div>
          <h3>Vista previa de cartas:</h3>
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Stars</th>
                <th>Card Number</th>
                <th>Version</th>
                <th>Anime Name</th>
                <th>Character Name</th>
                <th>Image Path</th>
              </tr>
            </thead>
            <tbody>
              {previewCards.map((row, index) => (
                <tr key={index}>
                  <td>{row.code}</td>
                  <td>{row.stars}</td>
                  <td>{row.card_number}</td>
                  <td>{row.version}</td>
                  <td>{row.anime_name}</td>
                  <td>{row.character_name}</td>
                  <td>{row.image_path}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleUploadCards}>Subir Cartas</button>
        </div>
      )}
      {previewEconomy.length > 0 && (
        <div>
          <h3>Vista previa de economía:</h3>
          <table>
            <thead>
              <tr>
                <th>Card ID</th>
                <th>Gold</th>
                <th>Dust</th>
                <th>Stars</th>
              </tr>
            </thead>
            <tbody>
              {previewEconomy.map((row, index) => (
                <tr key={index}>
                  <td>{row.card_id}</td>
                  <td>{row.gold}</td>
                  <td>{row.dust}</td>
                  <td>{row.stars}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleUploadEconomy}>Subir Economía</button>
        </div>
      )}

      {previewWork.length > 0 && (
        <div>
          <h3>Vista previa de trabajo:</h3>
          <table>
            <thead>
              <tr>
                <th>Card ID</th>
                <th>Character Details</th>
                <th>Effort</th>
                <th>Health Status</th>
                <th>Effort Modifiers</th>
              </tr>
            </thead>
            <tbody>
              {previewWork.map((row, index) => (
                <tr key={index}>
                  <td>{row.card_id}</td>
                  <td>{row.character_details}</td>
                  <td>{row.effort}</td>
                  <td>{row.health_status}</td>
                  <td>{row.effort_modifiers}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleUploadWork}>Subir Trabajo</button>
        </div>
      )}*/}
        {/* <button onClick={handleUpload}>Subir</button> */}
        {/* {errors.length > 0 && (
          <div className="error-log">
            <h3>Errores:</h3>
            <ul>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )} */}
      </Panel>
    </div>
  );
};

export default KarutaUploader;
