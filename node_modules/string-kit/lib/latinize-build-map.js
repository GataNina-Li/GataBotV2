/*
	String Kit

	Copyright (c) 2014 - 2021 Cédric Ronvel

	The MIT License (MIT)

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
*/

"use strict" ;



var fs = require( 'fs' ) ;



// Execute this file every time you change it to build the map.

// This map is borrowed from the 'atonic' module
var inverseMap = {
	'': '\u0301' ,
	'0': '߀' ,
	' ': ' ' ,
	A: 'ⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄȺⱯ' ,
	AA: 'Ꜳ' ,
	AE: 'ÆǼǢ' ,
	AO: 'Ꜵ' ,
	AU: 'Ꜷ' ,
	AV: 'ꜸꜺ' ,
	AY: 'Ꜽ' ,
	B: 'ⒷＢḂḄḆɃƁ' ,
	C: 'ｃⒸＣꜾḈÇ' ,
	D: 'ⒹＤḊĎḌḐḒḎĐƊƉᴅꝹ' ,
	Dh: 'Ð' ,
	DZ: 'ǱǄ' ,
	Dz: 'ǲǅ' ,
	E: 'ɛⒺＥÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚƐƎᴇ' ,
	F: 'ꝼⒻＦḞƑꝻ' ,
	G: 'ⒼＧǴĜḠĞĠǦĢǤƓꞠꝽꝾɢ' ,
	H: 'ⒽＨĤḢḦȞḤḨḪĦⱧⱵꞍ' ,
	I: 'ⒾＩÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗ' ,
	J: 'ⒿＪĴɈȷ' ,
	K: 'ⓀＫḰǨḲĶḴƘⱩꝀꝂꝄꞢ' ,
	L: 'ⓁＬĿĹĽḶḸĻḼḺŁȽⱢⱠꝈꝆꞀ' ,
	LJ: 'Ǉ' ,
	Lj: 'ǈ' ,
	M: 'ⓂＭḾṀṂⱮƜϻ' ,
	N: 'ꞤȠⓃＮǸŃÑṄŇṆŅṊṈƝꞐᴎ' ,
	NJ: 'Ǌ' ,
	Nj: 'ǋ' ,
	O: 'ⓄＯÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰÖȪỎŐǑȌȎƠỜỚỠỞỢỌỘǪǬØǾƆƟꝊꝌ' ,
	OE: 'Œ' ,
	OI: 'Ƣ' ,
	OO: 'Ꝏ' ,
	OU: 'Ȣ' ,
	P: 'ⓅＰṔṖƤⱣꝐꝒꝔ' ,
	Q: 'ⓆＱꝖꝘɊ' ,
	R: 'ⓇＲŔṘŘȐȒṚṜŖṞɌⱤꝚꞦꞂ' ,
	S: 'ⓈＳẞŚṤŜṠŠṦṢṨȘŞⱾꞨꞄ' ,
	T: 'ⓉＴṪŤṬȚŢṰṮŦƬƮȾꞆ' ,
	Th: 'Þ' ,
	TZ: 'Ꜩ' ,
	U: 'ⓊＵÙÚÛŨṸŪṺŬÜǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴɄ' ,
	V: 'ⓋＶṼṾƲꝞɅ' ,
	VY: 'Ꝡ' ,
	W: 'ⓌＷẀẂŴẆẄẈⱲ' ,
	X: 'ⓍＸẊẌ' ,
	Y: 'ⓎＹỲÝŶỸȲẎŸỶỴƳɎỾ' ,
	Z: 'ⓏＺŹẐŻŽẒẔƵȤⱿⱫꝢ' ,
	a: 'ⓐａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐɑ' ,
	aa: 'ꜳ' ,
	ae: 'æǽǣ' ,
	ao: 'ꜵ' ,
	au: 'ꜷ' ,
	av: 'ꜹꜻ' ,
	ay: 'ꜽ' ,
	b: 'ⓑｂḃḅḇƀƃɓƂ' ,
	c: 'ⓒćĉċčçḉƈȼꜿↄCĆĈĊČƇȻ' ,
	d: 'ⓓｄḋďḍḑḓḏđƌɖɗƋᏧԁꞪ' ,
	dh: 'ð' ,
	dz: 'ǳǆ' ,
	e: 'ⓔｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇǝ' ,
	f: 'ⓕｆḟƒ' ,
	ff: 'ﬀ' ,
	fi: 'ﬁ' ,
	fl: 'ﬂ' ,
	ffi: 'ﬃ' ,
	ffl: 'ﬄ' ,
	g: 'ⓖｇǵĝḡğġǧģǥɠꞡꝿᵹ' ,
	h: 'ⓗｈĥḣḧȟḥḩḫẖħⱨⱶɥ' ,
	hv: 'ƕ' ,
	i: 'ⓘｉìíîĩīĭïḯỉǐȉȋịįḭɨı' ,
	j: 'ⓙｊĵǰɉ' ,
	k: 'ⓚｋḱǩḳķḵƙⱪꝁꝃꝅꞣ' ,
	l: 'ⓛｌŀĺľḷḹļḽḻſłƚɫⱡꝉꞁꝇɭ' ,
	lj: 'ǉ' ,
	m: 'ⓜｍḿṁṃɱɯ' ,
	n: 'ⓝｎǹńñṅňṇņṋṉƞɲŉꞑꞥԉ' ,
	nj: 'ǌ' ,
	o: 'ⓞｏòóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộǫǭøǿꝋꝍɵɔᴑ' ,
	oe: 'œ' ,
	oi: 'ƣ' ,
	oo: 'ꝏ' ,
	ou: 'ȣ' ,
	p: 'ⓟｐṕṗƥᵽꝑꝓꝕρ' ,
	q: 'ⓠｑɋꝗꝙ' ,
	r: 'ⓡｒŕṙřȑȓṛṝŗṟɍɽꝛꞧꞃ' ,
	s: 'ⓢｓśṥŝṡšṧṣṩșşȿꞩꞅẛʂ' ,
	ss: 'ß' ,
	t: 'ⓣｔṫẗťṭțţṱṯŧƭʈⱦꞇ' ,
	th: 'þ' ,
	tz: 'ꜩ' ,
	u: 'ⓤｕùúûũṹūṻŭüǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉ' ,
	v: 'ⓥｖṽṿʋꝟʌ' ,
	vy: 'ꝡ' ,
	w: 'ⓦｗẁẃŵẇẅẘẉⱳ' ,
	x: 'ⓧｘẋẍ' ,
	y: 'ⓨｙỳýŷỹȳẏÿỷẙỵƴɏỿ' ,
	z: 'ⓩｚźẑżžẓẕƶȥɀⱬꝣ'
} ;



function build() {
	var k , i , iMax , str , map = {} ;

	for ( k in inverseMap ) {
		str = inverseMap[ k ] ;

		for ( i = 0 , iMax = str.length ; i < iMax ; i ++ ) {
			map[ str[ i ] ] = k ;
		}
	}

	fs.writeFileSync( __dirname + '/latinize-map.json' , JSON.stringify( map ) , 'utf8' ) ;
}



build() ;



