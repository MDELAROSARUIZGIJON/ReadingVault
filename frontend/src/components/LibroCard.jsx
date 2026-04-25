const LibroCard = ({ libro }) => {
    return (
        <div 
            style={estiloCard}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
            <div style={estiloContenedorImagen}>
                <img 
                    src={libro.portada || 'https://via.placeholder.com/100x150?text=Sin+Portada'} 
                    alt={libro.titulo} 
                    style={estiloImagen} 
                />
            </div>
            <div style={estiloEstrellas}>★★★★☆</div>
            <h4 style={estiloTituloLibro}>{libro.titulo}</h4>
            <p style={estiloAutorLibro}>{libro.autor}</p>
            
            {/* Aquí podrías añadir un botón de "Añadir" más adelante */}
        </div>
    );
};

// --- ESTILOS ---
const estiloCard = { 
    backgroundColor: '#A8CBBF', 
    padding: '15px', 
    borderRadius: '15px', 
    textAlign: 'center', 
    transition: '0.3s', 
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
};

const estiloContenedorImagen = { 
    backgroundColor: 'white', 
    padding: '15px', 
    borderRadius: '10px', 
    marginBottom: '10px', 
    display: 'flex', 
    justifyContent: 'center' 
};

const estiloImagen = { width: '100%', height: '180px', objectFit: 'contain' };
const estiloEstrellas = { color: '#FFCC66', marginBottom: '5px', fontSize: '1.1rem' };
const estiloTituloLibro = { fontSize: '0.95rem', margin: '5px 0', fontWeight: 'bold', color: '#333' };
const estiloAutorLibro = { fontSize: '0.85rem', color: '#555' };

export default LibroCard;