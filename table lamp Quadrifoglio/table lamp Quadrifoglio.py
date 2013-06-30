#Final Project - table lamp Quadrifoglio.py - Federico Violante - 281308

#** CONVERSIONE DA JS A PY **//

X = 1;
Y = 2;
Z = 3;

S0 = S1;
S1 = S2;
S2 = S3;

DRAW = VIEW;
CYL_SURFACE = CYLINDER;
REPLICA = NN;

ROTATIONAL_SURFACE = ROTATIONALSURFACE;

def DOMAIN(intv):
    i1, i2 = intv;
    def f(doms):
        return PROD([INTERVALS(i1[1])(doms[0]),INTERVALS(i2[1])(doms[1])])
    return f

#****FUNZIONI DI SUPPORTO****//

def Sk (scale):
    def Sk1(object):
        return S([0,1,2])([scale,scale,scale])(object);
    return Sk1;


#colori in RGB da 1 a 255
def COLOR255 (args):
    return Color4f([args[0]/255.0, args[1]/255.0, args[2]/255.0, args[3]]);

#sfera
def SPHERE(r):
    def f(arg):
        a = arg[0];
        b = arg[1];
        u = r*SIN(a) * COS(b);
        v = r*SIN(a) * SIN(b);
        w = r*COS(a);
        return [u,v,w];
    return f;

#toro
def TORUS(R, r):
    def f(arg):
        a = arg[0];
        b = arg[1] + PI/2.0;
        u = (r*COS(a)+R) * COS(b);
        v = (r*COS(a)+R) * SIN(b);
        w = r*SIN(a);
        return [u, v, w];
    return f;

# Lamp Glass Quarter, full domain, img.1
#domain = DOMAIN([[0, PI],[0,2*PI]])([32,32]);
#lampQuarter = MAP(lampQuarterFunc)(domain);
#DRAW(lampQuarter);
#

#Lamp glass
def lampQuarterFunc (arg):
    a = arg[0];
    b = arg[1] + PI/2.0;
    u = SIN(a) * (COS(b) +1) * 0.9;
    v = (SIN(a)+0.25) * SIN(b);
    w = COS(a);
    return [u,v,w];

def slicer (alpha, R):
    domain = DOMAIN([[0,alpha],[0,R]])([lowDom,1]);
    def mapping (v):
        a = v[0] + 3*PI/4.0;
        r = v[1];
        return [r*COS(a), r*SIN(a)];
    model = MAP(mapping)(domain);
    return model;

#consts
glassColor = [0,255,0,0.95];

radius = 0.05;
baseDiameter = 1;
lowDom = 12;
dom = 32;

lampR = R([X,Y])(PI/2.0);
lampT = T([X,Y])([0.2,0.2]);
lampT2 = T([X,Y])([0.1,0.1]);

pillarH = 1.5;
pillar = T([1,2])([0.1,-pillarH-1.15])(CYL_SURFACE([radius, pillarH])(dom));

pillarAngleDomain = DOMAIN([[0, 2*PI],[0,PI/2.0]])([dom,dom]);
pillarAngle = MAP(TORUS(baseDiameter*0.75, radius))(pillarAngleDomain);
pillarAngles = R([X,Y])(PI/4.0)(T([X,Z])([(baseDiameter*1.25)-0.3589,-1.15])(R([Y,Z])(PI/2.0)(pillarAngle)));

pillarArm = R([X,Y])(PI/4.0)(T([X,Z])([-0.87,-0.4])(R([X,Z])(-PI/2.0)(CYL_SURFACE([radius, 0.8])(dom))));

baseDiskTop = T([Z])([radius])(slicer(PI/2.0,baseDiameter));
baseDiskBottom = T([Z])([-radius*2])(baseDiskTop);

baseDiskBorderDomain = DOMAIN([[-(PI+0.1)*0.5, (PI+0.1)*0.5],[PI/4.0,3*PI/4.0]])([dom,dom]);
baseDiskBorder = MAP(TORUS(baseDiameter,radius))(baseDiskBorderDomain);

