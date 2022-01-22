/*
	Tree Kit

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
var i , j , l , k , v , o = {} ;
module.exports = o ;



for ( i = 0 ; i < 10000 ; i ++ )
{
	k = '' ;
	
	for ( j = 0 , l = 1 + Math.floor( Math.random() * 30 ) ; j < l ; j ++ )
	{
		k += String.fromCharCode( 0x61 + Math.floor( Math.random() * 26 ) ) ;
	}
	
	switch ( i % 3 )
	{
		case 0 :
			v = '' ;
			for ( j = 0 , l = 1 + Math.floor( Math.random() * 100 ) ; j < l ; j ++ )
			{
				v += String.fromCharCode( 0x20 + Math.floor( Math.random() * 0x60 ) ) ;
			}
			break ;
		case 1 :
			v = Math.random() * 1000000 ;
			break ;
		case 2 :
			v = Math.random() > 0.8 ? null : ( Math.random() > 0.5 ? true : false ) ;
			break ;
	}
	
	o[ k ] = v ;
}
