// Extensions to the Math routines - Trig routines in degrees
function rev(angle){return angle-Math.floor(angle/360.0)*360.0;}
function sind(angle){return Math.sin((angle*Math.PI)/180.0);}
function cosd(angle){return Math.cos((angle*Math.PI)/180.0);}
function tand(angle){return Math.tan((angle*Math.PI)/180.0);}
function asind(c){return (180.0/Math.PI)*Math.asin(c);}
function acosd(c){return (180.0/Math.PI)*Math.acos(c);}
function atan2d(y,x){return (180.0/Math.PI)*Math.atan(y/x)-180.0*(x<0);}

// Functions used for converting Basic code
function SGN(x) { return (x<0)?-1:+1; }

// radtoaa converts ra and dec to altitude and azimuth

function radtoaa(ra,dec,obs) {
  var lst=local_sidereal(obs);
  var x=cosd(15.0*(lst-ra))*cosd(dec);
  var y=sind(15.0*(lst-ra))*cosd(dec);
  var z=sind(dec);
  // rotate so z is the local zenith
  var xhor=x*sind(obs.latitude)-z*cosd(obs.latitude);
  var yhor=y;
  var zhor=x*cosd(obs.latitude)+z*sind(obs.latitude);
  var azimuth=rev(atan2d(yhor,xhor)+180.0); // so 0 degrees is north
  var altitude=atan2d(zhor,Math.sqrt(xhor*xhor+yhor*yhor));
  return new Array(altitude,azimuth);
}


// Functions for the moon

// Meeus first edition table 45.A Longitude and distance of the moon

   var T45AD = new Array(0, 2, 2, 0, 0, 0, 2, 2, 2, 2,
                         0, 1, 0, 2, 0, 0, 4, 0, 4, 2,
                         2, 1, 1, 2, 2, 4, 2, 0, 2, 2,
                         1, 2, 0, 0, 2, 2, 2, 4, 0, 3,
                         2, 4, 0, 2, 2, 2, 4, 0, 4, 1,
                         2, 0, 1, 3, 4, 2, 0, 1, 2, 2);

   T45AM = new Array(0,  0,  0,  0,  1,  0,  0, -1,  0, -1,
                     1,  0,  1,  0,  0,  0,  0,  0,  0,  1,
                     1,  0,  1, -1,  0,  0,  0,  1,  0, -1,
                     0, -2,  1,  2, -2,  0,  0, -1,  0,  0,
                     1, -1,  2,  2,  1, -1,  0,  0, -1,  0,
                     1,  0,  1,  0,  0, -1,  2,  1,  0,  0);

   T45AMP = new Array( 1, -1,  0,  2,  0,  0, -2, -1,  1,  0,
                      -1,  0,  1,  0,  1,  1, -1,  3, -2, -1,
                       0, -1,  0,  1,  2,  0, -3, -2, -1, -2,
                       1,  0,  2,  0, -1,  1,  0, -1,  2, -1,
                       1, -2, -1, -1, -2,  0,  1,  4,  0, -2,
                       0,  2,  1, -2, -3,  2,  1, -1,  3, -1);

   T45AF  = new Array( 0,  0,  0,  0,  0,  2,  0,  0,  0,  0,
                       0,  0,  0, -2,  2, -2,  0,  0,  0,  0,
                       0,  0,  0,  0,  0,  0,  0,  0,  2,  0,
                       0,  0,  0,  0,  0, -2,  2,  0,  2,  0,
                       0,  0,  0,  0,  0, -2,  0,  0,  0,  0,
                      -2, -2,  0,  0,  0,  0,  0,  0,  0, -2);

   T45AL = new Array(6288774, 1274027, 658314, 213618, -185116,
                     -114332,   58793,  57066,  53322,   45758,
                      -40923,  -34720, -30383,  15327,  -12528,
                       10980,   10675,  10034,   8548,   -7888,
                       -6766,   -5163,   4987,   4036,    3994,
                        3861,    3665,  -2689,  -2602,    2390,
                       -2348,    2236,  -2120,  -2069,    2048,
                       -1773,   -1595,   1215,  -1110,    -892,
                        -810,     759,   -713,   -700,     691,
                         596,     549,    537,    520,    -487,
                        -399,    -381,    351,   -340,     330,
                         327,    -323,    299,    294,       0);

   T45AR = new Array(-20905355, -3699111, -2955968, -569925,   48888,
                         -3149,   246158,  -152138, -170733, -204586,
                       -129620,   108743,   104755,   10321,       0,
                         79661,   -34782,   -23210,  -21636,   24208,
                         30824,    -8379,   -16675,  -12831,  -10445,
                        -11650,    14403,    -7003,       0,   10056,
                          6322,    -9884,     5751,       0,   -4950,
                          4130,        0,    -3958,       0,    3258,
                          2616,    -1897,    -2117,    2354,       0,
                             0,    -1423,    -1117,   -1571,   -1739,
                             0,    -4421,        0,       0,       0,
                             0,     1165,        0,       0,    8752);

