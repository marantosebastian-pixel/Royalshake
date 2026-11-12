import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import './App.css'

function App() {
    const [mensajeIA, setMensajeIA] = useState('')
  
  const [cargandoIA, setCargandoIA] = useState(false)
  const [errorIA, setErrorIA] = useState('')
  const [mensajesChat, setMensajesChat] = useState([
  {
    tipo: 'asistente',
    texto: '¡Hola! Soy Royalito, tu asistente virtual de Royalshake. 🥤👑 Estoy aquí para ayudarte a encontrar tu malteada favorita. ¿Qué sabor te gustaría probar?'
  }
])
    const consultarIA = async () => {
    if (!mensajeIA.trim()) return
    const pregunta = mensajeIA.trim()
setMensajeIA('')
    setMensajesChat((prev) => [
  ...prev,
  { tipo: 'usuario', texto: pregunta }
])

    setCargandoIA(true)
    
    setErrorIA('')

    try {
      const { data, error } = await supabase.functions.invoke(
        'Royalshake-ia',
        {
          body: {
  mensaje: pregunta,
  productos: productos
}
        }
      )

      if (error) throw error

      if (data?.error) {
        throw new Error(data.error)
      }

      
setMensajesChat((prev) => [
  ...prev,
  { tipo: 'asistente', texto: data.respuesta }
])
    } catch (error) {
      console.error('Error al consultar la IA:', error)
      setErrorIA('No pudimos responder en este momento. Inténtalo nuevamente.')
    } finally {
      setCargandoIA(false)
    }
  }
  const [administrador, setAdministrador] = useState(false)
  const [contrasena, setContrasena] = useState('')
  const [errorAdmin, setErrorAdmin] = useState('')
  const [sesionAdmin, setSesionAdmin] = useState(false)
  const [emailAdmin, setEmailAdmin] = useState('')
  const [productos, setProductos] = useState([
    
  {
    id: 1,
    nombre: 'Royal Chocolate',
    descripcion: 'Una deliciosa combinación de leche y chocolate.',
    imagen: `${import.meta.env.BASE_URL}imagenes/chocolate.jpeg`,
    precio: 'Precio por definir'
  },
  {
    id: 2,
    nombre: 'Royal Fresa',
    descripcion: 'El dulce sabor de la fresa en una malteada cremosa.',
    imagen: `${import.meta.env.BASE_URL}imagenes/fresa.jpeg`,
    precio: 'Precio por definir'
  },
  {
    id: 3,
    nombre: 'Royal Oreo',
    descripcion: 'Una mezcla de galletas y crema que te encantará.',
    imagen: `${import.meta.env.BASE_URL}imagenes/oreo.jpeg`,
    precio: 'Precio por definir'
  },
  {
    id: 4,
    nombre: 'Royal Vainilla',
    descripcion: 'El sabor clásico de la vainilla con textura cremosa.',
    imagen: `${import.meta.env.BASE_URL}imagenes/vainilla.jpeg`,
    precio: 'Precio por definir'
  }
])
useEffect(() => {
  cargarProductos()
}, [])
const [nuevoNombre, setNuevoNombre] = useState('')
const [nuevaDescripcion, setNuevaDescripcion] = useState('')
const [nuevaImagen, setNuevaImagen] = useState('/imagenes/chocolate.jpeg')
const [nuevoPrecio, setNuevoPrecio] = useState('')
const [editandoId, setEditandoId] = useState(null)
async function cargarProductos() {
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .order('id', { ascending: true })

  if (error) {
    console.error('Error al cargar productos:', error.message)
    return
  }

  setProductos(data || [])
}
async function actualizarEstadoPedido(id, nuevoEstado) {
  const { error } = await supabase
    .from('pedidos')
    .update({ estado: nuevoEstado })
    .eq('id', id)

  if (error) {
    console.error('Error al actualizar estado:', error.message)
    alert('No se pudo actualizar el estado')
    return
  }

  await cargarPedidos()
}
async function agregarProducto(e) {
  e.preventDefault()

  const { error } = await supabase
    .from('productos')
    .insert([
      {
        nombre: nuevoNombre,
        descripcion: nuevaDescripcion,
        imagen: nuevaImagen,
        precio: nuevoPrecio
      }
    ])

  if (error) {
    console.error('Error al agregar producto:', error.message)
    alert('No se pudo agregar la malteada')
    return
  }

  setNuevoNombre('')
  setNuevaDescripcion('')
  setNuevaImagen('/imagenes/chocolate.jpeg')
  setNuevoPrecio('')

  await cargarProductos()
  alert('Malteada agregada correctamente')
}

async function eliminarProducto(id) {
  const confirmar = window.confirm(
    '¿Estás seguro de que deseas eliminar esta malteada?'
  )

  if (!confirmar) return

  const { error } = await supabase
    .from('productos')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error al eliminar producto:', error.message)
    alert('No se pudo eliminar la malteada')
    return
  }

  await cargarProductos()
  alert('Malteada eliminada correctamente')
}

