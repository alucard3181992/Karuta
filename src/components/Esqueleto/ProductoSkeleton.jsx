/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Skeleton } from 'primereact/skeleton';
import { BlockUI } from 'primereact/blockui';

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
function ProductoSkeleton2({tamaño}) {
    const [products, setProducts] = useState([]);
    const [layout, setLayout] = useState('grid');
    const items = Array.from({ length: tamaño }, (v, i) => i)
    useEffect(() => {
        setProducts(items)
    }, []);

    const listItem = () => {
        return (
            <div className="col-12">
                <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                    <Skeleton className="w-9 sm:w-16rem xl:w-10rem shadow-2 h-6rem block xl:block mx-auto border-round" />
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <Skeleton className="w-8rem border-round h-2rem" />
                            <Skeleton className="w-6rem border-round h-1rem" />
                            <div className="flex align-items-center gap-3">
                                <Skeleton className="w-6rem border-round h-1rem" />
                                <Skeleton className="w-3rem border-round h-1rem" />
                            </div>
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            <Skeleton className="w-4rem border-round h-2rem" />
                            <Skeleton shape="circle" className="w-3rem h-3rem" />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const gridItem = () => {
        return (
            <div className="col-12 sm:col-6 lg:col-6 xl:col-4 p-2">
                <div className="p-4 border-1 surface-border surface-card border-round">
                    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                        <Skeleton className="w-6rem border-round h-1rem" />
                        <Skeleton className="w-3rem border-round h-1rem" />
                    </div>
                    <div className="flex flex-column align-items-center gap-3 py-5">
                        <Skeleton className="w-9 shadow-2 border-round h-10rem" />
                        <Skeleton className="w-8rem border-round h-2rem" />
                        <Skeleton className="w-6rem border-round h-1rem" />
                    </div>
                    <div className="flex align-items-center justify-content-between">
                        <Skeleton className="w-4rem border-round h-2rem" />
                        <Skeleton shape="circle" className="w-3rem h-3rem" />
                    </div>
                </div>
            </div>
        );
    };

    const itemTemplate = (product, layout) => {
        if (!product) {
            return;
        }

        if (layout === 'list') return listItem(product);
        else if (layout === 'grid') return gridItem(product);
    };

    const header = () => {
        return (
            <div className="flex justify-content-end">
                <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
            </div>
        );
    };

    return (
        <div className="card">
            <DataView value={products} itemTemplate={itemTemplate} layout={layout} header={header()} />
        </div>
    )
}
export function ProductoSkeletonSoloPartes() {
    return (<React.Fragment>
        <BlockUI blocked={true} template={cargar("P", "Cargando Contenido...")} fullScreen={false} >
            <ProductoSkeleton2 tamaño={7}></ProductoSkeleton2>
        </BlockUI>
    </React.Fragment>)
}
export function RegistroSkeletonSoloPartes() {
    return (<React.Fragment>
        <BlockUI blocked={true} template={cargar("P", "Seleccione un Usuario...")} fullScreen={false} >
            <ProductoSkeleton2 tamaño={3}></ProductoSkeleton2>
        </BlockUI>
    </React.Fragment>)
}
export default function ProductoSkeleton() {
    return (<React.Fragment>
        <BlockUI blocked={true} template={cargar("P", "Cargando Contenido...")} fullScreen={false} >
            <ProductoSkeleton2 tamaño={7}></ProductoSkeleton2>
        </BlockUI>
    </React.Fragment>)
}

