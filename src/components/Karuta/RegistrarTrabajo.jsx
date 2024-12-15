import { Card } from "primereact/card";
import { InputTextarea } from "primereact/inputtextarea";
import React, { useState } from "react";
import WorkerDetailsDisplay from "./TrabajosDatos";
import { Button } from "primereact/button";

const WorkerForm = ({ onWorkerDataSubmit, workerData, setWorkerData }) => {
  const [workerText, setWorkerText] = useState("");
  //const [workerData, setWorkerData] = useState(null);

  const parseWorkerData = () => {
    const lines = workerText.split("\n").map((line) => line.trim());
    console.log("LINEAS SON", lines);
    // Extraer detalles principales
    const characterMatch = lines[1]?.match(/Character · (.+?) \((.+?)\)/);
    const effortMatch = lines[2]?.match(/Effort · (\d+)/);

    const characterDetails = characterMatch ? characterMatch[1] : null;
    const cardCode = characterMatch ? characterMatch[2] : null;
    const effort = effortMatch ? parseInt(effortMatch[1], 10) : 0;

    // Estado de salud
    const healthStatus = lines[4] || "Unknown";

    /* // Modificadores de esfuerzo
    const modifiersStart = lines.indexOf("Effort modifiers") + 1;
    const modifiers = {};
    for (let i = modifiersStart; i < lines.length; i++) {
      const match = lines[i]?.match(/^(\d+) \((.+?)\) (.+)/);
      if (match) {
        const [_, value, grade, description] = match;
        modifiers[description] = { value: parseInt(value, 10), grade };
      }
    } */
    // Modificadores de esfuerzo
    const modifiersStart = lines.indexOf("Effort modifiers") + 1;
    const modifiers = {};

    // Procesar la línea '3 Base value' antes del bucle principal
    const baseValueLine = lines[modifiersStart];
    if (baseValueLine?.match(/^\d+ Base value$/)) {
      const [baseValue] = baseValueLine.match(/^\d+/);
      modifiers["Value"] = {
        value: parseInt(baseValue, 10),
        grade: "Base",
      };
    }

    // Procesar los demás modificadores
    for (let i = modifiersStart + 1; i < lines.length; i++) {
      const match = lines[i]?.match(/^(\d+) \((.+?)\) (.+)/);
      if (match) {
        const [_, value, grade, description] = match;
        modifiers[description] = { value: parseInt(value, 10), grade };
      }
    }

    return {
      characterDetails,
      cardCode,
      effort,
      healthStatus,
      effortModifiers: modifiers,
    };
  };

  const handleSubmit = () => {
    const parsedData = parseWorkerData();
    if (parsedData.characterDetails) {
      setWorkerData(parsedData);
      onWorkerDataSubmit(parsedData);
      setWorkerText(""); // Limpiar texto después del envío
    } else {
      alert(
        "Error al procesar los datos del Worker. Revisa el texto ingresado."
      );
    }
  };

  return (
    <div className="p-4 text-center w-full">
      <label htmlFor="rawText">Texto desde Discord</label>
      <InputTextarea
        value={workerText}
        className="w-full text-center"
        onChange={(e) => setWorkerText(e.target.value)}
        placeholder="Pega aquí el texto del Worker..."
        rows={4}
        cols={40}
      />
      <Button
        label="Procesar Worker"
        icon="pi pi-check"
        onClick={handleSubmit}
        className="p-mt-3"
      />
      {workerData && (
        <Card>
          <WorkerDetailsDisplay workerData={workerData} />
        </Card>
      )}
    </div>
  );
};

export default WorkerForm;
