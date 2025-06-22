//importar los framekworks necesarios parea ejecutar
//la app
const express = require('express');//SW
const mongoose = require('mongoose');//mongo
const bodyParser = require('body-parser');//json
const cors = require('cors');// permitir solicitudes
const bcrypt = require('bcrypt');//encriptar

//crear una instancia de la aplicación express
const app = express();
//Definir el puerto donde se ejecutará el server
const PORT = process.cnv.PORT || 3000; //Usa el puerto que asigna el local 3000


//habilitar cors  para permitir peticiones
app.use(cors());
//sentencia que permite a express entienda el formato json
app.use(bodyParser.json());

//detectar archivos estaticos de la carpeta public
app.use(express.static('public'));

//conexion a mongoDB
//concetarse a veterinaria
mongoose.connect(process.cnv.MONGODB_URI,{   
    useNewUrlParser:true, //usa el parser de url
    useUnifiedTopology:true //motor de monitoreo
   })

   //si la conexion es exitosa, mmuestra mensaje
   .then(() => console.log('CONECTANDO A MONGODB ATLAS'))
    //si hay un error, muestra mensaje
    .catch(err => console.error('ERROR DE CONEXION', err));

    //esquemas y modelos 


// Define el esquema para los usuarios
const UsuarioSchema = new mongoose.Schema({
    nombre: String,     // Nombre del usuario
    email: String,      // Correo electrónico del usuario
    password: String    // Contraseña encriptada del usuario
});

// Crea el modelo Usuario basado en el esquema anterior
const Usuario = mongoose.model('Usuario', UsuarioSchema);

// Define el esquema para los tratamientos
const TratamientoSchema = new mongoose.Schema({
    mascota: String, //Nombre de la Mascota
    tratamiento: String, //Tratamineto de la Mascota
    fechaI: String, //Fecha de Inicio del Tratamiento
    Nveterinario: String, //Nombre del Veterinario
    duracion: String, //Duracion del Tratamiento
    costo: Number //Costo del Tratamiento
});
// Crea el modelo Tratamientos basado en el esquema anterior
const Tratamiento = mongoose.model('Tratamiento', TratamientoSchema);

// Define el Medicinas para los medicinas
const MedicinaSchema = new mongoose.Schema({
    mascota: String,      //Nombre de la Mascota
    medicina: String,    //Medician Resetada
    fechaV: String,    //Fecha de Venta
    precio: Number,   //Precio de la Medicina
    Cvendida: String //Cantidad Vendida
});
// Crea el modelo Medicinas basado en el esquema anterior
const Medicina = mongoose.model('Medicina', MedicinaSchema);

// Define el esquema para las vacunas
const VacunasSchema = new mongoose.Schema({
    mascota: String,
    Tvacuna: String,
    fechaAP: String,
    Pfecha: String,
    precio: Number
});
// Crea el modelo Vacuna basado en el esquema anterior
const Vacunas = mongoose.model('Vacunas', VacunasSchema);

// Define el esquema para las Adopciones
const AdopcionesSchema = new mongoose.Schema({
    mascota: String,        //Nombre de la Mascota
    raza: String,          //Raza de la Mascota
    nombreA: String,      //Nombre del Adoptante
    telefonoA: String,   //Telefono del Adoptante
    fechaA: String      //Fecha de Adopcion
});
// Crea el modelo Vacuna basado en el esquema anterior
const Adopciones = mongoose.model('Adopciones', AdopcionesSchema);

// Define el esquema para las productos
const ProductosSchema = new mongoose.Schema({
    Nproducto: String,
    Tproducto: String,
    Cvendida: String,
    precio: String
});
// Crea el modelo Vacuna basado en el esquema anterior
const Productos = mongoose.model('Productos', ProductosSchema);

// Rutas de autenticación

// Ruta para registrar un nuevo usuario
app.post('/registro', async (req, res) => {
    // Extrae nombre, email y password del cuerpo de la solicitud
    const { nombre, email, password } = req.body;
    // Encripta la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);
    // Crea un nuevo usuario con los datos recibidos y la contraseña encriptada
    const nuevoUsuario = new Usuario({ nombre, email, password: hashedPassword });
    // Guarda el usuario en la base de datos
    await nuevoUsuario.save();
//responde con un mensaje de exito y codigo 201
    res.status(201).send('Uusario registrado');

});

//ruta para iniciar sesion 
app.post('/login',async(req,res) =>{
//extraer email y password del cuerpo de la solicitud
const {email,password} = req.body;
// busca un usuario con el email dado
const usuario = await Usuario.findOne({email});
////si no existe el usario , responde con error
if (!usuario)return res.status(401).send('usuario no encontrado');
//compara la contraseña proporcionada
const valid = await bcrypt.compare(password,usuario.password);
//si la contraseña no es valida responde con error 401
if(!valid) return res.status(401).send('contraseña incorrecta');
//si todo coincide responde con un mensaje de éxito
res.send('bienvenido ' + usuario.nombre);
});

