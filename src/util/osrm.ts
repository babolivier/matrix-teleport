import { Location } from "@/util/location";

const util = require("util");
const OSRM = require('osrm.js');

const osrm = new OSRM("https://routing.openstreetmap.de/routed-foot");

export async function getRouteLegs(locations: Location[]) {
    // Extract the coordinates from the locations in the format that OSRM
    // understands (i.e. [lon, lat] whereas other parts of the app use
    // [lat, lon]).
    let coords = []
    for (let i in locations) {
        coords.push([locations[i].coords[1], locations[i].coords[0]])
    }

    console.log(`Getting legs for coords ${JSON.stringify(coords)}`)

    // Promisify the trip function so we can use async/await semantics.
    const tripFct = util.promisify(osrm.trip.bind(osrm));

    // Query the OSRM API to compute an itinerary between all of the
    // coordinates.
    let opts = {
        coordinates: coords,
        steps: true,
        overview: 'simplified',
        geometries: 'polyline'
    }
    let trip = await tripFct(opts)

    // There's only one trip, so get that.
    let legs = trip.trips[0].legs;

    // The last leg of the trip is from the last location to the first one and
    // we currently don't want that, so we pop it out of the array.
    legs.pop();

    // Get the location of each step of each leg.
    let legsLocations: number[][] = []
    for (let i in legs) {
        let steps = legs[i].steps;
        for (let j in steps) {
            legsLocations.push(steps[j].maneuver.location)
        }
    }

    // Convert the locations from OSRM's [lon, lat] format to the [lat, lon]
    // one.
    return invertLatLon(legsLocations)
}

function invertLatLon(coords: number[][]) {
    let inverted: number[][] = []
    for (let i in coords) {
        let coord = coords[i]
        inverted[i] = [coord[1], coord[0]]
    }
    return inverted
}