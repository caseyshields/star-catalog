#include <stdio.h>
#include <stdlib.h>
#include <assert.h>
#include "novas.h"
#include "FK6.h"
#include "StarMap.h"
/*include "StarPlot.h"
include <GL/glut.h>*/

#define N_STARS 3
#define N_TIMES 4

int main (void) {
    FILE *file;
    StarMap * map;
//    StarPlot * plot;
/*
   Main function to check out many parts of NOVAS-C by calling
   function 'topo_star' with version 3 of function 'solarsystem'.

   For use with NOVAS-C Version 3.
*/

   short int error = 0;
   short int accuracy = 1;
   short int i, j;

/*
   'deltat' is the difference in time scales, TT - UT1.

    The array 'tjd' contains four selected Julian dates at which the
    star positions will be evaluated.
*/

   double deltat = 60.0;
   double tjd[N_TIMES] = {2450203.5, 2450203.5, 2450417.5, 2450300.5};
   double ra, dec;

/*
   Hipparcos (ICRS) catalog data for three selected stars.
*/

   cat_entry stars[N_STARS] = {
      {"POLARIS", "HIP",   0,  2.530301028,  89.264109444,
               44.22, -11.75,  7.56, -17.4},
      {"Delta ORI", "HIP", 1,  5.533444639,  -0.299091944,
                1.67,   0.56,  3.56,  16.0},
      {"Theta CAR", "HIP", 2, 10.715944806, -64.394450000,
               -18.87, 12.06,  7.43,  24.0}};

/*
   The observer's terrestrial coordinates (latitude, longitude, height).
*/

   on_surface geo_loc = {45.0, -75.0, 0.0, 10.0, 1010.0};

/*
   Compute the topocentric places of the three stars at the four
   selected Julian dates.
*/

   for (i = 0; i < N_TIMES; i++)
   {
      for (j = 0; j < N_STARS; j++)
      {
         if ((error = topo_star (tjd[i],deltat,&stars[j],&geo_loc,
            accuracy, &ra,&dec)) != 0)
            printf ("Error %d from topo_star. Star %d  Time %d\n",
               error, j, i);
          else
         {
            printf ("JD = %f  Star = %s\n", tjd[i], stars[j].starname);
            printf ("RA = %12.9f  Dec = %12.8f\n", ra, dec);
            printf ("\n");
         }
      }
      printf ("\n");
   }

   printf("Building star map.");
   file = fopen("C:/dev/starmap/data/FK6.txt", "r");
   assert(file);

   map = StarMap_create();
   FK6_loadMap(878, file, map);
   assert(map);

   StarMap_update(map);
   StarMap_printTime( map );
   StarMap_printSite( map );
   StarMap_printMap( map );

   //   plot = StarPlot_create(map);

   return 1;
}