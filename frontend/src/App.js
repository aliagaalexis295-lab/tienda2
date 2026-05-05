import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './Login';

function App() {
  // ========== ESTADOS ==========
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [carritoVentas, setCarritoVentas] = useState([]);
  const [ventas, setVentas] = useState([]);

  const [formProd, setFormProd] = useState({ id: '', nombre: '', precio: '', stock: '', categoria: '', descripcion: '' });
  const [editandoProd, setEditandoProd] = useState(false);

  const [formProv, setFormProv] = useState({ 
    id: '', nombre_empresa: '', nombre_contacto: '', telefono: '', email: '', marca_distribuidora: '' 
  });
  const [editandoProv, setEditandoProv] = useState(false);

  const [vProdId, setVProdId] = useState('');
  const [vCant, setVCant] = useState('');
  const [vVendedor, setVVendedor] = useState('');

  // ========== APIs ==========
  const API_PROD = 'http://localhost:3000/api/productos';
  const API_PROV = 'http://localhost:3000/api/proveedores';
  const API_VENTAS = 'http://localhost:3000/api/ventas';

  // ========== EFECTOS ==========
  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');
    if (token && usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    if (usuario) {
      cargarProductos();
      cargarProveedores();
      cargarVentas();
    }
  }, [usuario]);

  // ========== FUNCIONES AUXILIARES ==========
  const handleLoginExitoso = (usuarioData) => {
    setUsuario(usuarioData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  // ========== PRODUCTOS ==========
  async function cargarProductos() {
    try {
      const res = await fetch(API_PROD);
      const data = await res.json();
      setProductos(data);
    } catch (e) {
      console.error('Error cargando productos:', e);
    }
  }

  function prepEditProd(p) {
    setEditandoProd(true);
    setFormProd({ id: p.id, nombre: p.nombre, precio: p.precio, stock: p.stock, categoria: p.categoria, descripcion: p.descripcion || '' });
  }

  async function submitFormProd(e) {
    e.preventDefault();
    const data = { nombre: formProd.nombre, precio: formProd.precio, stock: formProd.stock, categoria: formProd.categoria, descripcion: formProd.descripcion };
    await fetch(editandoProd ? `${API_PROD}/${formProd.id}` : API_PROD, {
      method: editandoProd ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    resetFormProd();
    cargarProductos();
  }

  function resetFormProd() {
    setEditandoProd(false);
    setFormProd({ id: '', nombre: '', precio: '', stock: '', categoria: '', descripcion: '' });
  }

  async function eliminarProd(id) {
    if (window.confirm('¿Eliminar producto?')) {
      await fetch(`${API_PROD}/${id}`, { method: 'DELETE' });
      cargarProductos();
    }
  }

  // ========== PROVEEDORES ==========
  async function cargarProveedores() {
    try {
      const res = await fetch(API_PROV);
      const data = await res.json();
      setProveedores(data);
    } catch (e) {
      console.error('Error cargando proveedores:', e);
    }
  }

  function prepEditProv(p) {
    setEditandoProv(true);
    setFormProv(p);
  }

  async function submitFormProv(e) {
    e.preventDefault();
    const data = { 
      nombre_empresa: formProv.nombre_empresa, 
      nombre_contacto: formProv.nombre_contacto, 
      telefono: formProv.telefono, 
      email: formProv.email, 
      marca_distribuidora: formProv.marca_distribuidora 
    };
    await fetch(editandoProv ? `${API_PROV}/${formProv.id}` : API_PROV, {
      method: editandoProv ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    resetFormProv();
    cargarProveedores();
  }

  function resetFormProv() {
    setEditandoProv(false);
    setFormProv({ id: '', nombre_empresa: '', nombre_contacto: '', telefono: '', email: '', marca_distribuidora: '' });
  }

  async function eliminarProv(id) {
    if (window.confirm('¿Eliminar proveedor?')) {
      await fetch(`${API_PROV}/${id}`, { method: 'DELETE' });
      cargarProveedores();
    }
  }

  // ========== VENTAS ==========
  async function cargarVentas() {
    try {
      const res = await fetch(API_VENTAS);
      const data = await res.json();
      setVentas(data);
    } catch (e) {
      console.error('Error cargando ventas:', e);
    }
  }

  // ----- VENTAS -----
  function agregarAlCarrito(e) {
    e.preventDefault();
    const id = Number(vProdId);
    const cant = Number(vCant);
    if (cant <= 0) return alert('Cantidad inválida');
    setCarritoVentas([...carritoVentas, { productoId: id, cantidad: cant }]);
    setVProdId('');
    setVCant('');
  }

  function quitarCarrito(index) {
    setCarritoVentas(carritoVentas.filter((_, i) => i !== index));
  }

  async function completarVentaMasiva() {
    if (carritoVentas.length === 0 || !vVendedor.trim()) return alert('Faltan datos o carrito vacío');
    try {
      const resProd = await fetch(API_PROD);
      const productos = await resProd.json();
      for (let v of carritoVentas) {
        const productoInfo = productos.find(p => p.id === v.productoId);
        if (!productoInfo) throw new Error(`Producto ID ${v.productoId} no encontrado`);
        const montoTotal = v.cantidad * productoInfo.precio;
        await fetch(API_VENTAS, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            producto_id: v.productoId, 
            cantidad_vendida: v.cantidad, 
            vendedor_nombre: vVendedor,
            monto_total: montoTotal
          })
        });
      }
      alert('✅ Venta completada y guardada correctamente');
      setCarritoVentas([]);
      setVVendedor('');
      cargarProductos();
      cargarVentas();
    } catch (e) {
      alert('❌ Error: ' + e.message);
    }
  }
  async function eliminarVenta(id) {
    if (window.confirm('¿Deseas eliminar este registro de venta?')) {
      try {
        await fetch(`${API_VENTAS}/${id}`, { method: 'DELETE' });
        cargarVentas();
      } catch (error) {
        alert("No se pudo eliminar la venta");
      }
    }
  }

  // ========== RENDERIZADO ==========
  if (cargando) {
    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px'}}>Cargando...</div>;
  }

  if (!usuario) {
    return <Login onLoginExitoso={handleLoginExitoso} />;
  }

  return (
    <div>
      <div className="container">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
          <h1>💻"Tecno Mundo Ulices"</h1>
          <div style={{textAlign: 'right'}}>
            <p style={{margin: '0 0 10px 0', fontSize: '14px', color: '#666'}}>Bienvenido, <strong>{usuario?.nombre || usuario?.email}</strong></p>
            <button onClick={handleLogout} style={{
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>

        <div className="grid">
          {/* FORMULARIO PRODUCTOS */}
          <div className="card">
            <h2 id="tituloProd">{editandoProd ? '✏️ Editando: ' + formProd.nombre : '📦 Gestionar Producto'}</h2>
            <form onSubmit={submitFormProd}>
              <input type="text" placeholder="Nombre del Producto" value={formProd.nombre} 
                onChange={(e) => setFormProd({...formProd, nombre: e.target.value})} required />
              <input type="number" placeholder="Precio " step="0.01" value={formProd.precio}
                onChange={(e) => setFormProd({...formProd, precio: e.target.value})} required />
              <input type="number" placeholder="Stock Inicial" value={formProd.stock}
                onChange={(e) => setFormProd({...formProd, stock: e.target.value})} required />
              <input type="text" placeholder="Categoría" value={formProd.categoria}
                onChange={(e) => setFormProd({...formProd, categoria: e.target.value})} />
              <textarea placeholder="Descripción del Producto" value={formProd.descripcion}
                onChange={(e) => setFormProd({...formProd, descripcion: e.target.value})}
                style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontFamily: 'inherit', fontSize: '14px', minHeight: '80px', boxSizing: 'border-box'}} />
              <button type="submit" className="btn-save">Guardar Producto</button>
              {editandoProd && (
                <button type="button" onClick={resetFormProd} className="btn-cancel">Cancelar</button>
              )}
            </form>
          </div>

          {/* FORMULARIO PROVEEDORES */}
          <div className="card">
            <h2>{editandoProv ? '✏️ Editando Proveedor' : '🚚 Gestionar Proveedor'}</h2>
            <form onSubmit={submitFormProv}>
              <input type="text" placeholder="Nombre de la Empresa" value={formProv.nombre_empresa}
                onChange={(e) => setFormProv({...formProv, nombre_empresa: e.target.value})} required />
              <input type="text" placeholder="Nombre del Contacto" value={formProv.nombre_contacto}
                onChange={(e) => setFormProv({...formProv, nombre_contacto: e.target.value})} />
              <input type="text" placeholder="Teléfono / WhatsApp" value={formProv.telefono}
                onChange={(e) => setFormProv({...formProv, telefono: e.target.value})} />
              <input type="email" placeholder="Correo Electrónico" value={formProv.email}
                onChange={(e) => setFormProv({...formProv, email: e.target.value})} />
              <input type="text" placeholder="Marca que distribuye" value={formProv.marca_distribuidora}
                onChange={(e) => setFormProv({...formProv, marca_distribuidora: e.target.value})} />
              <button type="submit" className="btn-save">Guardar Proveedor</button>
              {editandoProv && (
                <button type="button" onClick={resetFormProv} className="btn-cancel">Cancelar</button>
              )}
            </form>
          </div>

          {/* CARRITO DE VENTAS */}
          <div className="card">
            <h2> Ventas</h2>
            <form onSubmit={agregarAlCarrito}>
              <input type="number" placeholder="ID del Producto" value={vProdId}
                onChange={(e) => setVProdId(e.target.value)} required />
              <input type="number" placeholder="Cantidad" value={vCant}
                onChange={(e) => setVCant(e.target.value)} required />
              <button type="submit" style={{backgroundColor: '#f39c12'}}>Agregar venta</button>
            </form>
            
            <table>
              <thead>
                <tr style={{backgroundColor: '#eee'}}>
                  <th>ID</th><th>Cant</th><th>Quitar</th>
                </tr>
              </thead>
              <tbody>
                {carritoVentas.map((item, index) => (
                  <tr key={index}>
                    <td>{item.productoId}</td><td>{item.cantidad}</td>
                    <td><button onClick={() => quitarCarrito(index)} style={{background:'red', color:'white', border:'none', padding:'2px 5px', width:'auto', cursor:'pointer'}}>X</button></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <input type="text" placeholder="Nombre del Vendedor" value={vVendedor}
              onChange={(e) => setVVendedor(e.target.value)} style={{marginTop:'10px'}} />
            <button onClick={completarVentaMasiva} style={{backgroundColor: '#16a085', marginTop: '10px'}}>
               Procesar Toda la Venta
            </button>
          </div>
        </div>

        <h2>📊 Inventario de Productos</h2>
        <table>
          <thead>
            <tr><th>ID</th><th>Producto</th><th>Descripción</th><th>Precio</th><th>Stock</th><th>Categoría</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {productos.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td><td>{p.nombre}</td><td style={{fontSize: '12px', color: '#666', maxWidth: '200px'}}>{(p.descripcion || '-').substring(0, 60)}{p.descripcion && p.descripcion.length > 60 ? '...' : ''}</td><td>{p.precio}</td>
                <td><span className="badge-stock">{p.stock}</span></td><td>{p.categoria || '-'}</td>
                <td>
                  <button className="btn-edit" onClick={() => prepEditProd(p)}>✏️</button>
                  <button className="btn-delete" onClick={() => eliminarProd(p.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 style={{marginTop:'40px'}}>🚚 Directorio de Proveedores</h2>
        <table>
          <thead>
            <tr><th>ID</th><th>Empresa</th><th>Contacto</th><th>Teléfono</th><th>Email</th><th>Marca</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {proveedores.map(pv => (
              <tr key={pv.id}>
                <td>{pv.id}</td><td><b>{pv.nombre_empresa}</b></td>
                <td>{pv.nombre_contacto || '-'}</td><td>{pv.telefono || '-'}</td>
                <td>{pv.email || '-'}</td><td>{pv.marca_distribuidora || '-'}</td>
                <td>
                  <button className="btn-edit" onClick={() => prepEditProv(pv)}>✏️</button>
                  <button className="btn-delete" onClick={() => eliminarProv(pv.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    <h2 style={{ marginTop: '40px' }}>💰 Historial de Ventas Realizadas</h2>
<table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Monto Total</th>
            <th>Vendedor</th>
            <th>Fecha y Hora</th>
            <th>Acciones</th>
        </tr>
    </thead>
    <tbody>
        {ventas.map(v => (
            <tr key={v.id}>
                <td>{v.id}</td>
                {/* Mostramos el nombre del producto si existe el include, si no, el ID */}
                <td><b>{v.Producto ? v.Producto.nombre : `Producto ${v.producto_id}`}</b></td>
                <td>{v.cantidad_vendida}</td>
                <td style={{ color: '#27ae60', fontWeight: 'bold' }}>{v.monto_total}</td>
                <td>{v.vendedor_nombre || '-'}</td>
                <td>{new Date(v.createdAt).toLocaleString()}</td>
                <td>
                    {/* Botón para eliminar venta si te equivocas */}
                    <button className="btn-delete" onClick={() => eliminarVenta(v.id)}>🗑️</button>
                </td>
            </tr>
        ))}
    </tbody>
</table>
      </div>    
    </div>
  );
}
export default App;
