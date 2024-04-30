// Función para agregar una nueva tarea
function agregarTarea() {
    var entradaTarea = document.getElementById('entradaTarea');
    var textoTarea = entradaTarea.value.trim();

    if (textoTarea !== '') {
        gestionarTarea(textoTarea, 'pendientes'); // Llamamos a la función para gestionar la tarea
        entradaTarea.value = ''; // Limpiamos el campo de entrada
    } else {
        alert('Por favor ingresa una tarea válida.');
    }
}

// Función para alternar el estado de la tarea entre pendiente y completada
function alternarEstadoTarea(casillaVerificacion) {
    var elementoTarea = casillaVerificacion.parentNode;

    if (casillaVerificacion.checked) {
        elementoTarea.classList.add('completada');
        document.getElementById('listaTareasCompletadas').appendChild(elementoTarea);
        guardarTareaEnLocalStorage(elementoTarea.id, 'completadas'); // Guardar tarea como completada en localStorage
    } else {
        elementoTarea.classList.remove('completada');
        document.getElementById('tareasPendientes').appendChild(elementoTarea);
        eliminarTareaLocalStorage(elementoTarea.id, 'completadas'); // Eliminar tarea completada del localStorage
    }
}


// Función para eliminar una tarea
function eliminarTarea(elementoTarea) {
    elementoTarea.parentNode.removeChild(elementoTarea);
    // Eliminar tarea de localStorage (tanto pendientes como completadas)
    actualizarTareaEnLocalStorage(elementoTarea.id, 'pendientes', 'eliminar');
    actualizarTareaEnLocalStorage(elementoTarea.id, 'completadas', 'eliminar');
}
// Función para gestionar las tareas
function gestionarTarea(textoTarea, estado) {
    var listaTareas = estado === 'pendientes' ? document.getElementById('tareasPendientes') : document.getElementById('listaTareasCompletadas');

    if (!document.getElementById(textoTarea.replace(/\s+/g, ''))) {
        var elementoTarea = document.createElement('li');
        elementoTarea.className = 'tarea';
        elementoTarea.id = textoTarea.replace(/\s+/g, '');

        var casillaVerificacion = document.createElement('input');
        casillaVerificacion.type = 'checkbox';
        casillaVerificacion.addEventListener('change', function() {
            alternarEstadoTarea(casillaVerificacion);
        });

        var spanTarea = document.createElement('span');
        spanTarea.textContent = textoTarea;

        var botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.addEventListener('click', function() {
            eliminarTarea(elementoTarea);
        });

        elementoTarea.appendChild(casillaVerificacion);
        elementoTarea.appendChild(spanTarea);
        elementoTarea.appendChild(botonEliminar);

        listaTareas.appendChild(elementoTarea);

        if (estado === 'pendientes') {
            guardarTareaEnLocalStorage(textoTarea, 'pendientes'); // Guardar tarea en localStorage solo si es pendiente
        }
    }
}

// Función para guardar o eliminar una tarea en localStorage
function actualizarTareaEnLocalStorage(textoTarea, estado, accion) {
    var tareas = JSON.parse(localStorage.getItem(estado)) || [];
    if (accion === 'guardar') {
        tareas.push(textoTarea);
    } else if (accion === 'eliminar') {
        var index = tareas.indexOf(textoTarea);
        if (index !== -1) {
            tareas.splice(index, 1);
        }
    }
    localStorage.setItem(estado, JSON.stringify(tareas));
}

// Función para cargar las tareas desde el localStorage al cargar la página
function cargarTareasDesdeLocalStorage(estado) {
    var tareas = JSON.parse(localStorage.getItem(estado)) || [];
    var listaTareas = estado === 'pendientes' ? document.getElementById('tareasPendientes') : document.getElementById('listaTareasCompletadas');

    if (estado === 'pendientes') {
        tareas.forEach(function(tarea) {
            gestionarTarea(tarea, estado);
        });
    } else {
        // Solo agregar tareas completadas como completadas
        tareas.forEach(function(tarea) {
            gestionarTarea(tarea, estado);
        });
    }
}
// Llamar a las funciones para cargar las tareas desde el localStorage al cargar la página
cargarTareasDesdeLocalStorage('pendientes');
cargarTareasDesdeLocalStorage('completadas');
