import { Injectable } from '@angular/core';
import { ScriptStore } from '../../directives/maths/maths.directive';
import * as _ from 'lodash';
declare var document: any;

@Injectable()
export class MathsService {
    private scripts: any = {};

    constructor() {
        ScriptStore.forEach((script: any) => {
            this.scripts[script.name] = {
                loaded: false,
                src: script.src
            };
        });
    }

    load(...scripts: string[]) {
        const promises: any[] = [];
        scripts.forEach((script) => promises.push(this.loadScript(script, 'name')));
        return Promise.all(promises);
    }

    loadScript(name: string, contentType: string) {
        let src: string;
        return new Promise((resolve, reject) => {

            // resolve if already loaded
            if (this.scripts[name].loaded) {
                resolve({ script: name, loaded: true, status: 'Already Loaded' });
            } else {
                try {
                    src = (contentType === 'name') ? _.get(this.scripts, name + '.src', '') : name;
                    // load script
                    const script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.src = src;
                    script.async = true;
                    if (script.readyState) {  // IE
                        script.onreadystatechange = () => {
                            if (script.readyState === 'loaded' || script.readyState === 'complete') {
                                script.onreadystatechange = null;
                                this.scripts[name].loaded = true;
                                resolve({ script: name, loaded: true, status: 'Loaded' });
                            }
                        };
                    } else {  // Others
                        script.onload = () => {
                            this.scripts[name].loaded = true;
                            resolve({ script: name, loaded: true, status: 'Loaded' });
                        };
                    }
                    script.onerror = (error: any) => resolve({ script: name, loaded: false, status: 'Loaded' });
                    document.getElementsByTagName('head')[0].appendChild(script);
                } catch (error) {
                    console.log(error);
                }
            }
        });
    }

}
