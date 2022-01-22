# Brainly Scraper
Library to scrape `www.brainly.com`

**LICENSE: [BrainlyScraper_Official](https://github.com/defrindr/brainly-scraper)**

## Installation

```
npm install brainly-scraper-v2
```
or
```
npm i brainly-scraper-v2
```

## Parameters

| Name | Nullable | Description |
|------|----------|-------------|
| query|    ✖     | The keywords you want to find |
| count|    ✔     | Total data to be displayed |
| language|    ✔     | Language customize | 

## Example

### Simple Usage

```javascript
const brainly = require('brainly-scraper-v2');

brainly("1+1", 5, "id").then(res => {
	console.log(res);
});
```

Or

```typescript
import brainly from 'brainly-scraper-v2';

brainly("nkri", 5, "id").then(res => {
	console.log(res);
});
```

Output : 

```javascript
{
  success: true,
  length: 5,
  message: 'Request Success',
  data: [
    {
      pertanyaan: '1!1!1!1!1!1!1!1!1!1!1!!1!1!1!1!1!1!1!1!1!1!!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!!1!1!1!1!1!1!1!1!1!1!!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!Doang!  \n' +
        ' \n' +
        '​ \n' +
        ' \n' +
        '​​​',
      jawaban: [Array],
      questionMedia: [Array]
    },
    {
      pertanyaan: 'tolong!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!!1!!!1!1!1!1!1!1!1!1!1!1!1!1!1!1!!1!1!1!11!1!1​',
      jawaban: [Array],
      questionMedia: [Array]
    },
    {
      pertanyaan: 'bantu donk bro!1!1!1!1!1!1!!1!1!1!1!1!1!1!1!1!1!!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1!1! \n' +
        ' \n' +
        '​',
      jawaban: [Array],
      questionMedia: [Array]
    },
    {
      pertanyaan: 'TOLONG1!1!!1!1!1!1!1!1!1!1!!1!1!1!1!1!1!1!1!1!1!!11!1!1!1!1!1!1!1!1!!1!1!1!',
      jawaban: [Array],
      questionMedia: [Array]
    },
    {
      pertanyaan: '1×1×1×1×1×1×1×1×1×1×1×1×1×1×1×1=​',
      jawaban: [Array],
      questionMedia: [Array]
    }
  ]
}
```

### Error Response
```javascript
import brainly from 'brainly-scraper-v2';

brainly().then(res => {
	console.log(res);
});
```

Output:

```javascript
{ 
  success: false,
  message: 'Param cant be blank'
}
```
	Tips :
	You can use JSON.stringify() to get string output

### Available languages
```json
[
    "id",
    "us",
    "es",
    "pt",
    "ru",
    "ro",
    "tr",
    "ph",
    "pl",
    "hi"
]
```

## Contribution
Contributions are welcome.
