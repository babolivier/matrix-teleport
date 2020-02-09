<template>
    <div>
        <p v-if="datapoint.type === datatype.TEXT">{{ datapoint.body }}</p>
        <img
            v-if="datapoint.type === datatype.IMAGE"
            :src="client.mxcUrlToHttp(datapoint.media_url)"
            width="100%"
        />
    </div>
</template>

<script lang="ts">
import { Prop, Vue, Component } from 'vue-property-decorator';
import { Datapoint, Datatype } from "@/util/location";
import { getMatrixClient, TMatrixClient } from "@/util/matrix";

@Component({})
export default class TDatapoint extends Vue {
    @Prop() private datapoint!: Datapoint;
    private datatype = Datatype;
    private client!: TMatrixClient;

    private beforeMount(): void {
        // Retrieve a Matrix client to use when converting the mxc:// URLs into
        // http(s):// ones.
        this.client = getMatrixClient()
    }
}
</script>

<style scoped>

</style>