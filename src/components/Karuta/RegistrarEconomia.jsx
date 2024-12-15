import { InputTextarea } from "primereact/inputtextarea";
import React, { useState } from "react";

const EconomyForm = ({ initialData = "", onSubmit }) => {
  const [economyText, setEconomyText] = useState(initialData);
  const [economyData, setEconomyData] = useState({
    gold: 0,
    dust: 0,
    stars: "",
  });

  // Procesar el texto para obtener datos de economía
  const processEconomyText = (text) => {
    const goldMatch = text.match(/💰\s*(\d+)\s*Gold/);
    const dustMatch = text.match(/✨\s*(\d+)\s*Dust/);
    const starsMatch = text.match(/\(([^)]+)\)/);

    return {
      gold: goldMatch ? parseInt(goldMatch[1], 10) : 0,
      dust: dustMatch ? parseInt(dustMatch[1], 10) : 0,
      stars: starsMatch ? starsMatch[1] : "",
    };
  };

  const handleChange = (e) => {
    const text = e.target.value;
    setEconomyText(text);

    const processed = processEconomyText(text);
    setEconomyData(processed);
    if (onSubmit) {
      console.log("SE ENVIA DATOS JAJA", processed);
      onSubmit(processed);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(economyData);
    }
  };

  return (
    <React.Fragment>
      {/* <form onSubmit={handleSubmit}> */}
      <InputTextarea
        id="economyText"
        className="w-8 text-center"
        value={economyText}
        onChange={handleChange}
        placeholder="Ejemplo: 💰 12 Gold ✨ 1 Dust (★★★☆)"
        required
      />
      <div>
        <p>
          <strong>Gold:</strong> {economyData.gold}
        </p>
        <p>
          <strong>Dust:</strong> {economyData.dust}
        </p>
        <p>
          <strong>Stars:</strong> {economyData.stars}
        </p>
      </div>
      {/* <button type="submit">Guardar Economía</button> */}
      {/* </form> */}
    </React.Fragment>
  );
};

export default EconomyForm;
