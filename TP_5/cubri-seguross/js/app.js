// js/app.js
import { solicitud, irAPaso } from './estado.js';
import { render } from './render.js';
import { calcularCuota, validarPaso1, validarPaso3, validarPaso4 } from './cotizador.js';
import { simularPago, generarPoliza } from './pago.js';

document.addEventListener('DOMContentLoaded', () => {
    render();

    // Botón inicio -> Paso 1
    const btnCotizar = document.getElementById('btn-cotizar-celular');
    if (btnCotizar) {
        btnCotizar.addEventListener('click', () => irAPaso(1));
    }

    // Paso 1: Cotizar
    const formPaso1 = document.getElementById('form-paso-1');
    if (formPaso1) {
        formPaso1.addEventListener('input', () => {
            solicitud.equipo.marca = document.getElementById('marca').value;
            solicitud.equipo.modelo = document.getElementById('modelo').value;
            solicitud.equipo.valor = Number(document.getElementById('valor').value.replace(/\D/g, ''));
            
            const radioAntiguedad = document.querySelector('input[name="antiguedad"]:checked');
            solicitud.equipo.antiguedad = radioAntiguedad ? radioAntiguedad.value : '';

            const btnVerPlanes = document.getElementById('btn-ver-planes');
            const esValido = validarPaso1(solicitud.equipo);
            if (btnVerPlanes) btnVerPlanes.disabled = !esValido;
        });

        formPaso1.addEventListener('change', () => {
            solicitud.equipo.marca = document.getElementById('marca').value;
            const radioAntiguedad = document.querySelector('input[name="antiguedad"]:checked');
            solicitud.equipo.antiguedad = radioAntiguedad ? radioAntiguedad.value : '';

            const btnVerPlanes = document.getElementById('btn-ver-planes');
            if (btnVerPlanes) btnVerPlanes.disabled = !validarPaso1(solicitud.equipo);
        });

        formPaso1.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (validarPaso1(solicitud.equipo)) {
                try {
                    const res = await fetch('data/planes.json');
                    const planes = await res.json();
                    renderPlanes(planes);
                    irAPaso(2);
                } catch (error) {
                    console.error('Error al cargar los planes:', error);
                }
            }
        });
    }

    // Paso 2 -> Paso 3
    const btnContinuarDatos = document.getElementById('btn-continuar-datos');
    if (btnContinuarDatos) {
        btnContinuarDatos.addEventListener('click', () => {
            irAPaso(3);
        });
    }

    // Paso 3: Datos personales
    const formPaso3 = document.getElementById('form-paso-3');
    if (formPaso3) {
        formPaso3.addEventListener('input', () => {
            solicitud.titular.nombre = document.getElementById('nombre').value;
            solicitud.titular.apellido = document.getElementById('apellido').value;
            solicitud.titular.dni = document.getElementById('dni').value;
            solicitud.titular.nacimiento = document.getElementById('nacimiento').value;
            solicitud.titular.email = document.getElementById('email').value;
            solicitud.titular.celular = document.getElementById('celular').value;
            solicitud.titular.terminos = document.getElementById('terminos').checked;

            const btnContinuarPago = document.getElementById('btn-continuar-pago');
            if (btnContinuarPago) {
                btnContinuarPago.disabled = !validarPaso3(solicitud.titular);
            }
        });

        formPaso3.addEventListener('change', () => {
            solicitud.titular.terminos = document.getElementById('terminos').checked;
            const btnContinuarPago = document.getElementById('btn-continuar-pago');
            if (btnContinuarPago) {
                btnContinuarPago.disabled = !validarPaso3(solicitud.titular);
            }
        });

        formPaso3.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validarPaso3(solicitud.titular)) {
                irAPaso(4);
            }
        });
    }

    // Paso 4: Pago con simulación y manejo de éxito/error
    const formPaso4 = document.getElementById('form-paso-4');
    if (formPaso4) {
        formPaso4.addEventListener('input', () => {
            solicitud.pago.tarjeta = document.getElementById('tarjeta').value;
            solicitud.pago.vencimiento = document.getElementById('vencimiento').value;
            solicitud.pago.cvv = document.getElementById('cvv').value;
            solicitud.pago.titular = document.getElementById('titular-tarjeta').value;

            const btnPagar = document.getElementById('btn-pagar');
            if (btnPagar) {
                btnPagar.disabled = !validarPaso4(solicitud.pago);
            }
        });

        formPaso4.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (validarPaso4(solicitud.pago)) {
                const btnPagar = document.getElementById('btn-pagar');
                btnPagar.disabled = true;
                const textoOriginal = btnPagar.textContent;
                btnPagar.textContent = 'Procesando...';

                try {
                    const resultado = await simularPago(solicitud.pago.tarjeta);
                    if (resultado.ok) {
                        solicitud.poliza = generarPoliza();
                        
                        // Poblar detalle de éxito dinámicamente
                        const detalleExito = document.getElementById('detalle-exito');
                        if (detalleExito) {
                            detalleExito.innerHTML = `
                                <p><strong>Póliza:</strong> ${solicitud.poliza}</p>
                                <p><strong>Titular:</strong> ${solicitud.titular.nombre} ${solicitud.titular.apellido}</p>
                                <p><strong>Equipo:</strong> ${solicitud.equipo.marca} ${solicitud.equipo.modelo}</p>
                                <p><strong>Plan Elegido:</strong> ${solicitud.plan.toUpperCase()}</p>
                            `;
                        }

                        irAPaso(5); // Pantalla de Éxito
                    } else {
                        irAPaso(6); // Pantalla de Error de pago
                    }
                } catch (error) {
                    console.error('Error en el pago:', error);
                    irAPaso(6);
                } finally {
                    btnPagar.disabled = false;
                    btnPagar.textContent = textoOriginal;
                }
            }
        });
    }

    // Pantalla de error (Paso 6) -> Reintentar pago
    const btnReintentar = document.getElementById('btn-reintentar');
    if (btnReintentar) {
        btnReintentar.addEventListener('click', () => irAPaso(4));
    }

    // Pantalla de éxito (Paso 5) -> Volver al inicio limpiando el estado
    const btnInicioExito = document.getElementById('btn-inicio-exito');
    if (btnInicioExito) {
        btnInicioExito.addEventListener('click', () => {
            solicitud.paso = 0;
            solicitud.equipo = { marca: '', modelo: '', valor: 0, antiguedad: '' };
            solicitud.titular = { nombre: '', apellido: '', dni: '', nacimiento: '', email: '', celular: '', terminos: false };
            solicitud.pago = { metodo: 'credito', tarjeta: '', vencimiento: '', cvv: '', titular: '' };
            solicitud.poliza = null;
            
            if (formPaso1) formPaso1.reset();
            if (formPaso3) formPaso3.reset();
            if (formPaso4) formPaso4.reset();

            render();
        });
    }

    // Botones volver atrás
    document.querySelectorAll('.btn-volver').forEach(btn => {
        btn.addEventListener('click', () => {
            if (solicitud.paso > 0 && solicitud.paso < 5) irAPaso(solicitud.paso - 1);
        });
    });
});

