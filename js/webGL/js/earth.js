class Earth {
	constructor(opt) {
		this.linesCache = [];
		this.isAnimate = false;
		this.radius = 100;
		this.segments = 60;
		this.rotateX = 0;
		this.rotateY = 0;
		this.rotateVX = 0;
		this.rotateVY = 0;
		this.rotateXMax = 90 * Math.PI / 180;
		this.rotateTargetX = 0;
		this.rotateTargetY = 0;
		this.dragging = false;
		this.apply(this, opt);
		this.wrap = this.el.get ? this.el.get(0) : (typeof this.el == "string" ? document.getElementById(this.el) : this.el);
		this.el = document.createElement("div");
		this.el.className = "user-select";
		this.el.style = "user-select: none;";
		this.wrap.appendChild(this.el);
		this.containt = document.createElement("div");
		this.containt.style = "user-select: none;";
		this.wrap.appendChild(this.containt);
		this.initScene();
	}
	apply(a, b) {
    if(a && b && typeof b == 'object') {
      for(var p in b) {
        a[p] = b[p];
      }
    }
    return a;
  }
  initScene() {
		if(!this.renderer) {
			this.renderer = new THREE.WebGLRenderer({
	  		antialias: false,
	  		alpha: true
	  	});
	  	this.renderer.setSize(window.innerWidth, window.innerHeight);
	  	this.renderer.autoClear = false;
	  	this.renderer.sortObjects = false;		
	  	this.renderer.generateMipmaps = false;					
	  	this.el.appendChild(this.renderer.domElement);
		}
		if(!this.scene) {
			this.scene = new THREE.Scene();
	  	this.scene.matrixAutoUpdate = false;
		}
		if(!this.camera) {
			this.camera = new THREE.PerspectiveCamera(12, window.innerWidth / window.innerHeight, 1, 20000);
	  	this.camera.position.z = 1200;
	  	this.camera.position.y = 0;
	  	//this.camera.lookAt(this.scene.width / 2, this.scene.height / 2);
	  	this.scene.add(this.camera);
		}
		if(!this.rotating) {
			this.rotating = new THREE.Object3D();
	  	this.scene.add(this.rotating);
		}
		if(!this.visualizationMesh) {
			this.visualizationMesh = new THREE.Object3D();
	  	this.rotating.add(this.visualizationMesh);
		}
		if(!this.sphere) {
    	this.sphere = new THREE.Mesh(
    	  new THREE.SphereGeometry(this.radius, this.segments, this.segments),
    	  new THREE.MeshLambertMaterial({
    	    //map: new THREE.ImageUtils.loadTexture("js/webGL/images/earth.jpg"),
    	  	//map: new THREE.ImageUtils.loadTexture("js/webGL/images/earth_political_alpha.png"),  	
    	  	//map: new THREE.ImageUtils.loadTexture("js/webGL/images/fire4.png"),  	
    	  	map: new THREE.ImageUtils.loadTexture("js/webGL/images/map.png"),    	  	
    	  	color: 0x0A3B48,
    	  	transparent: true,
    	  	opacity: 0.6,
//    	  	blending: THREE.AdditiveBlending,
//    	    side: THREE.DoubleSide,
//    	    fog: true,
//    	    depthWrite: false,
//    	    depthTest: false
    	  })
    	);
    	this.rotating.add(this.sphere);
		}
//		if(!this.sphere) {
//  		this.sphere = new THREE.Mesh(
//  		  new THREE.SphereGeometry(this.radius, this.segments, this.segments),
//  		  new THREE.MeshLambertMaterial({
//  		  	transparent: true,
//  		  	opacity: 1.0,
//  		  	color: 0x287299,
//  		  	//map: new THREE.ImageUtils.loadTexture("js/webGL/images/earth.jpg")
//  		  	map: new THREE.ImageUtils.loadTexture("js/webGL/images/earth_political_alpha.png")
//  		  })
//  		);
//  		this.rotating.add(this.sphere);
//  		
//  		/*var shadeGeo = new THREE.SphereGeometry(this.radius + 1, this.segments, this.segments);
//  		var shadeMesh = new THREE.Mesh(shadeGeo, new THREE.ShaderMaterial({
//        vertexShader: `
//          varying vec3 vNormal;
//          void main() {
//            //vNormal = normalize(normal);
//            vNormal = normalize(normalMatrix * normal);
//            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//          }
//        `,
//        fragmentShader: `
//          varying vec3 vNormal;
//          void main() {
//            float intensity = pow(0.3 - dot(vNormal, vec3(0.0, 0.0, 0.8)), 1.0);
//            vec3 glow = vec3(1.0, 0.0, 0) * intensity;
//            gl_FragColor = vec4(glow, 1.0);
//          }
//        `,
//        side: THREE.BackSide,
//        blending: THREE.AdditiveBlending,
//        opacity: 0.6,
//        transparent: true
//      }));
//  		shadeMesh.scale.set(1.1, 1.1, 1.1);
//      this.rotating.add(shadeMesh);*/
//  		this.sphere.add(new THREE.Mesh(
//  			new THREE.SphereGeometry(this.radius + 1, this.segments, this.segments), 
//  			new THREE.MeshLambertMaterial({
//  			  transparent: true,
//  			  color: 0xE64853,
//  			  blending: THREE.AdditiveBlending,
//  			  opacity: 0.6,
//  			  map: new THREE.ImageUtils.loadTexture("js/webGL/images/fire4.png")
//  		  })
//  		));
//  		/*this.sphere.add(new THREE.Mesh(
//  			new THREE.SphereGeometry(this.radius + 2, 50, 50),
//  			new THREE.MeshLambertMaterial({
//  			  blending: THREE.AdditiveBlending,
//  			  transparent: true,
//  			  color: 0x2AC7CC,
//  			  opacity: 0.8,
//  			  map: new THREE.ImageUtils.loadTexture("js/webGL/images/earth_political_alpha.png")
//  		  })
//  		));*/
//  		
//  	}
		var img0 = new Image();
		img0.src = "js/webGL/images/map_inverted.png";
		img0.onload = () => {
			this.rotating.add(this.showEarth(img0));
		}
		this.ring();
		this.initLinght();
		
		this.initFlightLine({
      lon: -43,
      lat: -22
    }, {
      lon: 116,
      lat: 40
    });
		this.initFlightLine({
      lon: -179,
      lat: 30
    }, {
      lon: 116,
      lat: 40
    });
		this.initFlightLine({
      lon: 140,
      lat: 35
    }, {
      lon: 116,
      lat: 40
    });
		this.initFlightLine({
      lon: 121.5,
      lat: 25
    }, {
      lon: 116,
      lat: 40
    });
		this.initFlightLine({
      lon: 106.5,
      lat: 6.2
    }, {
      lon: 116,
      lat: 40
    });
		this.initFlightLine({
      lon: 149,
      lat: -35
    }, {
      lon: 116,
      lat: 40
    });
		//this.initMap();
  	//this.sphere.rotation.y = (Math.PI / 180) * 270;
    //this.scene.add(this.earthContainer);
		
  	//this.rotating.rotation.y = (Math.PI / 180) * 270;
  	THREEx.WindowResize(this.renderer, this.camera);
  	//this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);
  	this.initTrackballControls();
	}
  ring() {
  	var geometry = new THREE.CubeGeometry(480, 480, 1);
    var material = new THREE.MeshBasicMaterial({
    	map: THREE.ImageUtils.loadTexture("js/webGL/images/radial_layers_medium.jpg"),
    	//color: 0xCB0A0A,
    	opacity: 0.4,
			blending: THREE.AdditiveBlending
    });
    var cube = new THREE.Mesh(geometry, material);
    //cube.position.z = 10;
    this.scene.add(cube);
  }
  showEarth(img) {
  	var globeCloudVerticesArray = [], globeCloud, offset = 5;
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var geo = new THREE.Geometry();
    for (var i = 0; i < imageData.data.length; i += offset) {
      var curX = i / 4 % canvas.width;
      var curY = (i / 4 - curX) / canvas.width;
      if (i / offset % 2 === 1 && curY % 2 === 1) {
        var color = imageData.data[i];
        if (color === 0) {
          var x = curX;
          var y = curY;
          var lat = (y / (canvas.height / 180) - 90) / -1;
          var lng = x / (canvas.width / 360) - 180;
          geo.vertices.push(this.getVector3(lat, lng, this.radius));
        }
      }
    }
    var uniforms = {
  		color: {
  			type: "c",
  			//value: new THREE.Color(0x082B37)
        value: new THREE.Color(0x0A3B48)
  		}
  	};
    var mat = new THREE.ShaderMaterial({
    	uniforms: uniforms,    	
      vertexShader: `
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
			    gl_PointSize = 3.0;
			    gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        void main() {
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      blending: THREE.AdditiveBlending,
  		depthTest: true,
  		depthWrite: false,
  		transparent: true
    });
    /*var mat = new THREE.MeshBasicMaterial({
  	  transparent: true,
  	  color: 0xE64853,
  	  opacity: 1.0
    });*/
    var globeCloud = new THREE.ParticleSystem(geo, mat);
    globeCloud.sortParticles = true;
    return globeCloud;
  }
  /*getPos(lat, lon) {
    var phi = (90 - lat) * Math.PI / 180;
    var theta = (lon - 180) * Math.PI / 180;
	  var center {};
	  center.x = -this.radius * Math.sin(phi) * Math.cos(theta);
	  center.y = this.radius * Math.cos(phi);
	  center.z = this.radius * Math.sin(phi) * Math.sin(theta);
    return center;
  }*/
  initFlightLine(start, end) {
  	var attributes = {
  		pos: {
  			type: 'f',
  			value: []
  	  }
  	};
  	var number, pointNum = 0.08;
  	var linesGeo = new THREE.Geometry();
  	if(Math.abs(start["lon"] - end["lon"]) > 180) {
  		number = Math.ceil(Math.abs(-180 - start["lon"] - (180 - end["lon"])) / pointNum);
  		number = Math.ceil(Math.abs(-180 - start["lon"] - (180 - end["lon"])) / pointNum);
      var num1, num2;
      var a1, a2;
      a1 = -180 - start["lon"];
      a2 = 180 - end["lon"];
      num1 = Math.ceil(number * Math.abs(a1) / (a2 - a1));
      var lonP = Math.abs(start["lon"] - end["lon"]) / number;
      var latP = Math.abs(start["lat"] - end["lat"]) / number;
      for (var i = 1; i < number; i++) {
        var lonTmp, latTmp;
        if (i <= num1) {
        	lonTmp = start["lon"] + i * a1 / num1;
        } else {
        	lonTmp = 180 - (i - num1) * a2 / (number - num1);
        }
        if (start["lat"] > end["lat"]) {
          latTmp = start["lat"] - i * latP;
        } else if (start["lat"] < end["lat"]) {
          latTmp = start["lat"] + i * latP;
        }
        var r, h = this.radius / 10;
        if (i <= number / 2) {
          r = this.radius + 4 * h / (number + 2) * i - (i * (i - 1 ) / 2) * 8 * h / (Math.pow(number, 2) + 2 * number);
        } else {
          var count = number - i;
          r = this.radius + 4 * h / (number + 2) * count - (count * (count - 1 ) / 2) * 8 * h / (Math.pow(number, 2) + 2 * number);
        }
        linesGeo.vertices.push(this.getVector3(latTmp, lonTmp, r));
        attributes.pos.value.push(i);
      }
  	} else {
  		if (Math.abs(start["lon"] - end["lon"]) > Math.abs(start["lat"] - end["lat"])) {
        number = Math.ceil(Math.abs(start["lon"] - end["lon"]) / pointNum);
      } else {
        number = Math.ceil(Math.abs(start["lat"] - end["lat"]) / pointNum);
      }
      var lonP = Math.abs(start["lon"] - end["lon"]) / number;
      var latP = Math.abs(start["lat"] - end["lat"]) / number;
      for (var i = 1; i < number; i++) {
        var lonTmp, latTmp;
        if (start["lon"] > end["lon"]) {
          lonTmp = start["lon"] - i * lonP;
        } else if (start["lon"] < end["lon"]) {
          lonTmp = start["lon"] + i * lonP;
        }
        if (start["lat"] > end["lat"]) {
          latTmp = start["lat"] - i * latP;
        } else if (start["lat"] < end["lat"]) {
          latTmp = start["lat"] + i * latP;
        }
        var r, h = this.radius / 10;
        if (i <= number / 2) {
          r = this.radius + 4 * h / (number + 2) * i - (i * (i - 1 ) / 2) * 8 * h / (Math.pow(number, 2) + 2 * number);
        } else {
          var count = number - i;
          r = this.radius + 4 * h / (number + 2) * count - (count * (count - 1 ) / 2) * 8 * h / (Math.pow(number, 2) + 2 * number);
        }
        linesGeo.vertices.push(this.getVector3(latTmp, lonTmp, r));
        attributes.pos.value.push(i);
      }
  	}
  	var uniforms = {
			c: {
				type: "f",
				value: 1.0
		  },
			p: {
				type: "f",
				value: 1.4
			},
			glowColor: {
				type: "c",
				value: new THREE.Color(0xffff00)
			},
			viewVector: {
				type: "v3",
				value: this.camera.position
			},
			time: {
  			type: "f",
  			value: 0.0
  		},
  		color: {
  			type: "c",
  			//value: new THREE.Color(0xdd380c)
  			value: new THREE.Color(0xE08133)
  		},
  		texture: {
  			type: "t",
  			value: 0,
  			texture: THREE.ImageUtils.loadTexture("js/webGL/images/particleA.png")
  		}
  	};
    var shaderMaterial = new THREE.ShaderMaterial({
    	attributes: attributes,
    	uniforms: uniforms,
      vertexShader: `
        uniform vec3 viewVector;
        uniform float c;
        uniform float p;
        varying float intensity;
        attribute float pos;
        varying float vPos;
        varying vec3 vNormal;
        uniform float time;
        void main() {
          vPos = pos;
          if(vPos >= time && vPos <= time + 60.0) {
            //vNormal = normalize(normal);
            gl_PointSize = 3.0;
          } else {
            gl_PointSize = 2.0;
          }
          //vec3 vNormal = normalize(normalMatrix * normal);
        	//vec3 vNormel = normalize(normalMatrix * viewVector);
        	//intensity = pow(c - dot(vNormal, vNormel), p);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        varying vec3 vColor;
        varying float vPos;
        varying vec3 vNormal;
        uniform sampler2D texture;
        uniform vec3 glowColor;
        varying float intensity;
        void main() {
          //float light = 1.0 - fract((1.0) + fract(time * 0.6));
          //vec3 glow = glowColor * intensity;
          if(vPos >= time && vPos <= time + 60.0) {
            //gl_FragColor = vec4(vec3(light, 0.0, 0.0) * (1.0 - 0.5), 1.0);
            //gl_FragColor = 2.0 * vec4(1.0, 0.0, 0.0, 1.0);
            //gl_FragColor = vec4(color, 1.0);
            //gl_FragColor = gl_FragColor * texture2D(texture, gl_PointCoord);
            gl_FragColor = vec4(color, 1.0);
	          //gl_FragColor = gl_FragColor * texture2D(texture, gl_PointCoord);
	        } else {
	          gl_FragColor = vec4(color, 0.1);
	        }
        }
      `,
      blending: THREE.AdditiveBlending,
  		depthTest: true,
  		depthWrite: false,
  		transparent: true
    });
    //var splineOutline = new THREE.Line(geo, shaderMaterial);
    var points = new THREE.ParticleSystem(linesGeo, shaderMaterial);
    this.rotating.add(points);
    this.linesCache.push(points);
    points.update = function() {
    	/*var path = this.geometry.vertices.length;
	  	if(shaderMaterial.uniforms.time.value >= path) {
	  		shaderMaterial.uniforms.time.value = 0;
	  	} else {
	  		shaderMaterial.uniforms.time.value += 2;
	  	}*/
    	//particle.lerpN += 0.05;
    	if(this.material.uniforms.time.value >= this.geometry.vertices.length) {
    		this.material.uniforms.time.value = 0;
    	} else {
    		this.material.uniforms.time.value += 9.5;
    	}
    	this.geometry.verticesNeedUpdate = true;
    }
    
    
  	/*var src = store[0]["src"];
  	var dst = store[0]["dst"];
    var segments = [];
    var number;
    if (Math.abs(src["lon"] - dst["lon"]) > 180) {
      number = Math.ceil(Math.abs(-180 - src["lon"] - (180 - dst["lon"])) / 0.1);
      var num1, num2;
      var a1, a2;
      a1 = -180 - src["lon"];
      a2 = 180 - dst["lon"];
      num1 = Math.ceil(number * Math.abs(a1) / (a2 - a1));
      var lngP = Math.abs(src["lon"] - dst["lon"]) / number;
      var latP = Math.abs(src["lat"] - dst["lat"]) / number;
      segments.push( {
        lon: src["lon"],
        lat: src["lat"]
      });
      for (var index = 1; index < number; index++) {
        var lngTmp, latTmp;
        if (index <= num1)
          lngTmp = src["lon"] + index * a1 / num1;
        else
          lngTmp = 180 - (index - num1) * a2 / (number - num1);
        if (src["lat"] > dst["lat"]) {
          latTmp = src["lat"] - index * latP;
        } else if (src["lat"] < dst["lat"]) {
          latTmp = src["lat"] + index * latP;
        }
        segments.push({
          lon: lngTmp,
          lat: latTmp
        });
      }
      segments.push({
        lon: dst["lon"],
        lat: dst["lat"]
      });
    } else {
      if (Math.abs(src["lon"] - dst["lon"]) > Math.abs(src["lat"] - dst["lat"])) {
        number = Math.ceil(Math.abs(src["lon"] - dst["lon"]) / 0.1);
      } else {
        number = Math.ceil(Math.abs(src["lat"] - dst["lat"]) / 0.1);
      }
      var lngP = Math.abs(src["lon"] - dst["lon"]) / number;
      var latP = Math.abs(src["lat"] - dst["lat"]) / number;
      segments.push({
        lon: src["lon"],
        lat: src["lat"]
      });
      for (var index = 1; index < number; index++) {
        var lngTmp, latTmp;
        if (src["lon"] > dst["lon"]) {
          lngTmp = src["lon"] - index * lngP;
        } else if (src["lon"] < dst["lon"]) {
          lngTmp = src["lon"] + index * lngP;
        }
        if (src["lat"] > dst["lat"]) {
          latTmp = src["lat"] - index * latP;
        } else if (src["lat"] < dst["lat"]) {
          latTmp = src["lat"] + index * latP;
        }
        segments.push({
          lon: lngTmp,
          lat: latTmp
        });
      }
      segments.push({
        lon: dst["lon"],
        lat: dst["lat"]
      });
    }
    var flightPointsMaterial = new THREE.PointsMaterial({
    	transparent: true,
      opacity: 0.5,        	
      vertexColors: true,
      color: 0xffffff,
      size: 1,
      depthWrite: false
    });
    var flightPointsGeometry = new THREE.Geometry();
    for (var index = 1; index < segments.length - 1; index++) {
      var r, h = radius / 10;
      if (index <= number / 2) {
        r = radius + 4 * h / (number + 2) * index - (index * (index - 1 ) / 2) * 8 * h / (Math.pow(number, 2) + 2 * number );
      } else {
        var i = number - index;
        r = radius + 4 * h / (number + 2) * i - (i * (i - 1 ) / 2) * 8 * h / (Math.pow(number, 2) + 2 * number );
      }
      var coor = LngLat2Coordinate(segments[index]["lon"], segments[index]["lat"], r);
      flightPointsGeometry.vertices.push(
        new THREE.Vector3(coor["x"], coor["y"], coor["z"])
      );
      flightPointsGeometry.colors.push(
        new THREE.Color(0xffffff)
      );
    }
    var flightPoints = new THREE.Points(flightPointsGeometry, flightPointsMaterial);
    this.rotating.add(flightPoints);*/
  }
  initMap() {
		/*if(!Float32BufferAttribute) {
  		THREE.BufferAttribute = function( array, itemSize, normalized ) {
  			if ( Array.isArray( array ) ) {
  				throw new TypeError( 'THREE.BufferAttribute: array should be a Typed Array.' );
  			}
  			this.uuid = _Math.generateUUID();
  			this.name = '';
  			this.array = array;
  			this.itemSize = itemSize;
  			this.count = array !== undefined ? array.length / itemSize : 0;
  			this.normalized = normalized === true;
  			this.dynamic = false;
  			this.updateRange = { offset: 0, count: - 1 };
  			this.onUploadCallback = function () {};
  			this.version = 0;
  		}
  		Object.defineProperty(THREE.BufferAttribute.prototype, 'needsUpdate', {
  			set: function (value) {
  				if (value === true) this.version ++;
  			}
  		});
  		Object.assign(THREE.BufferAttribute.prototype, {
  			isBufferAttribute: true,
  			setArray: function (array) {
  				if (Array.isArray(array)) {
  					throw new TypeError('THREE.BufferAttribute: array should be a Typed Array.');
  				}
  				this.count = array !== undefined ? array.length / this.itemSize : 0;
  				this.array = array;
  			},
  			setDynamic: function (value) {
  				this.dynamic = value;
  				return this;
  			},
  			copy: function (source) {
  				this.array = new source.array.constructor( source.array );
  				this.itemSize = source.itemSize;
  				this.count = source.count;
  				this.normalized = source.normalized;
  				this.dynamic = source.dynamic;
  				return this;
  			},
  			copyAt: function ( index1, attribute, index2 ) {
  				index1 *= this.itemSize;
  				index2 *= attribute.itemSize;
  				for ( var i = 0, l = this.itemSize; i < l; i ++ ) {
  					this.array[ index1 + i ] = attribute.array[ index2 + i ];
  				}
  				return this;
  			},
  			copyArray: function ( array ) {
  				this.array.set( array );
  				return this;
  			},
  			copyColorsArray: function ( colors ) {
  				var array = this.array, offset = 0;
  				for ( var i = 0, l = colors.length; i < l; i ++ ) {
  					var color = colors[ i ];
  					if ( color === undefined ) {
  						console.warn( 'THREE.BufferAttribute.copyColorsArray(): color is undefined', i );
  						color = new Color();
  					}
  					array[ offset ++ ] = color.r;
  					array[ offset ++ ] = color.g;
  					array[ offset ++ ] = color.b;
  				}
  				return this;
  			},
  			copyIndicesArray: function ( indices ) {
  				var array = this.array, offset = 0;
  				for ( var i = 0, l = indices.length; i < l; i ++ ) {
  					var index = indices[ i ];
  					array[ offset ++ ] = index.a;
  					array[ offset ++ ] = index.b;
  					array[ offset ++ ] = index.c;
  				}
  				return this;
  			},
  			copyVector2sArray: function ( vectors ) {
  				var array = this.array, offset = 0;
  				for ( var i = 0, l = vectors.length; i < l; i ++ ) {
  					var vector = vectors[ i ];
  					if ( vector === undefined ) {
  						console.warn( 'THREE.BufferAttribute.copyVector2sArray(): vector is undefined', i );
  						vector = new Vector2();
  					}
  					array[ offset ++ ] = vector.x;
  					array[ offset ++ ] = vector.y;
  				}
  				return this;
  			},
  			copyVector3sArray: function ( vectors ) {
  				var array = this.array, offset = 0;
  				for ( var i = 0, l = vectors.length; i < l; i ++ ) {
  					var vector = vectors[ i ];
  					if ( vector === undefined ) {
  						console.warn( 'THREE.BufferAttribute.copyVector3sArray(): vector is undefined', i );
  						vector = new Vector3();
  					}
  					array[ offset ++ ] = vector.x;
  					array[ offset ++ ] = vector.y;
  					array[ offset ++ ] = vector.z;
  				}
  				return this;
  			},
  			copyVector4sArray: function ( vectors ) {
  				var array = this.array, offset = 0;
  				for ( var i = 0, l = vectors.length; i < l; i ++ ) {
  					var vector = vectors[ i ];
  					if ( vector === undefined ) {
  						console.warn( 'THREE.BufferAttribute.copyVector4sArray(): vector is undefined', i );
  						vector = new Vector4();
  					}
  					array[ offset ++ ] = vector.x;
  					array[ offset ++ ] = vector.y;
  					array[ offset ++ ] = vector.z;
  					array[ offset ++ ] = vector.w;
  				}
  				return this;
  			},
  			set: function ( value, offset ) {
  				if ( offset === undefined ) offset = 0;
  				this.array.set( value, offset );
  				return this;
  			},
  			getX: function ( index ) {
  				return this.array[ index * this.itemSize ];
  			},
  			setX: function ( index, x ) {
  				this.array[ index * this.itemSize ] = x;
  				return this;
  			},
  			getY: function ( index ) {
  				return this.array[ index * this.itemSize + 1 ];
  			},
  			setY: function ( index, y ) {
  				this.array[ index * this.itemSize + 1 ] = y;
  				return this;
  			},
  			getZ: function ( index ) {
  				return this.array[ index * this.itemSize + 2 ];
  			},
  			setZ: function ( index, z ) {
  				this.array[ index * this.itemSize + 2 ] = z;
  				return this;
  			},
  			getW: function ( index ) {
  				return this.array[ index * this.itemSize + 3 ];
  			},
  			setW: function ( index, w ) {
  				this.array[ index * this.itemSize + 3 ] = w;
  				return this;
  			},
  			setXY: function ( index, x, y ) {
  				index *= this.itemSize;
  				this.array[ index + 0 ] = x;
  				this.array[ index + 1 ] = y;
  				return this;
  			},
  			setXYZ: function ( index, x, y, z ) {
  				index *= this.itemSize;
  				this.array[ index + 0 ] = x;
  				this.array[ index + 1 ] = y;
  				this.array[ index + 2 ] = z;
  				return this;
  			},
  			setXYZW: function ( index, x, y, z, w ) {
  				index *= this.itemSize;
  				this.array[ index + 0 ] = x;
  				this.array[ index + 1 ] = y;
  				this.array[ index + 2 ] = z;
  				this.array[ index + 3 ] = w;
  				return this;
  			},
  			onUpload: function ( callback ) {
  				this.onUploadCallback = callback;
  				return this;
  			},
  			clone: function () {
  				return new this.constructor(this.array, this.itemSize).copy(this);
  			}
  		});
  		function Float32BufferAttribute(array, itemSize) {
  			THREE.BufferAttribute.call(this, new Float32Array(array), itemSize);
  		}
  		Float32BufferAttribute.prototype = Object.create(THREE.BufferAttribute.prototype);
  		Float32BufferAttribute.prototype.constructor = Float32BufferAttribute;
  	}*/
  	if(!THREE.EdgesGeometry) {
  		THREE.Geometry.prototype.clone = function() {
  			return new THREE.Geometry().copy(this);
  		}
  		THREE.Geometry.prototype.copy = function(source) {
  			var i, il, j, jl, k, kl;
  			// reset
  			this.vertices = [];
  			this.colors = [];
  			this.faces = [];
  			this.faceVertexUvs = [[]];
  			this.morphTargets = [];
  			this.morphNormals = [];
  			this.skinWeights = [];
  			this.skinIndices = [];
  			this.lineDistances = [];
  			this.boundingBox = null;
  			this.boundingSphere = null;
  			// name
  			this.name = source.name;
  			// vertices
  			var vertices = source.vertices;
  			for (i = 0, il = vertices.length; i < il; i ++) {
  				this.vertices.push(vertices[i].clone());
  			}
  			// colors
  			var colors = source.colors;
  			for (i = 0, il = colors.length; i < il; i ++) {
  				this.colors.push(colors[i].clone());
  			}
  			// faces
  			var faces = source.faces;
  			for (i = 0, il = faces.length; i < il; i ++) {
  				this.faces.push(faces[i].clone());
  			}
  			// face vertex uvs
  			for (i = 0, il = source.faceVertexUvs.length; i < il; i ++) {
  				var faceVertexUvs = source.faceVertexUvs[i];
  				if (this.faceVertexUvs[i] === undefined) {
  					this.faceVertexUvs[i] = [];
  				}
  				for (j = 0, jl = faceVertexUvs.length; j < jl; j ++) {
  					var uvs = faceVertexUvs[j], uvsCopy = [];
  					for (k = 0, kl = uvs.length; k < kl; k ++) {
  						var uv = uvs[k];
  						uvsCopy.push(uv.clone());
  					}
  					this.faceVertexUvs[i].push(uvsCopy);
  				}
  			}
  			// morph targets
  			var morphTargets = source.morphTargets;
  			for (i = 0, il = morphTargets.length; i < il; i ++) {
  				var morphTarget = {};
  				morphTarget.name = morphTargets[i].name;
  				// vertices
  				if (morphTargets[i].vertices !== undefined) {
  					morphTarget.vertices = [];
  					for (j = 0, jl = morphTargets[i].vertices.length; j < jl; j ++) {
  						morphTarget.vertices.push(morphTargets[i].vertices[j].clone());
  					}
  				}
  				// normals
  				if (morphTargets[i].normals !== undefined) {
  					morphTarget.normals = [];
  					for (j = 0, jl = morphTargets[i].normals.length; j < jl; j ++) {
  						morphTarget.normals.push(morphTargets[i].normals[j].clone());
  					}
  				}
  				this.morphTargets.push(morphTarget);
  			}
  			// morph normals
  			var morphNormals = source.morphNormals;
  			for (i = 0, il = morphNormals.length; i < il; i ++) {
  				var morphNormal = {};
  				// vertex normals
  				if (morphNormals[i].vertexNormals !== undefined) {
  					morphNormal.vertexNormals = [];
  					for (j = 0, jl = morphNormals[i].vertexNormals.length; j < jl; j ++) {
  						var srcVertexNormal = morphNormals[i].vertexNormals[j];
  						var destVertexNormal = {};
  						destVertexNormal.a = srcVertexNormal.a.clone();
  						destVertexNormal.b = srcVertexNormal.b.clone();
  						destVertexNormal.c = srcVertexNormal.c.clone();
  						morphNormal.vertexNormals.push(destVertexNormal);
  					}
  				}
  				// face normals
  				if (morphNormals[i].faceNormals !== undefined) {
  					morphNormal.faceNormals = [];
  					for (j = 0, jl = morphNormals[i].faceNormals.length; j < jl; j ++) {
  						morphNormal.faceNormals.push(morphNormals[i].faceNormals[j].clone());
  					}
  				}
  				this.morphNormals.push(morphNormal);
  			}
  			/*// skin weights
  			var skinWeights = source.skinWeights;
  			for (i = 0, il = skinWeights.length; i < il; i ++) {
  				this.skinWeights.push(skinWeights[i].clone());
  			}
  			// skin indices
  			var skinIndices = source.skinIndices;
  			for (i = 0, il = skinIndices.length; i < il; i ++) {
  				this.skinIndices.push(skinIndices[i].clone());
  			}
  			// line distances
  			var lineDistances = source.lineDistances;
  			for (i = 0, il = lineDistances.length; i < il; i ++) {
  				this.lineDistances.push(lineDistances[i]);
  			}
  			// bounding box
  			var boundingBox = source.boundingBox;
  			if (boundingBox !== null) {
  				this.boundingBox = boundingBox.clone();
  			}
  			// bounding sphere
  			var boundingSphere = source.boundingSphere;
  			if (boundingSphere !== null) {
  				this.boundingSphere = boundingSphere.clone();
  			}*/
  			// update flags
  			this.elementsNeedUpdate = source.elementsNeedUpdate;
  			this.verticesNeedUpdate = source.verticesNeedUpdate;
  			this.uvsNeedUpdate = source.uvsNeedUpdate;
  			this.normalsNeedUpdate = source.normalsNeedUpdate;
  			this.colorsNeedUpdate = source.colorsNeedUpdate;
  			this.lineDistancesNeedUpdate = source.lineDistancesNeedUpdate;
  			this.groupsNeedUpdate = source.groupsNeedUpdate;
  			return this;
  		}
  		THREE.EdgesGeometry = function(geometry, thresholdAngle) {
  			//return new Geometry().copy(this);
  			THREE.BufferGeometry.call(this);
  			this.type = 'EdgesGeometry';
  			this.parameters = {
  				thresholdAngle: thresholdAngle
  			};
  			thresholdAngle = (thresholdAngle !== undefined) ? thresholdAngle : 1;
  			// buffer
  			var vertices = [];
  			// helper variables
  			var thresholdDot = Math.cos(THREE.Math.DEG2RAD * thresholdAngle);
  			var edge = [0, 0], edges = {}, edge1, edge2;
  			var key, keys = ['a', 'b', 'c'];
  			// prepare source geometry
  			var geometry2;
  			console.log(geometry);
  			if (geometry.isBufferGeometry) {
  				geometry2 = new THREE.Geometry();
  				geometry2.fromBufferGeometry(geometry);
  			} else {
  				geometry2 = geometry.clone();
  				//geometry2 = new THREE.Geometry().copy(geometry);
  			}
  			geometry2.mergeVertices();
  			geometry2.computeFaceNormals();
  			var sourceVertices = geometry2.vertices;
  			var faces = geometry2.faces;
  			// now create a data structure where each entry represents an edge with its adjoining faces
  			for (var i = 0, l = faces.length; i < l; i ++) {
  				var face = faces[i];
  				for (var j = 0; j < 3; j ++) {
  					edge1 = face[keys[j]];
  					edge2 = face[keys[(j + 1) % 3]];
  					edge[0] = Math.min(edge1, edge2);
  					edge[1] = Math.max(edge1, edge2);
  					key = edge[0] + ',' + edge[1];
  					if (edges[key] === undefined) {
  						edges[key] = {index1: edge[0], index2: edge[1], face1: i, face2: undefined};
  					} else {
  						edges[key].face2 = i;
  					}
  				}
  			}
  			// generate vertices
  			for (key in edges) {
  				var e = edges[key];
  				// an edge is only rendered if the angle (in degrees) between the face normals of the adjoining faces exceeds this value. default = 1 degree.
  				if (e.face2 === undefined || faces[e.face1].normal.dot(faces[e.face2].normal) <= thresholdDot) {
  					var vertex = sourceVertices[e.index1];
  					vertices.push(vertex.x, vertex.y, vertex.z);
  					vertex = sourceVertices[e.index2];
  					vertices.push(vertex.x, vertex.y, vertex.z);
  				}
  			}
  			// build geometry
  			//this.addAttribute('position', new Float32BufferAttribute(vertices, 3));
  		}
  		THREE.EdgesGeometry.prototype = Object.create(THREE.BufferGeometry.prototype);
  		THREE.EdgesGeometry.prototype.constructor = THREE.EdgesGeometry;
  	}
  	if(!THREE.LineSegments) {
  		THREE.LineSegments = function(geometry, material) {
  			THREE.Line.call(this, geometry, material);
  			this.type = 'LineSegments';
  		}
  	}
  	if(!THREE.EdgesHelper) {
  		THREE.EdgesHelper = function (object, hex) {
  			console.warn('THREE.EdgesHelper has been removed. Use THREE.EdgesGeometry instead.');
  			return new THREE.LineSegments(
  			  new THREE.EdgesGeometry(object.geometry), 
  			  new THREE.LineBasicMaterial({color: hex !== undefined ? hex : 0xffffff})
  			);
  		}
  	}
		var t3d;
  	for (var name in country_data) {
  		//if(country_data[name].data.cont === "CH") {
  		  t3d = new Tessalator3D(country_data[name], 0);
        var continents = ["CH"];
        var color;
        //var hsl;
        if(country_data[name].data.cont == "CH") {
        	//hsl = this.toColor(147,155,150);
        	color = new THREE.Color(0x103C3F);
        } else {
        	//hsl = this.toColor(1,114,95);
        	color = new THREE.Color(0x103C3F);
        }
        //var h = hsl[0];
      	//var s = hsl[1];
      	//var l = hsl[2];
        //color.setHSL(h, s, l);
        var mesh = country_data[name].mesh = new THREE.Mesh(t3d, new THREE.MeshLambertMaterial({
        	//transparent: true,
          //depthTest: true,
          //depthWrite: false,
          //opacity: 1.0,
          emissive: 0x103C3F,
          //color: color
        }));
        //mesh.name = "land";
        //mesh.userData.country = name;
        this.rotating.add(mesh);
  	  }
    //}
	}
  initTrackballControls() {
		this.mouseX = 0;
		this.mouseY = 0;
		this.pmouseX = 0;
		this.pmouseY = 0;
		this.pressX = 0;
		this.pressY = 0;
		this.keyboard = new THREEx.KeyboardState();
		this.onDocumentResize = function(event) {}
		this.onDocumentMouseDown = function(event) {	
	    this.dragging = true;			   
	    this.pressX = this.mouseX;
	    this.pressY = this.mouseY;   	
	    this.rotateTargetX = undefined;
	    this.rotateTargetX = undefined;
	  }
		this.onDocumentMouseMove = function(event) {
	  	this.pmouseX = this.mouseX;
	  	this.pmouseY = this.mouseY;
	  	this.mouseX = event.clientX - window.innerWidth * 0.5;
	  	this.mouseY = event.clientY - window.innerHeight * 0.5;
	  	if(this.dragging) {
	  		if(this.keyboard.pressed("shift") == false) {
	  			this.rotateVY += (this.mouseX - this.pmouseX) / 2 * Math.PI / 180 * 0.3;
	  			this.rotateVX += (this.mouseY - this.pmouseY) / 2 * Math.PI / 180 * 0.3;	
	  		} else {
	  			this.camera.position.x -= (this.mouseX - this.pmouseX) * .5; 
	  			this.camera.position.y += (this.mouseY - this.pmouseY) * .5;
	  		}
	  	}
	  }
		this.onDocumentMouseUp = function(event) {
	  	this.dragging = false;
	  }
		this.onMouseWheel = function(event) {
	  	var delta = 0;
	    //IE Opera.
	  	if (event.wheelDelta) {
	  	  delta = event.wheelDelta / 120;
	  	} else if(event.detail) {
	  	  //firefox
	  		delta = -event.detail / 3;
	  	}
	  	if (delta) {
	  		this.camera.scale.z += delta * 0.1;
	  	  this.camera.scale.z = this.constrain(this.camera.scale.z, 0.7, 5.0);
	  	}
	  	event.returnValue = false;			
	  }
  	this.renderer.domElement.addEventListener('windowResize', (event) => {
    	this.onDocumentResize(event);
    }, false);
  	this.renderer.domElement.addEventListener('mousedown', (event) => {
    	this.onDocumentMouseDown(event);
    }, true);
  	this.renderer.domElement.addEventListener('mousemove', (event) => {
    	this.onDocumentMouseMove(event);
    }, true);
  	this.renderer.domElement.addEventListener('mouseup', (event) => {
    	this.onDocumentMouseUp(event);
    }, false);
  	this.renderer.domElement.addEventListener('mousewheel', (event) => {
    	this.onMouseWheel(event);
  	}, false);
  	this.renderer.domElement.addEventListener('DOMMouseScroll', (event) => {
    	this.onMouseWheel(window.event || event);
  	}, false);
  }
  initLinght() {
  	var hemiLight = new THREE.PointLight(0x33CCFF, 20);
  	hemiLight.position.x = 0; 
  	hemiLight.position.y = 0;
  	hemiLight.position.z = 600;
  	hemiLight.castShadow = true;
    this.scene.add(hemiLight);
    
  	var hemiLight0 = new THREE.PointLight(0x33CCFF, 1.25, 400, 2.0);
  	hemiLight0.position.x = -50;
  	hemiLight0.position.y = 150;
  	hemiLight0.position.z = 600;
  	this.scene.add(hemiLight0);

    var hemiLight1 = new THREE.PointLight(0x33CCFF, 1.25, 400, 2.0);
    hemiLight1.position.x = 100;
    hemiLight1.position.y = 50;
    hemiLight1.position.z = 600;
    this.scene.add(hemiLight1);

    var hemiLight2 = new THREE.PointLight(0x33CCFF, 1.25, 400, 2.0);
    hemiLight2.position.x = 0;
    hemiLight2.position.y = -300;
    hemiLight2.position.z = 600;
    this.scene.add(hemiLight2);
	}
  getVector3(lat, lon, radius) {
  	radius = radius || this.radius;
    var phi = (90 - lat) * Math.PI / 180;
    var theta = (lon - 180) * Math.PI / 180;
	  var center = new THREE.Vector3();
	  center.x = -radius * Math.sin(phi) * Math.cos(theta);
	  center.y = radius * Math.cos(phi);
	  center.z = radius * Math.sin(phi) * Math.sin(theta);
    return center;
  }
  isVersion49() {
  	return THREE.REVISION == 49;
  }
  drawLine(start, end, v, type) {
  	//var value = v || 30;
  	var value = 30;
  	var distanceBetweenCountryCenter = start.clone()[this.isVersion49() ? "subSelf" : "sub"](end).length();		
  	var anchorHeight = this.radius + distanceBetweenCountryCenter * 0.7;
  	var mid = start.clone()[this.isVersion49() ? "lerpSelf" : "lerp"](end, 0.5);		
  	var midLength = mid.length();
  	mid.normalize();
  	mid.multiplyScalar(midLength + distanceBetweenCountryCenter * 0.5);			
  	var normal = (new THREE.Vector3()).sub(start, end);
  	normal.normalize();
  	var distanceHalf = distanceBetweenCountryCenter * 0.5;
  	var startAnchor = start;
  	var midStartAnchor = mid.clone()[this.isVersion49() ? "addSelf" : "add"](normal.clone().multiplyScalar(distanceHalf));					
  	var midEndAnchor = mid.clone()[this.isVersion49() ? "addSelf" : "add"](normal.clone().multiplyScalar(-distanceHalf));
  	var endAnchor = end;
  	var splineCurveA = new THREE.CubicBezierCurve3( start, startAnchor, midStartAnchor, mid);											
  	var splineCurveB = new THREE.CubicBezierCurve3(mid, midEndAnchor, endAnchor, end);
  	var vertexCountDesired = Math.floor(distanceBetweenCountryCenter * 0.5 + 6) * 2;
  	var points = splineCurveA.getPoints(vertexCountDesired);
  	points = points.splice(0, points.length - 1);
  	points = points.concat(splineCurveB.getPoints(vertexCountDesired));
  	points.push(new THREE.Vector3(0, 0, 0));
  	//var val = value * 10;
  	var size = value;
  	//var size = (1 + Math.sqrt(val));
  	//size = this.constrain(size, 10, 100);
  	var curveGeometry = new THREE.Geometry();
  	for(var i = 0; i < points.length; i ++) {
    	curveGeometry.vertices.push(points[i]);
    }
  	curveGeometry.size = size;
    //this.rotating.add(this.getMesh(curveGeometry, value, type));
  	//this.rotating.add(this.getSplineOutline(curveGeometry, value, type));
  	this.rotating.add(this.getPoints(curveGeometry, value, type));
  }
  getPoints(lineGeometry, value, type) {
  	/*var geo = new THREE.BufferGeometry();
  	for(var s in lineGeometry.vertices) {
			//var v = lineGeometry.vertices[s];
			//geo.vertices.push(v);
		}*/
    //geometry.addAttribute('position', verticesPosition);
  	var splineOutline = new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({
			//color: 0xE34031,
			opacity: 1.0,
			blending: THREE.AdditiveBlending,
			transparent: true,
			depthWrite: false,
			vertexColors: true
	    //linecap: 'butt'
		}));
  	splineOutline.renderDepth = false;
  	
  	
  	
  	var linesGeo = new THREE.Geometry();
  	for(var s in lineGeometry.vertices) {
  		linesGeo.vertices.push(lineGeometry.vertices[s]);
		}
  	
  	
  	var uniforms = {
  		scale: {
  			type: "v3", 
  			value: new THREE.Vector3(1, 1, 1)
  	  },	
  		time: {
  			type: "f",
  			value: 0.0
  		},
  		color: {
  			type: "c",
  			value: new THREE.Color(0x00B7EE)
  		}
  	};
    this.shaderMaterial = new THREE.ShaderMaterial({
    	uniforms: uniforms,
      vertexShader: `
        uniform float time;
        uniform vec3 scale;
        varying vec3 vNormal;
        void main() {
          //vNormal = normal;
          vec3 test = vec3(time, time, time);
          vec3 newPosition = position * test;
          //vec3 newPosition = position * scale;
          //gl_PointSize = 10.0;
          //gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
          //vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  			  //gl_PointSize = time;
  			  //gl_PointSize = 2.0;
  			  //gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying vec3 vColor;
        varying vec3 vNormal;
        void main() {
          //vec3 light = vec3(0.5, 0.2, 1.0);
          //light = normalize(light);
          //float dProd = max(0.0, dot(vNormal, light));
          //gl_FragColor = vec4(dProd, dProd, dProd, 1.0);
          //gl_FragColor = vec4(color, 1.0);
          
          gl_FragColor = 2.0 * vec4(1.0, 0.0, 0.0, 1.0);
        }
      `,
    });
    //var splineOutline = new THREE.Line(geo, shaderMaterial);
    var points = new THREE.ParticleSystem(linesGeo, this.shaderMaterial);
    splineOutline.add(points);
    return splineOutline;
  }
  getSplineOutline(lineGeometry, value, type) {
  	/*var attributes = {
  		size: {
  			type: 'f',
  			value: []
  	  },
  		customColor: {
  			type: 'c',
  			value: []
  	  }
  	};
  	var shaderMaterial = new THREE.ShaderMaterial({
  		uniforms: {
    		amplitude: {
    			type: "f",
    			value: 1.0
    		},
    		color: {
    			type: "c",
    			value: new THREE.Color(0xffffff)
    	  },
    		texture: {
    			type: "t",
    			value: 0,
    			texture: THREE.ImageUtils.loadTexture("js/webGL/images/particleA.png")
    		}
    	},
  		attributes: attributes,
  		vertexShader: `
			uniform float amplitude;
			attribute float size;
			attribute vec3 customColor;
			varying vec3 vColor;
			void main() {
			  vColor = customColor;
			  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
			  gl_PointSize = size;
			  gl_Position = projectionMatrix * mvPosition;
  		}`,
  		fragmentShader: `
			uniform vec3 color;
			uniform sampler2D texture;
			varying vec3 vColor;
			void main() {
			  gl_FragColor = vec4(color * vColor, 1.0);
			  //gl_FragColor = gl_FragColor * texture2D(texture, gl_PointCoord);
  		}`,
  		blending: THREE.AdditiveBlending,
  		depthTest: true,
  		depthWrite: false,
  		transparent: true
  		// sizeAttenuation: true,
  	});*/
  	/*var shaderMaterial = new THREE.LineBasicMaterial({
			color: 0xE34031,
			opacity: 1.0,
			blending: THREE.AdditiveBlending,
			transparent: true,
			depthWrite: false,
			vertexColors: true
	    //linecap: 'butt'
		});*/
  	var shaderMaterial = new THREE.LineBasicMaterial({
  		color: 0xE34031,
  		opacity: 1.0,
      linewidth: 1000
		});
  	var splineOutline = new THREE.Line(lineGeometry, shaderMaterial);
  	return splineOutline;
  }
  getMesh(lineGeometry, value, type) {
  	var linesGeo = new THREE.Geometry();
  	var lineColors = [];
  	var particlesGeo = new THREE.Geometry();
  	var particleColors = [];
  	//var lineColor = thisLineIsExport ? new THREE.Color(this.exportColor) : new THREE.Color(this.importColor);
  	//var lineColor = new THREE.Color(0xdd380c);
  	var lineColor = new THREE.Color(0x48EAB6);
  	//var lineColor = new THREE.Color(0x154492);
  	var lastColor;
		for(var s in lineGeometry.vertices) {
			var v = lineGeometry.vertices[s];		
			lineColors.push(lineColor);
			lastColor = lineColor;
		}
  	THREE.GeometryUtils.merge(linesGeo, lineGeometry);
  	var particleColor = lastColor.clone();
  	var points = lineGeometry.vertices;
		var particleCount = Math.floor(value / 10 / lineGeometry.vertices.length) + 1;
		particleCount = this.constrain(particleCount, 1, 100);
		var particleSize = lineGeometry.size;
		for(var s = 0; s < particleCount; s++) {
			var desiredIndex = s / particleCount * points.length;
			var rIndex = this.constrain(Math.floor(desiredIndex), 0, points.length - 1);
			var point = points[rIndex];						
			var particle = point.clone();
			particle.moveIndex = rIndex;
			particle.nextIndex = rIndex + 1;
			if(particle.nextIndex >= points.length)
				particle.nextIndex = 0;
			particle.lerpN = 0;
			particle.path = points;
			particlesGeo.vertices.push(particle);	
			particle.size = particleSize;
			particleColors.push(particleColor);						
		}
		linesGeo.colors = lineColors;
  	var splineOutline = new THREE.Line(linesGeo, new THREE.LineBasicMaterial({
			//color: 0xE34031,
			opacity: 1.0,
			blending: THREE.AdditiveBlending,
			transparent: true,
			depthWrite: false,
			vertexColors: true
	    //linecap: 'butt'
		}));
  	splineOutline.renderDepth = false;
  	var attributes = {
  		size: {
  			type: 'f',
  			value: []
  	  },
  		customColor: {
  			type: 'c',
  			value: []
  	  }
  	};
  	var shaderMaterial = new THREE.ShaderMaterial({
  		uniforms: {
    		amplitude: {
    			type: "f",
    			value: 1.0
    		},
    		color: {
    			type: "c",
    			value: new THREE.Color(0xffffff)
    	  },
    		texture: {
    			type: "t",
    			value: 0,
    			texture: THREE.ImageUtils.loadTexture("js/webGL/images/particleA.png")
    		}
    	},
  		attributes: attributes,
  		vertexShader: `
			uniform float amplitude;
			attribute float size;
			attribute vec3 customColor;
			varying vec3 vColor;
			void main() {
			  vColor = customColor;
			  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
			  gl_PointSize = size;
			  gl_Position = projectionMatrix * mvPosition;
  		}`,
  		fragmentShader: `
			uniform vec3 color;
			uniform sampler2D texture;
			varying vec3 vColor;
			void main() {
			  gl_FragColor = vec4(color * vColor, 1.0);
			  gl_FragColor = gl_FragColor * texture2D(texture, gl_PointCoord);
  		}`,
  		blending: THREE.AdditiveBlending,
  		depthTest: true,
  		depthWrite: false,
  		transparent: true
  		// sizeAttenuation: true,
  	});
  	/*var particleGraphic = THREE.ImageUtils.loadTexture("js/webGL/images/map_mask.png");
  	var particleMat = new THREE.ParticleBasicMaterial({
  		map: particleGraphic,
  		color: 0xE34031,
  		size: 1,
  		blending: THREE.NormalBlending,
  		transparent: true,
  	  depthWrite: false,
  	  vertexColors: true,
  		sizeAttenuation: true
  	});*/
  	particlesGeo.colors = particleColors;
  	var pSystem = new THREE.ParticleSystem(particlesGeo, shaderMaterial);
  	pSystem.dynamic = true;
  	splineOutline.add(pSystem);
  	var vertices = pSystem.geometry.vertices;
  	var values_size = attributes.size.value;
  	var values_color = attributes.customColor.value;
  	for(var v = 0; v < vertices.length; v++) {
  		values_size[v] = pSystem.geometry.vertices[v].size;
  		values_color[v] = particleColors[v];
  	}
  	pSystem.update = function() {
  		for(var i in this.geometry.vertices) {
  			var particle = this.geometry.vertices[i];
  			var path = particle.path;
  			var moveLength = path.length;
  			particle.lerpN += 0.1;
  			if(particle.lerpN > 1) {
  				particle.lerpN = 0;
  				particle.moveIndex = particle.nextIndex;
  				particle.nextIndex++;
  				if(particle.nextIndex >= path.length) {
  					particle.moveIndex = 0;
  					particle.nextIndex = 1;
  				}
  			}
  			var currentPoint = path[particle.moveIndex];
  			var nextPoint = path[particle.nextIndex];
  			particle.copy(currentPoint);
  			particle.lerpSelf(nextPoint, particle.lerpN);			
  		}
  		this.geometry.verticesNeedUpdate = true;
  	};
  	//splineOutline.affectedCountries = affectedCountries;
  	return splineOutline;
  }
  constrain(v, min, max) {
  	if(v < min)
  		v = min;
  	else
  	if(v > max)
  		v = max;
  	return v;
  }
  addItem(item) {
  	var start = item["source"], 
  	end = item["target"],
  	start_latLon = start["latlon"].split(","),
  	end_latLon = end["latlon"].split(",");
  	this.drawLine(this.getVector3(start_latLon[1], start_latLon[0]), this.getVector3(end_latLon[1], end_latLon[0]));
  }
  load(data) {
  	if(!this.isAnimate) {
  		this.animate();
  		this.isAnimate = true;
  	}
  	for(var i = 0; i < data.length; i++) {
  		this.addItem(data[i]);
  	}
  }
}