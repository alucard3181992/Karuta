/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef, useContext } from "react";
import { Button } from "primereact/button";
import { Galleria } from "primereact/galleria";
import { classNames } from "primereact/utils";
import { Image } from "primereact/image";
import axios from "axios";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Funciones } from "./Funciones";

export default function Galeria({
  images,
  openAlbumModal,
  nuevaLista,
  setBloqueo,
  mensajeFlotante,
  borrarAlbum,
}) {
  //const [images, setImages] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [isAutoPlayActive, setAutoPlayActive] = useState(true);
  const [isFullScreen, setFullScreen] = useState(false);
  const [confirmarBorrar, setConfirmarBorrar] = useState(false);

  const galleria = useRef(null);

  const responsiveOptions = [
    {
      breakpoint: "1024px",
      numVisible: 5,
    },
    {
      breakpoint: "960px",
      numVisible: 4,
    },
    {
      breakpoint: "768px",
      numVisible: 3,
    },
    {
      breakpoint: "560px",
      numVisible: 1,
    },
  ];

  useEffect(() => {
    console.log("ME VUELVO A ARMAR");
    if (images.length !== 0) {
      //const newMar = productos2.filter((item) => item.base64 !== null);
      //setImages(productos2);
      /* bindDocumentListeners();
      return () => unbindDocumentListeners(); */
    } else {
    }
  }, [images]);

  useEffect(() => {
    setAutoPlayActive(galleria.current.isAutoPlayActive());
  }, [isAutoPlayActive]);

  const onItemChange = (event) => {
    setActiveIndex(event.index);
  };

  const toggleFullScreen = () => {
    if (isFullScreen) {
      closeFullScreen();
    } else {
      openFullScreen();
    }
  };

  const onFullScreenChange = () => {
    setFullScreen((prevState) => !prevState);
  };

  const openFullScreen = () => {
    let elem = document.querySelector(".custom-galleria");
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Chrome, Safari & Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE/Edge */
      elem.msRequestFullscreen();
    }
  };

  const closeFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  const bindDocumentListeners = () => {
    document.addEventListener("fullscreenchange", onFullScreenChange);
    document.addEventListener("mozfullscreenchange", onFullScreenChange);
    document.addEventListener("webkitfullscreenchange", onFullScreenChange);
    document.addEventListener("msfullscreenchange", onFullScreenChange);
  };

  const unbindDocumentListeners = () => {
    document.removeEventListener("fullscreenchange", onFullScreenChange);
    document.removeEventListener("mozfullscreenchange", onFullScreenChange);
    document.removeEventListener("webkitfullscreenchange", onFullScreenChange);
    document.removeEventListener("msfullscreenchange", onFullScreenChange);
  };

  const thumbnailTemplate = (item) => {
    return (
      <div
        className="grid grid-nogutter justify-content-center"
        onPaste={(e) => handlePaste(e, item)}
      >
        <Image
          //src={item.base64}
          src={
            imageUrls[item.name] ||
            `/api/karuta/album/serveImage?imageName=${item.name}.jpg`
          }
          onError={(e) => (e.currentTarget.src = "/icons/image.png")}
          alt="Foto Actual"
          className="ImgnormalGalleria border-round"
          style={{ height: "50px", width: "60%" }}
        />
      </div>
    );
  };

  const handlePaste2 = async (event, code) => {
    setBloqueo(true);
    const items = event.clipboardData.items;
    let men = "";
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        const formData = new FormData();
        const url = URL.createObjectURL(file);
        formData.append("image", file);
        formData.append("code", code.name); // El código de la carta

        try {
          const cardResponse = await axios.post(
            "/api/karuta/excel/imagen2",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log("Imagen subida exitosamente:", cardResponse.data);
          if (
            cardResponse.data.message === "Imagen actualizada exitosamente."
          ) {
            setBloqueo(false);
            nuevaLista();
            handleImageUpdate(code.name);
            //openAlbumModal(code)
            mensajeFlotante(
              false,
              "info",
              "EXITO",
              "Imagen actualizada exitosamente.",
              4000
            );
          }
        } catch (error) {
          console.error(
            "Error al subir la imagen:",
            error.response?.data || error
          );
          setBloqueo(false);
        }
        break;
      } else {
        men = "NO";
      }
    }
    if (men === "NO") {
      setBloqueo(false);
      mensajeFlotante(false, "error", "EXITO", "No es una Imagen", 4000);
    }
  };

  const handlePaste = async (event, code) => {
    setBloqueo(true);

    const items = event.clipboardData.items;
    let imagenEncontrada = false;

    for (const item of items) {
      if (item.type.startsWith("image/")) {
        imagenEncontrada = true;
        const file = item.getAsFile();
        const formData = new FormData();

        try {
          // Convertir la imagen a WebP con transparencia
          const convertedFile =
            await Funciones.convertirWebPConTransparenciaNOCALLBACK(file, 0.8);

          // Crear el FormData
          formData.append("image", convertedFile);
          formData.append("code", code.name); // El código de la carta

          // Enviar la imagen al endpoint
          const response = await axios.post(
            "/api/karuta/excel/imagen2",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          console.log("Imagen subida exitosamente:", response.data);

          if (response.data.message === "Imagen actualizada exitosamente.") {
            setBloqueo(false);
            nuevaLista();
            handleImageUpdate(code.name);
            mensajeFlotante(
              false,
              "info",
              "ÉXITO",
              "Imagen actualizada exitosamente.",
              4000
            );
          } else {
            throw new Error("Imagen no actualizada.");
          }
        } catch (error) {
          console.error("Error al subir la imagen:", error);
          mensajeFlotante(
            false,
            "error",
            "ERROR",
            "Error al subir la imagen.",
            4000
          );
          setBloqueo(false);
        }
        break; // Sale del bucle si encuentra una imagen
      }
    }

    if (!imagenEncontrada) {
      setBloqueo(false);
      mensajeFlotante(false, "error", "INFO", "No es una Imagen", 4000);
    }
  };

  const [imageUrls, setImageUrls] = useState({});
  const handleImageUpdate = (code) => {
    setImageUrls((prev) => ({
      ...prev,
      [code]: `/api/karuta//album/serveImage?imageName=${code}.jpg&t=${new Date().getTime()}`,
    }));
  };

  const itemTemplate = (item) => {
    /* return <img src={item.base64} alt={item.alt} style={{ width: '100%', display: 'block' }} /> */
    return (
      <Image
        //src={item.base64}
        src={
          imageUrls[item.name] ||
          `/api/karuta/album/serveImage?imageName=${item.name}.jpg`
        }
        onError={(e) => (e.currentTarget.src = "/icons/image.png")}
        alt="Foto Actual"
        className="ImgnormalGalleriaP border-round"
        style={{ height: "400px", width: "100%", display: "block" }}
        onPaste={(e) => handlePaste(e, item)}
      />
    );
  };

  const renderFooter = () => {
    let autoPlayClassName = classNames("pi", {
      "pi-play": !isAutoPlayActive,
      "pi-pause": isAutoPlayActive,
    });

    let fullScreenClassName = classNames("pi", {
      "pi-window-maximize": !isFullScreen,
      "pi-window-minimize": isFullScreen,
    });

    return (
      <div className="custom-galleria-footer">
        <Button
          icon="pi pi-list"
          onClick={() => setShowThumbnails((prevState) => !prevState)}
        />
        <Button
          icon={autoPlayClassName}
          onClick={() => {
            if (!isAutoPlayActive) {
              galleria.current.startSlideShow();
              setAutoPlayActive(true);
            } else {
              galleria.current.stopSlideShow();
              setAutoPlayActive(false);
            }
          }}
        />
        {images && (
          <span className="title-container">
            <span>
              {activeIndex + 1}/{images.length}
            </span>
            <span
              className="title p-1 ml-5"
              style={{
                border: "1px dashed var(--primary-color)",
                borderRadius: "4px",
              }}
              onPaste={(e) => handlePaste(e, images[activeIndex])}
            >
              Album: {images[activeIndex].name}
            </span>
            <Button
              icon={"pi pi-trash"}
              severity="danger"
              tooltip="Borrar album"
              tooltipOptions={{ position: "bottom" }}
              text
              className="fullscreen-button p-0 m-0"
              //onClick={() => borrarAlbum(images[activeIndex])}
              onClick={(e) => {
                e.preventDefault();
                setConfirmarBorrar(true);
              }}
            />
            {confirmarBorrar && (
              <ConfirmDialog
                visible={confirmarBorrar}
                onHide={() => setConfirmarBorrar(false)}
                message="¿Confirma la eliminación?"
                header="Confirmación!!!!"
                icon="pi pi-info-circle"
                accept={() => borrarAlbum(images[activeIndex])}
                acceptClassName="p-button-danger"
                acceptLabel="Sí"
              />
            )}
          </span>
        )}
        <Button
          icon={fullScreenClassName}
          //onClick={() => toggleFullScreen()}
          className="fullscreen-button"
          onClick={() => openAlbumModal(images[activeIndex])}
        />
      </div>
    );
  };

  const footer = renderFooter();
  const galleriaClassName = classNames("custom-galleria", {
    fullscreen: isFullScreen,
  });

  return (
    <React.Fragment>
      <div className="card">
        <h2>Álbumes</h2>
        <div className="galleria-demo flex justify-content-center">
          <Galleria
            ref={galleria}
            value={images}
            activeIndex={activeIndex}
            onItemChange={onItemChange}
            showThumbnails={showThumbnails}
            showItemNavigators
            showItemNavigatorsOnHover
            numVisible={5}
            circular
            autoPlay={false}
            transitionInterval={3000}
            responsiveOptions={responsiveOptions}
            item={itemTemplate}
            thumbnail={thumbnailTemplate}
            footer={footer}
            style={{ width: "600px" }}
            className={galleriaClassName}
          />
        </div>
      </div>
    </React.Fragment>
  );
}