function renderPlanes(planes) {
    const contenedor = document.getElementById('contenedor-planes');
    if (!contenedor) return;

    contenedor.innerHTML = planes.map(plan => {
        const cuota = calcularCuota(solicitud.equipo.valor, plan.tasaAnual, solicitud.equipo.antiguedad);
        const recomendadoBadge = plan.recomendado ? '<span class="badge bg-indigo-50 text-indigo-600 font-semibold mb-2 inline-block">Recomendado</span>' : '';
        const isChecked = plan.id === solicitud.plan ? 'checked' : '';

        return `
            <label class="card p-6 bg-white rounded-xl border border-slate-200 block cursor-pointer hover:border-indigo-600 transition">
                <div class="flex items-start justify-between">
                    <div>
                        ${recomendadoBadge}
                        <h3 class="text-xl font-bold text-slate-900">${plan.nombre}</h3>
                        <p class="text-sm text-slate-500 mt-1">${plan.coberturas.join(' • ')}</p>
                    </div>
                    <input type="radio" name="plan" value="${plan.id}" ${isChecked} class="mt-1">
                </div>
                <div class="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span class="text-sm text-slate-600">Cuota mensual</span>
                    <span class="text-xl font-bold text-indigo-600">$ ${cuota.toLocaleString('es-AR')}</span>
                </div>
            </label>
        `;
    }).join('');

    document.querySelectorAll('input[name="plan"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            solicitud.plan = e.target.value;
        });
    });
}