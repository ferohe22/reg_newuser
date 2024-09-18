require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const Airtable = require('airtable');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Configuración de Airtable
const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID);
const tableKey = base(process.env.AIRTABLE_TABLE_NAME);
const tableEmp = base(process.env.AIRTABLE_TABLE_NAME_EMP);

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Ruta para validar email
app.post('/validar-email', async (req, res) => {
    const { email } = req.body;
    console.log('Validando email:', email);
    try {
        const recordsKey = await tableKey.select({
            filterByFormula: `{Email} = '${email}'`
        }).firstPage();

        const existsInKey = recordsKey.length > 0;
        console.log('Email existe en tab_key:', existsInKey);

        if (existsInKey) {
            res.json({ exists: true, registered: true });
        } else {
            const recordsEmp = await tableEmp.select({
                filterByFormula: `{Email} = '${email}'`
            }).firstPage();

            const existsInEmp = recordsEmp.length > 0;
            console.log('Email existe en tab_emp:', existsInEmp);

            res.json({ exists: existsInEmp, registered: false });
        }
    } catch (error) {
        console.error('Error al validar email:', error);
        res.status(500).json({ error: 'Error al validar email' });
    }
});

// Ruta para registrar usuario
app.post('/registrar', async (req, res) => {
    const { email, password } = req.body;
    console.log('Intentando registrar usuario:', email);
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const record = await tableKey.create({
            "Email": email,
            "password": hashedPassword
        });
        console.log('Usuario registrado con éxito:', record.id);
        res.json({ success: true, id: record.id });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});