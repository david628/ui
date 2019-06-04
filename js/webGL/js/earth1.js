class Earth {
  constructor(prop) {
  	this.radius = 130;
  	this.segments = 60;
    this.apply(this, prop);
    this.el = this.el.get ? this.el.get(0) : (typeof this.el == "string" ? document.getElementById(this.el) : this.el);
    this.map = THREE.ImageUtils.loadTexture("js/webGL/images/newgradient.png");
    this.init();
  }
  apply(d, e, b) {
    if(b) {
      this.apply(d, b);
    }
    if(d && e && typeof e=="object") {
      for(var a in e) {
        d[a] = e[a];
      }
    }
    return d;
  }
  init() {
  	if(!this.renderer) {
  		this.renderer = new THREE.WebGLRenderer({
  			antialias: false,
	  		alpha: true
  		});
  		this.renderer.setSize(window.innerWidth, window.innerHeight);
  		this.el.appendChild(this.renderer.domElement);
  	}
  	if(!this.scene) {
  		this.scene = new THREE.Scene();
  		this.scene.matrixAutoUpdate = false;
  	}
  	if(!this.camera) {
  		this.camera = new THREE.PerspectiveCamera(12, window.innerWidth / window.innerHeight, 1, 20000);
  	  this.camera.position.z = 1900;
  	  //this.camera.position.z = 80;
  	  this.camera.position.x = 0;
  	  this.camera.position.y = 0;
  	  this.scene.add(this.camera);
  	}
  	if(!this.rotating) {
  		this.rotating = new THREE.Object3D();
  		this.scene.add(this.rotating);
  	}
  	if(!this.sphere) {
  		this.sphere = new THREE.Mesh(
  		  new THREE.SphereGeometry(this.radius, this.segments, this.segments),
  		  new THREE.MeshLambertMaterial({
  		  	transparent: true,
  		  	opacity: 1.0,
  		  	color: 0x134649,
  		  	//map: new THREE.ImageUtils.loadTexture("js/webGL/images/earth.jpg")
  		  	map: new THREE.ImageUtils.loadTexture("js/webGL/images/earth_political_alpha.png")
  		  })
  		);
  		this.rotating.add(this.sphere);
  		this.sphere.add(new THREE.Mesh(
  			new THREE.SphereGeometry(this.radius + 1, 50, 50), 
  			new THREE.MeshLambertMaterial({
  			  transparent: true,
  			  color: 0xff8340,
  			  blending: THREE.AdditiveBlending,
  			  opacity: 0.6,
  			  map: new THREE.ImageUtils.loadTexture("js/webGL/images/fire4.png")
  		  })
  		));
  		/*this.sphere.add(new THREE.Mesh(
  			new THREE.SphereGeometry(this.radius + 2, 50, 50),
  			new THREE.MeshLambertMaterial({
  			  blending: THREE.AdditiveBlending,
  			  transparent: true,
  			  color: 0x2AC7CC,
  			  opacity: 0.8,
  			  map: new THREE.ImageUtils.loadTexture("js/webGL/images/earth_political_alpha.png")
  		  })
  		));*/
  	}
  	//this.fireBall();
  	this.start = Date.now();
  	//this.fire();
  	//this.effects();
  	//this.fireLine();
  	this.addLight();
  	//this.test();
  	/*this.getLightLine({
  		lat: 19.659852,
  		lon: -99.266568
  	}, {
  		lat: -15.709668,
  		lon: -47.933511
  	});*/
  	//this.getSphere(39.184826, -77.116223);
  	//this.getSphere(19.659852, -99.266568);
  	//this.getSphere(-15.709668, -47.933511);
  	
  	this.initTrackballControls();
  }
  afterRender() {
  	
  }
  initTrackballControls() {
  	this.controllers = {
			spin: 0
		};
  	this.mouseX = 0;
		this.mouseY = 0;
		this.pmouseX = 0;
		this.pmouseY = 0;
		this.pressX = 0;
		this.pressY = 0;
		this.dragging = false;					
		this.rotateX = 0;
		this.rotateY = 0;
		this.rotateVX = 0;
		this.rotateVY = 0;
		this.rotateXMax = 90 * Math.PI / 180;
		this.rotateTargetX = 0;
		this.rotateTargetY = 0;
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
  effects() {
  	/*var geometry = new THREE.CubeGeometry(2, 2, 2);
    var material = new THREE.MeshPhongMaterial({color: 0xff0000});
    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);*/
  	this.effects = {};
  	effekseer.init(this.renderer.context);
  	//this.effects["Laser01"] = effekseer.loadEffect("js/webGL/Resource/Laser01.efk");
  	this.effects["Laser01"] = effekseer.loadEffect("js/webGL/Resource/Laser01.efk");
  }
  fireLine() {
  	
  }
  fire() {
  	var max = 120;
  	var vertexShader = document.getElementById("vertexshader").textContent;
  	var fragmentShader = document.getElementById("fragmentshader").textContent;
  	var texture = THREE.ImageUtils.loadTexture("js/webGL/images/particle.png");
  	var uniforms = {
  		time: {type: "f", value: 0}, 
  		size: {type: "f", value: 120}, 
  		startColor: {type: "c", value: new THREE.Color(0xFF0000)}, 
  		offsetColor: {type: "c", value: new THREE.Color(0xFFFF00)}, 
  		texture: {type: "t", value: texture}
  	};
  	var attributes = {
  		lifetime: {type: "f", value: []}, 
  		shift: {type: "f", value: []}
  	};
  	var material = new THREE.ShaderMaterial({
  		vertexShader: vertexShader, 
  		fragmentShader: fragmentShader, 
  		uniforms: uniforms, 
  		attributes: attributes, 
  		blending: THREE.AdditiveBlending, 
  		transparent: true, 
  		depthTest: false
  	});
  	var geometry = new THREE.Geometry();
  	//attributes = material.attributes;
  	for (var n = 0; n < max; n++) {
  		var vertex = new THREE.Vector3((Math.random() - 0.5) * 200, 500 + (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 200);
  		geometry.vertices.push(vertex);
  		//uniforms.size.value = 60 + Math.random()*30;
  		uniforms.startColor.value.r = 0.8 + Math.random()*0.24;
  		uniforms.startColor.value.g = 0.24 + Math.random()*0.12;
  		uniforms.offsetColor.value.r = (0.8 + Math.random()*0.24) - uniforms.startColor.value.r;
  		uniforms.offsetColor.value.g = (0.24 + Math.random()*0.12) - uniforms.startColor.value.g;
  		material.attributes.lifetime.value.push(2.4);
  		//material.attributes.shift.value.push(Math.random()*2.4);
  	}
  	this.particles = new THREE.ParticleSystem(geometry, material);
  	this.scene.add(this.particles);
  	this.particles.sortParticles = false;
  	this.particles.position.y = - 140;
  }
  fireBall() {
  	this.material = new THREE.ShaderMaterial({ 
  		uniforms: { 
        tExplosion: {
          type: "t", 
          value: THREE.ImageUtils.loadTexture('js/webGL/images/explosion.png')
        },
        time: {
          type: "f", 
          value: 0.0
        }
      },
      vertexShader: document.getElementById('vertexShader').textContent,
  		fragmentShader: document.getElementById('fragmentShader').textContent
    });
  	var mesh = new THREE.Mesh( 
      new THREE.IcosahedronGeometry(20, 4), 
      this.material 
    );
  	this.scene.add(mesh);
  }
  test() {
  	var material = new THREE.MeshLambertMaterial({color: 0x00cc00});
    //create a triangular geometry
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-10,  10, 0));
    geometry.vertices.push(new THREE.Vector3(-10, -10, 0));
    geometry.vertices.push(new THREE.Vector3(10, -10, 0));
    geometry.faces.push(new THREE.Face3(0, 1, 2));
    //create a new face using vertices 0, 1, 2
    //var normal = new THREE.Vector3(0, 1, 0); //optional
    //var color = new THREE.Color(0xffaa00); //optional
    //var materialIndex = 0; //optional
    //var face = new THREE.Face3(0, 1, 2, normal, color, materialIndex);
    //add the face to the geometry's faces array
    //geometry.faces.push(face);
    //the face normals and vertex normals can be calculated automatically if not supplied above
    //geometry.computeFaceNormals();
    //geometry.computeVertexNormals();
    var mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);
  }
  getLightLine(start, end) {
  	var uniforms = {
			"scale": {type: "v3", value: new THREE.Vector3(0.1, 0.1, 0.1)},
			"uvOffset": {type: "v2", value: new THREE.Vector2(0.1, 0.1)},
			"map": {type: "t", value: 0, texture: this.map}
		};
  	var shaderMaterial = new THREE.ShaderMaterial({
  		uniforms: uniforms,
  		vertexShader: `#ifdef GL_ES
  		precision highp float;
  		#endif
  		uniform vec3 scale;
  		varying vec2 vUv;
  		void main()
  		{
  			vec3 newPosition = position * scale;
  			gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition,1.0);
  			vUv = uv;
  		}`,
  		fragmentShader: `#ifdef GL_ES
			precision highp float;
			#endif
			uniform sampler2D map;
			uniform vec2 uvOffset;
			varying vec2 vUv;
			void main()
			{
				vec4 diffuse = texture2D(map, mod(vUv + uvOffset, 1.0));
				gl_FragColor = diffuse;
			}`,
  		map: this.map,
  		blending: THREE.NormalBlending,
  		depthTest: false,
  		transparent: true
  	});
  	var geometry = this.getGeometry(DATA, 0, 20);
  	var sp = this.loadGeoData(start["lat"], start["lon"]);
  	var ep = this.loadGeoData(end["lat"], end["lon"]);
  	//geometry.vertices.push(new THREE.Vector3(sp.x, sp.y, sp.z));  
    //geometry.vertices.push(new THREE.Vector3(ep.x, ep.y, ep.z));
  	var mesh = new THREE.Mesh(geometry, shaderMaterial);
  	mesh.doubleSided = true;
  	this.rotating.add(mesh);
  	console.log(mesh);
  	return {
  		mesh: mesh,
  		uniforms: uniforms,
  		material: shaderMaterial,
  		uvoffset: Math.random(),
  		uvtimescale: 1.0
  	};
  }
  getGeometry(graf, lineWidth, grafSize) {
    var grafSizeX = grafSize * (1920 / 1080); //aspect captured at Tate
    var grafSizeY = grafSize;
    var strokes = graf.strokes;
    var getRadius = function(r, w) {
      r *= w;
      r = Math.max(r, 0.25);
      r = Math.min(r, 1.0);
      return r;
    }
    var geometry = new THREE.Geometry();
    var totalVertIndex = 0;
    strokes.forEach(function(stroke) {
      var n = stroke.length;
      if (n > 2) {
        var averageZ;
        var thisPoint = new THREE.Vector3();
        //var lastPoint = new THREE.Vector3();
        var thisPerp = new THREE.Vector3();
        var lastPerp = new THREE.Vector3();
        var nextPoint = new THREE.Vector3();
        thisPoint.set(
          (stroke[0].x - 0.5) * grafSizeX,
          -(stroke[0].y - 0.5) * grafSizeY,
          stroke[0].t
        );
        nextPoint.set(
          (stroke[1].x - 0.5) * grafSizeX,
          -(stroke[1].y - 0.5) * grafSizeY,
          stroke[1].t
        );
        var line = new THREE.Vector3();
        line.sub(nextPoint, thisPoint);
        thisPerp = new THREE.Vector3(line.y, -line.x, 0);
        thisPerp.normalize();
        var startVertIndex = totalVertIndex;
        var perpLine = new THREE.Vector3();
        perpLine = thisPerp.clone();
        perpLine.multiplyScalar(getRadius(stroke[0].r, lineWidth));
        var newPoint1 = thisPoint.clone();
        newPoint1.addSelf(perpLine);
        var newPoint2 = thisPoint.clone();
        newPoint2.subSelf(perpLine);
        geometry.vertices.push(newPoint1);
        geometry.vertices.push(newPoint2);
        totalVertIndex+=2;
        var uvRange = [stroke[0].t, stroke[stroke.length - 1].t]; //map uvs to this range of normalised time
        for(var i = 1; i < n-1; i++) {
          thisPoint = nextPoint.clone();
          lastPerp = thisPerp.clone();
          nextPoint = new THREE.Vector3(
            (stroke[i+1].x - 0.5) * grafSizeX,
            -(stroke[i+1].y - 0.5) * grafSizeY,
            stroke[i+1].t
          );
          line.sub(nextPoint, thisPoint);
          thisPerp = new THREE.Vector3(line.y, -line.x, 0);
          thisPerp.normalize();
          perpLine.add(lastPerp, thisPerp);
          perpLine.normalize();
          perpLine.multiplyScalar(getRadius(stroke[i].r, lineWidth));
          newPoint1 = thisPoint.clone();
          newPoint1.addSelf(perpLine);
          newPoint2 = thisPoint.clone();
          newPoint2.subSelf(perpLine);
          averageZ = thisPoint.z;
          averageZ = Math.min(1.0, averageZ);
          averageZ = Math.max(0.0, averageZ);
          newPoint1.z = averageZ;
          newPoint2.z = averageZ;
          if (Math.random() < 0.05) {
            var offset = Math.random();
            newPoint1.z += offset * 0.5;
            newPoint2.z += offset * 0.5;
          }
          geometry.vertices.push(newPoint1);
          geometry.vertices.push(newPoint2);
          totalVertIndex+= 2;
        }
        var lastIndex = stroke.length - 1; 
        thisPoint = nextPoint.clone();
        perpLine = thisPerp.clone();
        perpLine.normalize();
        perpLine.multiplyScalar(getRadius(stroke[lastIndex].r, lineWidth));
        newPoint1 = thisPoint.clone();
        newPoint1.addSelf(perpLine);
        newPoint2 = thisPoint.clone();
        newPoint2.subSelf(perpLine);
        averageZ = thisPoint.z;
        newPoint1.z = averageZ;
        newPoint2.z = averageZ;
        geometry.vertices.push(newPoint1);  
        geometry.vertices.push(newPoint2);          
        totalVertIndex+=2;
        var numVerts = totalVertIndex - startVertIndex;
        for (var i = 2; i < numVerts; i++) {
          var offsetVertIndex = startVertIndex + i;
          var uv = ((i/numVerts) * (uvRange[1] - uvRange[0]) + uvRange[0]); //TODO crucial fix
          geometry.faces.push(new THREE.Face3(offsetVertIndex-2, offsetVertIndex-1, offsetVertIndex));
          geometry.faceVertexUvs[0].push([new THREE.UV(uv,uv), new THREE.UV(uv,uv), new THREE.UV(uv,uv)]);
        }
      }
    });
    console.log(geometry);
    return geometry;
  }
  getSphere(lat, lon) {
  	var sphere = new THREE.Mesh(
		  new THREE.SphereGeometry(1, this.segments, this.segments),
		  new THREE.MeshLambertMaterial({
		  	color: 0x102042,
		  	//map: new THREE.ImageUtils.loadTexture("js/webGL/images/earth.jpg")
		  	//map: new THREE.ImageUtils.loadTexture("js/webGL/images/earth_political_alpha.png")
		  })
		)
  	this.scene.add(sphere);
  	//"lat":40.7127,"lng": -74.0059 USA
  	//39.184826, -77.116223
  	var pos = this.loadGeoData(lat, lon);
  	sphere.position.set(pos.x, pos.y, pos.z);
  }
  makeConnectionLineGeometry(start, end, value, type) {
  	var distanceBetweenCountryCenter = start.clone().subSelf(end).length();
  	var anchorHeight = this.radius * 0.01 + distanceBetweenCountryCenter * 0.5;
  	var mid = start.clone().lerpSelf(end, 0.5);
  	var midLength = mid.length()
  	mid.normalize();
  	mid.multiplyScalar(midLength + distanceBetweenCountryCenter * 0.5);	
  	var normal = (new THREE.Vector3()).sub(start, end);
  	normal.normalize();
  	var distanceHalf = distanceBetweenCountryCenter * 0.5;
  	var startAnchor = start;
  	var midStartAnchor = mid.clone().addSelf(normal.clone().multiplyScalar(distanceHalf));					
  	var midEndAnchor = mid.clone().addSelf(normal.clone().multiplyScalar(-distanceHalf));
  	var endAnchor = end;
    //now make a bezier curve out of the above like so in the diagram
  	var splineCurveA = new THREE.CubicBezierCurve3(start, startAnchor, midStartAnchor, mid);
  	var splineCurveB = new THREE.CubicBezierCurve3(mid, midEndAnchor, endAnchor, end);
  	//splineCurveB.updateArcLengths();
    //how many vertices do we want on this guy? this is for *each* side
  	var vertexCountDesired = Math.floor(/*splineCurveA.getLength()*/ distanceBetweenCountryCenter * 0.001 + this.pointSpeed) * 5;
    //collect the vertices
  	var points = splineCurveA.getPoints(vertexCountDesired);
  	//remove the very last point since it will be duplicated on the next half of the curve
  	points = points.splice(0, points.length - 1);

  	points = points.concat(splineCurveB.getPoints(vertexCountDesired));
  	//add one final point to the center of the earth
  	//we need this for drawing multiple arcs, but piled into one geometry buffer
  	//points.push(vec3_origin);
  	//var val = value * 0.0003;
  	//var size = (1 + Math.sqrt(val));
  	//create a line geometry out of these
  	//var curveGeometry = THREE.Curve.Utils.createLineGeometry(points);
  	var curveGeometry = new THREE.Geometry();
  	//curveGeometry.size = size;
  	curveGeometry.vertices = points;
  	return curveGeometry;
//  	var distanceBetweenCountryCenter = start.clone().subSelf(end).length();	
//  	var anchorHeight = this.radius * 10 + distanceBetweenCountryCenter * 0.5;
//  	var mid = start.clone().lerpSelf(end, 0.5);
//  	var midLength = mid.length();
//  	mid.normalize();
//  	mid.multiplyScalar(midLength + distanceBetweenCountryCenter * 0.45);
//  	var normal = (new THREE.Vector3()).sub(start, end);
//  	normal.normalize();
//  	var distanceHalf = distanceBetweenCountryCenter * 0.5;
//  	var startAnchor = start;
//  	var midStartAnchor = mid.clone().addSelf(normal.clone().multiplyScalar(distanceHalf));
//  	var midEndAnchor = mid.clone().addSelf(normal.clone().multiplyScalar(-distanceHalf));
//  	var endAnchor = end;
//  	var splineCurveA = new THREE.CubicBezierCurve3(start, startAnchor, midStartAnchor, mid);
//  	var splineCurveB = new THREE.CubicBezierCurve3(mid, midEndAnchor, endAnchor, end);
//  	var vertexCountDesired = Math.floor(distanceBetweenCountryCenter * 0.02 + 5) * 2;
//  	var points = splineCurveA.getPoints(vertexCountDesired);
//  	points = points.splice(0, points.length - 1);
//  	points = points.concat(splineCurveB.getPoints(vertexCountDesired));
//  	points.push(new THREE.Vector3(0, 0, 0));
//  	var val = value * 0.1;
//  	var size = (10 + Math.sqrt(val));
//  	size = this.constrain(size, 12, 100);
//  	var curveGeometry = new THREE.Geometry();
//  	for(var i = 0; i < points.length; i ++) {
//  		curveGeometry.vertices.push(points[i]);
//  	}
//  	curveGeometry.size = size;
//  	return curveGeometry;
  }
  createPoint(lat, lon, value) {
  	var pos = this.loadGeoData(lat, lon, value);
  	return new THREE.Vector3(pos.x, pos.y, pos.z);
  }
  addData(target, source, value) {
		var start = this.createPoint(target["lat"], target["lon"]);
		var end = this.createPoint(source["lat"], source["lon"]);
		var splineOutline = new THREE.Line(
		  this.makeConnectionLineGeometry(start, end, value),
		  new THREE.LineBasicMaterial({
  			color: 0x48EAB6,
  			opacity: 1,
  			blending: THREE.AdditiveBlending,
  			transparent: true,
  			depthWrite: false,
  			vertexColors: true,
  			linewidth: 1
		  })
		);
		/*var splineOutline = new THREE.Line(
		  this.makeConnectionLineGeometry(start, end, value),
		  new THREE.MeshBasicMaterial({
				transparent: true,
				opacity: 1,
				color: 0xFCA325
			})
		);*/
		this.rotating.add(splineOutline);
  }
  loadGeoData(lat, lon, height) {
    var h = height || 0;
    var phi = (lat) * Math.PI / 180;
    var theta = (lon - 180) * Math.PI / 180;
    var x = -(this.radius + h) * Math.cos(phi) * Math.cos(theta);
    var y = (this.radius + h) * Math.sin(phi);
    var z = (this.radius + h) * Math.cos(phi) * Math.sin(theta);
    return {
    	x: x,
    	y: y,
    	z: z
    };
  }
  addLight() {
  	//var grid = new THREE.GridHelper(20, 10, 0xffffff, 0xffffff);
    //this.scene.add(grid);
  	var ambientLight = new THREE.AmbientLight(0xeeeeee);
  	this.scene.add(ambientLight);
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, 0.7, 0.7);
    this.scene.add(directionalLight);
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, 0.7, 0.7);
    this.scene.add(directionalLight);
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, 0.7, 0.7);
    this.scene.add(directionalLight);
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, 0.7, 0.7);
    this.scene.add(directionalLight);
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, 0.7, 0.7);
    this.scene.add(directionalLight);
    return false;
  	
  	var ambientLight = new THREE.AmbientLight(0x102042);
  	this.scene.add(ambientLight);
    var directionalLight = new THREE.DirectionalLight(0xeeeeee);
    //directionalLight.position.set(-40, 60, -10);
    this.scene.add(directionalLight);
    
  	/*var light1 = new THREE.SpotLight(0xeeeeee, 1);
  	light1.position.x = 730; 
  	light1.position.y = 520;
  	light1.position.z = 626;
  	light1.castShadow = true;
  	this.scene.add(light1);
  	var light2 = new THREE.PointLight(0xeeeeee, 12);
  	light2.position.x = -640;
  	light2.position.y = -500;
  	light2.position.z = -1000;
  	this.scene.add(light2);
  	var light1 = new THREE.SpotLight(0xeeeeee, 1);
  	light1.position.x = 730; 
  	light1.position.y = 520;
  	light1.position.z = 626;
  	light1.castShadow = true;
  	this.scene.add(light1);
  	var light2 = new THREE.PointLight(0xeeeeee, 12);
  	light2.position.x = -640;
  	light2.position.y = -500;
  	light2.position.z = -1000;
  	this.scene.add(light2);*/
  }
  constrain(v, min, max) {
  	if(v < min)
  		v = min;
  	else
  	if(v > max)
  		v = max;
  	return v;
  }
  load(data) {
  	this.data = data || [];
  	/*for(var i = 0; i < data.length; i++) {
  		this.addData(data[i]["target"], data[i]["source"], data[i]["value"]);
  	}*/
  	if(!this.isAnimate) {
  		this.animate();
  		this.isAnimate = true;
  	}
  }
}



