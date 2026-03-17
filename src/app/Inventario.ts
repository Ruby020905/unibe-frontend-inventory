import { ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Medicamento } from './Medicamento';
import { MedicamentoService } from './MedicamentoService';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AlertaCaducidad } from './AlertaCaducidad';
import { Router } from '@angular/router';
// 1. IMPORTANTE: Debes instalarlo con: npm install sweetalert2
import Swal from 'sweetalert2'; 
import { Observable } from 'rxjs';
import { LoginService } from './LoginService';
import id from '@angular/common/locales/id';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './inventario.html'
})
export class Inventario implements OnInit ,AfterViewInit{


@ViewChild('cantidadInput') cantidadField!: ElementRef; 
mostrarFormularioRegistro: boolean = false;
  resaltarCantidad: boolean = false;
nombreDeArchivo: string = '';
  confirmandoEdicion: boolean = false;
  mostrarToast: boolean = false;
mensajeToast: string = '';
tipoToast: 'success' | 'error' | 'info' = 'success';
vistaActual: 'resumen' | 'tabla' = 'resumen';
mostrarModalEliminar: boolean = false;
medicamentoAEliminar: any = null;
usuarioActivo: any = { username: '', rol: '' }; 
 medicamentos: any[] = [];
  mostrarModal = false;
  filtroActual: 'todos' | 'vencidos' | 'proximos' = 'todos';
  terminoBusqueda: string = '';
  nombresFiltrados: string[] = [];
  filtroNombre: string = '';
  paginaActual: number = 1;
  itemsPorPagina: number = 10;
  alertas: AlertaCaducidad = {
    vencidos: 0,
    proximos: 0
  };
  imagenExpandida: string | null = null;
mostrarRegistroModal: boolean = false;
nuevoUsuario = { username: '', password: '', rol: 'LECTOR' };
usuarios: any[] = [];
mostrarEdicionModal: boolean = false;
usuarioEditando: any = {}
limiteUsuarios: number = 10; // Puedes cambiar el número aquí
limiteAdmins: number = 3;
  nuevo: Medicamento = {
    nombre: '',
    tipo: '',
    presentacion: '',
    unidad: '',
    cantidad: 1,
    imagen: '',
    fechaIngreso: '',
    fechaSalida: '',
    fechaCaducidad: ''
  };

