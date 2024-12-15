import React from "react";
import { Skeleton } from 'primereact/skeleton';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { BlockUI } from 'primereact/blockui';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { Card } from 'primereact/card';
const VistaSkeleton = () => {
    return (
        <>

            <div className="border-round border-1 surface-border p-4 surface-card">
                <div className="flex mb-3">
                    <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                    <div>
                        <Skeleton width="10rem" className="mb-2"></Skeleton>
                        <Skeleton width="5rem" className="mb-2"></Skeleton>
                        <Skeleton height=".5rem"></Skeleton>
                    </div>
                </div>
                <Skeleton width="100%" height="150px" className='mb-2'></Skeleton>
                <div className="border-round border-1 surface-border p-4 mb-3">
                    <ul className="m-0 p-0 list-none">
                        <li className="mb-3">
                            <div className="flex">
                                <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                                <div style={{ flex: '1' }}>
                                    <Skeleton width="100%" className="mb-2" ></Skeleton>
                                    <Skeleton width="75%"></Skeleton>
                                </div>
                            </div>
                        </li>
                        <li className="mb-3">
                            <div className="flex">
                                <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                                <div style={{ flex: '1' }}>
                                    <Skeleton width="100%" className="mb-2"></Skeleton>
                                    <Skeleton width="75%"></Skeleton>
                                </div>
                            </div>
                        </li>
                        <li className="mb-3">
                            <div className="flex">
                                <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                                <div style={{ flex: '1' }}>
                                    <Skeleton width="100%" className="mb-2"></Skeleton>
                                    <Skeleton width="75%"></Skeleton>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="flex">
                                <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                                <div style={{ flex: '1' }}>
                                    <Skeleton width="100%" className="mb-2"></Skeleton>
                                    <Skeleton width="75%"></Skeleton>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="flex mb-3">
                    <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                    <div>
                        <Skeleton width="10rem" className="mb-2"></Skeleton>
                        <Skeleton width="5rem" className="mb-2"></Skeleton>
                        <Skeleton height=".5rem"></Skeleton>
                    </div>
                </div>
                <Skeleton width="100%" height="150px" className='mb-2'></Skeleton>
                <div className="flex justify-content-between mt-3">
                    <Skeleton width="4rem" height="2rem"></Skeleton>
                    <Skeleton width="4rem" height="2rem"></Skeleton>
                </div>
            </div>
        </>


    );
};

export default VistaSkeleton;

const cargar = (animacion, mensaje) => {
    return (
        <>
            {animacion === "P" ? <div className="container">
                <div className="cargando">
                    <div className="pelotas"></div>
                    <div className="pelotas"></div>
                    <div className="pelotas"></div>
                    <span className="texto-cargando">{mensaje}</span>
                </div>
            </div> : <div id="contenedor2">
                <div className="contenedor-loader">
                    <div className="loader1"></div>
                    <div className="loader2"></div>
                    <div className="loader3"></div>
                    <div className="loader4"></div>
                </div>
                <div className="cargando2">{mensaje}</div>
            </div>
            }
        </>
    );
}

export function Tabla({ tamaño, todo, columnas, animacion }) {
    const items = Array.from({ length: tamaño }, (v, i) => i);

    const bodyTemplate = () => {
        return <Skeleton></Skeleton>
    }
    const cabeceraTabla = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" value={''} placeholder="Buscar..." />
                </span>
                <Button label="Nuevo" icon="pi pi-plus" severity="warnnig" />
                <Button label="Eliminar" icon="pi pi-trash" severity="success" />
            </div>

        );
    };

    const cabecera = cabeceraTabla();

    return (
        <BlockUI blocked={true} template={cargar(animacion, "Cargando Contenido...")} fullScreen={todo} >
            <Panel className="card" header="Registros de.....">
                <DataTable value={items} header={cabecera}>
                    <Column selectionMode="multiple" frozen exportable={false} />
                    {columnas && columnas.map((col, index) => <Column key={index} field={col.field}
                        header={col.header} body={bodyTemplate} sortable />)}
                </DataTable>
            </Panel>
        </BlockUI>
    );
}

