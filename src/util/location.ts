export class Location {
    public coords: number[];
    public datapoints: Datapoint[];

    constructor(coords: number[], datapoints: Datapoint[]) {
        this.coords = coords;
        this.datapoints = datapoints;
    }

    public static fromObject(
        coords: string,
        jsonObject: {
            datapoints: {
                datatype: string,
                body?: string,
                media_url?: string
            }[]
        }
    ) {
        let datapointObjects = []
        for (let i in jsonObject.datapoints) {
            datapointObjects.push(Datapoint.fromObject(jsonObject.datapoints[i]))
        }

        let coords_split = coords.split(",")

        return new Location(
            [parseFloat(coords_split[0]), parseFloat(coords_split[1])],
            datapointObjects,
        )
    }
}

export class Datapoint{
    public type: Datatype;
    public body?: string;
    public media_url?: string;

    constructor(type: string, body?: string, media_url?: string) {
        let strToDataType: {[key: string]: Datatype} = {
            "bzh.abolivier.teleport.text": Datatype.TEXT,
            "bzh.abolivier.teleport.image": Datatype.IMAGE,
            "bzh.abolivier.teleport.video": Datatype.VIDEO,
            "bzh.abolivier.teleport.audio": Datatype.AUDIO,
        }

        this.type = strToDataType[type];

        if (this.type === Datatype.TEXT) {
            this.body = body;
        } else {
            this.media_url = media_url;
        }
    }

    public static fromObject(
        jsonObject: {
            datatype: string,
            body?: string,
            media_url?: string
        }
    ) {
        return new Datapoint(jsonObject.datatype, jsonObject.body, jsonObject.media_url)
    }
}

export enum Datatype {
    TEXT,
    IMAGE,
    VIDEO,
    AUDIO,
}
