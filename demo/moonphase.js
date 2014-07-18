//
// Calculate the phases of the moon.
//
// This work was adapted from the Stellafane Moon Phase Calculator at www.stellafane.com.
// That work in turn was ported from a BASIC program that appeared in
// Astronomical Computing, Sky & Telescope, March, 1985, while the code for
// Julian Day to Calendar Dates appeared in the same column in May 1984. In both
// cases, the BASIC code by Roger W. Sinnott was based on algorithms by Jean
// Meeus in Astronomical Formulae for Calculators (Willmann-Bell, 1982). The
// BASIC source code was obtained from the Sky Publishing Web Site and converted
// to JavaScript for this web page. The TDT to UTC corrections are from a
// subsequent book by Meeus: Astronomical Algorithms, Second Edition (Willmann-
// Bell, 1998).
// 
// This isn't meant to show off good JavaScript coding style; it just needs to
// work for purposes of this moon calendar demo.  This code glaringly shows its
// BASIC origins: cryptic variable names, relatively sparse comments, inadequate
// factoring to clear functions, etc. On the plus side, in comparison to many
// other JavaScript calcuations of moon phase, this code seems to actually come
// reasonably close to matching the official moon phase calendars put out by
// sources such as the US Naval Observatory's Phases of the Moon page at
// http://aa.usno.navy.mil/data/docs/MoonPhase.php.
// 

//-----Utility Funtions------------------------------------------------------------
function INT(  n )  { return Math.floor( n ); }     //Emulates BASIC's INT Funtion
function POW2( n )  { return Math.pow( n, 2 );} //Square a number

//-----Correct TDT to UTC----------------------------------------------------------------
// Meeus Astronomical Algorithms Chapter 10
function fromTDTtoUTC( tobj ) {
    // Correction lookup table has entry for every even year between TBLfirst and TBLlast
    var TBLfirst = 1620, TBLlast = 2002;    // Range of years in lookup table
    var TBL = new Array(                    // Corrections in Seconds
        /*1620*/ 121,112,103, 95, 88,  82, 77, 72, 68, 63,  60, 56, 53, 51, 48,  46, 44, 42, 40, 38,
        /*1660*/  35, 33, 31, 29, 26,  24, 22, 20, 18, 16,  14, 12, 11, 10,  9,   8,  7,  7,  7,  7,
        /*1700*/   7,  7,  8,  8,  9,   9,  9,  9,  9, 10,  10, 10, 10, 10, 10,  10, 10, 11, 11, 11,
        /*1740*/  11, 11, 12, 12, 12,  12, 13, 13, 13, 14,  14, 14, 14, 15, 15,  15, 15, 15, 16, 16,
        /*1780*/  16, 16, 16, 16, 16,  16, 15, 15, 14, 13,  
        /*1800*/ 13.1, 12.5, 12.2, 12.0, 12.0,  12.0, 12.0, 12.0, 12.0, 11.9,  11.6, 11.0, 10.2,  9.2,  8.2,
        /*1830*/  7.1,  6.2,  5.6,  5.4,  5.3,   5.4,  5.6,  5.9,  6.2,  6.5,   6.8,  7.1,  7.3,  7.5,  7.6,
        /*1860*/  7.7,  7.3,  6.2,  5.2,  2.7,   1.4, -1.2, -2.8, -3.8, -4.8,  -5.5, -5.3, -5.6, -5.7, -5.9,
        /*1890*/ -6.0, -6.3, -6.5, -6.2, -4.7,  -2.8, -0.1,  2.6,  5.3,  7.7,  10.4, 13.3, 16.0, 18.2, 20.2,
        /*1920*/ 21.1, 22.4, 23.5, 23.8, 24.3,  24.0, 23.9, 23.9, 23.7, 24.0,  24.3, 25.3, 26.2, 27.3, 28.2,
        /*1950*/ 29.1, 30.0, 30.7, 31.4, 32.2,  33.1, 34.0, 35.0, 36.5, 38.3,  40.2, 42.2, 44.5, 46.5, 48.5,
        /*1980*/ 50.5, 52.5, 53.8, 54.9, 55.8,  56.9, 58.3, 60.0, 61.6, 63.0,  63.8, 64.3); /*2002 last entry*/
        // Values for Delta T for 2000 thru 2002 from NASA
    var deltaT = 0; // deltaT = TDT - UTC (in Seconds)
    var Year = tobj.getUTCFullYear();
    var t = (Year - 2000) / 100;    // Centuries from the epoch 2000.0
    
    if ( Year >= TBLfirst && Year <= TBLlast ) { // Find correction in table
        if (Year%2) { // Odd year - interpolate
            deltaT = ( TBL[(Year-TBLfirst-1)/2] + TBL[(Year-TBLfirst+1)/2] ) / 2;
        } else { // Even year - direct table lookup
            deltaT = TBL[(Year-TBLfirst)/2];
        }
    } else if( Year < 948) { 
        deltaT = 2177 + 497*t + 44.1*POW2(t);
    } else if( Year >=948) {
        deltaT =  102 + 102*t + 25.3*POW2(t);
        if (Year>=2000 && Year <=2100) { // Special correction to avoid discontinurity in 2000
            deltaT += 0.37 * ( Year - 2100 );
        }
    } else { alert("Error: TDT to UTC correction not computed"); }
    return( new Date( tobj.getTime() - (deltaT*1000) ) ); // JavaScript native time is in milliseonds
} // End fromTDTtoUTC

