# Koduppgift - TvTablå

Detta projekt innehåller Cypress end-to-end tester för en TV-schema applikation.

## Förutsättningar

Innan du kan köra testerna behöver du ha följande installerat:

- **Node.js** (version 14 eller senare)
- **Git** (för versionshantering och studentnamn)
- **PowerShell** (Windows - finns förinstallerat)

**Observera**: Du behöver INTE installera npm packages eller Cypress manuellt - PowerShell-scripten gör detta automatiskt!

## Köra Cypress Tester

### 1. Interaktivt läge (Rekommenderat för utveckling)

```powershell
.\PsCypressOpen.ps1
```

Detta script:
- ✅ Kontrollerar automatiskt alla dependencies
- ✅ Installerar npm packages om de saknas
- ✅ Installerar Cypress om det saknas
- ✅ Hämtar ditt studentnamn från git automatiskt
- ✅ Öppnar Cypress Test Runner

I Test Runner kan du:
- Välja vilka tester att köra
- Se testerna köras i realtid
- Debugga och inspektera element
- Ta screenshots och videor

### 2. Headless läge (För snabb körning och CI/CD)

```powershell
.\PSCypressRun.ps1
```

Detta script kör alla tester automatiskt i bakgrunden och visar resultatet.

## Vad händer när du kör scripten?

PowerShell-scripten gör allt automatiskt:

- Kontrollerar att allt är installerat
- Installerar Cypress om det saknas
- Hämtar ditt studentnamn från git
- Startar testerna

## Kommandon

| Kommando | Beskrivning |
|----------|-------------|
| `.\PsCypressOpen.ps1` | Öppna Cypress Test Runner (interaktivt) |
| `.\PSCypressRun.ps1` | Kör alla tester automatiskt |

## Felsökning

**PowerShell execution policy fel:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Git inte konfigurerat:**
```bash
git config user.name "Ditt Riktiga Namn"
git config user.email "din.email@exempel.se"
```

## Support

Vid eventuella problem eller fel, kontakta utbildaren via Slack för hjälp.