var eh;
function test() {
	if(!eh) {
		eh = new Earth({
			el: "webgl-content"
		});
		eh.animate = function() {
			if(eh.rotateTargetX !== undefined && eh.rotateTargetY !== undefined) {
	      eh.rotateVX += (eh.rotateTargetX - eh.rotateX) * 0.012;
	      eh.rotateVY += (eh.rotateTargetY - eh.rotateY) * 0.012;
	      if(Math.abs(eh.rotateTargetX - eh.rotateX) < 0.1 && Math.abs(eh.rotateTargetY - eh.rotateY) < 0.1) {
	        eh.rotateTargetX = undefined;
	        eh.rotateTargetY = undefined;
	      }
	    }
	    eh.rotateX += eh.rotateVX;
	    eh.rotateY += eh.rotateVY;
	    eh.rotateVX *= 0.98;
	    eh.rotateVY *= 0.98;
	    if(eh.dragging || eh.rotateTargetX !== undefined) {
	      eh.rotateVX *= 0.6;
	      eh.rotateVY *= 0.6;
	    }
	    eh.rotateY += eh.controllers.spin * 0.01;
	    if(eh.rotateX < -eh.rotateXMax){
	      eh.rotateX = -eh.rotateXMax;
	      eh.rotateVX *= -0.95;
	    }
	    if(eh.rotateX > eh.rotateXMax){
	      eh.rotateX = eh.rotateXMax;
	      eh.rotateVX *= -0.95;
	    }
	    // TWEEN.update();
	    eh.rotating.rotation.x = eh.rotateX;
	    eh.rotating.rotation.y = eh.rotateY;
			eh.renderer.clear();               
			eh.renderer.render(eh.scene, eh.camera);
			/*if(eh.mesh) {
				eh.mesh.rotation.set(
          0,
          eh.mesh.rotation.y + .01,
          eh.mesh.rotation.z + .01
        );
			}*/
			if(eh.material) {
				eh.material.uniforms['time'].value = .00025 * (Date.now() - eh.start);
			}
			if(eh.particles) {
				eh.particles.material.uniforms.time.value = (+new Date - eh.start) / 1000;
			}
			/*if(effekseer) {
				effekseer.update();
				effekseer.setProjectionMatrix(eh.camera.projectionMatrix.elements);
        effekseer.setCameraMatrix(eh.camera.matrixWorldInverse.elements);
        effekseer.draw();
        //effekseer.play(eh.effects['Laser01'], 0, 0, 0);
        effekseer.play(eh.effects['Laser01'], 0, 0, 0);
			}*/
	    requestAnimationFrame(eh.animate);
		}
	}
	//eh.load([39.184826, -77.116223], [19.659852, -99.266568], 100);
	eh.load([{
		target: {
			lat: 39.184826,
			lon: -77.116223
		},
		source: {
			lat: 19.659852,
			lon: -99.266568
		},
		value: 100
	}]);
	/*if(effekseer) {
		//effekseer.play(eh.effects['Laser01'], 0, 0, 0);
		effekseer.play(eh.effects['Laser01'], 0, 0, 0);
	}*/
}