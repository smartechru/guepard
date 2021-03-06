/*class flash.display.BitmapData*/
/*
import flash.filters.*;
import flash.geom.*;
import flash.utils.*;
*/
(function ()
{
	"use strict";
	
	var d = {};
	
	d._transparent = true;
	d._fillColor = 0xffffffff;
	d._rect = null;
	d._virtualcanvas = null;
	d._context2d = null;
	
	d._cTransformedvirtualcanvas = null;
	d._cTransformedcontext2d = null;
	d._cTransformedAtlas = null;
	
	d._checkTouch_point = null;
	d._checkTouch_matrix = null;
	
	/*public*/
	d.get_width = function ()/*int*/
	{
		return this._rect.width;
	};
	
	/*public*/
	d.get_height = function ()/*int*/
	{
		return this._rect.width;
	};
	
	/*public*/
	d.get_rect = function ()/*Rectangle*/
	{
		return this._rect;
	};
	
	/*public*/
	d.get_transparent = function ()/*Boolean*/
	{
		return this._transparent;
	};
	
	/*public*/
	d.BitmapData = function (width/*int*/, height/*int*/, transparent/*Boolean*/, fillColor/*uint*/)
	{
		width = Math.round(width);
		height = Math.round(height);
		
		if (width > 0 && height > 0)
		{
			this._checkTouch_point = new flash.geom.Point();
			this._checkTouch_matrix = new flash.geom.Matrix();
			
			this._transparent = transparent == undefined ? true : transparent;
			this._fillColor = fillColor == undefined ? 0xffffffff : fillColor;
			
			this._virtualcanvas = document.createElement('canvas');
			this._context2d = this._virtualcanvas.getContext('2d');
			
			this._rect = new flash.geom.Rectangle();
			
			this._setSize(width, height);
			
			if (this._transparent)
			{
				var alpha = (this._fillColor >> 24 & 255) / 255;
				
				this._context2d.globalAlpha = alpha;
			}
			
			this._context2d.fillStyle = flash.numberToHex(this._fillColor);
			this._context2d.fillRect(0, 0, width, height);
			
			this._context2d.globalAlpha = 1;
		}
		else
		{
			throw new Error("Incorect size of BitmapData");
		}
	};
	
	/*private*/
	d._setSize = function (width, height)/*void*/
	{
		width = Math.round(width);
		height = Math.round(height);
		
		this._rect.width = width;
		this._rect.height = height;
		
		this._virtualcanvas.width = width;
		this._virtualcanvas.height = height;
		
		if (this._cTransformedvirtualcanvas)
		{
			this._cTransformedvirtualcanvas.width = width;
			this._cTransformedvirtualcanvas.height = height;
		}
		
		this._cTransformedAtlas = {};
	};
	
	/*public*/
	d.applyFilter = function (sourceBitmapData/*BitmapData*/, sourceRect/*Rectangle*/, destPoint/*Point*/, filter/*BitmapFilter*/)/*void*/
	{
		
	};
	
	/*public*/
	d.clone = function ()/*BitmapData*/
	{
		var bitmapData = new flash.display.BitmapData(this._rect.width, this._rect.height, this._transparent, this._fillColor);
		
		bitmapData.copyPixels(this, this._rect, null, null, null, false);
		
		return bitmapData;
	};
	
	/*public*/
	d.colorTransform = function (rect/*Rectangle*/, colorTransform/*ColorTransform*/)/*void*/
	{
		
	};
	
	/*public*/
	d.compare = function (otherBitmapData/*BitmapData*/)/*Object*/
	{
		return null;
		
	};
	
	/*public*/
	d.copyChannel = function (sourceBitmapData/*BitmapData*/, sourceRect/*Rectangle*/, destPoint/*Point*/, sourceChannel/*uint*/, destChannel/*uint*/)/*void*/
	{
		sourceChannel = /*uint*/Math.floor(sourceChannel);
		destChannel = /*uint*/Math.floor(destChannel);
		
		var s = sourceChannel;
		var d = destChannel;
		
		var sourceData = sourceBitmapData._context2d.getImageData(sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height);
		var sa = sourceData.data;
		
		var destData = this._context2d.getImageData(destPoint.x, destPoint.y, sourceRect.width, sourceRect.height);
		var da = destData.data;
		
		for (var i = 0; i < sa.length; i += 4)
		{
			da[ i + d ] = sa[ i + s ];
		}
		
		this._context2d.putImageData(destData, destPoint.x, destPoint.y);
	};
	
	/*public*/
	d.copyPixels = function (sourceBitmapData/*BitmapData*/, sourceRect/*Rectangle*/, destPoint/*Point*/, alphaBitmapData/*BitmapData*/, alphaPoint/*Point*/, mergeAlpha/*Boolean*/)/*void*/
	{
		if (alphaBitmapData == undefined) alphaBitmapData = null;
		if (alphaPoint == undefined) alphaPoint = null;
		if (mergeAlpha == undefined) mergeAlpha = false;
		
		if (!sourceRect)
		{
			sourceRect = new flash.geom.Rectangle(0, 0, sourceBitmapData.width, sourceBitmapData.height);
		}
		
		if (!destPoint)
		{
			destPoint = new flash.geom.Point();
		}
		
		var sourceContext = sourceBitmapData._virtualcanvas.getContext("2d");
		var dataCopy = sourceContext.getImageData(sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height);
		
		this._context2d.putImageData(dataCopy, destPoint.x, destPoint.y);
	};
	
	/*public*/
	d.dispose = function ()/*void*/
	{
		this._virtualcanvas = null;
		this._context2d = null;
		
		this._cTransformedvirtualcanvas = null;
		this._cTransformedcontext2d = null;
		this._cTransformedAtlas = null;
		
		this._checkTouch_point = null;
		this._checkTouch_matrix = null;
	};
	
	/*public*/
	d.draw = function (source/*IBitmapDrawable*/, matrix/*Matrix*/, colorTransform/*ColorTransform*/, blendMode/*String*/, clipRect/*Rectangle*/, smoothing/*Boolean*/)/*void*/
	{
		if (matrix == undefined) matrix = new flash.geom.Matrix();
		if (colorTransform == undefined) colorTransform = new flash.geom.ColorTransform();
		if (blendMode == undefined) blendMode = flash.display.BlendMode.NORMAL;
		if (clipRect == undefined) clipRect = new flash.geom.Rectangle(0, 0, this._rect.width, this._rect.height);
		if (smoothing == undefined) smoothing = false;
		
		var render = flash.display.BitmapData._render;
		render.setCanvas(this._virtualcanvas, this._context2d, this._rect.width, this._rect.height);
		render._baseMatrix = matrix;
		
		source._render_(render);
	};
	
	/*public*/
	d.fillRect = function (rect/*Rectangle*/, color/*uint*/)/*void*/
	{
		color = /*uint*/Math.floor(color);
		
		this._context2d.clearRect(rect.x, rect.y, rect.width, rect.height);
	};
	
	/*public*/
	d.floodFill = function (x/*int*/, y/*int*/, color/*uint*/)/*void*/
	{
		x = /*int*/Math.floor(x);
		y = /*int*/Math.floor(y);
		color = /*uint*/Math.floor(color);
		
		//TODO
	};
	
	/*public*/
	d.generateFilterRect = function (sourceRect/*Rectangle*/, filter/*BitmapFilter*/)/*Rectangle*/
	{
		return null;
		
	};
	
	/*public*/
	d.getColorBoundsRect = function (mask/*uint*/, color/*uint*/, findColor/*Boolean*/)/*Rectangle*/
	{
		mask = /*uint*/Math.floor(mask);
		color = /*uint*/Math.floor(color);
		if (findColor == undefined) findColor = true;
		
		return null;
		
	};
	
	/*public*/
	d.getPixel = function (x/*int*/, y/*int*/)/*uint*/
	{
		x = /*int*/Math.floor(x);
		y = /*int*/Math.floor(y);
		
		if (x < 0 || y < 0 || x >= this._rect.width || y >= this._rect.height)
		{
			return 0;
		}
		else
		{
			var d = this._context2d.getImageData(x, y, 1, 1).data;
			
			var r = d[ 1 ];
			var g = d[ 2 ];
			var b = d[ 3 ];
			
			return r << 16 | g << 8 | b;
		}
	};
	
	/*public*/
	d.getPixel32 = function (x/*int*/, y/*int*/)/*uint*/
	{
		x = /*int*/Math.floor(x);
		y = /*int*/Math.floor(y);
		
		if (x < 0 || y < 0 || x >= this._rect.width || y >= this._rect.height)
		{
			return 0;
		}
		else
		{
			var d = this._context2d.getImageData(x, y, 1, 1).data;
			
			var r = d[ 0 ];
			var g = d[ 1 ];
			var b = d[ 2 ];
			var a = d[ 3 ];
			
			return a << 24 | r << 16 | g << 8 | b;
		}
		
	};
	
	/*public*/
	d.getPixels = function (rect/*Rectangle*/)/*ByteArray*/
	{
		return null;
	};
	
	/*public*/
	d.hitTest = function (firstPoint/*Point*/, firstAlphaThreshold/*uint*/, secondObject/*Object*/, secondBitmapDataPoint/*Point*/, secondAlphaThreshold/*uint*/)/*Boolean*/
	{
		firstAlphaThreshold = /*uint*/Math.floor(firstAlphaThreshold);
		if (secondBitmapDataPoint == undefined) secondBitmapDataPoint = null;
		if (secondAlphaThreshold == undefined) secondAlphaThreshold = 1;
		secondAlphaThreshold = /*uint*/Math.floor(secondAlphaThreshold);
		
		return false;
		
	};
	
	/*public*/
	d.lock = function ()/*void*/
	{
		
	};
	
	/*public*/
	d.merge = function (sourceBitmapData/*BitmapData*/, sourceRect/*Rectangle*/, destPoint/*Point*/, redMultiplier/*uint*/, greenMultiplier/*uint*/, blueMultiplier/*uint*/, alphaMultiplier/*uint*/)/*void*/
	{
		redMultiplier = /*uint*/Math.floor(redMultiplier);
		greenMultiplier = /*uint*/Math.floor(greenMultiplier);
		blueMultiplier = /*uint*/Math.floor(blueMultiplier);
		alphaMultiplier = /*uint*/Math.floor(alphaMultiplier);
		
		
	};
	
	/*public*/
	d.noise = function (randomSeed/*int*/, low/*uint*/, high/*uint*/, channelOptions/*uint*/, grayScale/*Boolean*/)/*void*/
	{
		randomSeed = /*int*/Math.floor(randomSeed);
		if (low == undefined) low = 0;
		low = /*uint*/Math.floor(low);
		if (high == undefined) high = 255;
		high = /*uint*/Math.floor(high);
		if (channelOptions == undefined) channelOptions = 7;
		channelOptions = /*uint*/Math.floor(channelOptions);
		if (grayScale == undefined) grayScale = false;
		
		
	};
	
	/*public*/
	d.paletteMap = function (sourceBitmapData/*BitmapData*/, sourceRect/*Rectangle*/, destPoint/*Point*/, redArray/*Array*/, greenArray/*Array*/, blueArray/*Array*/, alphaArray/*Array*/)/*void*/
	{
		if (redArray == undefined) redArray = null;
		if (greenArray == undefined) greenArray = null;
		if (blueArray == undefined) blueArray = null;
		if (alphaArray == undefined) alphaArray = null;
		
		
	};
	
	/*public*/
	d.perlinNoise = function (baseX/*Number*/, baseY/*Number*/, numOctaves/*uint*/, randomSeed/*int*/, stitch/*Boolean*/, fractalNoise/*Boolean*/, channelOptions/*uint*/, grayScale/*Boolean*/, offsets/*Array*/)/*void*/
	{
		numOctaves = /*uint*/Math.floor(numOctaves);
		randomSeed = /*int*/Math.floor(randomSeed);
		if (channelOptions == undefined) channelOptions = 7;
		channelOptions = /*uint*/Math.floor(channelOptions);
		if (grayScale == undefined) grayScale = false;
		if (offsets == undefined) offsets = null;
		
		
	};
	
	/*public*/
	d.pixelDissolve = function (sourceBitmapData/*BitmapData*/, sourceRect/*Rectangle*/, destPoint/*Point*/, randomSeed/*int*/, numPixels/*int*/, fillColor/*uint*/)/*int*/
	{
		if (randomSeed == undefined) randomSeed = 0;
		randomSeed = /*int*/Math.floor(randomSeed);
		if (numPixels == undefined) numPixels = 0;
		numPixels = /*int*/Math.floor(numPixels);
		if (fillColor == undefined) fillColor = 0;
		fillColor = /*uint*/Math.floor(fillColor);
		
		return 0;
		
	};
	
	/*public*/
	d.scroll = function (x/*int*/, y/*int*/)/*void*/
	{
		x = /*int*/Math.floor(x);
		y = /*int*/Math.floor(y);
		
		
	};
	
	/*public*/
	d.setPixel = function (x/*int*/, y/*int*/, color/*uint*/)/*void*/
	{
		x = /*int*/Math.floor(x);
		y = /*int*/Math.floor(y);
		color = /*uint*/Math.floor(color);
		
		if (x < 0 || y < 0 || x >= this._rect.width || y >= this._rect.height) return;
		
		var r = (value >> 16) & 0xff;
		var g = (value >> 8) & 0xff;
		var b = value & 0xff;
		
		var data = this._context2d.getImageData(x, y, 1, 1);
		
		var d = data.data;
		
		d[ i ] = r;
		d[ i ] = g;
		d[ i ] = b;
		
		this._context2d.putImageData(data, x, y);
	};
	
	/*public*/
	d.setPixel32 = function (x/*int*/, y/*int*/, color/*uint*/)/*void*/
	{
		x = /*int*/Math.floor(x);
		y = /*int*/Math.floor(y);
		color = /*uint*/Math.floor(color);
		
		if (x < 0 || y < 0 || x >= this._rect.width || y >= this._rect.height) return;
		
		var a = (value >> 24) & 0xff;
		var r = (value >> 16) & 0xff;
		var g = (value >> 8) & 0xff;
		var b = value & 0xff;
		
		var data = this._context2d.getImageData(x, y, 1, 1);
		
		var d = data.data;
		
		d[ 0 ] = r;
		d[ 1 ] = g;
		d[ 2 ] = b;
		d[ 3 ] = a;
		
		this._context2d.putImageData(data, x, y);
	};
	
	/*public*/
	d.setPixels = function (rect/*Rectangle*/, inputByteArray/*ByteArray*/)/*void*/
	{
		
	};
	
	/*public*/
	d.threshold = function (sourceBitmapData/*BitmapData*/, sourceRect/*Rectangle*/, destPoint/*Point*/, operation/*String*/, threshold/*uint*/, color/*uint*/, mask/*uint*/, copySource/*Boolean*/)/*uint*/
	{
		threshold = /*uint*/Math.floor(threshold);
		if (color == undefined) color = 0;
		color = /*uint*/Math.floor(color);
		//if (mask == undefined) mask = 4.29497e + 009;//not works - check
		mask = /*uint*/Math.floor(mask);
		if (copySource == undefined) copySource = false;
		
		return 0;
		
	};
	
	/*public*/
	d.unlock = function (changeRect/*Rectangle*/)/*void*/
	{
		if (changeRect == undefined) changeRect = null;
	};
	
	d._equalsColor = function (color1, color2)
	{
		for (var i = 0; i < color1.length; i++)
		{
			if (color1[ i ] != color2[ i ]) return false;
		}
		
		return true;
	};
	
	d._getTransfomedCanvas = function (map, colorTransform, filters)
	{
		map.x = Math.floor(map.x);
		map.y = Math.floor(map.y);
		map.width = Math.floor(map.width);
		map.height = Math.floor(map.height);
		
		if (!this._cTransformedvirtualcanvas)
		{
			this._cTransformedvirtualcanvas = document.createElement('canvas');
			this._cTransformedvirtualcanvas.width = this._virtualcanvas.width;
			this._cTransformedvirtualcanvas.height = this._virtualcanvas.height;
			this._cTransformedcontext2d = this._cTransformedvirtualcanvas.getContext('2d');
			this._cTransformedAtlas = {};
		}
		
		var id = map.x + "_" + map.y + "_" + map.width + "_" + map.height;
		var value = colorTransform._toValue();
		
		for (var i in filters)
		{
			value += "_" + filters[ i ]._toValue();
		}
		
		if (this._cTransformedAtlas[ id ] != value)
		{
			this._cTransformedAtlas[ id ] = value;
			
			var mr = colorTransform.redMultiplier;
			var mg = colorTransform.greenMultiplier;
			var mb = colorTransform.blueMultiplier;
			var ma = colorTransform.alphaMultiplier;
			
			var or = colorTransform.redOffset;
			var og = colorTransform.greenOffset;
			var ob = colorTransform.blueOffset;
			var oa = colorTransform.alphaOffset;
			
			var imagedata = this._context2d.getImageData(map.x, map.y, map.width, map.height);
			
			var d = imagedata.data;
			
			var i = 0;
			
			if (!colorTransform.isEmpty())
			{
				//var time = flash.utils.getTimer();
				
				i = d.length;
				
				while (i--)
				{
					if (d[ i ])
					{
						d[ i ] = d[ i ] * ma + oa;
						i--;
						d[ i ] = d[ i ] * mb + ob;
						i--;
						d[ i ] = d[ i ] * mg + og;
						i--;
						d[ i ] = d[ i ] * mr + or;
					}
					else
					{
						i -= 3;
					}
				}
				
				//console.log(flash.utils.getTimer() - time);
			}
			
			for (i in filters)
			{
				var filter = filters[ i ];
				filter._apply(d, map.width, map.height);
			}
			
			this._cTransformedcontext2d.putImageData(imagedata, map.x, map.y);
		}
		
		return this._cTransformedvirtualcanvas;
	};
	
	d._checkTouch = function (x, y, displayObject)
	{
		if (this._rect)
		{
			this._checkTouch_point.x = x;
			this._checkTouch_point.y = y;
			
			this._checkTouch_point = displayObject.globalToLocal(this._checkTouch_point);
			
			if (this._rect.containsPoint(this._checkTouch_point))
			{
				return this._checkTouch_point;
			}
		}
		
		return null;
	};
	
	var s = {};
	
	s.__init__ = function ()
	{
		this._render = new flash.display.Render2d(null, 100, 100);
	}
	
	flash.addDescription("flash.display.BitmapData", d, null, s, [ "flash.display.IBitmapDrawable" ]);
	
}
());
