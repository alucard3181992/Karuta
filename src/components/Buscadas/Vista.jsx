import React, { useState, useEffect } from "react";
import { DataView } from "primereact/dataview";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Image } from "primereact/image";
import axios from "axios";
import { Panel } from "primereact/panel";
import { Ripple } from "primereact/ripple";
import ProductoSkeleton from "../Esqueleto/ProductoSkeleton";
import { Funciones } from "../Esqueleto/Funciones";
//import pako from "pako";

const Buscadas = () => {
  const [buscadas, setBuscadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCard, setNewCard] = useState({ code: "", image: "" });
  const [imagePreview, setImagePreview] = useState(null); // Estado para previsualizar la imagen
  const [imageFile, setImageFile] = useState(null);

  const toast = React.useRef(null);
  /* const handlePaste = (event) => {
    const items = event.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        const url = URL.createObjectURL(file);
        setImageFile(file);
        setImagePreview(url);
        break;
      }
    }
  }; */
  /*   const handlePaste = async (event) => {
    const items = event.clipboardData.items;

    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();

        // Paso 1: Convertir a JPEG con calidad personalizada
        convertirImagen(file, 0.8, async (convertedFile) => {
          // Paso 2: Comprimir a formato WebP
          const options = {
            fileType: "image/webp",
            initialQuality: 1, // Mayor calidad
          };

          try {
            const compressedFile = await imageCompression(
              convertedFile,
              options
            );

            // Paso 3: Leer el archivo comprimido como ArrayBuffer
            const arrayBuffer = await compressedFile.arrayBuffer();

            // Paso 4: Comprimir los datos binarios con pako
            const compressedBinary = pako.deflate(new Uint8Array(arrayBuffer));
            const compressedSizeKB = (compressedBinary.length / 1024).toFixed(
              2
            ); // Tamaño en KB
            console.log(
              "Tamaño del binario comprimido:",
              compressedSizeKB,
              "KB"
            );
            console.log("Binario comprimido:", compressedBinary);

            const originalSize = arrayBuffer.byteLength; // Tamaño en bytes
            const originalSizeKB = (originalSize / 1024).toFixed(2); // Tamaño en KB
            console.log("Tamaño del binario original:", originalSizeKB, "KB");

            // Paso 5: Opcionalmente, puedes convertir el binario comprimido a Base64
            const base64CompressedBinary = btoa(
              String.fromCharCode(...compressedBinary)
            );
            console.log(
              "Base64 del binario comprimido:",
              base64CompressedBinary
            );

            // Establecer la vista previa y los datos procesados
            const url = URL.createObjectURL(compressedFile);
            console.log("Tamaño original:", file.size, "bytes");
            console.log("Tamaño comprimido:", compressedFile.size, "bytes");
            setImageFile(compressedFile);
            setImagePreview(url);
          } catch (error) {
            console.error("Error al comprimir la imagen:", error);
          }
        });

        break;
      }
    }
  };

  // Función convertirImagen mejorada
  const convertirImagen = (archivo, calidad, callback) => {
    const misNombres = {};
    misNombres.Image = window.Image;

    const img = new misNombres.Image();
    const reader = new FileReader();

    reader.readAsDataURL(archivo);
    reader.onload = function (event) {
      img.src = event.target.result;
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          function (blob) {
            const newImgFile = new File([blob], "convertedImage.jpg", {
              type: "image/jpeg",
            });

            const kilobytes = newImgFile.size / 1024;
            const formattedSize = kilobytes.toFixed(3) + " KB";
            console.log("Tamaño después de conversión a JPEG:", formattedSize);

            // Llamar al callback con el archivo convertido
            callback(newImgFile);
          },
          "image/jpeg",
          calidad
        );
      };
    };
  }; */

  const handlePaste = async (event) => {
    const items = event.clipboardData.items;

    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();

        // Convertir a WebP respetando la transparencia
        Funciones.convertirWebPConTransparencia(file, 0.8, (convertedFile) => {
          console.log("Archivo WebP listo:", convertedFile);

          const url = URL.createObjectURL(convertedFile);
          setImageFile(convertedFile);
          setImagePreview(url);
        });

        break;
      }
    }
  };

  /* const convertirWebPConTransparencia = (archivo, calidad, callback) => {
    const misNombres = {};
    misNombres.Image = window.Image;

    const img = new misNombres.Image();
    const reader = new FileReader();

    reader.readAsDataURL(archivo);

    reader.onload = function (event) {
      img.src = event.target.result;

      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d", { alpha: true }); // Habilita el canal alfa
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Asegura un fondo transparente
        ctx.drawImage(img, 0, 0);

        // Exportar a WebP respetando la transparencia
        canvas.toBlob(
          (blob) => {
            const newImgFile = new File([blob], "convertedImage.webp", {
              type: "image/webp",
            });

            console.log(
              "Tamaño de la imagen WebP:",
              (newImgFile.size / 1024).toFixed(2),
              "KB"
            );
            callback(newImgFile);
          },
          "image/webp",
          calidad // Calidad de la imagen (0-1)
        );
      };
    };
  };
 */
  // Fetch inicial de las cartas buscadas
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/karuta/buscadas"); // Ruta de la API
      const data = await response.json();
      setBuscadas(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  /* const decompressImageBinary = (compressedBinary) => {
    const decompressedBinary = pako.inflate(compressedBinary);
    const blob = new Blob([decompressedBinary], { type: "image/webp" });
    return URL.createObjectURL(blob);
  }; */

  // Función para agregar una nueva carta
  const handleAddCard = async () => {
    if (!newCard.code || !imageFile) {
      toast.current.show({
        severity: "warn",
        summary: "Error",
        detail: "Debes ingresar el código y la imagen.",
      });
      return;
    }
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("code", newCard.code);

    const response = await axios.post("/api/karuta/buscadasAgregar", formData);
    //console.log("RESPONDE", response);
    if ((response.data.message = "Carta registrada exitosamente.")) {
      //const addedCard = await response.json();
      setBuscadas([...buscadas, response.data.carta]);
      setNewCard({ code: "", image: "" });
      setImageFile(null);
      setImagePreview(null);
      toast.current.show({
        severity: "success",
        summary: "Carta agregada",
        detail: `La carta con código ${newCard.code} fue agregada.`,
      });
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error al agregar",
        detail: "Hubo un problema al agregar la carta.",
      });
    }
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText("kv " + code).then(() => {
      toast.current.show({
        severity: "success",
        summary: "Copiado",
        detail: `Código ${code} copiado al portapapeles.`,
      });
    });
  };

  const handleDelete = async (cardCode) => {
    try {
      const response = await axios.delete("/api/karuta/buscadasEliminar", {
        data: { code: cardCode },
      });

      if (response.data.message === "Carta eliminada exitosamente.") {
        // Actualiza el estado para eliminar la carta de la lista
        setBuscadas(buscadas.filter((card) => card.code !== cardCode));

        // Muestra una notificación de éxito
        toast.current.show({
          severity: "success",
          summary: "Carta eliminada",
          detail: `La carta con código ${cardCode} fue eliminada.`,
        });
      } else {
        // Muestra una notificación de error
        toast.current.show({
          severity: "error",
          summary: "Error al eliminar",
          detail: "Hubo un problema al eliminar la carta.",
        });
      }
    } catch (error) {
      console.error("Error al eliminar la carta:", error);

      // Muestra una notificación de error
      toast.current.show({
        severity: "error",
        summary: "Error al eliminar",
        detail: "Ocurrió un problema inesperado al eliminar la carta.",
      });
    }
  };

  const itemTemplate = (card) => {
    return (
      <div className="col-12 sm:col-6 md:col-4 lg:col-3 xl:col-3 p-2 text-center centro-total">
        <div className="p-4 border-3 surface-border surface-card border-round">
          <div
            style={{
              position: "relative",
              width: "150px",
              height: "200px",
              border: "1px solid var(--primary-color)",
              borderRadius: "4px",
            }}
            className="ContenedorKImg p-0 m-0"
          >
            <Image
              src={`/api/karuta/serveImageBuscada?imageName=${card.code}.jpg`}
              alt={card.code}
              className="ImgnormalK border-round"
              width="150"
              height="200"
              preview
            />
          </div>
          <div className="font-semibold">Código: {card.code}</div>
          <div className="p-0 m-0">
            <Button
              label="📋"
              rounded
              size="small"
              className="p-2 m-0"
              text
              onClick={() => handleCopy(card.code)}
            />
            <Button
              label="🗑️"
              rounded
              size="small"
              className="p-2 m-0"
              text
              onClick={() => handleDelete(card.code)}
            />
          </div>
        </div>
      </div>
    );
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
          Agregar Carta
        </span>
      </div>
    );
  };
  return (
    <React.Fragment>
      {loading ? (
        <ProductoSkeleton />
      ) : (
        <>
          <h2 className="KarutaC-title text-center">Cartas Buscadas</h2>
          <Panel headerTemplate={template} toggleable collapsed>
            <div className="grid" onPaste={handlePaste}>
              <div className="col-6 centro-total">
                <div
                  className="p-4 border-1 surface-border border-round h-full"
                  style={{ position: "relative" }}
                >
                  <div className="centro-total h-full">
                    <label htmlFor="name">Codigo:</label>
                    <InputText
                      id="name"
                      value={newCard.code}
                      onChange={(e) =>
                        setNewCard({ ...newCard, code: e.target.value })
                      }
                      placeholder="Código de la carta"
                    />
                  </div>
                </div>
              </div>
              <div className="col-6 text-center centro-total">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt={"S/N"}
                    className="ImgnormalK border-round"
                    width="150"
                    height="200"
                    preview
                  />
                ) : (
                  <div
                    style={{
                      border: "1px dashed var(--primary-color)",
                      textAlign: "center",
                      height: 200,
                      width: 150,
                    }}
                    className="centro-total"
                  >
                    No hay imagen
                  </div>
                )}
              </div>
              <div className="col-12 text-center">
                <Button
                  label="Agregar Carta"
                  icon="pi pi-plus"
                  className="p-button-success"
                  onClick={handleAddCard}
                />
              </div>
            </div>
          </Panel>
          <div className="" style={{ padding: 0 }}>
            <Toast ref={toast} />
            <DataView
              value={buscadas}
              layout="grid"
              itemTemplate={itemTemplate}
              paginator
              className="w-full"
              rows={9} // Número de cartas por página
            />
          </div>
        </>
      )}
    </React.Fragment>
  );
};

export default Buscadas;