function iniciarEdicion(producto) {
  setEditandoId(producto.id)
  setNuevoNombre(producto.nombre)
  setNuevaDescripcion(producto.descripcion || '')
  setNuevaImagen(producto.imagen || '/imagenes/chocolate.jpeg')
  setNuevoPrecio(producto.precio || '')
}

async function guardarEdicion(e) {
  e.preventDefault()

  const { error } = await supabase
    .from('productos')
    .update({
      nombre: nuevoNombre,
      descripcion: nuevaDescripcion,
      imagen: nuevaImagen,
      precio: nuevoPrecio
    })
    .eq('id', editandoId)

  if (error) {
    console.error('Error al editar producto:', error.message)
    alert('No se pudo actualizar la malteada')
    return
  }

  setEditandoId(null)
  setNuevoNombre('')
  setNuevaDescripcion('')
  setNuevaImagen('/imagenes/chocolate.jpeg')
  setNuevoPrecio('')

  await cargarProductos()
  alert('Malteada actualizada correctamente')
}

async function cargarPedidos() {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*')
    .order('fecha', { ascending: false })

  if (error) {
    console.error('Error al cargar pedidos:', error.message)
    setErrorAdmin('No se pudieron cargar los pedidos')
    return
  }

  setPedidos(data || [])
}
const [pedidos, setPedidos] = useState(() => {
  const pedidosGuardados = localStorage.getItem('pedidosRoyalshake')

  return pedidosGuardados ? JSON.parse(pedidosGuardados) : []
})
useEffect(() => {
  if (sesionAdmin) {
    cargarPedidos()
  }
}, [sesionAdmin])
  // FUNCIÓN PARA INGRESAR COMO ADMINISTRADOR
  async function ingresarAdmin(event) {
  event.preventDefault()

  const { error } = await supabase.auth.signInWithPassword({
    email: emailAdmin,
    password: contrasena
  })

  if (error) {
    setErrorAdmin('Correo o contraseña incorrectos')
  } else {
    setSesionAdmin(true)
    setAdministrador(false)
    setContrasena('')
    setErrorAdmin('')
  }
}

  // FUNCIÓN PARA ENVIAR PEDIDOS POR WHATSAPP
 async function manejarPedido(event) {
  event.preventDefault()

  const datos = new FormData(event.target)

  const nombre = datos.get('nombre')
  const telefono = datos.get('telefono')
  const malteada = datos.get('malteada')
  const cantidad = datos.get('cantidad')
  const detalles = datos.get('detalles')

 

  const ventanaWhatsApp = window.open('', '_blank')

  const { error } = await supabase
    .from('pedidos')
    .insert([
      {
        nombre,
        telefono,
        malteada,
        cantidad: Number(cantidad),
        detalles
      }
    ])

  if (error) {
    alert('No se pudo guardar el pedido: ' + error.message)
    if (ventanaWhatsApp) ventanaWhatsApp.close()
    return
  }

  

  const mensaje = `¡Hola Royalshake! Quiero realizar un pedido.

Nombre: ${nombre}
Teléfono: ${telefono}
Malteada: ${malteada}
Cantidad: ${cantidad}
Detalles: ${detalles || 'Sin detalles adicionales'}`

  const numero = '573234951382'

  const enlace = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`

  if (ventanaWhatsApp) {
    ventanaWhatsApp.location.href = enlace
  }
}

  // FUNCIÓN PARA CERRAR SESIÓN
  async function cerrarSesionAdmin() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Error al cerrar sesión:', error.message)
    return
  }

  setSesionAdmin(false)
  setEmailAdmin('')
  setContrasena('')
}

  // PANEL DE ADMINISTRACIÓN
  if (sesionAdmin) {
    return (
      <main className="panel-admin">

        <header className="admin-header">
          <div>
            <p>ROYALSHAKE</p>
            <h1>Panel de administración</h1>
            <span>Bienvenido a la gestión de tu negocio.</span>
          </div>

          <button onClick={cerrarSesionAdmin}>
            Cerrar sesión
          </button>
        </header>

        <section className="admin-resumen">
          <article>
            <h3>Productos</h3>
           <p>{productos.length} malteadas registradas</p>
          </article>

          <article>
            <h3>Pedidos</h3>
            <p>Gestión de pedidos próximamente</p>
          </article><article>
  <h3>Pedidos</h3>
  <p>{pedidos.length} pedidos recibidos</p>
</article>
        </section>
<section className="admin-pedidos">
  <h2>Pedidos recibidos</h2>

  {pedidos.length === 0 ? (
    <p>Todavía no hay pedidos registrados.</p>
  ) : (
    pedidos.map((pedido) => (
      <article key={pedido.id}>
        <h3>{pedido.nombre}</h3>
        <p>Teléfono: {pedido.telefono}</p>
        <p>Malteada: {pedido.malteada}</p>
        <p>Cantidad: {pedido.cantidad}</p>
        <p>Detalles: {pedido.detalles || 'Sin detalles adicionales'}</p>
        <p>Fecha: {pedido.fecha}</p>
        <p>Estado: {pedido.estado}</p>

<select
  value={pedido.estado || 'Pendiente'}
  onChange={(e) =>
    actualizarEstadoPedido(pedido.id, e.target.value)
  }
>
  <option value="Pendiente">Pendiente</option>
  <option value="En preparación">En preparación</option>
  <option value="Entregado">Entregado</option>
</select>
      </article>
    ))
  )}
</section>
        
          <section className="admin-productos">
  <h2>Catálogo de productos</h2>

  <form onSubmit={editandoId ? guardarEdicion : agregarProducto}>
    <input
      type="text"
      placeholder="Nombre de la malteada"
      value={nuevoNombre}
      onChange={(e) => setNuevoNombre(e.target.value)}
      required
    />

    <textarea
      placeholder="Descripción"
      value={nuevaDescripcion}
      onChange={(e) => setNuevaDescripcion(e.target.value)}
    />

    <select
      value={nuevaImagen}
      onChange={(e) => setNuevaImagen(e.target.value)}
    >
      <option value={`${import.meta.env.BASE_URL}imagenes/chocolate.jpeg`}>Chocolate</option>
<option value={`${import.meta.env.BASE_URL}imagenes/fresa.jpeg`}>Fresa</option>
<option value={`${import.meta.env.BASE_URL}imagenes/oreo.jpeg`}>Oreo</option>
<option value={`${import.meta.env.BASE_URL}imagenes/vainilla.jpeg`}>Vainilla</option>
    </select>

    <input
      type="text"
      placeholder="Precio"
      value={nuevoPrecio}
      onChange={(e) => setNuevoPrecio(e.target.value)}
    />

    <button type="submit">
      {editandoId ? 'Guardar cambios' : 'Agregar malteada'}
    </button>
  </form>

  {productos.map((producto) => (
    <div key={producto.id}>
      <h3>{producto.nombre}</h3>
      <p>{producto.descripcion}</p>
      <p>{producto.precio}</p>

      <button type="button" onClick={() => iniciarEdicion(producto)}>
        Editar
      </button>

      <button type="button" onClick={() => eliminarProducto(producto.id)}>
        Eliminar
      </button>
    </div>
  ))}
</section>

        

      </main>
    )
  }

  // PÁGINA PRINCIPAL
  return (
    <main>

      {administrador && (
        <section className="panel-admin">
          <h2>Acceso de administrador</h2>

          <form onSubmit={ingresarAdmin}>
            <input
  type="email"
  placeholder="Correo electrónico"
  value={emailAdmin}
  onChange={(e) => setEmailAdmin(e.target.value)}
  required
/>
            <input
              type="password"
              placeholder="Contraseña de administrador"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />

            <button type="submit">
              Ingresar
            </button>

            <button
              type="button"
              onClick={() => setAdministrador(false)}
            >
              Cerrar
            </button>
          </form>

          <p>{errorAdmin}</p>
        </section>
      )}

      <header className="navbar">
        <h2>ROYALSHAKE</h2>

        <nav>
          <a href="#inicio">Inicio</a>
          <a href="#productos">Productos</a>
          <a href="#contacto">Contacto</a>

          <button
            className="admin-link"
            onClick={() => setAdministrador(true)}
          >
            Administrador
          </button>
        </nav>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-content">
          <p className="subtitle">EL PLACER DE UN BUEN BATIDO</p>

          <h1>El sabor que merece la realeza</h1>

          <p>
            Descubre una experiencia deliciosa con nuestros
            malteados preparados especialmente para ti.
          </p>

          <a href="#productos" className="btn">
            Ver nuestros productos
          </a>
        </div>
      </section>

      <section className="productos" id="productos">
        <p className="productos-subtitle">NUESTRA SELECCIÓN</p>

        <h2>Malteadas de la casa</h2>

        <p className="productos-intro">
          Descubre sabores irresistibles preparados para disfrutar.
        </p>

        <div className="productos-grid">
  {productos.map((producto) => (
    <article className="producto-card" key={producto.id}>
      <div className="producto-imagen">
        <img src={producto.imagen} alt={producto.nombre} />
      </div>

      <div className="producto-info">
        <h3>{producto.nombre}</h3>
        <p>{producto.descripcion}</p>
        <span>{producto.precio}</span>
      </div>
    </article>
  ))}
</div>

</section>

<section className="asistente-ia" id="asistente-ia">
  <div className="chat-encabezado">
  <div className="chat-avatar">
  <img src={`${import.meta.env.BASE_URL}royalito.jpeg`} alt="Royalito, asistente virtual de Royalshake" />
</div>

  <div>
    <h3>Royalito</h3>
    <p>Asistente virtual · En línea</p>
  </div>
</div>
  <p className="productos-subtitle">ASISTENTE VIRTUAL</p>

  <h2>¿No sabes qué malteada elegir?</h2>

  <p>¡Pregúntale a nuestro asistente y descubre tu próximo sabor favorito!</p>

  <div className="asistente-contenedor">
    <input
      type="text"
      placeholder="Ejemplo: ¿Qué malteada me recomiendas?"
      value={mensajeIA}
      onChange={(e) => setMensajeIA(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') consultarIA()
      }}
    />

    <button
  onClick={consultarIA}
  disabled={cargandoIA || !mensajeIA.trim()}
>
      {cargandoIA ? 'Consultando...' : 'Consultar'}
    </button>
  </div>

  <div className="chat-mensajes">
  {mensajesChat.map((mensaje, index) => (
    <div
      key={index}
      className={`mensaje-chat ${mensaje.tipo}`}
    >
      {mensaje.tipo === 'asistente' && (
        <img
          src={`${import.meta.env.BASE_URL}royalito.jpeg`}
          alt="Royalito"
          className="avatar-mensaje"
        />
      )}

      <p>{mensaje.texto}</p>
    </div>
  ))}
</div>

{cargandoIA && (
  <div className="mensaje-chat asistente">
    <p>Royalito está escribiendo... 🥤</p>
  </div>
)}

  

  {errorIA && <p>{errorIA}</p>}
</section>

<section className="contacto" id="contacto">

        <p className="productos-subtitle">HAZ TU PEDIDO</p>

        <h2>¿Se te antojó una malteada?</h2>

        <p>Completa tus datos y cuéntanos qué deseas disfrutar.</p>

        <form onSubmit={manejarPedido}>
          <label>Tu nombre</label>

          <input
            type="text"
            name="nombre"
            placeholder="Escribe tu nombre"
            required
          />

          <label>Tu teléfono</label>

          <input
            type="tel"
            minLength={10}
            name="telefono"
            placeholder="Tu número de contacto"
            required
          />

          <label>Elige tu malteada</label>

          <select name="malteada" required defaultValue="">
  <option value="" disabled>Selecciona un sabor</option>

  {productos.map((producto) => (
    <option key={producto.id} value={producto.nombre}>
      {producto.nombre}
    </option>
  ))}
</select>

          <label>Cantidad</label>

          <input
            type="number"
            name="cantidad"
            min="1"
            defaultValue="1"
            required
          />

          <label>Detalles adicionales</label>

          <textarea
            name="detalles"
            placeholder="Escribe aquí tus indicaciones"
          />

          <button type="submit" className="btn">
            Enviar pedido
          </button>
        </form>
      </section>

      <footer>
        <p>ROYALSHAKE © 2026 - El sabor de la realeza</p>
      </footer>

    </main>
  )
}

export default App