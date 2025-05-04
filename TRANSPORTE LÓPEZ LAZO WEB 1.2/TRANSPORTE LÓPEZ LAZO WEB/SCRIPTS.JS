document.addEventListener('DOMContentLoaded', () => {
    // Sistema de navegación SPA
    const sections = document.querySelectorAll('.content-section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function showSection(sectionId) {
        sections.forEach(section => {
            section.classList.remove('active');
            if(section.id === sectionId) section.classList.add('active');
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if(link.getAttribute('href') === `#${sectionId}`) link.classList.add('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);
            showSection(sectionId);
            window.scrollTo(0, 0);
        });
    });

    // Sistema de almacenamiento
    let estudiantes = JSON.parse(localStorage.getItem('estudiantes')) || [];
    let pagos = JSON.parse(localStorage.getItem('pagos')) || [];

    // Registrar estudiantes
    document.getElementById('studentForm').addEventListener('submit', (e) => {
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

    // Registrar pagos
    document.getElementById('paymentForm').addEventListener('submit', (e) => {
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

    // Actualizar tablas y selectores
    function actualizarTablas() {
        // Estudiantes
        const studentsTbody = document.querySelector('#studentsTable tbody');
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

        // Pagos
        const paymentsTbody = document.querySelector('#paymentsTable tbody');
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

        // Selector de estudiantes
        const studentSelect = document.getElementById('studentSelect');
        studentSelect.innerHTML = estudiantes.map(e => `
            <option value="${e.id}">${e.nombre} - ${e.grado}</option>
        `).join('');
    }

    // Gráfico financiero
    const ctx = document.getElementById('financeChart').getContext('2d');
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
                ]
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => `C$ ${value.toLocaleString()}`
                    }
                }
            }
        }
    });

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
    showSection('inicio');
});