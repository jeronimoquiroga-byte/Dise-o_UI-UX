// js/render.js
import { solicitud } from './estado.js';

export function render() {
    // 1. Mostrar u ocultar las secciones según el paso actual
    document.querySelectorAll('[data-paso]').forEach((s) => {
        s.hidden = Number(s.dataset.paso) !== solicitud.paso;
    });

    renderStepper();
    renderResumen();
}

function renderStepper() {
    const stepperContainer = document.getElementById('stepper-container');
    if (!stepperContainer) return;

    // Si estamos en inicio (0) o pantallas finales (5, 6), vaciamos el stepper
    if (solicitud.paso === 0 || solicitud.paso >= 5) {
        stepperContainer.innerHTML = '';
        return;
    }

    const pasos = ['Cotizar', 'Plan', 'Datos', 'Pago'];
    stepperContainer.innerHTML = pasos.map((nombre, index) => {
        const nroPaso = index + 1;
        let estilo = 'text-slate-400';
        if (solicitud.paso > nroPaso) estilo = 'text-emerald-600 font-semibold';
        else if (solicitud.paso === nroPaso) estilo = 'text-indigo-600 font-bold underline';
        
        return `<span class="${estilo}">Paso ${nroPaso}: ${nombre}</span>`;
    }).join(' <span class="text-slate-300">/</span> ');
}

export function renderResumen() {
    // Actualiza dinámicamente los bloques de resumen en los pasos 2, 3 y 4
    const idsResumen = ['resumen-paso-2', 'resumen-paso-3', 'resumen-paso-4'];
    
    idsResumen.forEach(id => {
        const contenedor = document.getElementById(id);
        if (!contenedor) return;

        const valorFormateado = Number(solicitud.equipo.valor || 0).toLocaleString('es-AR');

        contenedor.innerHTML = `
            <div class="space-y-1">
                <p class="text-slate-600"><strong>Equipo:</strong> ${solicitud.equipo.marca || '-'} ${solicitud.equipo.modelo || ''}</p>
                <p class="text-slate-600"><strong>Valor:</strong> $ ${valorFormateado}</p>
                <p class="text-slate-600"><strong>Antigüedad:</strong> ${solicitud.equipo.antiguedad || '-'}</p>
                <p class="text-slate-600"><strong>Plan elegido:</strong> <span class="uppercase font-semibold text-indigo-600">${solicitud.plan}</span></p>
            </div>
        `;
    });
}