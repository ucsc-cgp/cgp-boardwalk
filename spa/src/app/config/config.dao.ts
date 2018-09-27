/**
 * UCSC Genomics Institute - CGL
 * https://cgl.genomics.ucsc.edu/
 *
 * Data Access Object for hitting config-related API end points.
 */

// Core dependencies
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

// App dependencies
import { Config } from "./config.model";

@Injectable()
export class ConfigDAO {

    /**
     * @param {HttpClient} httpClient
     */
    constructor(private httpClient: HttpClient) {}

    /**
     * Hit API end point to retrieve configuration information for this Boardwalk instance. The core config information
     * is hosted locally (as opposed to being hosted at the data server). This end point is hit during app
     * initialization, before components are rendered. See providers definition in app.module. Must return promise here
     * so Angular knows to continue with component setup once config has been resolved.
     *
     * @returns {Promise<Config>}
     */
    public fetchConfig(): Promise<Config> {

        return this.httpClient.get("/api/config")
            .map(res => {
                return Object.assign(new Config(""), res); // Convert JSON to Config instance
            })
            .toPromise();
    }
}
