import React, { useState } from "react";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Image } from "primereact/image";

const CreateAlbum = ({ setBloqueo, nuevaLista, mensajeFlotante }) => {
  const [name, setName] = useState("");
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [backgroundImageP, setBackgroundImageP] = useState(null);

  const handleSubmit = async (e) => {
    setBloqueo(true);
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    if (backgroundImage) {
      formData.append("background_image", backgroundImage);
    }

    try {
      const response = await axios.post("/api/karuta/albums", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Album created:", response.data);
      if (response.status === 201) {
        //console.log("Página añadida exitosamente:", response.data.page);
        setBloqueo(false);
        nuevaLista();
        setBackgroundImage(null)
        setBackgroundImageP(null)
        setName("")
        mensajeFlotante(
          false,
          "info",
          "EXITO",
          "Album creado exitosamente:",
          4000
        );
        return; // Retorna los datos de la página creada
      } else {
        console.error("Respuesta inesperada del servidor:", response);
      }
    } catch (error) {
      console.error("Error creating album:", error);
    }
  };

  const handlePaste = async (event) => {
    console.log("MI LLAMAN");
    setBloqueo(true);
    const items = event.clipboardData.items;
    let men = "SI";
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        //const formData = new FormData();
        const url = URL.createObjectURL(file);
        setBackgroundImage(file);
        setBackgroundImageP(url);
        setBloqueo(false);
        men = "SI";
        //break;
      } else {
        men = "NO";
      }
    }
    if (men === "NO") {
      console.log("SI ENTRO AQUI");
      setBloqueo(false);
      //mensajeFlotante(false, "error", "EXITO", "No es una Imagen", 4000);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="text-center">
        <div className="grid">
          <div className="md:col-6 col-12 centro-total">
            <div
              className="p-4 border-1 surface-border border-round h-full"
              style={{ position: "relative" }}
            >
              <div className="centro-total h-full">
                <label htmlFor="name">Nombre:</label>
                <InputText
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <div
            className="md:col-6 col-12 text-center centro-total"
            onPaste={handlePaste}
          >
            {backgroundImageP ? (
              <Image
                src={backgroundImageP}
                alt={"S/N"}
                className="ImgnormalK border-round"
                width="350"
                height="200"
                preview
              />
            ) : (
              <div
                style={{
                  border: "1px dashed var(--primary-color)",
                  textAlign: "center",
                  height: 200,
                  width: 350,
                }}
                className="centro-total"
              >
                No hay imagen
              </div>
            )}
          </div>
        </div>

        <Button label="Crear" icon="pi pi-check" />
      </form>
    </div>
  );
};

export default CreateAlbum;
