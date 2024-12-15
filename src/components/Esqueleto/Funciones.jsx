
export const Funciones = {

    cambioValores(campo, valor, setCli, setCliente, cliente, cli) {
        /* console.log(`lo que llega es ${campo} y valor es ${valor}`); */
        setCliente({
            ...cliente,
            [campo]: valor
        })
        const newMar = cli.filter((item) => item !== campo);
        setCli(newMar);
    },
    cambioCheckbox(campo, valor, e, setCli, setCliente, cliente, cli) {
        //console.log(`Campo es ${campo} y valor es ${valor}`);

        if (e.checked) {
            setCliente({
                ...cliente,
                [campo]: [...cliente[campo], valor]
            })
            const newMar = cli.filter((item) => item !== campo);
            setCli(newMar);
        } else {
            const updatedValues = cliente[campo].filter((item) => item !== valor);
            setCliente({
                ...cliente,
                [campo]: updatedValues
            })
        }
    },
    cambioToggleButton(campo, valor, setCli, setCliente, cliente, cli) {
        const valor2 = valor.target.name.value
        if (cliente[campo].includes(valor2)) {
            //console.log("SI");
            const updatedValues = cliente[campo].filter((item) => item !== valor2);
            setCliente({
                ...cliente,
                [campo]: updatedValues
            })
        } else {
            setCliente({
                ...cliente,
                [campo]: [...cliente[campo], valor2]
            })
            //console.log("NO");
            const newMar = cli.filter((item) => item !== campo);
            setCli(newMar);
        }

    },
    getColumnClass(index, totalElements) {
        if (totalElements % 2 === 0) {
            // Si hay un número par de elementos, cada elemento toma md:col-6
            return "md:col-6";
        } else {
            // Si hay un número impar de elementos, el último elemento toma md:col-12
            return index === totalElements - 1 ? "md:col-12" : "md:col-6";
        }
    },
    getColumnClassLg(index, totalElements) {
        if (totalElements % 3 === 0) {
            return "lg:col-4";
        } else {
            const multiplos = Math.floor(totalElements / 3) * 3;
            const restante = totalElements - multiplos
            if (restante === 1) {
                return index === totalElements - 1 ? "lg:col-12" : "lg:col-4"
            } else {
                if (restante === 2) {
                    return index === totalElements - 1 || index === totalElements - 2 ? "lg:col-6" : "lg:col-4"
                }
            }
        }
    },
    obtenerValorPropiedad(objeto, propiedad) {
        const propiedades = propiedad.split('.'); // Dividir la cadena en partes usando el punto como separador

        return propiedades.reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : undefined, objeto);
    },
    fechabien(campo) {
        const options = { timeZone: 'UTC' };
        const fecha = campo === null ? campo : new Date(campo).toLocaleString('en-US', options)
        return new Date(fecha)
    },
    obtenerChips(objeto, propiedad) {
        if (Array.isArray(objeto)) {
            const cadenaObtenida = objeto.map((cad) => Funciones.obtenerValorPropiedad(cad, propiedad))
            return cadenaObtenida
        } else {
            const cadenaObtenida = [objeto]
            return cadenaObtenida
        }

    },
    convierteListas(listaNueva, campo, campo1, campo2) {
        const listaNew = listaNueva.map((u) => ({
            label: Funciones.obtenerValorPropiedad(u, campo1),
            [campo]: Funciones.obtenerValorPropiedad(u, campo2)
        }))
        //console.log("LA LISTA NUEVA ES", listaNew);
        return listaNew
    },
    compararTelefonos(cliente, telefonosOriginales) {
        const resultado = {};
        Object.keys(cliente).forEach((key) => {
            if (key.startsWith('telefono')) {
                const tipoTelefono = key; // 'telefono' o 'telefono2'
                const nuevos = cliente[key].filter((numero) => {
                    return !telefonosOriginales.some((originales) =>
                        originales[tipoTelefono] && originales[tipoTelefono].includes(numero)
                    );
                });

                const eliminados = telefonosOriginales
                    .map((originales) => originales[tipoTelefono] || [])
                    .flat()
                    .filter((numero) => !cliente[key].includes(numero));

                //resultado[tipoTelefono] = { nuevos, eliminados };
                if (nuevos.length > 0 || eliminados.length > 0) {
                    resultado[tipoTelefono] = { nuevos, eliminados };
                }
            }
        });
        if (Object.keys(resultado).length === 0) {
            resultado.sinCambios = "Sin Cambios";
        }
        return resultado;
    },
    validar(cliente, clienteRequerido, clienteAyuda, cli, setCli) {
        let mens = []
        let isValid = true
        let _cli = []
        Object.keys(cliente).map((campo) => {
            //console.log("EL CAMPO ES", campo);
            if (clienteRequerido[campo]) {
                if (Array.isArray(cliente[campo])) {
                    if (!cliente[campo].length) {
                        isValid = false
                        mens.push(clienteAyuda[campo] + " se encuentra vacio")
                        _cli.push(campo)
                    }
                }
                else {
                    if (!cliente[campo]) {
                        isValid = false
                        mens.push(clienteAyuda[campo] + " se encuentra vacio")
                        _cli.push(campo)
                    }
                }
            }
        })
        setCli(_cli)
        return { isValid, mens };
    },
    formatearCadena(cadena) {
        return cadena
            .replace(/([a-z])([A-Z])/g, '$1 $2') // Separa camelCase
            .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2') // Maneja casos como "DiferentesCasos"
            .replace(/_/g, ' ') // Reemplaza guiones bajos con espacios
            .toLowerCase() // Convierte todo a minúsculas
            .replace(/^./, function (str) {
                return str.toUpperCase(); // Convierte la primera letra a mayúscula
            });
    },
    compararObjetosOriginal(objetoOriginal, objetoModificado, clavesAdicionales = []) {
        const resultado = {};

        // Función para encontrar diferencias en listas
        function diffArrays(arr1, arr2) {
            const eliminado = arr1.filter(item => !arr2.includes(item));
            const nuevos = arr2.filter(item => !arr1.includes(item));
            return { eliminado, nuevos };
        }

        // Comparar cada campo del objeto
        for (const key in objetoOriginal) {
            if (objetoOriginal.hasOwnProperty(key)) {
                if (Array.isArray(objetoOriginal[key])) {
                    const { eliminado, nuevos } = diffArrays(objetoOriginal[key], objetoModificado[key] || []);
                    if (eliminado.length || nuevos.length) {
                        resultado[key] = { eliminado, nuevos };
                    }
                } else if (objetoOriginal[key] !== objetoModificado[key]) {
                    resultado[key] = objetoModificado[key];
                }
            }
        }

        // Incluir claves adicionales
        for (const key of clavesAdicionales) {
            if (objetoOriginal.hasOwnProperty(key)) {
                resultado[key] = objetoOriginal[key];
            }
        }

        return resultado;
    },
    compararObjetos(objetoOriginal, objetoModificado, clavesAdicionales = []) {
        const resultado = {};

        // Función para encontrar diferencias en listas
        function diffArrays(arr1, arr2) {
            const eliminado = arr1.filter(item => !arr2.includes(item));
            const nuevos = arr2.filter(item => !arr1.includes(item));
            return { eliminado, nuevos };
        }

        // Comparar cada campo del objeto
        let hayCambios = false;
        for (const key in objetoOriginal) {
            if (objetoOriginal.hasOwnProperty(key)) {
                if (Array.isArray(objetoOriginal[key])) {
                    const { eliminado, nuevos } = diffArrays(objetoOriginal[key], objetoModificado[key] || []);
                    if (eliminado.length || nuevos.length) {
                        resultado[key] = { eliminado, nuevos };
                        hayCambios = true;
                    }
                } else if (objetoOriginal[key] !== objetoModificado[key]) {
                    resultado[key] = objetoModificado[key];
                    hayCambios = true;
                }
            }
        }

        // Incluir claves adicionales si hay cambios
        if (hayCambios) {
            for (const key of clavesAdicionales) {
                if (objetoOriginal.hasOwnProperty(key)) {
                    resultado[key] = objetoOriginal[key];
                }
            }
        }

        return hayCambios ? resultado : null;
    }

}