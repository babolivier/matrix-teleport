<template>
    <div>
        <LMarker :lat-lng="location.coords">
            <LPopup :lat-lng="location.coords">
                <TDatapoint
                    v-for="(datapoint, index) in location.datapoints"
                    :key="index"
                    :datapoint="datapoint"
                ></TDatapoint>
            </LPopup>
        </LMarker>
    </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import { LMarker, LPopup } from 'vue2-leaflet';
import L from 'leaflet';
import TDatapoint from "@/components/TDatapoint.vue";
import { Location } from "@/util/location";

delete (L.Icon.Default.prototype as unknown as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});


@Component({
    components: {
        LMarker,
        LPopup,
        TDatapoint,
    },
})

export default class TMarker extends Vue {
    @Prop() private location!: Location;
}
</script>

<style scoped>

</style>