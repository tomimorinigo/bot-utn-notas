import 'dotenv/config';
import { chromium } from 'playwright';

// ==================== CONFIGURACIÓN ====================
const USUARIO = process.env.USUARIO;
const PASSWORD = process.env.PASSWORD;
const URL_BASE = process.env.URL_BASE || 'https://a4.frc.utn.edu.ar/4';

const MATERIA = process.env.MATERIA || 'Investigación Operativa';
const COLUMNA_NOTA = parseInt(process.env.COLUMNA_NOTA || '1');

// Configuración de Twilio
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM;
const MI_WHATSAPP = process.env.MI_WHATSAPP;

// ==================== FUNCIONES ====================

async function enviarWhatsApp(mensaje) {
  const horaActual = new Date().getHours();
  
  // Verificar horario de silencio (1am - 7am)
  if (horaActual >= 1 && horaActual < 7) {
    console.log(`🌙 Horario de silencio (1am-7am). Mensaje NO enviado: ${horaActual}:00`);
    console.log(`📝 Mensaje pendiente: ${mensaje.substring(0, 50)}...`);
    return false;
  }

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: TWILIO_WHATSAPP_FROM,
        To: MI_WHATSAPP,
        Body: mensaje
      })
    });

    if (response.ok) {
      console.log('✅ WhatsApp enviado correctamente');
      return true;
    } else {
      const error = await response.text();
      console.log(`❌ Error al enviar WhatsApp: ${error}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error al enviar WhatsApp: ${error.message}`);
    return false;
  }
}

async function verificarNotas() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });

  const page = await context.newPage();

  try {
    console.log('\n' + '='.repeat(50));
    console.log(`🔍 Verificando notas... [${new Date().toLocaleString('es-AR')}]`);
    console.log('='.repeat(50));

    // 1. Ir a la página de login
    await page.goto(URL_BASE);
    console.log('📄 Página cargada');

    // Presionar en autogestión
    await page.click('#B');

    // Llenar usuario
    await page.waitForSelector('#txtUsuario');
    await page.fill('#txtUsuario', USUARIO);

    // Seleccionar especialidad (opción 20) -> Sistemas
    await page.selectOption('#txtDominios', { index: 19 }); // index es 0-based

    // Llenar password
    await page.fill('#pwdClave', PASSWORD);

    // Click en login
    await page.click('#btnEnviar');
    console.log('🔐 Login realizado');

    // Esperar a que cargue la página principal
    await page.waitForTimeout(3000);

    // Buscar la materia dinámicamente por su nombre
    console.log(`🔎 Buscando materia: ${MATERIA}`);
    
    // Buscar todos los li que comienzan con idCurso
    const todosLosLi = await page.$$('li[id^="idCurso"]');
    
    let elementoPadre = null;
    let idMateria = null;
    
    // Recorrer todos los elementos y buscar el que contiene el nombre de la materia
    for (const li of todosLosLi) {
      const textoLi = await li.textContent();
      // Normalizar espacios y comparar
      if (textoLi.includes(MATERIA)) {
        elementoPadre = li;
        idMateria = await li.evaluate(el => el.id);
        break;
      }
    }
    
    if (!elementoPadre || !idMateria) {
      throw new Error(`❌ No se encontró la materia "${MATERIA}"`);
    }
    
    console.log(`✅ Materia encontrada con ID: ${idMateria}`);
    
    await elementoPadre.scrollIntoViewIfNeeded();
    console.log('🖱️  Haciendo hover...');
    
    await elementoPadre.hover();
    await page.waitForTimeout(1000);

    // Click en el botón de parciales (primer icono en el div.tools)
    const botonParciales = await page.waitForSelector(`#${idMateria} > div > i:nth-child(1)`, {
      state: 'visible'
    });
    await botonParciales.click();
    console.log('📝 Click en parciales realizado');

    await page.waitForTimeout(2000);

    // Extraer la nota usando el ID dinámico y la columna especificada
    const tablaId = idMateria.replace('idCurso', 'tabla');
    
    console.log(`🔎 Buscando nota en columna ${COLUMNA_NOTA}...`);
    
    // Obtener el nombre de la columna desde el header
    const nombreColumna = await page.$eval(
      `#${tablaId} thead th:nth-child(${COLUMNA_NOTA})`,
      th => th.textContent.trim()
    );
    
    console.log(`📋 Columna seleccionada: "${nombreColumna}"`);
    
    // Obtener la nota usando la columna especificada (nth-child es 1-based)
    const notaElement = await page.waitForSelector(`#${tablaId} > tbody > tr > td:nth-child(${COLUMNA_NOTA})`);
    const notaActual = await notaElement.textContent();

    console.log(`📊 Nota encontrada: ${notaActual}`);

    // Enviar notificación con la nota actual
    const mensaje = `📋 Verificación de nota\n\n📚 Materia: ${MATERIA}\n📝 Columna: ${nombreColumna}\n📊 Nota actual: ${notaActual}\n\n🕐 ${new Date().toLocaleString('es-AR')}`;
    await enviarWhatsApp(mensaje);

    return notaActual;

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    return null;
  } finally {
    await browser.close();
  }
}

// Ejecutar
verificarNotas();