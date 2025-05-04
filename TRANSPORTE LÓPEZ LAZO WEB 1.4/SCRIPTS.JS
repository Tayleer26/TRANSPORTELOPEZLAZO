document.addEventListener('DOMContentLoaded', () => {
    console.log("Script cargado correctamente");
    
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
            const nuevoEstudiante = {
                id: Date.now(),
                nombre: document.getElementById('nombre').value,
                grado: document.getElementById('grado').value
            };
            
            estudiantes.push(nuevoEstudiante);
            localStorage.setItem('estudiantes', JSON.stringify(estudiantes));
            actualizarTablas();
            e.target.reset();
        });
    }

    // Registrar pagos
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nuevoPago = {
                id: Date.now(),
                estudianteId: Number(document.getElementById('studentSelect').value),
                monto: document.getElementById('monto').value,
                fecha: new Date().toLocaleDateString()
            };
            
            pagos.push(nuevoPago);
            localStorage.setItem('pagos', JSON.stringify(pagos));
            actualizarTablas();
            e.target.reset();
        });
    }

    // Actualizar tablas y selectores
    function actualizarTablas() {
        console.log("Actualizando tablas...");
        
        // Estudiantes
        const studentsTbody = document.querySelector('#studentsTable tbody');
        if (studentsTbody) {
            studentsTbody.innerHTML = estudiantes.map(estudiante => `
                <tr>
                    <td>${estudiante.nombre}</td>
                    <td>${estudiante.grado}</td>
                    <td>
                        <button class="btn" onclick="eliminarEstudiante(${estudiante.id})">
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

    // Función para eliminar estudiantes
    window.eliminarEstudiante = (id) => {
        if(confirm('¿Está seguro de eliminar este estudiante?')) {
            estudiantes = estudiantes.filter(e => e.id !== id);
            localStorage.setItem('estudiantes', JSON.stringify(estudiantes));
            actualizarTablas();
        }
    };

    // Cargar datos iniciales
    actualizarTablas();
});