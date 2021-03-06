import { Injectable } from '@angular/core';
import { isString, isObject } from 'src/app/infrastructure/utility';
import {
  compressObjectToString,
  decompressStringToObject
} from 'src/app/infrastructure/text-utility';
import { Configuration } from '../configuration';
import { IStorage } from '../interface/storage.interface';
import { namespaceHTML } from '@angular/core/src/render3';

@Injectable()
export class BrowserSessionConfigurationStorage implements IStorage<Configuration> {
  configuration: any;
  private storage: any;
  private name: string;

  constructor(name: string) {
    this.name = name;

    this.storage = localStorage;

    this.configuration = {};

    this.get(this.name).then(configuration => {
      this.configuration = configuration;
    }).catch(error => console.log(error));
  }

  save(config: Configuration) {
    this.configuration[config.name] = config;

    this.add(this.name, this.configuration);
  }

  open(name: string): Configuration {
    return Object.setPrototypeOf(this.configuration[name], Configuration.prototype);
  }

  add(key: string, value: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        let prepareValue = '';
        if (isString(value)) {
          prepareValue = value;
        } else if (isObject(value)) {
          prepareValue = compressObjectToString(value);
        }

        if (this.storage.getItem(key)) {
          this.remove(key);
          this.storage.setItem(key, prepareValue); // update
        } else {
          this.storage.setItem(key, prepareValue);
        }

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  get(key): Promise<any> {
    return new Promise((resolve, reject) => {
      const value = this.storage.getItem(key);

      if (value) {
        try {
          const configText = decompressStringToObject(value);
          const parsed = JSON.parse(configText);
          resolve(parsed);
        } catch (error) {
          try {
            resolve(JSON.parse(value));
          } catch (error) {
            resolve(value);
          }
        }
      } else {
        reject('storage has no saved reports');
      }
    });
  }

  remove(key: string): void {
    // Check if key exists
    this.storage.removeItem(key);
  }
}
