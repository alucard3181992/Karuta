import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
//import { Imagen1 } from "path-to-your-components/Imagen1"; // Ajusta la ruta según tu proyecto
import { Image as Imagen1 } from "primereact/image";
import axios from "axios";
import { BlockUI } from "primereact/blockui";

const EditPage = ({
  page,
  index,
  selectedAlbum,
  handleAddCard,
  mensajeFlotante,
  cargar,
}) => {
  const [cards, setCards] = useState([...page.cards]);

  useEffect(() => {
    console.log("ME REARMO EDITAR");
    setCards([...page.cards]);
  }, [page.cards, selectedAlbum]);

  const [editar, setEditar] = useState(false);
  const [bloqueo, setBloqueo] = useState(false);
  // Mover carta entre posiciones
  const moveCard = (fromPosition, toPosition) => {
    const fromIndex = cards.findIndex((c) => c.position === fromPosition);
    const toIndex = cards.findIndex((c) => c.position === toPosition);

    if (fromIndex === -1) {
      alert("La posición de origen está vacía.");
      return;
    }

    const updatedCards = [...cards];

    // Intercambiar si ambas posiciones están ocupadas
    if (toIndex !== -1) {
      updatedCards[fromIndex].position = toPosition;
      updatedCards[toIndex].position = fromPosition;
    } else {
      // Mover a una posición vacía
      updatedCards[fromIndex].position = toPosition;
    }

    updatedCards.sort((a, b) => a.position - b.position);
    setCards(updatedCards);
  };

  // Eliminar carta de la posición
  const removeCard = (position) => {
    const updatedCards = cards.filter((c) => c.position !== position);
    setCards(updatedCards);
  };
  /* {
    "page_card_id": 16,
    "position": 1,
    "pagina": 1,
    "card_id": 425,
    "card_code": "vntcmzw",
    "character_name": "Aqua",
    "anime_name": "KonoSuba: God's blessing on this wonderful world!",
    "image_path": "F:\\Imagenes\\karuta\\vntcmzw.jpg"
}*/
  // Guardar cambios
  /* function compararCartas(nuevo, selectedAlbum) {
    const resultado = {
      modificar: [], // Cartas que cambiaron posición
      eliminar: [], // Cartas que se eliminaron
      agregar: [], // Cartas nuevas
    };

    // Crear un mapa de las páginas del álbum original para acceso rápido
    const paginasOriginales = {};
    selectedAlbum.pages.forEach((page) => {
      paginasOriginales[page.id] = page.cards;
    });

    // Iterar por las nuevas páginas y comparar las cartas
    nuevo.forEach(({ pageId, cards }) => {
      const cartasOriginales = paginasOriginales[pageId] || [];

      // Crear mapas para comparar
      const mapaOriginal = new Map(
        cartasOriginales.map((carta) => [carta.page_card_id, carta])
      );
      const mapaNuevo = new Map(
        cards.map((carta) => [carta.page_card_id, carta])
      );

      // Identificar eliminadas y modificadas
      cartasOriginales.forEach((cartaOriginal) => {
        if (!mapaNuevo.has(cartaOriginal.page_card_id)) {
          // Carta eliminada
          resultado.eliminar.push(cartaOriginal);
        } else {
          const cartaNueva = mapaNuevo.get(cartaOriginal.page_card_id);
          if (cartaNueva.position !== cartaOriginal.position) {
            // Carta modificada
            resultado.modificar.push({
              ...cartaNueva,
              oldPosition: cartaOriginal.position, // Posición anterior para referencia
            });
          }
        }
      });

      // Identificar nuevas cartas
      cards.forEach((cartaNueva) => {
        if (!mapaOriginal.has(cartaNueva.page_card_id)) {
          resultado.agregar.push(cartaNueva);
        }
      });
    });

    return resultado;
  } */

  function compararCartas(nuevo, originalAlbum) {
    const resultado = {
      modificar: [], // Cartas que cambiaron posición
      eliminar: [], // Cartas que se eliminaron
      agregar: [], // Cartas nuevas
    };

    // Crear un mapa de las páginas del álbum original para acceso rápido
    const paginasOriginales = {};
    originalAlbum.pages.forEach((page) => {
      paginasOriginales[page.id] = page.cards;
    });

    // Iterar por las nuevas páginas y comparar las cartas
    nuevo.forEach(({ pageId, cards }) => {
      const cartasOriginales = paginasOriginales[pageId] || [];

      // Crear mapas para comparar
      const mapaOriginal = new Map(
        cartasOriginales.map((carta) => [carta.page_card_id, carta])
      );
      const mapaNuevo = new Map(
        cards.map((carta) => [carta.page_card_id, carta])
      );

      // Identificar eliminadas y modificadas
      cartasOriginales.forEach((cartaOriginal) => {
        if (!mapaNuevo.has(cartaOriginal.page_card_id)) {
          // Carta eliminada
          resultado.eliminar.push(cartaOriginal);
        } else {
          const cartaNueva = mapaNuevo.get(cartaOriginal.page_card_id);
          if (cartaNueva.position !== cartaOriginal.position) {
            // Carta modificada
            resultado.modificar.push({
              ...cartaNueva,
              oldPosition: cartaOriginal.position, // Posición anterior para referencia
            });
          }
        }
      });

      // Identificar nuevas cartas
      cards.forEach((cartaNueva) => {
        if (!mapaOriginal.has(cartaNueva.page_card_id)) {
          resultado.agregar.push(cartaNueva);
        }
      });
    });

    return resultado;
  }

  const handleSave = async () => {
    setBloqueo(true);
    try {
      const { data } = await axios.get(
        `/api/karuta/album/${selectedAlbum.id}/pages`
      );
      const original = { ...selectedAlbum, pages: data };
      const nuevo = [
        {
          pageId: page.id,
          cards: cards.map(
            ({
              card_id,
              position,
              page_card_id,
              pagina,
              card_code,
              character_name,
              anime_name,
              image_path,
            }) => ({
              page_card_id,
              position,
              pagina,
              card_id,
              card_code,
              character_name,
              anime_name,
              image_path,
            })
          ),
        },
      ];
      const resultado = compararCartas(nuevo, original);
      //onSave(resultado);
      try {
        const response = await axios.post(
          "/api/karuta/album/actualizar",
          resultado
        );
        //console.log();
        if (response.data.message === "Operaciones realizadas con éxito.") {
          setBloqueo(false);
          setEditar(false);
          mensajeFlotante(
            false,
            "info",
            "Exito",
            "Operaciones realizadas con éxito.",
            4000
          );
        } else {
          mensajeFlotante(
            false,
            "error",
            "ERROR",
            "Error al enviar cambios:",
            4000
          );
          setBloqueo(false);
        }
      } catch (error) {
        setBloqueo(false);
        mensajeFlotante(
          false,
          "error",
          "ERROR",
          "Error al enviar cambios:",
          4000
        );
        console.error(
          "Error al enviar cambios:",
          error.response?.data || error.message
        );
      }
    } catch (error) {
      setBloqueo(false);
      console.error("Error al obtener las páginas del álbum:", error);
    }
  };

  return (
    <div style={{ marginBottom: "1rem" }} className="text-center">
      <BlockUI
        blocked={bloqueo}
        fullScreen
        template={cargar("C", `Cargando...`)}
      />
      <h4 className="text-center">
        {editar ? "Editar Pagina" : "Página(s)"} {index}
      </h4>
      <div
        style={{
          display: "grid",
          maxWidth: "600px",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "2rem",
          borderRadius: "var(--border-radius)",
          padding: "1rem",
          background: `url(/api/karuta/album/serveImage?imageName=${selectedAlbum.name}.jpg) no-repeat center center`,
          backgroundSize: "100% 100%",
          position: "relative",
        }}
        className="centro-total"
      >
        <div
          className="ArribaDerecha2"
          onClick={(e) => {
            e.preventDefault();
            setEditar(!editar);
          }}
        ></div>
        {editar && <div className="AbajoDerecha2" onClick={handleSave}></div>}
        {Array.from({ length: 8 }).map((_, position) => {
          const card = cards.find((c) => c.position === position + 1);
          return (
            <div
              key={position}
              style={{
                position: "relative",
                width: "100px",
                height: "200px",
                border: "none",
                borderRadius: "4px",
              }}
              className="ContenedorKImg2 p-0 m-0 centro-total"
            >
              {card ? (
                <div className="p-0 m-0">
                  <Imagen1
                    preview
                    src={`/api/karuta/serveImage?imageName=${card.card_code}.jpg`}
                    alt={card.card_code}
                    className="ImgnormalK2 border-round"
                    width="100"
                    height="150"
                  />
                  {editar && (
                    <div className="actions p-0 m-0 flex w-full centro-total">
                      <Button
                        icon="pi pi-arrow-left"
                        rounded
                        onClick={() =>
                          moveCard(card.position, card.position - 1)
                        }
                        style={{ height: "1.5rem", width: "1.5rem" }}
                        severity="success"
                      />
                      <Button
                        icon="pi pi-arrow-right"
                        rounded
                        onClick={() =>
                          moveCard(card.position, card.position + 1)
                        }
                        style={{ height: "1.5rem", width: "1.5rem" }}
                        severity="warning"
                      />
                      <Button
                        icon="pi pi-trash"
                        rounded
                        onClick={() => removeCard(card.position)}
                        style={{ height: "1.5rem", width: "1.5rem" }}
                        severity="danger"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {editar ? (
                    <div>vacio</div>
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
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EditPage;
