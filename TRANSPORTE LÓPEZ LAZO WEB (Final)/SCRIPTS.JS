document.addEventListener('DOMContentLoaded', () => {
    // Sistema de navegación
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Sistema de almacenamiento
    let estudiantes = JSON.parse(localStorage.getItem('estudiantes')) || [];
    let pagos = JSON.parse(localStorage.getItem('pagos')) || [];

    // Registrar estudiantes
    const studentForm = document.getElementById('studentForm');
    if (studentForm) {
        studentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const studentId = document.getElementById('studentId').value;
            const nuevoEstudiante = {
                id: studentId || Date.now(),
                nombre: document.getElementById('nombre').value,
                grado: document.getElementById('grado').value
            };
            
            if (studentId) {
                // Editar estudiante existente
                estudiantes = estudiantes.map(est => 
                    est.id === parseInt(studentId) ? nuevoEstudiante : est
                );
            } else {
                // Agregar nuevo estudiante
                estudiantes.push(nuevoEstudiante);
            }
            
            localStorage.setItem('estudiantes', JSON.stringify(estudiantes));
            actualizarTablas();
            studentForm.reset();
            document.getElementById('studentId').value = '';
            document.querySelector('#studentForm button[type="submit"]').textContent = 'Registrar Estudiante';
        });
    }

    // Registrar pagos
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const paymentId = document.getElementById('paymentId').value;
            const nuevoPago = {
                id: paymentId || Date.now(),
                estudianteId: Number(document.getElementById('studentSelect').value),
                monto: document.getElementById('monto').value,
                fecha: document.getElementById('fecha').value || new Date().toLocaleDateString()
            };
            
            if (paymentId) {
                // Editar pago existente
                pagos = pagos.map(pago => 
                    pago.id === parseInt(paymentId) ? nuevoPago : pago
                );
            } else {
                // Agregar nuevo pago
                pagos.push(nuevoPago);
            }
            
            localStorage.setItem('pagos', JSON.stringify(pagos));
            actualizarTablas();
            paymentForm.reset();
            document.getElementById('paymentId').value = '';
            document.querySelector('#paymentForm button[type="submit"]').textContent = 'Registrar Pago';
        });
    }

    // Actualizar tablas y selectores
    function actualizarTablas() {
        // Estudiantes
        const studentsTbody = document.querySelector('#studentsTable tbody');
        if (studentsTbody) {
            studentsTbody.innerHTML = estudiantes.map(estudiante => `
                <tr>
                    <td>${estudiante.nombre}</td>
                    <td>${estudiante.grado}</td>
                    <td class="actions">
                        <button class="btn btn-edit" onclick="editarEstudiante(${estudiante.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-delete" onclick="eliminarEstudiante(${estudiante.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }

        // Pagos
        const paymentsTbody = document.querySelector('#paymentsTable tbody');
        if (paymentsTbody) {
            paymentsTbody.innerHTML = pagos.map(pago => {
                const estudiante = estudiantes.find(e => e.id === pago.estudianteId);
                return `
                    <tr>
                        <td>${pago.fecha}</td>
                        <td>${estudiante?.nombre || 'N/A'}</td>
                        <td>C$ ${pago.monto}</td>
                        <td class="actions">
                            <button class="btn btn-edit" onclick="editarPago(${pago.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-delete" onclick="eliminarPago(${pago.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');
        }

        // Selector de estudiantes
        const studentSelect = document.getElementById('studentSelect');
        if (studentSelect) {
            studentSelect.innerHTML = estudiantes.map(e => `
                <option value="${e.id}">${e.nombre} - ${e.grado}</option>
            `).join('');
        }
    }

    // Gráfico financiero
    const financeChartCanvas = document.getElementById('financeChart');
    if (financeChartCanvas) {
        const ctx = financeChartCanvas.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Ingresos', 'Gastos', 'Utilidad'],
                datasets: [{
                    label: 'Córdobas',
                    data: [107200, 44000, 63200],
                    backgroundColor: [
                        'rgba(46, 204, 113, 0.8)',
                        'rgba(231, 76, 60, 0.8)',
                        'rgba(52, 152, 219, 0.8)'
                    ],
                    barThickness: 40
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: value => `C$ ${value.toLocaleString()}`
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                size: 14
                            }
                        }
                    }
                }
            }
        });
    }

    // Cargar datos iniciales
    actualizarTablas();
});

// Funciones globales para edición y eliminación
window.editarEstudiante = (id) => {
    const estudiante = JSON.parse(localStorage.getItem('estudiantes')).find(e => e.id === id);
    if (estudiante) {
        document.getElementById('studentId').value = estudiante.id;
        document.getElementById('nombre').value = estudiante.nombre;
        document.getElementById('grado').value = estudiante.grado;
        document.querySelector('#studentForm button[type="submit"]').textContent = 'Actualizar Estudiante';
        document.getElementById('nombre').focus();
    }
};

window.eliminarEstudiante = (id) => {
    if (confirm('¿Está seguro de eliminar este estudiante?')) {
        let estudiantes = JSON.parse(localStorage.getItem('estudiantes'));
        estudiantes = estudiantes.filter(e => e.id !== id);
        localStorage.setItem('estudiantes', JSON.stringify(estudiantes));
        
        // Actualizar también los pagos relacionados
        let pagos = JSON.parse(localStorage.getItem('pagos'));
        pagos = pagos.filter(p => p.estudianteId !== id);
        localStorage.setItem('pagos', JSON.stringify(pagos));
        
        document.querySelector('SCRIPT.JS').dispatchEvent(new Event('DOMContentLoaded'));
    }
};

window.editarPago = (id) => {
    const pago = JSON.parse(localStorage.getItem('pagos')).find(p => p.id === id);
    if (pago) {
        document.getElementById('paymentId').value = pago.id;
        document.getElementById('studentSelect').value = pago.estudianteId;
        document.getElementById('monto').value = pago.monto;
        document.getElementById('fecha').value = pago.fecha;
        document.querySelector('#paymentForm button[type="submit"]').textContent = 'Actualizar Pago';
        document.getElementById('monto').focus();
    }
};

window.eliminarPago = (id) => {
    if (confirm('¿Está seguro de eliminar este pago?')) {
        let pagos = JSON.parse(localStorage.getItem('pagos'));
        pagos = pagos.filter(p => p.id !== id);
        localStorage.setItem('pagos', JSON.stringify(pagos));
        document.querySelector('SCRIPT.JS').dispatchEvent(new Event('DOMContentLoaded'));
    }
};