$(document).ready(function(){
//Final Project - table lamp Quadrifoglio.js - Federico Violante - 281308

//****FUNZIONI DI SUPPORTO****//

//scala tutte le dims del valore scale
Sk = function(scale) {
	return function (object) {
		return object.clone().scale([0,1,2], [scale,scale,scale]);
	};
};

//colori in RGB da 1 a 255
COLOR255 = function(args){
	return COLOR([args[0]/255.0, args[1]/255.0, args[2]/255.0, args[3]]);
};

//sfera
SPHERE = function (r) {
	return function (arg){
		var a = arg[0];
		var b = arg[1];
		var u = r*SIN(a) * COS(b);
		var v = r*SIN(a) * SIN(b);
		var w = r*COS(a);
		return [u,v,w];
	};
};

//toro
TORUS = function (R,r){
	return function (arg){
		var a = arg[0];
		var b = arg[1] + PI/2.0;
		var u = (r*COS(a)+R) * COS(b);
		var v = (r*COS(a)+R) * SIN(b);
		var w = r*SIN(a);
		return [u,v,w];
	};
};

/* Lamp Glass Quarter, full domain, img.1
var lampQuarterFunc = function (arg){
	var a = arg[0];
	var b = arg[1] + PI/2.0;
	var u = SIN(a) * (COS(b) +1) * 0.9;
	var v = (SIN(a)+0.25) * SIN(b);
	var w = COS(a);
	return [u,v,w];
};
var domain = DOMAIN([[0, PI],[0,2*PI]])([32,32]);
var lampQuarter = MAP(lampQuarterFunc)(domain);
DRAW(lampQuarter);
*/

//Lamp glass
lampQuarterFunc = function (arg){
	var a = arg[0];
	var b = arg[1] + PI/2.0;
	var u = SIN(a) * (COS(b) +1) * 0.9;
	var v = (SIN(a)+0.25) * SIN(b);
	var w = COS(a);
	return [u,v,w];
};

slicer = function (alpha, R){
	var domain = DOMAIN([[0,alpha],[0,R]])([lowDom,1]);
	var mapping = function (v){
		var a = v[0] + 3*PI/4.0;
		var r = v[1];

		return [r*COS(a), r*SIN(a)];
	};
	var model = MAP(mapping)(domain);
	return model;
};

//consts
glassColor = [0,255,0,0.95];

radius = 0.05;
baseDiameter = 1;
lowDom = 12;
dom = 32;
copies = 1;

lampR = R([0,1])(PI/2.0);
lampT = T([0,1])([0.2,0.2]);
lampT2 = T([0,1])([0.1,0.1]);

pillarH = 1.5;
pillar = T([1,2])([0.1,-pillarH-1.15])(CYL_SURFACE([radius, pillarH])([dom]));

pillarAngleDomain = DOMAIN([[0, 2*PI],[0,PI/2.0]])([dom,dom]);
pillarAngle = MAP(TORUS(baseDiameter*0.75, radius))(pillarAngleDomain);
pillarAngles = R([0,1])(PI/4.0)(T([0,2])([(baseDiameter*1.25)-0.3589,-1.15])(R([1,2])(PI/2.0)(pillarAngle)));

pillarArm = R([0,1])(PI/4.0)(T([0,2])([-0.87,-0.4])(R([0,2])(-PI/2.0)(CYL_SURFACE([radius, 0.8])([dom]))));

baseDiskTop = T([2])([radius])(slicer(PI/2.0,baseDiameter));
baseDiskBottom = T([2])([-radius*2])(baseDiskTop);

baseDiskBorderDomain = DOMAIN([[-(PI+0.1)*0.5, (PI+0.1)*0.5],[PI/4.0,3*PI/4.0]])([dom,dom]);
baseDiskBorder = MAP(TORUS(baseDiameter,radius))(baseDiskBorderDomain);

footDisk = T([2])([-0.04])(Sk(0.9)( R([0,1])(PI)( baseDiskTop )) );
footBorder = CYL_SURFACE([baseDiameter-0.1, radius*2])([dom]);
foot = COLOR([0,0,0,1])(T([2])([-pillarH-1.15-radius*2.5])( STRUCT([footDisk, footBorder])));

disk = R([0,1])(PI)(STRUCT([baseDiskTop, baseDiskBottom, baseDiskBorder]));
topDisk = T([2])([1.1])(Sk(0.4)(disk));
disk = T([2])([-pillarH-1.15])(disk);

lampDomain = DOMAIN([[0,0.625*PI],[PI+0.15,2*PI-0.15]])([dom,dom]);
lampQuarter = MAP(lampQuarterFunc)(lampDomain);
lampQuarter = COLOR255(glassColor)( S([2])([1.1])(lampQuarter));
 
lampGlass = T([0])([0.2])(STRUCT(REPLICA(copies)([ lampQuarter, COMP([lampR,lampT])])));
pillars =  T([0])([0.1])(STRUCT(REPLICA(copies)([pillar, COMP([lampR, lampT2])])));

rotationalGroup = STRUCT(REPLICA(copies)([ disk, topDisk, pillarAngles, pillarArm, foot, COMP([lampR])]));

trunk = T([2])([-pillarH-1.15])(CYL_SURFACE([radius*0.7, pillarH+1])([dom]));

boltDomain = DOMAIN([[0, 2*PI],[0,2*PI]])([lowDom,dom]);
boltMap = MAP(TORUS(0.02, 0.008))(boltDomain);
bolt = T([0,1,2])([0.1315,0.1315,-1.25])(R([0,1])(3*PI/4.0)(R([1,2])(PI/2.0)(boltMap)));
bolts = STRUCT(REPLICA(copies)([ bolt, COMP([lampR])]));

sphereDomain = DOMAIN([[0,PI],[0,2*PI]])([dom,dom]);
sphere1 = T([2])([-1.25])(MAP(SPHERE(0.1))(sphereDomain));
sphere2 = T([2])([-1.257])(STRUCT([sphere1, bolts]));

bulbDomain = DOMAIN([[0,1],[0,2*PI]])([dom,dom]);
bulbSocketProfile = BEZIER(S0)([[0,0,0], [2.5,2.5,0.1],[2.5,2.5,0.1],[2.5,2.5,0.1],[2.5,2.5,0.1], [2.5,2.5,2.5],[2.5,2.5,2.5], [2.5,2.5,2.5],[2.5,2.5,2.5], [2.5,2.5,4],[2.5,2.5,4],[2.5,2.5,4], [1,1,3.5]]);
bulbMap = ROTATIONAL_SURFACE(bulbSocketProfile);
bulbSocket = COLOR([0,0,0,1])(MAP(bulbMap)(bulbDomain));

bulbProfile = BEZIER(S0)([[2,2,3.5],[2,2,4.5],  [2,2,4.5],  [2,2,4.5],  [3,3,4.5],[3,3,5.5],[3,3,5.5], [3.5,3.5,7.5],[3.5,3.5,7.5],[3.5,3.5,7.5],
	[3,3,9], [3,3,9], [3,3,9], [1,1,9.5],[1,1,9.5],[0,0,9.5],[0,0,9.5]  ]);
bulbMap = ROTATIONAL_SURFACE(bulbProfile);
bulb = COLOR([1.5,1.5,1.5,1])(MAP(bulbMap)(bulbDomain));
lightBulb = T([2])([-0.3])(Sk(0.1)(STRUCT([bulbSocket , bulb])));

model = STRUCT([lampGlass, pillars, rotationalGroup, trunk, bolts, sphere1, sphere2, lightBulb]);
DRAW(model);
}