// Meeus table 45B latitude of the moon

   var T45BD = new Array(0, 0, 0, 2, 2, 2, 2, 0, 2, 0,
                         2, 2, 2, 2, 2, 2, 2, 0, 4, 0,
                         0, 0, 1, 0, 0, 0, 1, 0, 4, 4,
                         0, 4, 2, 2, 2, 2, 0, 2, 2, 2,
                         2, 4, 2, 2, 0, 2, 1, 1, 0, 2,
                         1, 2, 0, 4, 4, 1, 4, 1, 4, 2);

   var T45BM = new Array( 0,  0,  0,  0,  0,  0,  0, 0,  0,  0,
                         -1,  0,  0,  1, -1, -1, -1, 1,  0,  1,
                          0,  1,  0,  1,  1,  1,  0, 0,  0,  0,
                          0,  0,  0,  0, -1,  0,  0, 0,  0,  1,
                          1,  0, -1, -2,  0,  1,  1, 1,  1,  1,
                          0, -1,  1,  0, -1,  0,  0, 0, -1, -2);

   var T45BMP = new Array(0,  1, 1,  0, -1, -1,  0,  2,  1,  2,
                          0, -2, 1,  0, -1,  0, -1, -1, -1,  0,
                          0, -1, 0,  1,  1,  0,  0,  3,  0, -1,
                          1, -2, 0,  2,  1, -2,  3,  2, -3, -1,
                          0,  0, 1,  0,  1,  1,  0,  0, -2, -1,
                          1, -2, 2, -2, -1,  1,  1, -1,  0,  0);

   var T45BF = new Array( 1,  1, -1, -1,  1, -1,  1,  1, -1, -1,
                         -1, -1,  1, -1,  1,  1, -1, -1, -1,  1,
                          3,  1,  1,  1, -1, -1, -1,  1, -1,  1,
                         -3,  1, -3, -1, -1,  1, -1,  1, -1,  1,
                          1,  1,  1, -1,  3, -1, -1,  1, -1, -1,
                          1, -1,  1, -1, -1, -1, -1, -1, -1,  1);

   var T45BL = new Array(5128122, 280602, 277693, 173237, 55413,
                           46271,  32573,  17198,   9266,  8822,
                            8216,   4324,   4200,  -3359,  2463,
                            2211,   2065,  -1870,   1828, -1794,
                           -1749,  -1565,  -1491,  -1475, -1410,
                           -1344,  -1335,   1107,   1021,   833,
                             777,    671,    607,    596,   491,
                            -451,    439,    422,    421,  -366,
                            -351,    331,    315,    302,  -283,
                            -229,    223,    223,   -220,  -220,
                            -185,    181,   -177,    176,   166,
                            -164,    132,   -119,    115,   107);

// MoonPos calculates the Moon position, based on Meeus chapter 45
// and the illuminated percentage from Meeus equations 46.4 and 46.1

// The Julian date at 0 hours UT at Greenwich

function jd0(year,month,day) {
  var y  = year;
  var m = month;
  if (m < 3) {m += 12; y -= 1};
  var a = Math.floor(y/100);
  var b = 2-a+Math.floor(a/4);
  var j = Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+day+b-1524.5;
  return j;
}

function moonPhaseAngle(jdobs) {
  var T=(jdobs-2451545.0)/36525;
  var T2=T*T;
  var T3=T2*T;
  var T4=T3*T;
  // Moons mean longitude L'
  var LP=218.3164477+481267.88123421*T-0.0015786*T2+T3/538841.0-T4/65194000.0;
  // Moons mean elongation
  var D=297.8501921+445267.1114034*T-0.0018819*T2+T3/545868.0-T4/113065000.0;
  // Suns mean anomaly
  var M=357.5291092+35999.0502909*T-0.0001536*T2+T3/24490000.0;
  // Moons mean anomaly M'
  var MP=134.9633964+477198.8675055*T+0.0087414*T2+T3/69699.0-T4/14712000.0;
  // phase angle
  var pa=180.0-D-6.289*sind(MP)+2.1*sind(M)-1.274*sind(2*D-MP)
         -0.658*sind(2*D)-0.214*sind(2*MP)-0.11*sind(D);
  // Altitude and azimuth
  // var altaz=radtoaa(ra,dec,obs);
  // return new Array(ra,dec,mr,altaz[0],altaz[1],rev(pa));
  return rev(pa);
}
