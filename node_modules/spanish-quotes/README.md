# spanish quotes | frases en español

NPM package to get spanish quotes.

Paquete NPM para obtener frases en español.

<p align="center">
  <a href="https://www.npmjs.com/package/spanish-quotes">
    <img src="https://img.shields.io/npm/v/spanish-quotes.svg?logo=npm&logoColor=fff&label=NPM+package&color=limegreen" alt="spanish-quotes on npm" />
  </a>
</p>

## Quickstart | Inicio rápido

### Globally | Globalmente

#### Install | Instalar

```bash
npm i -g spanish-quotes --save
```

#### Usage | Uso

Run with installation:

Ejecutar con instalación:

```bash
spanish-quotes
```

Run without installation:

Ejecutar sin instalación:

```bash
npx spanish-quotes
```

Result:

Resultado:

```text
La historia decía que era prisionera, pero eso no era cierto, porque ella tenía esperanza y cuando hay esperanza no eres prisionero de nadie.
 -- Despereaux: un pequeño gran héroe
```

### Locally | Localmente

#### Import | Importar

```javascript
import { getRandomQuote } from 'spanish-quotes';
```

#### Usage | Uso

* getRandomQuote()

Function that returns a random quote:

Función que retorna una frase aleatoria:

```javascript
getRandomQuote();
```

Result:

Resultado:

```json
{
  "quote": "La historia decía que era prisionera, pero eso no era cierto, porque ella tenía esperanza y cuando hay esperanza no eres prisionero de nadie.",
  "from": "Despereaux: un pequeño gran héroe"
}
```

## Want to help? | ¿Quiere ayudar?

Want to file a bug, contribute some code, or improve documentation? Thanks! Feel free to contact me at [@davidvives](https://twitter.com/davidvives) or at davr59@outlook.com.

¿Quiere reportar un error o una pulga, contribuir con código o mejorar la documentación? ¡Muchas gracias! Puede contactarme a [@davidvives](https://twitter.com/davidvives) o a davr59@outlook.com.