export function Paginacion({ todo, animacion }) {
    return (
        <BlockUI blocked={true} template={cargar(animacion, "Cargando Pagina...")} fullScreen={todo} >
            <VistaSkeleton />
        </BlockUI>
    );
}
export function Session({ todo, animacion, mensaje }) {
    return (
        <BlockUI blocked={true} template={cargar(animacion, mensaje)} fullScreen={todo} >
            <VistaSkeleton />
        </BlockUI>
    );
}

const ImagenDemo = () => {
    return (
        <div className="card">
            <div className="border-round border-1 surface-border p-4 surface-card">
                <div className="flex mb-3">
                    <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                    <div>
                        <Skeleton width="10rem" className="mb-2"></Skeleton>
                        <Skeleton width="5rem" className="mb-2"></Skeleton>
                        <Skeleton height=".5rem"></Skeleton>
                    </div>
                </div>
                <Skeleton width="100%" height="150px"></Skeleton>
                <div className="flex justify-content-between mt-3">
                    <Skeleton width="4rem" height="2rem"></Skeleton>
                    <Skeleton width="4rem" height="2rem"></Skeleton>
                </div>
            </div>
        </div>
    );
}

export function ImagenC({ todo, animacion, mensaje }) {
    return (
        <BlockUI blocked={true} template={cargar(animacion, mensaje)} fullScreen={todo} >
            <ImagenDemo />
        </BlockUI>
    );
}
export function VistaEmpresa({ tamaño, todo, animacion, mensaje }) {
    const items = Array.from({ length: tamaño }, (v, i) => i);
    const titulo = ["DATOS DE LA EMPRESA", "DATOS PERSONALES", "TELEFONOS DE CONTACTO", "IMAGENES PERSONALES"]
    return (
        <BlockUI blocked={true} template={cargar(animacion, "Cargando Contenido...")} fullScreen={todo} >
            <div className="grid">
                {titulo && titulo.map((t) =>
                    <div className="col-12 md:col-6 lg:col-3" key={t}>
                        <Card title={t}>
                            {items && items.map((e) => <React.Fragment key={t + " " + e}>
                                {t === "IMAGENES PERSONALES" ? (e === 1 || e === 2 ? <div className="flex flex-column align-items-center gap-3 py-5">
                                    <Skeleton className="w-9 shadow-2 border-round h-10rem" />
                                </div> : ""
                                )
                                    :
                                    <React.Fragment>
                                        <Skeleton width="10rem" className="mb-3"></Skeleton>
                                        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                                            <Skeleton className="w-6rem border-round h-1rem" />
                                            <Skeleton className="w-3rem border-round h-1rem" />
                                        </div>
                                    </React.Fragment>}
                            </React.Fragment>)}
                        </Card>
                    </div>
                )}
            </div>
        </BlockUI>
    );

}
export function Lista() {
    return (
        <div className="card">
            <div className="border-round border-1 surface-border p-4">
                <ul className="m-0 p-0 list-none">
                    <li className="mb-3">
                        <div className="flex">
                            <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                            <div style={{ flex: '1' }}>
                                <Skeleton width="100%" className="mb-2"></Skeleton>
                                <Skeleton width="75%"></Skeleton>
                            </div>
                        </div>
                    </li>
                    <li className="mb-3">
                        <div className="flex">
                            <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                            <div style={{ flex: '1' }}>
                                <Skeleton width="100%" className="mb-2"></Skeleton>
                                <Skeleton width="75%"></Skeleton>
                            </div>
                        </div>
                    </li>
                    <li className="mb-3">
                        <div className="flex">
                            <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                            <div style={{ flex: '1' }}>
                                <Skeleton width="100%" className="mb-2"></Skeleton>
                                <Skeleton width="75%"></Skeleton>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="flex">
                            <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                            <div style={{ flex: '1' }}>
                                <Skeleton width="100%" className="mb-2"></Skeleton>
                                <Skeleton width="75%"></Skeleton>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
}