//crud pasteles
//ruta para obtener todos los tratamientos
app.get('/api/tratamientos',async(req,res) =>{
    //busca todos los tratamientos en la BD
    const tratamientos = await Tratamiento.find();
    //devuelve la lista de tratamientos en formato JSON
    res.json(tratamientos);
});


//crear un nuevo tratamientos 
app.post('/api/tratamientos', async (req,res)=>{
    //crea un nuevo tratamientos 
    const nuevo = new Tratamiento(req.body);
    //guarda el tratamiento en la bd
    await nuevo.save();
//responde con un mensaje de exito
res.status(201).send('tratamiento creado');
});
// eliminar un tratamiento por id
app.delete('/api/tratamientos/:id' , async (req,res )=> {
    //elimina el tratamiento cuyo id se recibe
    await Tratamiento.findByIdAndDelete(req.params.id);
    //responde con un mensaje de exito
    res.send('tratamiento eliminado');
});





// Ruta para obtener todos los empleados
app.get('/api/medicinas', async (req, res) => {
    // Busca todos los empleados en la base de datos
    const medicinas = await Medicina.find();
    // Devuelve la lista de empleados en formato JSON
    res.json(medicinas);
});

// Ruta para crear un nuevo empleado
app.post('/api/medicinas', async (req, res) => {
    // Crea un nuevo empleado con los datos recibidos en la solicitud
    const nuevo = new Medicina(req.body);
    // Guarda el empleado en la base de datos
    await nuevo.save();
    // Responde con mensaje de éxito y código 201 (creado)
    res.status(201).send('Medicina agregado');
});

// Ruta para eliminar un empleado por su ID
app.delete('/api/medicinas/:id', async (req, res) => {
    // Elimina el empleado cuyo ID se recibe en la URL
    await Medicina.findByIdAndDelete(req.params.id);
    // Responde con mensaje de éxito
    res.send('Medicina eliminado');
});


// Ruta para obtener todos los pedidos
app.get('/api/vacunas', async (req, res) => {
    // Busca todos los pedidos en la base de datos
    const vacunas = await Vacunas.find();
    // Devuelve la lista de pedidos en formato JSON
    res.json(vacunas);
});

// Ruta para crear un nuevo pedido
app.post('/api/vacunas', async (req, res) => {
    // Crea un nuevo pedido con los datos recibidos en la solicitud
    const nuevo = new Vacunas(req.body);
    // Guarda el pedido en la base de datos
    await nuevo.save();
    // Responde con mensaje de éxito y código 201 (creado)
    res.status(201).send('Vacunas registrado');
});

// Ruta para eliminar un pedido por su ID
app.delete('/api/vacunas/:id', async (req, res) => {
    // Elimina el pedido cuyo ID se recibe en la URL
    await Vacunas.findByIdAndDelete(req.params.id);
    // Responde con mensaje de éxito
    res.send('Vacunas eliminado');
});


// Ruta para obtener todos las Adopciones
app.get('/api/adopciones', async (req, res) => {
    // Busca todos los pedidos en la base de datos
    const adopciones = await Adopciones.find();
    // Devuelve la lista de pedidos en formato JSON
    res.json(adopciones);
});

// Ruta para crear un nuevo pedido
app.post('/api/adopciones', async (req, res) => {
    // Crea un nuevo pedido con los datos recibidos en la solicitud
    const nuevo = new Adopciones(req.body);
    // Guarda el pedido en la base de datos
    await nuevo.save();
    // Responde con mensaje de éxito y código 201 (creado)
    res.status(201).send('Adopciones registrado');
});

// Ruta para eliminar un pedido por su ID
app.delete('/api/adopciones/:id', async (req, res) => {
    // Elimina el pedido cuyo ID se recibe en la URL
    await Adopciones.findByIdAndDelete(req.params.id);
    // Responde con mensaje de éxito
    res.send('Adopciones eliminado');
});


// Ruta para obtener todos los pedidos
app.get('/api/productos', async (req, res) => {
    // Busca todos los pedidos en la base de datos
    const productos = await Productos.find();
    // Devuelve la lista de pedidos en formato JSON
    res.json(productos);
});

// Ruta para crear un nuevo producto
app.post('/api/productos', async (req, res) => {
    // Crea un nuevo pedido con los datos recibidos en la solicitud
    const nuevo = new Productos(req.body);
    // Guarda el pedido en la base de datos
    await nuevo.save();
    // Responde con mensaje de éxito y código 201 (creado)
    res.status(201).send('Producto registrado');
});

// Ruta para eliminar un pedido por su ID
app.delete('/api/productos/:id', async (req, res) => {
    // Elimina el pedido cuyo ID se recibe en la URL
    await Productos.findByIdAndDelete(req.params.id);
    // Responde con mensaje de éxito
    res.send('Productos eliminado');
});

// Iniciar servidor

// Inicia el servidor y lo pone a escuchar en el puerto definido
app.listen(PORT, () => {
    // Muestra en consola la URL donde está corriendo el servidor
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
