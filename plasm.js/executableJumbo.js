$(document).ready(function(){
//Final Project - coffee table Jumbo.js - Federico Violante - 281308

//****FUNZIONI DI SUPPORTO****//
x=0;
y=1;
z=2;

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


function arrayConcat(first, second){
  firstLength = first.length;
  result = new Float32Array(firstLength + second.length);
  result.set(first);
  result.set(second, firstLength);
  return result;
}

function addZ(v){
  array = [];
  array.push(0);
  v = arrayConcat(v, array);
  return v;
}

//300-100, *3+1
function randomPattern(dom){
    dom[z]=Math.floor((Math.random()*3)+1);
    return dom;
}

gold = [250,180,0];
grey = [1,1,1];
white = [1.5,1.5,1.5];
black = [0,0,0];

//side = 60;
//domain3d = DOMAIN([[0,side],[0,side], [0,1]])([120,120,1]);
domain2d = DOMAIN([[0,60],[0,60]])([120,120]);
domain2d = MAP(addZ)(domain2d);


pattern = MAP(randomPattern)(domain2d);
pattern = T([y,z])([-Math.sqrt(17.99), 0.751])(Sk(0.0999)(R([x,y])(PI/4.0)(pattern)));
DRAW(COLOR(grey)(pattern));
pattern = MAP(randomPattern)(domain2d);
pattern = T([y,z])([-Math.sqrt(17.99), 0.751])(Sk(0.0999)(R([x,y])(PI/4.0)(pattern)));
DRAW(COLOR(grey)(pattern));
pattern = MAP(randomPattern)(domain2d);
pattern = T([y,z])([-Math.sqrt(17.99), 0.751])(Sk(0.0999)(R([x,y])(PI/4.0)(pattern)));
DRAW(COLOR255(gold)(pattern));

dom = 72;
disk1 = EXTRUDE([1.1])(DISK(0.55*0.5)([dom]));
rect = T([x,y])([-0.06,0.1])(EXTRUDE([1.2])(CUBOID([0.12,1.1])));
disk2 = T([y])([1.3])(EXTRUDE([0.9])(DISK(0.8*0.5)([dom])));

leg = T([y])([-4])(STRUCT([ disk1, rect, disk2 ]));

legR = R([0,1])(PI/2.0);
legs = STRUCT(REPLICA(4)([ leg, COMP([legR])]));

table = R([x,y])(PI/4.0)( T([x,y])([-3,-3])(EXTRUDE([-0.853, 0.197])(CUBOID([6,6]))));

model = COLOR(white)(STRUCT([table, legs]));
DRAW(model);
}