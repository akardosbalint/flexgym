# Apple Wallet pass icons

`src/lib/apple-wallet.ts` reads these files from this folder to build the
`.pkpass` file. They're required by Apple's PassKit spec and aren't
included here since they need to be the real Forge Gym brand assets:

- `icon.png` — 29×29 px
- `icon@2x.png` — 58×58 px
- `logo.png` — recommended 160×50 px (any reasonable logo aspect ratio works)

Until these are added, `/api/wallet/apple` fails gracefully with an
on-page error instead of crashing.
