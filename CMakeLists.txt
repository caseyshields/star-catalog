cmake_minimum_required(VERSION 3.10)
project(starmap C)

set(CMAKE_C_STANDARD 11)

include_directories(tracker)
include_directories(tracker/novas)

add_executable(starmap
        tracker/novas/novas.c
        tracker/novas/novas.h
        tracker/novas/novascon.c
        tracker/novas/novascon.h
        tracker/novas/nutation.c
        tracker/novas/nutation.h
        tracker/novas/solarsystem.h
        tracker/novas/solsys3.c
        tracker/FK6.c
        tracker/FK6.h
        tracker/Heap.c
        tracker/Heap.h
        tracker/StarMap.c
        tracker/StarMap.h
        tracker/test.c)