  // Listas de selección
  nombresMedicamentos: string[] = ['Paracetamol', 'Ibuprofeno', 'Amoxicilina', 'Alcohol', 'Gasas', 'Jeringas', 'Augmentin', 'Ampibex', 'Analgan 1 G', 'Buprexflash 600mg', 'Clotrimazol 1%', 'Diclofenaco 75mg/3ml', 'Oftalmogenta', 'Enalapril 10mg', 'Islamint', 'Loratadina 10mg', 'Metoclox', 'Dolgenal 20mg', 'Rubexal', 'Sertal Compuesto', 'Tiocolchicósido 4mg', 'Trio-Val', 'Hirudoid', 'Gynoblen -D', 'Gynoblen', 'Nofertyl', 'Dixi.Suave', 'Dixi-35', 'Tace', 'Bellaface', 'Vagicort', 'Valeriana', 'Ondasetron 2mg/Ml', 'Ketorolaco 30mg/Ml', 'Doloneurobion Dc', 'Neurotropas 2500ug', 'Hidrocortisona 500mg', 'Agua Estéril 5ml', 'Digesflat', 'Buscapina Duo', 'Diarex', 'Protecxin', 'Meloxicam 15mg', 'Diclofenaco Sodico 50mg', 'Donixin 126mg', 'Omeprazol 40mg', 'Apyral 1 Gramo', 'Aspirina Advanced', 'Bc2b Esporas De Bacilus', 'Suero Oral', 'Silvadin (Sulfadiazina De Plata)', 'Bladuril 200mg', 'Alivol 135mg', 'Metoclopramida', 'Leukoplast 5cm X 4.5m', 'Leukoplast Microporo', 'Algodón', 'Agujas Hipodermicas', 'Gasas Estériles', 'Alcohol Antiséptico 70%', 'Bajalenguas', 'Bisturí', 'Jeringuillas 10ml', 'Jeringuillas 5ml', 'Jeringuillas 3ml', 'Jeringuillas 1ml', 'Tiras Reactivas', 'Lancetas', 'Suero Fisiológico 120ml', 'Venda Elástica', 'Venda De Gasa', 'Cureband', 'Equipo De Venoclisis', 'Mascarillas', 'Sutura Nylon 3,0', 'Sutura Nylon 5,0', 'Ferula De Aluminio', 'Guantes Estériles', 'Guantes De Examinación', 'Toallas Higienicas', 'Nucast Gasas Parafina', 'Cloruro De Sodio 0.9% 100ml', 'Cloruro De Sodio 0.9% 250ml', 'Cloruro De Sodio 0.9% 500ml', 'Set Para Toma De Muestras De Papanicolau', 'Lysol 370ml', 'Cabestrillo', 'Canula De Guedel 7cm', 'Canula De Guedel 8cm', 'Canula De Guedel 9cm', 'Canula De Guedel 10cm'];
  tiposMedicamentos: string[] = ['ANTIBIÓTICO', 'ANTIPIRÉTICO / ANALGÉSICO', 'ANALGÉSICO', 'ANTIFUNGICO', 'ANTIBIÓTICO OCULAR', 'ANTIHIPERTENSIVO', 'ANTIHISTAMINICO', 'ANTIHEMÉTICO', 'ANALGESICO - ANTIINFLAMATORIO TÓPICO', 'ANTIESPASMODICO', 'ANTIGRIPAL', 'ANTIINFLAMATORIO - ANALGÉSICO', 'ANTICONCEPTIVO', 'MEDICAMENTO NATURAL', 'CORTICOIDE', 'ANTIFLATULENTO', 'ANTIDIARREICO', 'ANTIMIGRAÑOSO - ANALGÉSICO', 'PROTECTOR GÁSTRICO', 'PROBIÓTICO', 'SOLUCION DE REHIDRATACIÓN', 'ANTIBIÓTICO TÓPICO', 'ANTIESPASMODICO URINARIO'];
  presentacionesMedicamentos: string[] = ['TABLETAS', 'CÁPSULAS', 'CREMA 450G', 'SOLUCION INYECTABLE', 'SOLUCIÓN OFTÁLMICA', 'CREMA 30G', 'GEL', 'FRASCO', 'SUSPENSION ORAL', 'SOBRES', 'CREMA'];
  unidades: string[] = ['UNIDAD', 'CAJAS'];

