type ColorCode =
	| 'black'
	| 'dark_blue'
	| 'dark_green'
	| 'dark_aqua'
	| 'dark_red'
	| 'dark_purple'
	| 'gold'
	| 'gray'
	| 'dark_gray'
	| 'blue'
	| 'green'
	| 'aqua'
	| 'red'
	| 'light_purple'
	| 'yellow'
	| 'white';

type FormatCode =
	| 'obfuscated'
	| 'bold'
	| 'strikethrough'
	| 'underline'
	| 'italic'
	| 'reset';

interface Chat {
	text?: string,
	bold?: 'true' | 'false',
	italic?: 'true' | 'false',
	underlined?: 'true' | 'false',
	strikethrough?: 'true' | 'false',
	obfuscated?: 'true' | 'false',
	color?: ColorCode | FormatCode,
	extra?: Chat[]
}

export { Chat, ColorCode, FormatCode };