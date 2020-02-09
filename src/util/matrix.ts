import { createClient, MatrixClient } from "matrix-js-sdk";

export class TMatrixClient {
    private readonly mxClient: MatrixClient;

    constructor() {
        this.mxClient = createClient(JSON.parse(localStorage.TMxClientOpts))
        this.mxClient.startClient();

        // Register a sync listener that only logs the sync state changes.
        this.mxClient.on("sync", (state: string, prevState: string) => {
            if(state != prevState) {
                console.log(`Sync ${prevState}->${state}`);
            }
        })
    }

    public registerSuccessfulSyncListener(f: (mxClient: MatrixClient) => void) {
        this.mxClient.on("sync", async (state: string) => {
            if(state === "SYNCING") {
                await f(this.mxClient)
            }
        })
    }

    public mxcUrlToHttp(url: string) {
        return this.mxClient.mxcUrlToHttp(url)
    }
}

// Make the Matrix client a singleton.
let mxClient: TMatrixClient | undefined = undefined;
export function getMatrixClient() {
    if(mxClient == undefined) {
        mxClient = new TMatrixClient()
    }

    return mxClient
}