import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Image as Imagen1 } from "primereact/image";
import { Dialog } from "primereact/dialog";
import ViewCards from "./Vista"; // Asegúrate de tener este componente para seleccionar cartas
import { BlockUI } from "primereact/blockui";
import { KarutaContext } from "@/context/KarutaContext";
import { Toast } from "primereact/toast";
import Galeria from "../Esqueleto/Galleria";
import CreateAlbum from "./CrearAlbum";
import { Ripple } from "primereact/ripple";
import { Panel } from "primereact/panel";
import EditPage from "./EditarCartas";
import Buscadas from "../Buscadas/Vista";

const AlbumsPage = () => {
  const { cargar, album, nuevaListaAlbum } = useContext(KarutaContext);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [id, setId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [showCardPicker, setShowCardPicker] = useState(false);
  const [selectedPage, setSelectedPage] = useState(1);
  const [bloqueo, setBloqueo] = useState(false); // Nuevo estado para manejar falta de datos
  const toast = useRef(null);
  const [codigos, setCodigos] = useState([]); // Nuevo estado para manejar falta de datos

  /* useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const { data } = await axios.get("/api/karuta/album/lista");
        setAlbums(data);
      } catch (error) {
        console.error("Error al obtener los álbumes:", error);
      }
    };

    fetchAlbums();
  }, []); */
  useEffect(() => {
    setBloqueo(true);
    if (album.length !== 0) {
      try {
        setAlbums(album);
        //setBloqueo(false)
      } catch (error) {
        console.error("Error al cargar las cartas:", error);
      } finally {
        //setLoading(false);
        setBloqueo(false);
      }
      //setSeleccion([]);
      //setBloqueo(false);
    } else {
      //setBloqueo(true);
    }
  }, [album]);
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

  const openAlbumModal = async (album) => {
    setBloqueo(true);
    try {
      const { data } = await axios.get(`/api/karuta/album/${album.id}/pages`);
      console.log("ME LLAMAN MIERDA", album.id);
      setSelectedAlbum({ ...album, pages: data });
      const cardCodes = [];

      // Recorre cada página del álbum
      data.forEach((page) => {
        // Recorre cada carta dentro de la página
        page.cards.forEach((card) => {
          // Agrega el card_code al array de resultados
          cardCodes.push(card.card_code);
        });
      });
      // Muestra los códigos extraídos
      console.log("Códigos de cartas:", cardCodes);
      setCodigos(cardCodes);
      /* const albumCardCodes = data.pages.flatMap((page) =>
        page.cards.map((card) => card.card_code)
      );
      console.log("LISTA DE CODIGOS", albumCardCodes); */
      setBloqueo(false);
      setIsModalVisible(true);
    } catch (error) {
      setBloqueo(false);
      console.error("Error al obtener las páginas del álbum:", error);
    }
  };

  const closeAlbumModal = () => {
    setIsModalVisible(false);
    setSelectedAlbum(null);
  };

  const handleAddCard = (position, pagina, page) => {
    //console.log("PAGE ", page);
    setId(page.id);
    setSelectedPage(pagina);
    setSelectedPosition(position);
    setShowCardPicker(true); // Mostrar el modal para seleccionar cartas
  };

  const handleCardSelected = (card) => {
    setBloqueo(true);
    if (!selectedAlbum || !selectedPosition) {
      setBloqueo(false);
      return;
    }
    //console.log("album", selectedAlbum);
    axios
      .post("/api/karuta/album/agregarCarta", {
        album_page_id: id,
        card_code: card.code,
        position: selectedPosition,
        pagina: selectedPage,
      })
      .then(() => {
        //alert("Carta agregada correctamente.");
        mensajeFlotante(
          false,
          "info",
          "EXITO",
          "Carta agregada correctamente.",
          4000
        );
        setBloqueo(false);
        setShowCardPicker(false); // Cerrar el modal
        openAlbumModal(selectedAlbum); // Refrescar las páginas del álbum
      })
      .catch((err) => {
        setBloqueo(false);
        //console.error("Error al agregar carta:", err);
        alert("Error al agregar carta.");
        mensajeFlotante(
          false,
          "error",
          "ERROR",
          "Error al agregar carta.",
          4000
        );
      });
  };

  const borrarAlbum = async (datos) => {
    //console.log("BORRAR SE DIJO", datos);
    setBloqueo(true);
    try {
      const cardResponse = await axios.delete(
        "/api/karuta/album/eliminarAlbum",
        { data: { album: datos } }
      );
      //console.log("Album eliminado exitosamente:", cardResponse.data);
      if (cardResponse.data.message === "Album eliminado correctamente") {
        setBloqueo(false);
        nuevaListaAlbum();
        mensajeFlotante(
          false,
          "info",
          "EXITO",
          "Album eliminado correctamente",
          4000
        );
      }
    } catch (error) {
      setBloqueo(false);
      console.error("Error al subir la imagen:", error.response?.data || error);
    }
  };

  const renderAlbums = () => (
    <Galeria
      images={albums}
      openAlbumModal={openAlbumModal}
      nuevaLista={nuevaListaAlbum}
      setBloqueo={setBloqueo}
      mensajeFlotante={mensajeFlotante}
      borrarAlbum={borrarAlbum}
    ></Galeria>
  );
  const onSave = () => {
    console.log("SI ME LLAMAN SHJFHSJA");
  };
  const renderPages = () => {
    if (!selectedAlbum.pages || selectedAlbum.pages.length === 0) {
      return <p>No hay páginas en este álbum.</p>;
    }

    return selectedAlbum.pages.map((page, index) => (
      <div
        key={page.id}
        style={{ marginBottom: "1rem" }}
        className="text-center"
      >
        <div className="centro-total">
          <EditPage
            key={page.id}
            page={page}
            index={index + 1}
            selectedAlbum={selectedAlbum}
            handleAddCard={handleAddCard}
            mensajeFlotante={mensajeFlotante}
            cargar={cargar}
          />
        </div>
        {/* <h4 className="text-center">Página(s) {index + 1}</h4>
        <div className="centro-total">
          <div
            style={{
              display: "grid",
              //width:"500px",
              maxWidth: "600px",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "2rem",
              borderRadius: "var(--border-radius)",
              padding: "1rem",
              background: `url(/api/karuta/album/serveImage?imageName=${selectedAlbum.name}.jpg) no-repeat center center`,
              backgroundSize: "100% 100%", // Ajusta la imagen de fondo para cubrir el div
            }}
            className="centro-total"
          >
            {Array.from({ length: 8 }).map((_, position) => {
              const card = page.cards?.find((c) => c.position === position + 1);
              return (
                <div
                  key={position}
                  style={{
                    position: "relative",
                    width: "100px", // Cambia estos valores para ajustar el tamaño del contenedor
                    height: "150px",
                    border: "none",
                    borderRadius: "4px",
                  }}
                  className="ContenedorKImg2 p-0 m-0 centro-total"
                >
                  {card ? (
                    <Imagen1
                      preview
                      src={`/api/karuta/serveImage?imageName=${card.card_code}.jpg`}
                      alt={card.card_code}
                      className="ImgnormalK2 border-round"
                      width="100"
                      height="150"
                    />
                  ) : (
                    <Button
                      icon="pi pi-plus"
                      size="small"
                      className="p-button-outlined"
                      onClick={() =>
                        handleAddCard(position + 1, index + 1, page)
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>*/}
      </div>
    ));
  };
  const agregarPagina = () => {
    console.log("AGREGAR PAGINA ", selectedAlbum);
  };

  async function agregarPaginaSiEsNecesario(album) {
    setBloqueo(true);
    album = selectedAlbum;
    if (!album || !Array.isArray(album.pages)) {
      mensajeFlotante(
        false,
        "error",
        "OPERACION CANCELADA",
        "Error: Álbum inválido o sin páginas.",
        4000
      );
      setBloqueo(false);
      return;
    }

    // Determinar el número máximo de cartas por página
    const MAX_CARTAS_POR_PAGINA = 8;

    // Si no hay páginas en el álbum, crear la primera página
    let pagina = 0;
    if (album.pages.length === 0) {
      pagina = 1;

      //return;
    } else {
      // Revisar la última página para verificar si está llena
      const ultimaPagina = album.pages[album.pages.length - 1];
      if (ultimaPagina.cards.length < MAX_CARTAS_POR_PAGINA) {
        mensajeFlotante(
          false,
          "error",
          "OPERACION CANCELADA",
          "La última página aún tiene espacio disponible. No se agregó una nueva página.",
          4000
        );
        setBloqueo(false);
        return;
      }
    }

    pagina = album.pages.length + 1;

    try {
      const response = await axios.post("/api/karuta/album/agregarPagina", {
        album_id: album.id,
        page_number: pagina,
      });

      if (response.status === 201) {
        //console.log("Página añadida exitosamente:", response.data.page);
        openAlbumModal(selectedAlbum); // Refrescar las páginas del álbum
        mensajeFlotante(
          false,
          "info",
          "EXITO",
          "Página añadida exitosamente:",
          4000
        );
        setBloqueo(false);
        return response.data.page; // Retorna los datos de la página creada
      } else {
        console.error("Respuesta inesperada del servidor:", response);
      }
    } catch (error) {
      setBloqueo(false);
      if (error.response) {
        // Errores relacionados con la respuesta del servidor
        console.error("Error del servidor:", error.response.data.message);
      } else if (error.request) {
        // Errores relacionados con la solicitud (el servidor no respondió)
        console.error("No se recibió respuesta del servidor:", error.request);
      } else {
        // Otros errores (ejemplo: configuración de Axios)
        console.error(
          "Error en la configuración de la solicitud:",
          error.message
        );
      }
    }
  }
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
          Crear Album
        </span>
      </div>
    );
  };

  return (
    <div className="p-m-4">
      <Panel headerTemplate={template} toggleable collapsed>
        <CreateAlbum
          setBloqueo={setBloqueo}
          nuevaLista={nuevaListaAlbum}
          mensajeFlotante={mensajeFlotante}
        />
      </Panel>
      <Toast ref={toast}></Toast>
      {/* <h1>Álbumes</h1> */}
      <BlockUI
        blocked={bloqueo}
        template={cargar("C", `Cargando...`)}
        fullScreen={true}
      ></BlockUI>
      {albums.length > 0 ? renderAlbums() : <p>No hay álbumes disponibles.</p>}
      <Buscadas />
      <Dialog
        header={selectedAlbum?.name || "Álbum"}
        visible={isModalVisible}
        style={{ width: "100%" }}
        onHide={closeAlbumModal}
        className="text-center"
      >
        {selectedAlbum ? (
          <div>
            {renderPages()}
            <Button
              label="Agregar página"
              icon="pi pi-plus"
              className="p-button-outlined p-button-sm"
              onClick={agregarPaginaSiEsNecesario}
            />
          </div>
        ) : (
          <p>Cargando álbum...</p>
        )}
      </Dialog>

      {/* Modal para seleccionar cartas */}
      <Dialog
        header="Seleccionar carta"
        visible={showCardPicker}
        style={{ width: "80vw" }}
        onHide={() => setShowCardPicker(false)}
      >
        <ViewCards
          Add={true}
          onCardSelected={handleCardSelected}
          codigos={codigos}
        />
      </Dialog>
    </div>
  );
};

export default AlbumsPage;
