import React, { useState } from 'react';
import axios from 'axios';
import LibroCard from '../components/LibroCard';
import SidebarGeneros from '../components/SidebarGeneros';

const BuscadorLibros = () => {
    const [libros, setLibros] = useState([]);
    const [textoBusqueda, setTextoBusqueda] = useState('');

    const ejecutarBusqueda = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`http://localhost:8080/api/libros/buscar?q=${textoBusqueda}`);
            setLibros(response.data);
        } catch (error) {
            console.error("Error al buscar:", error);
        }
    };

    const tusGeneros = ["Ficción", "Misterio", "Ciencia Ficción", "Romance"];
    const todosLosGeneros = ["Arte", "Autoayuda", "Biografía", "Ciencia ficción", "Clásicos", "Crimen", "Fantasía", "Historia", "Comedia", "Infantil", "Misterio", "Novela", "Paranormal", "Poesía", "Romance", "Suspense", "Terror", "Thriller"];

    return (
        <div style={estiloPagina}>
            <SidebarGeneros tusGeneros={tusGeneros} todosLosGeneros={todosLosGeneros} />

            <main style={{ flex: 1 }}>
                <div style={estiloContenedorBuscador}>
                    <form onSubmit={ejecutarBusqueda} style={estiloForm}>
                        <div style={estiloIcono}>🔍</div>
                        <input 
                            type="text" 
                            placeholder="Busca por título, autor o género..." 
                            value={textoBusqueda}
                            onChange={(e) => setTextoBusqueda(e.target.value)}
                            style={estiloInput}
                        />
                        <button 
                            type="submit" 
                            style={estiloBoton}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#b57668'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#C88B7D'}
                        >
                            Buscar
                        </button>
                    </form>
                </div>

                <div style={{textAlign: 'right', marginBottom: '20px'}}>
                    <span style={{color: '#666', marginRight: '10px'}}>Ordenar por:</span>
                    <select style={estiloSelect}><option>Valoración</option><option>Título</option></select>
                </div>

                <div style={estiloGrid}>
                    {libros.length > 0 ? (
                        libros.map((libro, index) => <LibroCard key={index} libro={libro} />)
                    ) : (
                        <p style={{textAlign: 'center', gridColumn: '1/-1', color: '#666', marginTop: '50px'}}>Usa el buscador para encontrar tus libros favoritos.</p>
                    )}
                </div>
            </main>
        </div>
    );
};

const estiloPagina = { display: 'flex', padding: '40px', gap: '30px', backgroundColor: '#E0F9EE', minHeight: '100vh', fontFamily: 'sans-serif' };
const estiloContenedorBuscador = { backgroundColor: '#A8CBBF', padding: '15px 40px', borderRadius: '50px', marginBottom: '30px', display: 'flex', justifyContent: 'center' };
const estiloForm = { display: 'flex', width: '100%', maxWidth: '650px', backgroundColor: 'white', borderRadius: '30px', overflow: 'hidden' };
const estiloIcono = { padding: '0 15px', display: 'flex', alignItems: 'center', color: '#888' };
const estiloInput = { flex: 1, border: 'none', padding: '12px 10px', fontSize: '1rem', outline: 'none' };
const estiloBoton = { backgroundColor: '#C88B7D', color: 'white', border: 'none', padding: '0 30px', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' };
const estiloSelect = { padding: '5px 10px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: 'white' };
const estiloGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '25px' };

export default BuscadorLibros;