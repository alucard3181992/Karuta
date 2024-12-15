/* eslint-disable react-hooks/exhaustive-deps */

//carpeta context
import React, { createContext, useState, useEffect, useRef } from "react";
import { KarutaServicio } from "@/services/KarutaServicio";

export const KarutaContext = createContext();

const KarutaContextProvider = (props) => {
  const karutaServicio = new KarutaServicio();

  const [karuta, setKaruta] = useState([]);
  const [economia, setEconomia] = useState([]);
  const [trabajo, setTrabajo] = useState([]);
  const [album, setAlbum] = useState([]);
  const [editar, setEditar] = useState(null);
  const [registro, setRegistro] = useState("Guardar");

  useEffect(() => {
    //console.log("LLAMANDO A USUARIO")
    try {
      karutaServicio.listarKaruta().then((data) => setKaruta(data));
      karutaServicio.listarEconomia().then((data) => setEconomia(data));
      karutaServicio.listarTrabajo().then((data) => setTrabajo(data));
      karutaServicio.listarAlbum().then((data) => setAlbum(data));
    } catch (error) {
      console.log("aqui ", error);
    }
  }, []);

  const nuevo = async (karuta) => {
    const res = await karutaServicio.create(karuta);
    //nuevaLista()
    return res.data;
  };

  const buscar = (cli) => {
    //console.log("CLI ES", cli);
    setRegistro("Editar");
    setEditar(cli);
  };

  const cerrarFormulario = () => {
    setRegistro("Guardar");
    setEditar(null);
  };

  const mostrar = (cli) => {
    setRegistro("Mostrar");
    setEditar(cli);
  };

  const modificar = async (usuario, telefono) => {
    const res = await karutaServicio
      .modificar(usuario, telefono)
      .then(karutaServicio.listarKaruta().then(nuevaLista()));
    return res.data;
  };

  /* const eliminarMasivo = async (seleccion) => {
    try {
      let resultado = [];
      let mensajes = [];
      for (const id of seleccion) {
        const data = await karutaServicio.eliminar(id);
        resultado.push(data);
        mensajes.push({
          cliente: id.nom,
          mensaje: data.data.message,
          baja: data.data.msg,
        });
      }
      karutaServicio.listarCliente().then((data) => setClientes(data));
      //return resultado;
      return { mensajes };
    } catch (error) {
      console.log("el error es " + error);
    }
  }; */
  const eliminarIndividual = async (cliente) => {
    console.log("ME LLAMAN ELIMINAR CONTEXT", cliente);
    const res = await karutaServicio.eliminar(cliente);
    return res.data;
  };

  const nuevaLista = () => {
    karutaServicio.listarKaruta().then((data) => setKaruta(data));
    karutaServicio.listarEconomia().then((data) => setEconomia(data));
    karutaServicio.listarTrabajo().then((data) => setTrabajo(data));
  };
  const nuevaListaAlbum = () => {
    karutaServicio.listarAlbum().then((data) => setAlbum(data));
  };
  const cargar = (animacion, mensaje) => {
    return (
      <>
        {animacion === "P" ? (
          <div className="container">
            <div className="cargando">
              <div className="pelotas"></div>
              <div className="pelotas"></div>
              <div className="pelotas"></div>
              <span className="texto-cargando">{mensaje}</span>
            </div>
          </div>
        ) : (
          <div id="contenedor2">
            <div className="contenedor-loader">
              <div className="loader1"></div>
              <div className="loader2"></div>
              <div className="loader3"></div>
              <div className="loader4"></div>
            </div>
            <div className="cargando2">{mensaje}</div>
          </div>
        )}
      </>
    );
  };
  return (
    <KarutaContext.Provider
      value={{
        karuta,
        economia,
        trabajo,
        editar,
        album,
        nuevaListaAlbum,
        buscar,
        mostrar,
        nuevo,
        modificar,
        cargar,
        //eliminarMasivo,
        eliminarIndividual,
        registro,
        setRegistro,
        nuevaLista,
        cerrarFormulario,
      }}
    >
      {props.children}
    </KarutaContext.Provider>
  );
};

export default KarutaContextProvider;
