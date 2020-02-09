<template>
    <LMap :zoom=12 :center="center">
        <LTileLayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></LTileLayer>
        <TMarker
            v-for="(location, index) in locations"
            :location="location"
            :key="index"
        ></TMarker>
        <LPolyline :lat-lngs="coords" :color="color"></LPolyline>
    </LMap>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer, LPolyline } from 'vue2-leaflet';
import TMarker from "@/components/TMarker.vue";
import { Location } from "@/util/location";

@Component({
    components: {
        LMap,
        LTileLayer,
        TMarker,
        LPolyline,
    },
})

export default class TMap extends Vue {
    @Prop() private coords!: number[][];
    @Prop() private locations!: Location[];
    // TODO: Make the color configurable.
    private color = "red";
    private center!: number[];

    private beforeMount(): void {
        // Define the center of the map here so that the center doesn't reset at
        // each sync.
        this.center = this.locations[0].coords;
    }
}
</script>