  // Copia esto debajo de tus otras listas (nombresMedicamentos, etc.)
readonly CATALOGO_MAESTRO: { [key: string]: { tipo: string, presentacion: string, unidad: string } } = {
  // ANALGÉSICOS Y ANTIINFLAMATORIOS
  'Paracetamol': { tipo: 'ANTIPIRÉTICO / ANALGÉSICO', presentacion: 'TABLETAS', unidad: 'CAJAS' },
  'Ibuprofeno': { tipo: 'ANTIINFLAMATORIO - ANALGÉSICO', presentacion: 'TABLETAS', unidad: 'CAJAS' },
  'Analgan 1 G': { tipo: 'ANTIPIRÉTICO / ANALGÉSICO', presentacion: 'TABLETAS', unidad: 'CAJAS' },
  'Buprexflash 600mg': { tipo: 'ANALGESICO - ANTIINFLAMATORIO TÓPICO', presentacion: 'CÁPSULAS', unidad: 'CAJAS' },
  'Diclofenaco 75mg/3ml': { tipo: 'ANTIINFLAMATORIO - ANALGÉSICO', presentacion: 'SOLUCION INYECTABLE', unidad: 'UNIDAD' },
  'Ketorolaco 30mg/Ml': { tipo: 'ANALGÉSICO', presentacion: 'SOLUCION INYECTABLE', unidad: 'UNIDAD' },
  'Meloxicam 15mg': { tipo: 'ANTIINFLAMATORIO - ANALGÉSICO', presentacion: 'TABLETAS', unidad: 'CAJAS' },

  // ANTIBIÓTICOS
  'Amoxicilina': { tipo: 'ANTIBIÓTICO', presentacion: 'CÁPSULAS', unidad: 'CAJAS' },
  'Augmentin': { tipo: 'ANTIBIÓTICO', presentacion: 'TABLETAS', unidad: 'CAJAS' },
  'Ampibex': { tipo: 'ANTIBIÓTICO', presentacion: 'CÁPSULAS', unidad: 'CAJAS' },

  // GASTROINTESTINALES
  'Omeprazol 40mg': { tipo: 'PROTECTOR GÁSTRICO', presentacion: 'CÁPSULAS', unidad: 'CAJAS' },
  'Metoclox': { tipo: 'ANTIHEMÉTICO', presentacion: 'TABLETAS', unidad: 'CAJAS' },
  'Buscapina Duo': { tipo: 'ANTIESPASMODICO', presentacion: 'TABLETAS', unidad: 'CAJAS' },
  'Diarex': { tipo: 'ANTIDIARREICO', presentacion: 'TABLETAS', unidad: 'CAJAS' },

  // INSUMOS MÉDICOS (Estos suelen ser UNIDAD)
  'Alcohol Antiséptico 70%': { tipo: 'ANTIBIÓTICO TÓPICO', presentacion: 'FRASCO', unidad: 'UNIDAD' },
  'Gasas Estériles': { tipo: 'ANTIBIÓTICO TÓPICO', presentacion: 'SOBRES', unidad: 'UNIDAD' },
  'Jeringuillas 5ml': { tipo: 'ANTIBIÓTICO TÓPICO', presentacion: 'UNIDAD', unidad: 'UNIDAD' },
  'Guantes Estériles': { tipo: 'ANTIBIÓTICO TÓPICO', presentacion: 'UNIDAD', unidad: 'UNIDAD' },
  'Suero Fisiológico 120ml': { tipo: 'SOLUCION DE REHIDRATACIÓN', presentacion: 'FRASCO', unidad: 'UNIDAD' },
  'Gasas': { tipo: 'ANTIBIÓTICO TÓPICO', presentacion: 'SOBRES', unidad: 'UNIDAD' },
  // ANTICONCEPTIVOS
  'Nofertyl': { tipo: 'ANTICONCEPTIVO', presentacion: 'SOLUCION INYECTABLE', unidad: 'UNIDAD' },
  'Bellaface': { tipo: 'ANTICONCEPTIVO', presentacion: 'TABLETAS', unidad: 'CAJAS' },
  'Dixi-35': { tipo: 'ANTICONCEPTIVO', presentacion: 'TABLETAS', unidad: 'CAJAS' }
};
  constructor(private service: MedicamentoService, private cdr: ChangeDetectorRef, private router: Router,private http: HttpClient,private loginService: LoginService) {}

  ngOnInit(): void {
  // 1. PRIMERO: Identificamos quién es el usuario
  const data = localStorage.getItem('usuario_actual');
  if (data) {
    try {
      this.usuarioActivo = JSON.parse(data);
    } catch (e) {
      this.usuarioActivo = { username: data, rol: 'PERSONAL' };
    }
  }

  // 2. SEGUNDO: Solo si hay un usuario válido, cargamos los datos del servidor
  // Esto evita el error 401 al arrancar sin sesión
  if (this.usuarioActivo && this.usuarioActivo.username) {
    this.cargar(); // Ahora sí, con el usuario ya identificado
    this.cargarAlertas();
    this.obtenerUsuarios(); // La función que trae la lista de usuarios
  }

  // 3. TERCERO: Configuraciones locales que no dependen del servidor
  const guardadoMedicamentos = localStorage.getItem('mis_medicamentos');
  if (guardadoMedicamentos) {
    this.nombresMedicamentos = JSON.parse(guardadoMedicamentos);
  }
  this.nombresFiltrados = [...this.nombresMedicamentos];
  this.ordenarListas();

  console.log("LOGIN COMPLETADO:", this.usuarioActivo);
}
ngAfterViewInit() {
    // Mueve aquí la carga de usuarios
    this.obtenerUsuarios();
  }
  cargar(): void {
    this.service.listar().subscribe({
      next: (data) => {
        this.medicamentos = data;
        this.cdr.detectChanges();
      }
    });
  }

