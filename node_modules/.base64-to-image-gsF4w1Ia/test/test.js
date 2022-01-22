var base64ToImage = require('../index');
var should = require('should');
var fs = require('fs');

describe('Base64 to image', function () {
    it('should throw an error when base64 argument is null', function (done) {
      
	  var base64Info = function(){
			base64ToImage(null, '/opt', {'fileName':'test'});
	  };
	  
	  base64Info.should.throw('Missing mandatory arguments base64 string and/or path string');
	  
	  done();
    });
	
	
	 it('should throw an error when path argument is null', function (done) {
      
	  var base64Info = function(){
			base64ToImage(null, null, {'fileName':'test'});
	  };
	  
	  base64Info.should.throw('Missing mandatory arguments base64 string and/or path string');
	  
	  done();
    });
	
	 it('should throw an error when an invalid base64 argument is passed', function (done) {
      
	  var base64Info = function(){
			base64ToImage('invalid string', '/opt', {'fileName':'test'});
	  };
	  
	  base64Info.should.throw('Invalid base64 string');
	  
	  done();
    }); 
	
	it('should decode base64 and save image to disk', function (done) {
      var base64Str = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAADsElEQVQ4Eb3BfUzUdRzA8c/9ft/fwYWWgLWdIE6Gcy4lBmLIfAofFhpsSFQWwSxWmthEkocciKQmpweesAHJk5gIRCYXB17xJKDmUNOpm1qtiazWfF6TNNB3ra3NOWv1j6+XPB6nxV9uSKwa8Eq39ocWyhnJk33ysvwqz8h/Nii+Mijb5bZ2xXojlKS+FuKOVRH441ziD5QT0Bc5+GxbyjJJE4v8k10iU5onaxlBTaZ+vwHB59Y4lh1xUdAMQVcXMubOeCIGk8lqP8uH9T+zpKKmx9LoHSCP4hRVeDJYxzFXpyVEozpMYU8wKM5IYdLlyZhGBDXkQfBADPbW29g+g5WOn0rlYTNFLP2iLpTGa7j8FS2TNDpNih7R6fcU4kuErW9ZiPohDUfXNUrcUHQANu2GVNu1BHnQeqUiDyj9nj1Cp2+sTqtVJ3O1ibFHhOm1QlaKsPeNOWw4dZFy12/Uz45nt/04didkV98/JXl4yt+KlMrbZdb5wmTQFqTR9qSBI1ojar+GuiPUhWg4txyi4jDYd35Dp4cne8rPY3fBtqyuEee4aZnlIob8yeQW1V0VqajzVzRM0WgZpdGtG3R5CwvqrRweH0RF003KeqBo+RZ6Jk6l1H2P7Zs6aFUG55XOUcMIlUQRa6+mXS+bFk6bj5m6QKEpbD65H/ezeeMeMtfO5NCMV9h5EIrdUBE8j/bYVBwdUBwchcs3gBpPLy4oNUvylczs9npqqGRiOF+P0fjcV1EVmcz7ZWfIbBjGOTWahhWf4HCBvfoK+0d705TvxlZ5iU8to6iMTqPUwzL0vYcESZ6IeU3Ea/PWhcfdrQ2cjtNspl2ERh/FiqxYWq3+lHzQwmp3P2tzCuj0Hkdl4z02r6qh2dePouh0GkXOImKWv+ShLUy0976eupf1r26hInwprX5TyXk7iqMiHDaNwjbLzLuLhfrgMUS3Z5C1eCmuCWGUBT5Ph8gOedDs2MwlcSm7WJ7TS+q278guGqBg4zlqYtPZG/YE1TM0yv11LonBVz5C3gSh2zyaNmUMHzOM6fKwBQkf2RLTnKzKP8m6wstsKBvhnS/PYRrWsVwXwttMpGXrFCUpXnAoTpg9R04bhkMebZ6KSSzOT04/+PuagotkOX4ht2yIud/mYBl+GkEQBMGM182ArY1+fiHHRQz5Ny8ll8xPWuvev3LDiVvptkFyC+/yXFcScl3uq6sebv/Ts14UwST/R8ybtROT0zoWLcrY/p7a55kvHTJHREzyOPwBUd786O/7n3YAAAAASUVORK5CYII=';
	  var path =  __dirname + '/';
	  var optionalObj = {'fileName':'image_test'};
	  var fileSaved = false;
	  
	  var imageInfo = base64ToImage(base64Str, path, optionalObj);
	  
	  if (fs.existsSync('test/image_test.png')) {
         fileSaved = true;
	  }  

      fileSaved.should.true;
	  imageInfo.should.have.property('imageType', 'png');
	  imageInfo.should.have.property('fileName', 'image_test.png');	  
	  
	  done();
    });
});