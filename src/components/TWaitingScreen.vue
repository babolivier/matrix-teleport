<template>
    <div>
        <p>Syncing...</p>
    </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class TWaitingScreen extends Vue {}
</script>

<style scoped>
p {
    padding-top: 15%;
    font-size: 120%;
    width: 100%;
    margin: auto;
    text-align: center;
}
</style>