 cargarAlertas(): void {
    this.service.getAlertas().subscribe({
      next: (data) => {
        console.log("Datos de alertas recibidos:", data); // Revisa esto en F12 -> Console
        this.alertas = { ...data };
        this.cdr.detectChanges(); // Fuerza a Angular a pintar el 5
      }
    });

    this.obtenerUsuarios();
}

guardar(): void {
  if (this.fechaInvalida) {
    this.lanzarToast('Revise las fechas antes de continuar', 'error');
    return;
  }
  if (!this.validarFechas()) return;
  // Eliminamos el ID si existe para que el Backend cree uno nuevo
  const { id, ...datos } = this.nuevo;

  this.service.guardar(datos).subscribe({
    next: () => {
        this.cerrarModal(); 
        // Usamos tu sistema de Toast personalizado
        this.lanzarToast('Registro guardado con éxito', 'success');
        this.cargar(); 
        this.cargarAlertas(); 
        this.cdr.detectChanges(); 
      },
      
    error: (err) => {
      console.error('Error:', err);
      Swal.fire('Error', 'No se pudo conectar con el servidor.', 'error');
    }
  });
  if (!this.nombresMedicamentos.includes(this.nuevo.nombre)) {
    this.nombresMedicamentos.push(this.nuevo.nombre);
    this.ordenarListas(); // Se re-ordenan para que el nuevo aparezca en su lugar correcto
  }
  localStorage.setItem('mis_medicamentos', JSON.stringify(this.nombresMedicamentos));
  this.nuevo.imagen = ''; // Limpiamos la foto para el siguiente registro
  this.cdr.detectChanges();
}

  resetFormulario(): void {
    this.nuevo = { nombre: '', tipo: '', presentacion: '', unidad: '', cantidad: 1, imagen: '', fechaIngreso: '', fechaSalida: '', fechaCaducidad: '' };
  }

  // --- Lógica de Filtros ---
 get medicamentosFiltrados() {
  // 1. Primero filtramos por el estado (vencido, próximo o todos)
  let lista = this.medicamentos;
  
  if (this.filtroActual === 'vencidos') {
    lista = this.medicamentos.filter(m => this.color(m) === 'red');
  } else if (this.filtroActual === 'proximos') {
    lista = this.medicamentos.filter(m => this.color(m) === 'orange');
  }

  // 2. Luego, sobre esa lista, aplicamos la búsqueda por nombre
  const busqueda = this.filtroNombre.toLowerCase().trim();
  if (busqueda) {
    lista = lista.filter(m => 
      m.nombre.toLowerCase().includes(busqueda)
    );
  }

  return lista;
}

  setFiltro(tipo: 'todos' | 'vencidos' | 'proximos') {
  this.filtroActual = tipo;
  this.paginaActual = 1; // <-- Resetear aquí
}

  filtrarYVer(tipo: "todos" | "vencidos" | "proximos") {
    this.setFiltro(tipo); 
    this.vistaActual = 'tabla';
  }

 color(m: Medicamento): string {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Resetear horas para comparar solo el día
    
    const cad = new Date(m.fechaCaducidad);
    // Sumamos un día o reseteamos horas porque JS a veces resta un día por la zona horaria
    cad.setMinutes(cad.getMinutes() + cad.getTimezoneOffset()); 
    cad.setHours(0, 0, 0, 0);

    const limite = new Date();
    limite.setDate(hoy.getDate() + 30);
    limite.setHours(0, 0, 0, 0);

    // IMPORTANTE: Si es hoy (16/01/2026) o antes, debe ser 'red'
    if (cad <= hoy) return 'red'; 
    if (cad <= limite) return 'orange';
    return 'green';
}

  // --- Navegación y UI ---
  irAGestion() {
    this.setFiltro('todos');
    this.vistaActual = 'tabla';
  }
abrirModal() {
  // 1. Limpiamos el objeto para que no tenga ID ni datos viejos
  this.nuevo = {} as any;; 
  // 2. Ahora sí, abrimos el modal
  this.mostrarModal = true; 
  this.confirmandoEdicion = false; // Resetear para que abra el formulario
}
  cerrarModal() {
     this.mostrarModal = false;
this.confirmandoEdicion = false; // Importante para que la próxima vez abra el formulario
  this.resetFormulario(); }
  exportarExcel() { this.service.exportar(); }
  logout() {
    localStorage.removeItem('usuarioLogueado');
    this.router.navigate(['/login']);
  }

