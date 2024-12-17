/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useContext, useRef } from "react";
import { DataView } from "primereact/dataview";
import { Card } from "primereact/card";
import Image from "next/image";
import { Image as Imagen1 } from "primereact/image";
import { Button } from "primereact/button";
import { KarutaContext } from "@/context/KarutaContext";
import ProductoSkeleton from "../Esqueleto/ProductoSkeleton";
import RegisterCard from "./Registro";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import SearchBar from "./Buscar";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import KarutaEconomyUploader from "./CargarExcel";
import { BlockUI } from "primereact/blockui";
import { Toast } from "primereact/toast";
import { Funciones } from "../Esqueleto/Funciones";

export default function ViewCards({
  Add = false,
  onCardSelected,
  codigos = [],
}) {
  const { karuta, eliminarIndividual, nuevaLista, cargar } =
    useContext(KarutaContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cards, setCards] = useState([]);
  const [originalCards, setOriginalCards] = useState([]); // Lista base inmutable
  const [loading, setLoading] = useState(true);
  const toast = useRef(null);
  const [sortOptions, setSortOptions] = useState(null);
  const [sortField, setSortField] = useState("effort");
  const [sortKey, setSortKey] = useState("!effort");
  const [sortOrder, setSortOrder] = useState(-1);
  const [bloqueo1, setBloqueo1] = useState(false);

  const handleFilter = (filtered) => {
    setCards(filtered);
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

  const getSortOptions = (product) => {
    const sortOptions = [];
    for (const key in product) {
      if (typeof product[key] === "number") {
        sortOptions.push(
          {
            label: `${
              key.charAt(0).toUpperCase() + key.slice(1)
            } Menor a Mayor`,
            value: key,
          },
          {
            label: `${
              key.charAt(0).toUpperCase() + key.slice(1)
            } Mayor a Menor`,
            value: `!${key}`,
          }
        );
      } else {
        sortOptions.push(
          {
            label: `${key.charAt(0).toUpperCase() + key.slice(1)} A - Z`,
            value: key,
          },
          {
            label: `${key.charAt(0).toUpperCase() + key.slice(1)} Z - A`,
            value: `!${key}`,
          }
        );
      }
    }
    return sortOptions;
  };

  const cambioOrden = (event) => {
    const value = event.value;

    if (value.indexOf("!") === 0) {
      setSortOrder(-1);
      setSortField(value.substring(1, value.length));
      setSortKey(value);
    } else {
      setSortOrder(1);
      setSortField(value);
      setSortKey(value);
    }
  };

  /* useEffect(() => {
    if (karuta.length !== 0) {
      try {
        setCards(karuta);
        setSortOptions(getSortOptions(karuta[0]));
      } catch (error) {
        console.error("Error al cargar las cartas:", error);
      } finally {
        setLoading(false);
      }
      //setSeleccion([]);
      //setBloqueo(false);
    } else {
      //setBloqueo(true);
    }
  }, [karuta]); */

  useEffect(() => {
    console.log("SOY VERSION 1.0");
    if (karuta.length !== 0) {
      try {
        if (Add && codigos.length > 0) {
          console.log("PRIMERO");
          // Filtramos las cartas que NO están en la lista de "codigos"
          const filteredCards = karuta.filter(
            (card) => !codigos.includes(card.code)
          );
          setOriginalCards(filteredCards);
          setCards(filteredCards);
        } else {
          console.log("PRIMERO IGUAL");
          // Si Add es false o codigos está vacío, asignamos karuta directamente
          setCards(karuta);
          setOriginalCards(karuta);
        }
        setSortOptions(getSortOptions(karuta[0]));
      } catch (error) {
        console.error("Error al cargar las cartas:", error);
      } finally {
        console.log("SEGUNDO");
        setLoading(false);
      }
    } else {
      // Si karuta está vacío
      setCards([]);
      //setLoading(false);
    }
  }, [karuta]);

  const handleCardClick = (card) => {
    if (Add) {
      onCardSelected(card); // Devolver la carta seleccionada al componente padre
    }
  };
  const [imageUrls, setImageUrls] = useState({});
  const handleImageUpdate = (code) => {
    setImageUrls((prev) => ({
      ...prev,
      [code]: `/api/karuta/serveImage?imageName=${code}.jpg&t=${new Date().getTime()}`,
    }));
  };

  const gridItem = (card) => {
    const [isFlipped, setIsFlipped] = useState(false); // Estado para manejar el giro
    const [loading, setLoading] = useState(false);
    const [details, setDetails] = useState(null);
    const [noDetails, setNoDetails] = useState(false); // Nuevo estado para manejar falta de datos
    const [bloqueo, setBloqueo] = useState(false); // Nuevo estado para manejar falta de datos
    const [men, setMen] = useState(""); // Nuevo estado para manejar falta de datos
    const [copied, setCopied] = useState(false);
    const [modify, setModify] = useState(false);

    const handleFlip = async () => {
      setIsFlipped((prev) => !prev);

      if (!isFlipped && !details) {
        setLoading(true);
        try {
          const response = await axios.get(
            `/api/karuta/details?card_id=${card.id}`
          );

          if (
            response.data.message === "No hay datos adicionales disponibles."
          ) {
            setNoDetails(true);
          } else {
            //console.log("LOS DATOS SON", response.data);
            setDetails(response.data);
          }
        } catch (error) {
          console.error("Error al cargar detalles:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    const eliminarCarta = async (card) => {
      setMen("Eliminando");
      setBloqueo(true);
      try {
        const res = await eliminarIndividual(card);
        if (res.message === "Carta eliminada correctamente") {
          setBloqueo(false);
          nuevaLista();
          mensajeFlotante(
            false,
            "success",
            "EXITO",
            "Carta eliminada correctamente.",
            4000
          );
          //alert("Carta eliminada correctamente.");
        } else {
          alert(`Error: ${result.message}`);
        }
      } catch (error) {
        console.error("Error al eliminar la carta:", error);
      }
    };

    const [imagePreview, setImagePreview] = useState(null); // Estado para previsualizar la imagen

    /* const handlePaste2 = async (event, code = true) => {
      setMen("Subiendo");
      setBloqueo(true);
      const items = event.clipboardData.items;
      let men = "";
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          const formData = new FormData();
          Funciones.convertirWebPConTransparencia(
            file,
            0.8,
            (convertedFile) => {
              const url = URL.createObjectURL(convertedFile);
              code && setImagePreview(url);
              formData.append("image", convertedFile);
            }
          );
          formData.append("code", card.code); // El código de la carta
          try {
            const cardResponse = await axios.post(
              "/api/karuta/excel/imagen",
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
              setImagePreview(null);
              !code && handleImageUpdate(card.code);

              mensajeFlotante(
                false,
                "info",
                "EXITO",
                "Imagen actualizada exitosamente.",
                4000
              );
            } else {
              setBloqueo(false);
              mensajeFlotante(
                false,
                "error",
                "ERROR",
                "Imagen no actualizada.",
                4000
              );
            }
          } catch (error) {
            setBloqueo(false);
            console.error(
              "Error al subir la imagen:",
              error.response?.data || error
            );
          }
          men = "SI";
          break;
        } else {
          men = "NO";
        }
      }
      if (men === "NO") {
        setBloqueo(false);
        mensajeFlotante(false, "error", "INFO", "No es una Imagen", 4000);
      }
    }; */
    const handlePaste = async (event, code = true) => {
      setMen("Subiendo");
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
              await Funciones.convertirWebPConTransparenciaNOCALLBACK(
                file,
                0.8
              );

            const url = URL.createObjectURL(convertedFile);
            code && setImagePreview(url);

            // Crear el FormData
            formData.append("image", convertedFile);
            formData.append("code", card.code); // El código de la carta

            // Enviar la imagen al endpoint
            const response = await axios.post(
              "/api/karuta/excel/imagen",
              formData,
              {
                headers: { "Content-Type": "multipart/form-data" },
              }
            );

            console.log("Imagen subida exitosamente:", response.data);

            if (response.data.message === "Imagen actualizada exitosamente.") {
              setBloqueo(false);
              nuevaLista();
              setImagePreview(null);
              !code && handleImageUpdate(card.code);

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

    const handleCopy = () => {
      navigator.clipboard.writeText("kv " + card.code).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Tooltip de confirmación desaparece después de 2 segundos
      });
    };

    return (
      <div className="col-12 sm:col-6 md:col-4 lg:col-3 xl:col-3 p-2">
        {/* <Toast ref={toast} /> */}
        <BlockUI
          blocked={bloqueo}
          template={cargar("C", `${men}...`)}
          fullScreen={false}
          pt={{
            root: {
              className:
                "surface-ground surface-border p-1 border-round h-full",
            },
          }}
        >
          {isFlipped ? (
            <div
              className="p-4 border-1 surface-border surface-card border-round "
              style={{ position: "relative" }}
            >
              <div className="ArribaDerecha" onClick={handleFlip}></div>
              {loading ? (
                <p>Cargando detalles...</p>
              ) : noDetails ? (
                <p>No hay datos adicionales para esta carta.</p>
              ) : (
                details && (
                  <div>
                    <h4>Kb</h4>
                    <div className="flex gap-1">
                      <div>{"💰"}</div>
                      <div className="font-bold">{details.gold ?? "N/A"}</div>
                      <div>{`Gold`}</div>
                    </div>
                    <div className="flex gap-1">
                      <div>{"✨"}</div>
                      <div className="font-bold">{details.dust ?? "N/A"}</div>
                      <div>{`Dust`}</div>
                      <div>
                        {"("}
                        {details.economy_stars ?? "N/A"}
                        {")"}
                      </div>
                    </div>
                    {details.character_details && (
                      <>
                        <h4>Kwi</h4>
                        <p>{details.character_details ?? "N/A"}</p>
                        <p>Effort - {details.effort ?? "N/A"}</p>
                        <p>{details.health_status ?? "N/A"}</p>
                        <div className="col-12 text-center">
                          <p className="font-bold">Effort Modifiers</p>
                          <table
                            cellPadding="3"
                            style={{ borderRadius: "4px" }}
                            className="surface-0 w-full p-2"
                          >
                            <tbody>
                              {details.effort_modifiers &&
                                Object.entries(details.effort_modifiers).map(
                                  ([key, modifier]) => (
                                    <tr key={key}>
                                      <td className="text-blue-300">
                                        {modifier.value}
                                      </td>
                                      <td>{modifier.grade}</td>
                                      <td className="text-purple-300">{key}</td>
                                    </tr>
                                  )
                                )}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </div>
                )
              )}
            </div>
          ) : (
            <div
              className="p-4 border-1 surface-border surface-card border-round h-full"
              style={{ position: "relative" }}
            >
              <div className="ArribaDerecha" onClick={handleFlip}></div>
              {!Add && (
                <div
                  className="AbajoDerecha"
                  onClick={(e) => {
                    e.preventDefault();
                    setModify(!modify);
                  }}
                ></div>
              )}
              <Dialog
                header={"MODIFICAR"}
                visible={modify}
                style={{ width: "100%" }}
                onHide={() => setModify(false)}
                className="text-center"
              >
                <RegisterCard
                  modificar={true}
                  texto={`${card.code} · ${card.stars}  · ${card.card_number} · ${card.version} · ${card.anime_name} · ${card.character_name}`}
                />
              </Dialog>
              <div className="text-2xl font-bold text-center">
                {card.character_name}
              </div>
              <div className="flex flex-column align-items-center gap-3 py-5">
                <div
                  style={{
                    position: "relative",
                    width: "150px",
                    height: "200px",
                    border: "1px solid var(--primary-color)",
                    borderRadius: "4px",
                  }}
                  className="ContenedorKImg p-0 m-0 centro-total"
                >
                  {card.image_path === "Vacio" ? (
                    <div className="p-mt-4" onPaste={(e) => handlePaste(e)}>
                      {imagePreview ? (
                        <Imagen1
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
                            border: "1px dashed #ccc",
                            textAlign: "center",
                          }}
                        >
                          No hay imagen
                        </div>
                      )}
                    </div>
                  ) : (
                    <Imagen1
                      //src={`/api/karuta/serveImage?imageName=${card.code}.jpg`}
                      src={
                        imageUrls[card.code] ||
                        `/api/karuta/serveImage?imageName=${card.code}.jpg`
                      }
                      alt={card.character_name}
                      preview
                      className="ImgnormalK border-round"
                      width="150"
                      height="200"
                      onPaste={(e) => handlePaste(e, false)}
                    />
                  )}
                </div>
                {!Add ? (
                  <React.Fragment>
                    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                      <div className="flex align-items-center gap-2 text-center">
                        <span className="font-bold">{card.anime_name}</span>
                      </div>
                    </div>

                    <div className="flex centro-total">
                      <div className="font-semibold">Código: {card.code}</div>
                      <div className="p-0 m-0">
                        <Button
                          label="📋"
                          rounded
                          size="small"
                          className="p-2 m-0"
                          text
                          onClick={handleCopy}
                        />
                      </div>
                      {copied && (
                        <span className="text-green-500">¡Copiado!</span>
                      )}
                    </div>
                    <div className="font-semibold">Estrellas: {card.stars}</div>
                    {/* <div className="font-semibold">
                      Número: {card.card_number}
                    </div> */}
                    <div className="font-semibold">Versión: {card.version}</div>
                    <div className="font-semibold">
                      Gold 💰: {card.gold === 0 ? "S/N" : card.gold}
                    </div>
                    <div className="font-semibold">
                      Effort: {card.effort === 0 ? "S/N" : card.effort}
                    </div>
                    <Button
                      rounded
                      outlined
                      raised
                      icon="pi pi-trash"
                      severity="danger"
                      onClick={(e) => {
                        e.preventDefault();
                        eliminarCarta(card);
                      }}
                    ></Button>
                  </React.Fragment>
                ) : (
                  <Button
                    label="Agregar"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCardClick(card);
                    }}
                  ></Button>
                )}
              </div>
            </div>
          )}
        </BlockUI>
      </div>
    );
  };

  const closeAlbumModal = () => {
    setIsModalVisible(false);
  };
  const cantidad = cards.length;

  const startContent = (
    <React.Fragment>
      <Button
        outlined
        icon="pi pi-plus"
        onClick={(e) => {
          e.preventDefault();
          setIsModalVisible(true);
        }}
        className="p-2 m-0"
      ></Button>
      <SearchBar products={originalCards} onFilter={handleFilter} />
    </React.Fragment>
  );

  const endContent = (
    <React.Fragment>
      <Dropdown
        options={sortOptions}
        size={"small"}
        value={sortKey}
        optionLabel="label"
        placeholder="Ordenar por:"
        onChange={cambioOrden}
      />
    </React.Fragment>
  );
  const header = () => {
    return <Toolbar start={startContent} center={<p className="KarutaC-indicator" style={{transform:"translateX(0px)"}}>{cantidad} Cartas</p>} end={endContent} />;
  };

  return (
    <div className="">
      <Toast ref={toast} />

      {loading ? (
        <ProductoSkeleton />
      ) : (
        <React.Fragment>
          <BlockUI
            blocked={bloqueo1}
            template={cargar("C", `Cargando...`)}
            fullScreen={true}
          />
          {!Add && (
            <KarutaEconomyUploader
              mensajeFlotante={mensajeFlotante}
              setbloqueo={setBloqueo1}
            />
          )}
          <DataView
            header={header()}
            value={cards}
            itemTemplate={gridItem}
            layout="grid"
            paginator
            sortField={sortField}
            sortOrder={sortOrder}
            rows={24}
          />
          <Dialog
            header={"AGREGAR"}
            visible={isModalVisible}
            style={{ width: "100%" }}
            onHide={closeAlbumModal}
            className="text-center"
          >
            <RegisterCard />
          </Dialog>
        </React.Fragment>
      )}
    </div>
  );
}
