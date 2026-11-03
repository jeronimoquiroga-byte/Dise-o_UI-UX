// js/pago.js

export function simularPago(numero) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const limpio = numero.replace(/\s/g, '');
            resolve(
                limpio === '4000000000000002'
                    ? { ok: false, motivo: 'Tarjeta rechazada' }
                    : { ok: true }
            );
        }, 1500);
    });
}

let contadorPoliza = 123;
export function generarPoliza() {
    const anio = new Date().getFullYear();
    const nro = String(contadorPoliza++).padStart(6, '0');
    return `POL-${anio}-${nro}`;
}