  filtrarMedicamentos(): void {
  const termino = this.terminoBusqueda.toLowerCase().trim();
  if (!termino) {
    this.nombresFiltrados = [...this.nombresMedicamentos];
  } else {
    this.nombresFiltrados = this.nombresMedicamentos.filter(n => 
      n.toLowerCase().includes(termino)
    );
  }
}
seleccionarNombre(nombre: string): void {
  this.nuevo.nombre = nombre;
  this.terminoBusqueda = nombre;
  this.nombresFiltrados = []; // Ocultar lista tras seleccionar
}


// Función para eliminar

prepararEliminar(m: any) {
    this.medicamentoAEliminar = m;
    this.mostrarModalEliminar = true;
  }


// Función centralizada para cerrar y limpiar
cerrarModalEliminar() {
  this.mostrarModalEliminar = false;
  this.medicamentoAEliminar = null; // Limpia la referencia para que no se quede guardada
  this.cdr.detectChanges(); // Asegura que la interfaz se actualice
}

confirmarEliminacion() {
  if (this.medicamentoAEliminar && this.medicamentoAEliminar.id) {
    this.service.eliminar(this.medicamentoAEliminar.id).subscribe({
      next: () => {
        this.medicamentos = this.medicamentos.filter(m => m.id !== this.medicamentoAEliminar.id);
        this.cerrarModalEliminar(); // Cerramos correctamente aquí
        this.lanzarToast('Registro eliminado con éxito');
        this.cargarAlertas();
      },
      error: (err) => {
        console.error("Error en el servidor:", err); //
        this.lanzarToast('Error al eliminar', 'error');
        this.cerrarModalEliminar();
      }
    });
  }
}
 lanzarToast(mensaje: string, tipo: 'success' | 'error' | 'info' = 'success') {
  this.mensajeToast = mensaje;
  this.tipoToast = tipo; // Ahora esto ya no dará error
  this.mostrarToast = true;
  
  setTimeout(() => {
    this.mostrarToast = false;
    this.cdr.detectChanges();
  }, 5000);
}

// Esta función se llama desde el botón pequeño de la tabla
editarMedicamento(m: any) {
 this.nuevo = { ...m }; 
  this.confirmandoEdicion = false; // Empezamos en el formulario, no en la confirmación
  this.mostrarModal = true; 
  this.cdr.detectChanges();
}

actualizarMedicamento(): void {
  // 1. Primero la regla de los 10 días (Negocio)
  if (!this.esCaducidadSegura()) {
    this.lanzarToast('No se puede actualizar: la caducidad debe ser mayor a 10 días', 'error');
    return;
  }

  // 2. Luego la coherencia entre fechas (Ingreso vs Caducidad)
  if (!this.validarFechas()) {
    // No hace falta lanzarToast aquí porque validarFechas() ya lo hace
    return;
  }

  if (!this.nuevo.id) return;

this.service.editar(this.nuevo).subscribe({
      next: () => {
        this.cerrarModal(); 
        this.lanzarToast('Registro actualizado con éxito', 'success');
        this.cargar(); 
        this.cargarAlertas(); 
        this.cdr.detectChanges(); 
      },
    error: (err) => {
      console.error("Error al actualizar:", err); 
      this.lanzarToast('Error al actualizar registro', 'error');
    }
  });
}

private finalizarOperacion() {
  this.mostrarModal = false;
  this.cargar(); // Recarga la tabla
  this.resetFormulario();
}

confirmarActualizacion() {
  if (!this.validarFechas()) return;
  if (this.nuevo && this.nuevo.id) {
    this.service.editar(this.nuevo).subscribe({
      next: () => {
        this.cerrarModal(); 
        // Usamos tu sistema de Toast personalizado
        // this.lanzarToast('Registro actualizado con éxito', 'success');
        this.cargar(); 
        this.cargarAlertas(); 
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error("Error al actualizar:", err); 
        this.lanzarToast('Error al actualizar registro', 'error');
        // No cerramos el modal para que el usuario pueda intentar corregir
      }
    });
  }
}
// Modificamos el getter para que aplique el recorte (slice)
  get medicamentosPaginados() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return this.medicamentosFiltrados.slice(inicio, fin);
  }

  // Cálculo del total de páginas
  get totalPaginas(): number {
    return Math.ceil(this.medicamentosFiltrados.length / this.itemsPorPagina);
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.cdr.detectChanges();
    }
  }

 autoCompletar(): void {
  // Buscamos si el nombre ingresado existe en el catálogo maestro
  const datos = this.CATALOGO_MAESTRO[this.nuevo.nombre];

  if (datos) {
    // Si existe, llenamos los campos automáticamente
    this.nuevo.tipo = datos.tipo;
    this.nuevo.presentacion = datos.presentacion;
    this.nuevo.unidad = datos.unidad;
    
    // Notificación visual rápida
    this.lanzarToast(`Datos de ${this.nuevo.nombre} cargados`, 'success');
  }
  // Si no existe, permitimos que el usuario escriba lo que desee
}
// Valida las fechas antes de intentar guardar (lanza el Toast)
validarFechas(): boolean {
  if (!this.nuevo.fechaIngreso || !this.nuevo.fechaCaducidad) return true;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0); 

  const caducidad = new Date(this.nuevo.fechaCaducidad);
  const ingreso = new Date(this.nuevo.fechaIngreso);
  
  // 1. Regla de los 10 días desde HOY
  const diffTime = caducidad.getTime() - hoy.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 10) {
    this.lanzarToast('El medicamento debe tener al menos 10 días de vida útil desde hoy.', 'error');
    return false;
  }

  // 2. Regla de que caducidad > ingreso
  if (caducidad <= ingreso) {
    this.lanzarToast('La fecha de caducidad debe ser posterior al ingreso.', 'error');
    return false;
  }

  return true;
}

