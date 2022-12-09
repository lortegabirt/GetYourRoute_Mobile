import {Injectable} from '@angular/core';
import {from, map, Observable} from "rxjs";
import {Preferences} from "@capacitor/preferences";

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  public set(key: string, value: string): void {
    Preferences.set({value, key}).then();
  }

  public get(key: string): Observable<string> {
    return from(Preferences.get({key})).pipe(
      map(result => result.value)
    );
  }

  public remove(key: string): void {
    Preferences.remove({key}).then();
  }
}
