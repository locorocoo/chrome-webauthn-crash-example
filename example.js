const puppeteer = require('puppeteer');

async function register() {
  const browser = await puppeteer.launch(
    {
      headless: true,
      dumpio: true,
      args: ['--no-sandbox', '--enable-logging', '--v=1'],
    }
  );
  
  const page = await browser.newPage();
  const session = await page.target().createCDPSession();
  
  await session.send('WebAuthn.enable');
  const authenticatorId = (await session.send('WebAuthn.addVirtualAuthenticator', {
    options: {
      protocol: 'u2f',
      transport: 'usb',
      hasResidentKey: false,
      hasUserVerification: true,
      automaticPresenceSimulation: true,
      isUserVerified: true,
    },
  })).authenticatorId;
  await session.send('WebAuthn.addCredential', {
    authenticatorId,
    credential: {
      credentialId: 'MGyuqXxcTf7E+p/E/rgs4aKZpDV9Mu9cZj72UIzGql4=',
      isResidentCredential: false,
      rpId: 'yubico.com',
      privateKey: 'MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgH8HB/Zf7wydbCS6XCET1hfJE1BohkdwaD3D39cvaPRyhRANCAARRrB1qIGKq8yDRLnuM95VA17unff01teF+ZS4A28JpGTx6kopg86/h5AAKQGpe0rvJd/EVb04NAA2HWwQoPo64',
      signCount: 0,
    },
  });

  await page.goto('https://demo.yubico.com/webauthn-technical/registration');
  await page.waitFor('button.MuiButton-contained')
  await page.click('button.MuiButton-contained');
}

register()