// Getters para controlar las alertas visuales en el HTML
get fechaInvalida(): boolean {
  if (!this.nuevo.fechaIngreso || !this.nuevo.fechaCaducidad) return false;
  return new Date(this.nuevo.fechaCaducidad) <= new Date(this.nuevo.fechaIngreso);
}

// Nuevo Getter para la alerta naranja de salida
get salidaInvalida(): boolean {
  if (!this.nuevo.fechaSalida || !this.nuevo.fechaCaducidad) return false;
  return new Date(this.nuevo.fechaSalida) > new Date(this.nuevo.fechaCaducidad);
}
// Verifica si el formulario está listo para ser enviado
// Verifica si faltan datos o hay errores de fecha
formularioValido(): boolean {
  const n = this.nuevo;
  const camposObligatorios = n.nombre && n.tipo && n.presentacion && n.unidad  && n.cantidad > 0 && n.imagen && n.fechaIngreso && n.fechaCaducidad;
  const fechasValidas = !this.fechaInvalida && !this.salidaInvalida;
  
return !!(camposObligatorios && fechasValidas && !this.esDuplicado);
}

// Devuelve el texto informativo para el usuario
// obtenerMotivoBloqueo(): string {
//   const n = this.nuevo;
//   if (this.esDuplicado) return 'Este lote ya existe. Busque el registro y actualice la cantidad.';
//   if (!n.nombre || !n.tipo || !n.presentacion || !n.unidad || !n.cantidad  || !n.imagen) return 'Complete todos los campos del medicamento';
//   if (!n.fechaIngreso || !n.fechaCaducidad) return 'Indique las fechas de ingreso y caducidad';
//   if (this.fechaInvalida) return 'Corrija la fecha de caducidad (debe ser posterior al ingreso)';
//   if (this.salidaInvalida) return 'Corrija la fecha de salida (no puede superar la caducidad)';
//   return '';
// }
get esDuplicado(): boolean {
  if (!this.nuevo.nombre || !this.nuevo.fechaCaducidad || this.nuevo.id) return false;

  return this.medicamentos.some(m => 
    m.nombre.toLowerCase().trim() === this.nuevo.nombre.toLowerCase().trim() &&
    m.fechaCaducidad === this.nuevo.fechaCaducidad
  );
}
// Busca el medicamento que coincide en nombre y caducidad
obtenerMedicamentoDuplicado(): any {
  return this.medicamentos.find(m => 
    m.nombre.toLowerCase().trim() === this.nuevo.nombre.toLowerCase().trim() &&
    m.fechaCaducidad === this.nuevo.fechaCaducidad
  );
}

