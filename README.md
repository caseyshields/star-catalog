# Starmap

![Starmap](stars.png)

A D3 component for displaying star catalogs and selecting individual stars.
Also some scripts for parsing CDS catalogs into a JSON format is included.

# Examples

An example showing the [FK6 Star Catalog is available](https://caseyshields.github.io/starmap/index.html). FK6 is a selection of astrometrically excellent stars tied to the [ICRS](https://en.wikipedia.org/wiki/International_Celestial_Reference_System). It is often used to calibrate telescopes at optical wavelengths. It was compiled from the Hipparcos catalog and long term ground based measurements, and is known to be accurate to a milliarcsecond.

*TODO add Yale bright star catalog example for a more natural looking sky*

# Starmap API

Catalogs are loaded as arrays of json objects.
Any epoch can be used as long as all the entries are consistent.
Each entry must contain;

Member | Type | Meaning
-|-|-
ra | Floating point | Celestial right ascension in hours, 0.0 - 24.0
dec | Floating point | Declination in degrees, -90.0 to +90.0
vm | Floating Point | Visual magnitude




