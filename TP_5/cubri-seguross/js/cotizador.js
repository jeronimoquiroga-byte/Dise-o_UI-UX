// js/cotizador.js

export function calcularCuota(valor, tasaAnual, antiguedad) {
    let factor = 1.00;
    if (antiguedad === '1-2') factor = 1.10;
    if (antiguedad === 'mas-2') factor = 1.25;

    return Math.round((valor * tasaAnual / 12) * factor);
}

export function validarPaso1(equipo) {
    let valido = true;

    // Validación de marca
    const errorMarca = document.getElementById('marca-error');
    if (!equipo.marca) {
        errorMarca.textContent = 'Elegí una marca';
        errorMarca.classList.remove('hidden');
        valido = false;
    } else {
        errorMarca.classList.add('hidden');
    }

    // Validación de modelo (2 a 40 caracteres)
    const errorModelo = document.getElementById('modelo-error');
    if (!equipo.modelo || equipo.modelo.length < 2 || equipo.modelo.length > 40) {
        errorModelo.textContent = 'Ingresá el modelo del equipo (2 a 40 caracteres)';
        errorModelo.classList.remove('hidden');
        valido = false;
    } else {
        errorModelo.classList.add('hidden');
    }

    // Validación de valor (entre 100.000 y 2.500.000)
    const errorValor = document.getElementById('valor-error');
    const valNum = Number(equipo.valor);
    if (isNaN(valNum) || valNum < 100000 || valNum > 2500000) {
        errorValor.textContent = 'El valor debe estar entre $100.000 y $2.500.000';
        errorValor.classList.remove('hidden');
        valido = false;
    } else {
        errorValor.classList.add('hidden');
    }

    // Validación de antigüedad
    const errorAntiguedad = document.getElementById('antiguedad-error');
    if (!equipo.antiguedad) {
        errorAntiguedad.textContent = 'Indicá la antigüedad';
        errorAntiguedad.classList.remove('hidden');
        valido = false;
    } else {
        errorAntiguedad.classList.add('hidden');
    }

    return valido;
}

export function validarPaso3(titular) {
    let valido = true;

    // Nombre
    const errorNombre = document.getElementById('nombre-error');
    if (!titular.nombre || titular.nombre.trim().length < 2) {
        errorNombre.textContent = 'Ingresá un nombre válido';
        errorNombre.classList.remove('hidden');
        valido = false;
    } else {
        errorNombre.classList.add('hidden');
    }

    // Apellido
    const errorApellido = document.getElementById('apellido-error');
    if (!titular.apellido || titular.apellido.trim().length < 2) {
        errorApellido.textContent = 'Ingresá un apellido válido';
        errorApellido.classList.remove('hidden');
        valido = false;
    } else {
        errorApellido.classList.add('hidden');
    }

    // DNI (7 u 8 dígitos)
    const errorDni = document.getElementById('dni-error');
    if (!/^\d{7,8}$/.test(titular.dni)) {
        errorDni.textContent = 'Ingresá un DNI válido (7 u 8 dígitos)';
        errorDni.classList.remove('hidden');
        valido = false;
    } else {
        errorDni.classList.add('hidden');
    }

    // Mayor de 18 años
    const errorNacimiento = document.getElementById('nacimiento-error');
    if (!titular.nacimiento) {
        errorNacimiento.textContent = 'Ingresá tu fecha de nacimiento';
        errorNacimiento.classList.remove('hidden');
        valido = false;
    } else {
        const hoy = new Date();
        const nacimiento = new Date(titular.nacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const m = hoy.getMonth() - nacimiento.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
        
        if (edad < 18) {
            errorNacimiento.textContent = 'Debes ser mayor de 18 años';
            errorNacimiento.classList.remove('hidden');
            valido = false;
        } else {
            errorNacimiento.classList.add('hidden');
        }
    }

    // Email
    const errorEmail = document.getElementById('email-error');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(titular.email)) {
        errorEmail.textContent = 'Ingresá un email válido';
        errorEmail.classList.remove('hidden');
        valido = false;
    } else {
        errorEmail.classList.add('hidden');
    }

    // Celular
    const errorCelular = document.getElementById('celular-error');
    if (!titular.celular || titular.celular.replace(/\D/g, '').length < 8) {
        errorCelular.textContent = 'Ingresá un celular válido';
        errorCelular.classList.remove('hidden');
        valido = false;
    } else {
        errorCelular.classList.add('hidden');
    }

    // Términos
    const errorTerminos = document.getElementById('terminos-error');
    if (!titular.terminos) {
        errorTerminos.textContent = 'Debes aceptar los términos y condiciones';
        errorTerminos.classList.remove('hidden');
        valido = false;
    } else {
        errorTerminos.classList.add('hidden');
    }

    return valido;
}

export function validarPaso4(pago) {
    let valido = true;
    if (!pago.tarjeta || pago.tarjeta.replace(/\D/g, '').length < 16) valido = false;
    if (!pago.vencimiento || pago.vencimiento.length < 4) valido = false;
    if (!pago.cvv || pago.cvv.length < 3) valido = false;
    if (!pago.titular || pago.titular.trim().length < 2) valido = false;
    return valido;
}