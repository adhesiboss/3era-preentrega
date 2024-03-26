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

// Función para mostrar los usuarios en el DOM
function mostrarUsuarios() {
    let outputs = document.getElementById('outputs');
    outputs.innerHTML = '';
    usuarios.forEach((usuario, index) => {
        let planPagos = mostrarPlanPagosUsuario(usuario);
        let usuarioOutput = document.createElement('div');
        usuarioOutput.innerHTML = `<h3>Usuario ${index + 1}:</h3><p>${planPagos}</p>`;
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

// Función para mostrar el plan de pagos para un usuario específico
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

    // Mostrar el plan de pagos
    let planPagos = `Plan de pagos para ${nombre} ${apellido}:\n`;
    let mesActual = meses.indexOf(primerMes.toLowerCase());
    for (let i = 1; i <= cuotas; i++) {
        let cuota = pagoMensual;
        if (i === cuotas) {
            cuota += intereses;
        }
        planPagos += `Cuota ${i}: ${meses[mesActual % 12]} - $${cuota.toFixed(2)}\n`;
        mesActual++;
    }

    return planPagos;
}

// Función para capturar el evento de agregar usuario al hacer clic en el botón
document.getElementById('agregarUsuario').addEventListener('click', () => {
    let nombre = document.getElementById('nombre').value;
    let apellido = document.getElementById('apellido').value;
    let monto = parseFloat(document.getElementById('monto').value);
    let cuotas = parseInt(document.getElementById('cuotas').value);
    let primerMes = document.getElementById('primerMes').value;
    agregarUsuario(nombre, apellido, monto, cuotas, primerMes);
});