// Acción para cargar el duplicado en el formulario automáticamente
// 2. Método de edición mejorado con selección de texto
editarLoteExistente() {
  const duplicado = this.obtenerMedicamentoDuplicado();
  if (duplicado) {
    // Ahora 'info' es válido gracias al cambio anterior
    this.lanzarToast('Lote detectado. Actualice la cantidad.', 'info');
    this.editarMedicamento(duplicado);
    
    this.resaltarCantidad = true;

    // Usamos setTimeout para esperar a que el DOM se actualice
    setTimeout(() => {
      if (this.cantidadField) {
        const input = this.cantidadField.nativeElement;
        input.focus();
        input.select(); // Selecciona el texto para que el usuario solo escriba el nuevo valor
      }
      this.resaltarCantidad = false;
    }, 600); // Un tiempo corto es suficiente
  }
}
// Actualizamos el motivo de bloqueo para que sea más corto si hay botón
obtenerMotivoBloqueo(): string {
  const n = this.nuevo;
  if (this.esDuplicado) return 'Lote ya registrado en el sistema';
  if (!n.nombre || !n.tipo || !n.presentacion || !n.unidad || !n.cantidad) return 'Complete todos los campos del medicamento';
  if (!n.fechaIngreso || !n.fechaCaducidad) return 'Indique las fechas de ingreso y caducidad';
  if (this.fechaInvalida) return 'Corrija la fecha de caducidad (debe ser posterior al ingreso)';
  if (this.salidaInvalida) return 'Corrija la fecha de salida (no puede superar la caducidad)';
  return '';
}
ordenarListas(): void {
  // Ordena la lista de nombres
  this.nombresMedicamentos.sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
  
  // Opcional: También puedes ordenar las otras listas si lo deseas
  this.tiposMedicamentos.sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
  this.presentacionesMedicamentos.sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
}
subirImagen(event: any): void {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    
    reader.onload = (e: any) => {
      // 1. Asignamos el resultado
      this.nuevo.imagen = e.target.result as string;
      
      // 2. IMPORTANTE: Forzamos a Angular a actualizar la vista
      this.cdr.detectChanges(); 
      
      console.log("Imagen procesada y lista para ver");
    };
    
    reader.readAsDataURL(file);
  }
}
// Función para abrir
verImagen(url: string) {
  this.imagenExpandida = url;
}

// Función para cerrar
cerrarImagen() {
  this.imagenExpandida = null;
}

abrirModalRegistro() {
  this.mostrarFormularioRegistro = true; // La función solo cambia la variable

}

registrarNuevoUsuario() {
      this.mostrarFormularioRegistro = false; 

  this.loginService.registrarUsuario(this.nuevoUsuario).subscribe({
    next: (res) => {
      // 1. CERRAMOS EL MODAL PRIMERO
      this.mostrarFormularioRegistro = false; 

      // 2. REFRESCAMOS LOS DATOS
      this.obtenerUsuarios();

      // 3. MENSAJE CON DISEÑO (SweetAlert2)
      Swal.fire({
        title: '¡Registrado!',
        text: 'Usuario guardado con éxito',
        icon: 'success',
        confirmButtonColor: '#005596', // Tu azul UNIBE
        timer: 2000 // Se cierra solo en 2 segundos
      });

      this.nuevoUsuario = { username: '', password: '', rol: '' };
    },
    error: (err) => {
      Swal.fire('Error', 'No se pudo registrar', 'error');
    }
  });
}

obtenerUsuarios() {
  this.loginService.getUsuarios().subscribe({
    next: (data) => {
      this.usuarios = data; // Trae la lista completa
      console.log("Usuarios cargados:", this.usuarios);
    },
    error: (err) => console.error("Error al cargar usuarios", err)
  });
}

  // 3. Crear el método para editar (esto quita el error 'prepararEdicionUsuario')
  prepararEdicionUsuario(user: any) {
      this.mostrarEdicionModal = true;
     this.usuarioEditando = { ...user }; 
    console.log("Editando a:", user);
  }

  // 4. Crear el método para eliminar (esto quita el error 'eliminarUsuario')
