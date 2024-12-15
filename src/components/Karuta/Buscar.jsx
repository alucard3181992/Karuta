// SearchBar.js
import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';

const SearchBar = ({ products, onFilter }) => {
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
        filterProducts(value);
    };

    const filterProducts = (value) => {
        if (!value) {
            onFilter(products);
            return;
        }
        const filtered = products.filter((product) => {
            return Object.keys(product).some((key) =>
                String(product[key]).toLowerCase().includes(value.toLowerCase())
            );
        });
        onFilter(filtered);
    };

    return (
        <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
                type="search"
                placeholder="Buscar ..."
                value={globalFilterValue}
                onChange={onGlobalFilterChange}
                className='w-full'
            />
        </span>
    );
};

export default SearchBar;
