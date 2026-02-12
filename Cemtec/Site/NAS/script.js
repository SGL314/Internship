const { chromium } = require('playwright');

(async () => {
    const ip = "192.168.1.149";
    const loginUrl = `https://${ip}:5001`;
    const targetUrl = "https://192.168.1.149:5001/oo/r/16zkr7Y3ORnq4IR5l9jpv5OLF6eqg4a2#tid=1";
    const usuario = "MatheusPorto";
    const senha = "CemtecLIPq2024#";

    const browser = await chromium.launch({
        headless: true,
        args: ["--no-sandbox", "--ignore-certificate-errors"]
    });

    const context = await browser.newContext({
        acceptDownloads: true,
        ignoreHTTPSErrors: true,
        downloadPath: '/downloads'
    });


    const page = await context.newPage();

    // 1️⃣ Login DSM
    await page.goto(loginUrl, { waitUntil: "networkidle" });
    await page.fill('input[name="account"]', usuario);
    await page.fill('input[name="passwd"]', senha);
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: "networkidle" });

    // 2️⃣ Acessar a planilha
    await page.goto(targetUrl, { waitUntil: "networkidle" });

    // 3️⃣ Clicar no menu Exportar
    await page.waitForSelector('#ext-gen62');
    await page.click('#ext-gen62');

    // 4️⃣ Selecionar opção XLSX
    await page.waitForSelector('#ext-comp-1103');
    await page.click('#ext-comp-1103');
    await page.waitForSelector('#ext-gen490');
    const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.click('#ext-gen490')
    ]);

    // 5️⃣ Salvar arquivo
    await download.saveAs(`/downloads/${await download.suggestedFilename()}`);

    console.log("Arquivo exportado com sucesso!");
    await browser.close();
})();
