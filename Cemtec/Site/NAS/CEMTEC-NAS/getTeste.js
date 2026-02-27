const { chromium } = require('playwright');

(async () => {
    console.log("getTeste.js - iniciando");
    const ip = "192.168.1.144";
    const loginUrl = `https://${ip}:5001`;
    const targetUrls = [
        "https://" + ip + ":5001/oo/r/16Bv36gxKdaQ4nVfJGbDqTLt7k32ZNmc",
        "https://" + ip + ":5001/oo/r/16pnNL531nNH1sACJaKSMXKf1pacX7RH"
    ];
    const names = ["equipments.xlsx","uses_equipments.xlsx"];
    const usuario = "CEMTEC";
    const senha = "CemtecLIPq2024#";
    const localSave = '/app/downloads';

    const browser = await chromium.launch({ headless: true });

    const context = await browser.newContext({
        acceptDownloads: true,
        ignoreHTTPSErrors: true,
        downloadPath: '/downloads'
    });


    const page = await context.newPage();

    await page.goto(loginUrl, { waitUntil: "domcontentloaded" });
    console.log("getTeste.js - ...");

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

    var ind = 0;
    for (var targetUrl of targetUrls) {
        // 2️⃣ voltar para a planilha
        await page.goto(targetUrl, { waitUntil: "networkidle" });


        // 3️⃣ Clicar no menu Exportar
        //aguardar botão habilitado
        await page.screenshot({ path: localSave + '/dbg1.png', fullPage: true });
        await page.waitForSelector('#ext-gen62:not([aria-disabled="true"])', { timeout: 10000 });
        await page.click('#ext-gen62');

        // 4️⃣ Selecionar opção XLSX
        await page.waitForSelector('#ext-comp-1103');
        await page.click('#ext-comp-1103');
        await page.screenshot({ path: localSave + '/dbg2.png', fullPage: true });
        await page.waitForSelector('#ext-gen490', { timeout: 10000 });
        await page.screenshot({ path: localSave + '/dbg3.png', fullPage: true });
        const [download] = await Promise.all([
            page.waitForEvent('download'),
            page.click('#ext-gen490')
        ]);

        // 5️⃣ Salvar arquivo
        // console.log("foto!");
        await page.screenshot({ path: localSave + '/dbg4.png', fullPage: true });
        var nameFile = names[ind] || `file${ind}.xlsx`;
        await download.saveAs(localSave + `/${nameFile}`);
        await page.screenshot({ path: localSave + '/dbg5.png', fullPage: true });

        console.log("Arquivo exportado com sucesso! - " + nameFile);
        ind++;
    }
    await browser.close();
})();