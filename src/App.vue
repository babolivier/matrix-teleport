<template>
  <div id="app">
      <TMap v-if="locations.length" :coords="waypoints" :locations="locations"></TMap>
      <TWaitingScreen v-else></TWaitingScreen>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TMap from './components/TMap.vue'
import TWaitingScreen from './components/TWaitingScreen.vue';
import { MatrixClient } from "matrix-js-sdk";
import { Location } from "@/util/location";
import { TMatrixClient, getMatrixClient } from "@/util/matrix";
import { getRouteLegs } from "@/util/osrm";


@Component({
  components: {
      TMap,
      TWaitingScreen,
  },
})

export default class App extends Vue {
    private client!: TMatrixClient;
    private locations: Location[] = [];
    private waypoints: number[][] = [[0,0]];

    private async beforeMount() {
        this.client = getMatrixClient()

        // Register the listener for successful sync so that we get updates
        // about locations of interest and waypoints on sync.
        this.client.registerSuccessfulSyncListener(this.onSuccessfulSync)
    }

    private async onSuccessfulSync(mxClient: MatrixClient) {
        let room = mxClient.getRoom('!pwRgaSeRRkweMrTPkv:abolivier.bzh')
        let evts = room.currentState.getStateEvents("bzh.abolivier.teleport.location")

        // Remove the events with an empty content (which means they have
        // been redacted) and sort the remaining events by weight.
        evts = evts.filter((evt) => {return Object.keys(evt.getContent()).length > 0})
        evts = evts.sort((a, b) => {
            return a.getContent().weight - b.getContent().weight
        })

        // Parse every location events, including the ones with no
        // datapoints, which we use to influence the itinerary.
        let _locationsWithEmpty = []
        for (let i in evts) {
            let coords = evts[i].getStateKey() as string
            let content = evts[i].getContent()
            _locationsWithEmpty.push(Location.fromObject(coords, content))
        }

        // Compute the itinerary between every location.
        this.waypoints = await getRouteLegs(_locationsWithEmpty)

        // Filter out locations with no datapoints to only keep the ones for
        // which we have data to display.
        this.locations = _locationsWithEmpty.filter((location) => {
            return location.datapoints.length > 0
        })

        if (this.waypoints.length > 0) {
            console.log(`Coords are: ${JSON.stringify(this.waypoints)}`)
        }
    }
}
</script>

<style>
body {
    margin: 0;
}
#app {
    height: 100%;
    width: 100%;
    position: absolute;
}
</style>
