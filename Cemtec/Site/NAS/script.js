const { chromium } = require('playwright');

(async () => {
    const ip = "192.168.1.149";
    const loginUrl = `https://${ip}:5001`;
    const targetUrl = "https://192.168.1.149:5001/oo/r/16zkr7Y3ORnq4IR5l9jpv5OLF6eqg4a2#tid=1";
    const usuario = "MatheusPorto";
    const senha = "CemtecLIPq2024#";

    const browser = await chromium.launch({ headless: true });

    const context = await browser.newContext({
        acceptDownloads: true,
        ignoreHTTPSErrors: true,
        downloadPath: '/downloads'
    });


    const page = await context.newPage();

    await page.goto(loginUrl, { waitUntil: "domcontentloaded" });

    // esperar o loader sumir
    // await page.waitForFunction(() => {
    //     const el = document.querySelector('#sds-login-vue');
    //     console.log("sds-login-vue:", el ? el.innerHTML.length : "não existe");
    //     return el && el.innerHTML.trim().length > 0;
    // }, { timeout: 10000 });
    //photo


    await page.goto(loginUrl, { waitUntil: "domcontentloaded" });
    //usuário
    await page.waitForSelector('input[placeholder="Username"]', { timeout: 10000 });
    await page.fill('input[placeholder="Username"]', usuario);
    //debug
    //clicar seta azul
    await page.waitForSelector('.login-btn-spinner-wrapper', { timeout: 10000 });
    await page.locator('.login-btn-spinner-wrapper').first().click({ force: true });
    //esperar campo de senha
    await page.waitForSelector('input[type="password"]', { timeout: 10000 });
    //debug
    //senha
    await page.fill('input[type="password"]', senha);
    //clicar entrar
    await page.locator('.login-btn-spinner-wrapper').first().click({ force: true });
    //aguardar login
    await page.waitForLoadState('networkidle');



    // 2️⃣ voltar para a planilha
    await page.goto(targetUrl, { waitUntil: "networkidle" });
    
    
    // 3️⃣ Clicar no menu Exportar
    //aguardar botão habilitado
    await page.waitForSelector('#ext-gen62:not([aria-disabled="true"])', { timeout: 10000 });
    await page.click('#ext-gen62');
    await page.screenshot({ path: '/downloads/dbg1.png', fullPage: true });
    
    // 4️⃣ Selecionar opção XLSX
    await page.waitForSelector('#ext-comp-1103');
    await page.click('#ext-comp-1103');
    await page.screenshot({ path: '/downloads/dbg2.png', fullPage: true });
    await page.waitForSelector('#ext-gen490', { timeout: 10000 });
    await page.screenshot({ path: '/downloads/dbg3.png', fullPage: true });
    const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.click('#ext-gen490')
    ]);

    // 5️⃣ Salvar arquivo
    await download.saveAs(`/downloads/${await download.suggestedFilename()}`);

    console.log("Arquivo exportado com sucesso!");
    await browser.close();
})();