//-----Julian Date to UTC Date Object----------------------------------------------------
// Meeus Astronomical Algorithms Chapter 7 
function fromJDtoUTC( JD ){
    // JD = Julian Date, possible with fractional days
    // Output is a JavaScript UTC Date Object
    var A, alpha;
    var Z = INT( JD + 0.5 ); // Integer JD's
    var F = (JD + 0.5) - Z;  // Fractional JD's
    if (Z < 2299161) { A = Z; }
    else {
        alpha = INT( (Z-1867216.25) / 36524.25 );
        A = Z + 1 + alpha - INT( alpha / 4 );
    }
    var B = A + 1524;
    var C = INT( (B-122.1) / 365.25 );
    var D = INT( 365.25*C );
    var E = INT( ( B-D )/30.6001 );
    var DT = B - D - INT(30.6001*E) + F;    // Day of Month with decimals for time
    var Mon = E - (E<13.5?1:13);            // Month Number
    var Yr  = C - (Mon>2.5?4716:4715);      // Year    
    var Day = INT( DT );                    // Day of Month without decimals for time
    var H = 24*(DT - Day);                  // Hours and fractional hours 
    var Hr = INT( H );                      // Integer Hours
    var M = 60*(H - Hr);                    // Minutes and fractional minutes
    var Min = INT( M );                     // Integer Minutes
    var Sec = INT( 60*(M-Min) );            // Integer Seconds (Milliseconds discarded)
    //Create and set a JavaScript Date Object and return it
    var theDate = new Date(0);
    theDate.setUTCFullYear(Yr, Mon-1, Day);
    theDate.setUTCHours(Hr, Min, Sec);
    return( theDate );
} //End fromJDtoUTC

//-----Moon Phase Calculation-----------------------------------------------------
//Converted from Basic by Roger W. Sinnot, Sky & Telescope, March 1985.
function calcMoonPhases( Y ) {

  var phases = {
    full: [],
    new: []
  };

  var R1 = Math.PI / 180;
  var nextPhaseIsFull = false;
  var K0, T, T2, T3, J0, F0, J, F, M0, M1, B1, K9, K, M5, M6, B6;
  K0 = INT((Y-1900)*12.3685);
  T = (Y-1899.5) / 100;
  T2 = T*T; T3 = T*T*T;
  J0 = 2415020 + 29*K0;
  F0 = 0.0001178*T2 - 0.000000155*T3;
  F0 += (0.75933 + 0.53058868*K0);
  F0 -= (0.000837*T + 0.000335*T2);
  M0 = K0*0.08084821133;
  M0 = 360*(M0 - INT(M0)) + 359.2242;
  M0 -= 0.0000333*T2;
  M0 -= 0.00000347*T3;
  M1 = K0*0.07171366128;
  M1 = 360*(M1 - INT(M1)) + 306.0253;
  M1 += 0.0107306*T2;
  M1 += 0.00001236*T3;
  B1 = K0*0.08519585128;
  B1 = 360*(B1 - INT(B1)) + 21.2964;
  B1 -= 0.0016528*T2;
  B1 -= 0.00000239*T3;

  for ( K9=0; K9 <= 28; K9++ ) {
    J = J0 + 14*K9; F = F0 + 0.765294*K9;
    K = K9/2;
    M5 = (M0 + K* 29.10535608)*R1;
    M6 = (M1 + K*385.81691806)*R1;
    B6 = (B1 + K*390.67050646)*R1;
    F -= 0.4068*Math.sin(M6);
    F += (0.1734 - 0.000393*T)*Math.sin(M5);
    F += 0.0161*Math.sin(2*M6);
    F += 0.0104*Math.sin(2*B6);
    F -= 0.0074*Math.sin(M5 - M6);
    F -= 0.0051*Math.sin(M5 + M6);
    F += 0.0021*Math.sin(2*M5);
    F += 0.0010*Math.sin(2*B6-M6);
    F += 0.5 / 1440; //Adds 1/2 minute for proper rounding to minutes per Sky & Tel article
    var JDE = J + F;                // Julian Empheris Day with fractions for time of day
    var TDT = fromJDtoUTC( JDE );       // Convert Julian Days to TDT in a Date Object
    var UTC = fromTDTtoUTC( TDT );      // Correct TDT to UTC, both as Date Objects 
    if ( Y === UTC.getFullYear() ) {    //Filter output to only include phases in the indicated year.
      if ( nextPhaseIsFull ) {
        phases.full.push( UTC );
      } else {
        phases.new.push( UTC );
      }
    }
    nextPhaseIsFull = !nextPhaseIsFull;
  }

  return phases;
}