// En tu Inventario.ts
eliminarUsuario(id: number) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "Se eliminará de la base de datos y de esta vista.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#005596',
    confirmButtonText: 'Sí, eliminar'
  }).then((result) => {
    if (result.isConfirmed) {
      
      // 1. Llamamos al servicio para borrar
      this.loginService.eliminarUsuario(id).subscribe({
        next: () => {
          // --- ESTO ES LO QUE SOLUCIONA TU PROBLEMA ---
          // En lugar de llamar a obtenerUsuarios(), borramos el dato nosotros mismos de la memoria.
          // Así no dependemos de si la base de datos es lenta o rápida.
          
          this.usuarios = [...this.usuarios.filter(u => u.id !== id)];
          
          // Opcional: Si tienes un buscador o filtro, asegúrate de actualizar esa lista también
          // this.usuariosFiltrados = [...this.usuariosFiltrados.filter(u => u.id !== id)];

          console.log("Usuario borrado localmente. No hace falta recargar.");

          Swal.fire({
            title: '¡Eliminado!',
            icon: 'success',
            timer: 1000,
            showConfirmButton: false
          });
        },
        error: (err) => {
          console.error("Error al borrar:", err);
          Swal.fire('Error', 'El servidor no pudo eliminar el usuario', 'error');
        }
      });
    }
  });
}

guardarCambiosUsuario() {
  // NO llames a getUsuarios aquí arriba.
  this.mostrarEdicionModal = false;
  this.loginService.actualizarUsuario(this.usuarioEditando.id, this.usuarioEditando).subscribe({
    next: (res) => {
      console.log("Servidor respondió OK");
      this.obtenerUsuarios();           // Refrescamos la tabla DESPUÉS de cerrar
      
      Swal.fire({
        icon: 'success',
        title: '¡Actualizado!',
        confirmButtonColor: '#005596'
      });
    },
    error: (err) => {
      console.error("El servidor dio error:", err);
      Swal.fire('Error', 'No se pudo guardar', 'error');
    }
  });
}
puedoRegistrar(): boolean {
  return this.usuarios.length < this.limiteUsuarios;
}
esCaducidadSegura(): boolean {
  if (!this.nuevo.fechaCaducidad) return true;
  
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  const caducidad = new Date(this.nuevo.fechaCaducidad);
  const diffTime = caducidad.getTime() - hoy.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 10;
}
esPasswordSegura(): boolean {
  const pass = this.nuevoUsuario.password;
  if (!pass) return false;
  
  // Explicación del Regex:
  // (?=.*[a-z]) -> Al menos una minúscula
  // (?=.*[A-Z]) -> Al menos una mayúscula
  // (?=.*\d)     -> Al menos un número
  // (?=.*[@$!%*?&]) -> Al menos un carácter especial
  // {8,}         -> Mínimo 8 caracteres
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(pass);
}
mostrarPassword: boolean = false;
check(regex: string): boolean {
  if (!this.nuevoUsuario.password) return false;
  // Si pasamos 'len', verificamos longitud, si no, aplicamos regex
  if (regex === 'len') return this.nuevoUsuario.password.length >= 8;
  return new RegExp(regex).test(this.nuevoUsuario.password);
}
mostrarPassEdit = false; // Variable única para el modal de edición

// Función check mejorada para que acepte el objeto que estamos editando
checkEdit(regex: string): boolean {
  const p = this.usuarioEditando.password;
  if (!p) return false; // Si está vacío, no marcamos nada
  if (regex === 'len') return p.length >= 8;
  return new RegExp(regex).test(p);
}

esUsuarioValido(): boolean {
  const user = this.nuevoUsuario.username;
  if (!user) return false;
  // Regex: Solo letras (A-Z, a-z), mínimo 8, máximo 16
  const regex = /^[a-zA-Z]{8,16}$/;
  return regex.test(user);
}
puedoRegistrarAdmin(): boolean {
  const numAdmins = this.usuarios.filter(u => u.rol === 'ADMIN').length;
  return numAdmins < this.limiteAdmins;
}
}

