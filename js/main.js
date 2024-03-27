// Array para almacenar los usuarios
let usuarios = [];

// Función para agregar un usuario al array y guardar en el Storage
function agregarUsuario(nombre, apellido, monto, cuotas, primerMes) {
    usuarios.push({
        nombre,
        apellido,
        monto,
        cuotas,
        primerMes
    });
    mostrarUsuarios();
}

function mostrarUsuarios() {
    let outputs = document.getElementById('outputs');
    outputs.innerHTML = '';
    usuarios.forEach((usuario) => {
        let planPagos = mostrarPlanPagosUsuario(usuario);
        let usuarioOutput = document.createElement('div');
        usuarioOutput.innerHTML = `<h3 class="mt-5">Usuario: ${usuario.nombre} ${usuario.apellido}</h3>${planPagos}`;
        outputs.appendChild(usuarioOutput);
    });
}


// Función para calcular el pago mensual en cuotas para un usuario específico
function calcularPagoCuotasUsuario(usuario) {
    let {
        monto,
        cuotas
    } = usuario;
    // Verificar que el número de cuotas sea válido
    if (cuotas <= 0 || cuotas % 1 !== 0) {
        return "El número de cuotas debe ser un entero positivo.";
    }

    // Calcular el pago mensual aproximado
    let pagoMensual = Math.ceil(monto / cuotas);

    // Verificar si el pago mensual es menor que el monto prestado
    if (pagoMensual * cuotas < monto) {
        let intereses = monto - (pagoMensual * cuotas);
        pagoMensual += intereses / cuotas;
    }

    return pagoMensual;
}

function mostrarPlanPagosUsuario(usuario) {
    let {
        nombre,
        apellido,
        monto,
        cuotas,
        primerMes
    } = usuario;
    // Calcular el pago mensual
    let pagoMensual = calcularPagoCuotasUsuario(usuario);

    // Calcular intereses adicionales
    let intereses = monto - (pagoMensual * cuotas);

    // Meses del año
    let meses = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];

    // Crear la tabla de préstamos
    let tabla = `<table class="table table-striped">
                  <thead>
                    <tr>
                      <th>Mes</th>
                      <th>Cuota</th>
                    </tr>
                  </thead>
                  <tbody>`;

    let mesActual = meses.indexOf(primerMes.toLowerCase());
    for (let i = 1; i <= cuotas; i++) {
        let cuota = pagoMensual;
        if (i === cuotas) {
            cuota += intereses;
        }
        tabla += `<tr>
                  <td>${meses[mesActual % 12]}</td>
                  <td>$${cuota.toFixed(2)}</td>
                </tr>`;
        mesActual++;
    }

    tabla += `</tbody>
              </table>`;

    return tabla;
}


document.getElementById('agregarUsuario').addEventListener('click', () => {
    let nombre = document.getElementById('nombre').value.trim();
    let apellido = document.getElementById('apellido').value.trim();
    let monto = parseFloat(document.getElementById('monto').value);
    let cuotas = parseInt(document.getElementById('cuotas').value);
    let primerMes = document.getElementById('primerMes').value.trim();

    // Validar que los campos no estén vacíos
    if (nombre === '' || apellido === '' || isNaN(monto) || isNaN(cuotas) || primerMes === '') {
        // Mostrar un mensaje de error con Toastr
        toastr.error('Por favor, complete todos los campos para agregar un usuario.');
        return;
    }

    agregarUsuario(nombre, apellido, monto, cuotas, primerMes);

    // Mostrar un toaster verde con un mensaje de éxito
    toastr.success('Usuario agregado correctamente.');

    // Limpiar los valores de los campos de entrada
    document.getElementById('nombre').value = '';
    document.getElementById('apellido').value = '';
    document.getElementById('monto').value = '';
    document.getElementById('cuotas').value = '';
    document.getElementById('primerMes').value = '';
});