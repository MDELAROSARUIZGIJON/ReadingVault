const SidebarGeneros = ({ tusGeneros, todosLosGeneros }) => {
    return (
        <aside style={estiloSidebar}>
            <h3 style={estiloTituloSeccion}>Tus géneros</h3>
            <div style={estiloLinea} />
            <ul style={estiloLista}>
                {tusGeneros.map(g => <li key={g} style={estiloItem}>{g}</li>)}
            </ul>

            <h3 style={{...estiloTituloSeccion, marginTop: '20px'}}>Todos los géneros</h3>
            <div style={estiloLinea} />
            <ul style={estiloLista}>
                {todosLosGeneros.map(g => <li key={g} style={estiloItem}>{g}</li>)}
            </ul>
        </aside>
    );
};

const estiloSidebar = { width: '220px', backgroundColor: '#A8CBBF', padding: '20px', borderRadius: '15px', color: '#444', height: 'fit-content' };
const estiloTituloSeccion = { fontSize: '1.1rem', marginBottom: '5px', textAlign: 'center' };
const estiloLinea = { height: '1px', backgroundColor: '#888', marginBottom: '10px' };
const estiloLista = { listStyle: 'none', padding: 0, margin: 0, textAlign: 'center' };
const estiloItem = { padding: '5px 0', fontSize: '0.9rem', cursor: 'pointer' };

export default SidebarGeneros;