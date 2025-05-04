document.addEventListener('DOMContentLoaded', function() {
    // Gráfico financiero
    const ctx = document.getElementById('financeChart').getContext('2d');
    const financeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Ingresos', 'Gastos', 'Utilidad'],
            datasets: [{
                label: 'Córdobas',
                data: [107200, 44000, 63200],
                backgroundColor: [
                    'rgba(46, 204, 113, 0.7)',
                    'rgba(231, 76, 60, 0.7)',
                    'rgba(52, 152, 219, 0.7)'
                ],
                borderColor: [
                    'rgba(46, 204, 113, 1)',
                    'rgba(231, 76, 60, 1)',
                    'rgba(52, 152, 219, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'C$ ' + value.toLocaleString();
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'C$ ' + context.raw.toLocaleString();
                        }
                    }
                }
            }
        }
    });

    // Registro de estudiantes
    const studentForm = document.getElementById('studentForm');
    const studentsTable = document.getElementById('studentsTable').getElementsByTagName('tbody')[0];
    
    studentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre').value;
        const grado = document.getElementById('grado').value;
        const direccion = document.getElementById('direccion').value;
        const contacto = document.getElementById('contacto').value;
        const mensualidad = document.getElementById('mensualidad').value;
        
        // Crear nueva fila en la tabla
        const newRow = studentsTable.insertRow();
        
        newRow.innerHTML = `
            <td>${nombre}</td>
            <td>${grado}</td>
            <td>C$ ${parseInt(mensualidad).toLocaleString()}</td>
            <td><input type="checkbox" class="payment-check"></td>
        `;
        
        // Limpiar formulario
        studentForm.reset();
        
        // Mostrar notificación
        alert('Estudiante registrado exitosamente!');
    });

    // Simular datos existentes (para demostración)
    const sampleStudents = [
        { nombre: 'Juan Pérez', grado: '4to grado', mensualidad: 1200 },
        { nombre: 'María López', grado: '2do grado', mensualidad: 1000 },
        { nombre: 'Carlos Ruiz', grado: '7mo grado', mensualidad: 1500 }
    ];

    sampleStudents.forEach(student => {
        const row = studentsTable.insertRow();
        row.innerHTML = `
            <td>${student.nombre}</td>
            <td>${student.grado}</td>
            <td>C$ ${student.mensualidad.toLocaleString()}</td>
            <td><input type="checkbox" class="payment-check"></td>
        `;
    });
});