footDisk = T([Z])([-0.04])(Sk(0.9)( R([X,Y])(PI)( baseDiskTop )) );
footBorder = CYL_SURFACE([baseDiameter-0.1, radius*2])(dom);
foot = COLOR([0,0,0,1])(T([Z])([-pillarH-1.15-radius*2.5])( STRUCT([footDisk, footBorder])));

disk = R([X,Y])(PI)(STRUCT([baseDiskTop, baseDiskBottom, baseDiskBorder]));
topDisk = T([Z])([1.1])(Sk(0.4)(disk));
disk = T([Z])([-pillarH-1.15])(disk);

lampDomain = DOMAIN([[0,0.625*PI],[PI+0.15,2*PI-0.15]])([dom,dom]);
lampQuarter = MAP(lampQuarterFunc)(lampDomain);
lampQuarter = COLOR(COLOR255(glassColor))( S([2])([1.1])(lampQuarter));

lampGlass = T([X])([0.2])(STRUCT(REPLICA(4)([ lampQuarter, COMP([lampR,lampT])])));
pillars =  T([X])([0.1])(STRUCT(REPLICA(4)([pillar, COMP([lampR, lampT2])])));

rotationalGroup = STRUCT(REPLICA(4)([ disk, topDisk, pillarAngles, pillarArm, foot, COMP([lampR])]));

trunk = T([Z])([-pillarH-1.15])(CYL_SURFACE([radius*0.7, pillarH+1])(dom));

boltDomain = DOMAIN([[0, 2*PI],[0,2*PI]])([lowDom,dom]);
boltMap = MAP(TORUS(0.02, 0.008))(boltDomain);
bolt = T([X,Y,Z])([0.1315,0.1315,-1.25])(R([X,Y])(3*PI/4.0)(R([1,2])(PI/2.0)(boltMap)));
bolts = STRUCT(REPLICA(4)([ bolt, COMP([lampR])]));

sphereDomain = DOMAIN([[0,PI],[0,2*PI]])([dom,dom]);
sphere1 = T([Z])([-1.25])(MAP(SPHERE(0.1))(sphereDomain));
sphere2 = T([Z])([-1.257])(STRUCT([sphere1, bolts]));

model = STRUCT([lampGlass, pillars, rotationalGroup, trunk, bolts, sphere1, sphere2]);
DRAW(model);
#DRAW(Sk(100)(model));


bulbDomain = DOMAIN([[0,1],[0,2*PI]])([dom,dom]);
bulbSocketProfile = BEZIER(S0)([[0,0,0], [2.5,2.5,0.1],[2.5,2.5,0.1],[2.5,2.5,0.1],[2.5,2.5,0.1], [2.5,2.5,2.5],[2.5,2.5,2.5], [2.5,2.5,2.5],[2.5,2.5,2.5], [2.5,2.5,4],[2.5,2.5,4],[2.5,2.5,4], [1,1,3.5]]);
bulbMap = ROTATIONAL_SURFACE(bulbSocketProfile);
bulbSocket = COLOR([0,0,0,1])(MAP(bulbMap)(bulbDomain));

bulbProfile = BEZIER(S0)([[2,2,3.5],[2,2,4.5],  [2,2,4.5],  [2,2,4.5],  [3,3,4.5],[3,3,5.5],[3,3,5.5], [3.5,3.5,7.5],[3.5,3.5,7.5],[3.5,3.5,7.5],
[3,3,9], [3,3,9], [3,3,9], [1,1,9.5],[1,1,9.5],[0,0,9.5],[0,0,9.5]  ]);
bulbMap = ROTATIONAL_SURFACE(bulbProfile);
bulb = COLOR([1.5,1.5,1.5,1])(MAP(bulbMap)(bulbDomain));
lightBulb = T([Z])([-0.3])(Sk(0.1)(STRUCT([bulbSocket , bulb])));
DRAW(lightBulb);
