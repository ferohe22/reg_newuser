document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registroForm');
    const emailContainer = document.getElementById('emailContainer');
    const passwordContainer = document.getElementById('passwordContainer');
    const submitBtn = document.getElementById('submitBtn');
    const mensajeDiv = document.getElementById('mensaje');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    submitBtn.addEventListener('click', async () => {
        console.log('Botón clickeado');
        const email = emailInput.value;
        console.log('Email:', email);

        if (passwordContainer.style.display === 'none') {
            // Validar email
            console.log('Validando email...');
            try {
                const response = await fetch('/validar-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                });
                console.log('Respuesta recibida del servidor');
                const data = await response.json();
                console.log('Datos de la respuesta:', data);

                if (data.registered) {
                    mensajeDiv.textContent = 'Usuario ya está registrado';
                    console.log('Usuario ya registrado');
                } else if (data.exists) {
                    passwordContainer.style.display = 'block';
                    submitBtn.textContent = 'Enviar';
                    console.log('Usuario existe en tab_emp, mostrando campo de contraseña');
                } else {
                    mensajeDiv.textContent = 'El usuario no existe en la base de datos';
                    console.log('Usuario no existe');
                }
            } catch (error) {
                console.error('Error al validar email:', error);
                mensajeDiv.textContent = 'Ocurrió un error al validar el email';
            }
        } else {
            // Enviar registro
            console.log('Enviando registro...');
            const password = passwordInput.value;
            if (!password) {
                mensajeDiv.textContent = 'Por favor, ingrese una contraseña';
                console.log('Contraseña vacía');
                return;
            }
            try {
                const response = await fetch('/registrar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });
                const data = await response.json();
                console.log('Respuesta del servidor (registro):', data);

                if (data.success) {
                    mensajeDiv.textContent = 'Usuario registrado exitosamente';
                    form.reset();
                    passwordContainer.style.display = 'none';
                    submitBtn.textContent = 'Siguiente';
                    console.log('Usuario registrado exitosamente');
                } else {
                    mensajeDiv.textContent = 'Error al registrar el usuario';
                    console.log('Error al registrar el usuario');
                }
            } catch (error) {
                console.error('Error al registrar usuario:', error);
                mensajeDiv.textContent = 'Ocurrió un error al registrar el usuario';
            }
        }
    });

    // Limpiar mensaje cuando se modifica el email
    emailInput.addEventListener('input', () => {
        mensajeDiv.textContent = '';
    });
});