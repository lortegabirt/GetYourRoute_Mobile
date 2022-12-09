import {Injectable, OnDestroy} from '@angular/core';
import {interval, map, of, scan, startWith, Subject, switchMap, takeUntil, tap} from "rxjs";

type State = { value?: number, count?: boolean };

@Injectable({
  providedIn: 'root'
})
export class StopWatchService implements OnDestroy {

  private destroyed$ = new Subject();
  private events$: Subject<State> = new Subject<State>();
  readonly stopwatch$ = this.events$.asObservable().pipe(
    startWith({value: 0, count: false} as State),
    scan((acc, val) => ({...acc, ...val})),
    switchMap(state => state.count
      ? interval(1000)
        .pipe(
          tap(_ => state.value += 1000),
          map(_ => state)
        )
      : of(state)),
    takeUntil(this.destroyed$),
  );

  start() {
    this.events$.next({count: true});
  }

  stop() {
    this.events$.next({count: false});
  }

  reset() {
    this.events$.next({value: 0});
  }

  ngOnDestroy(): void {
    this.destroyed$.next('');
  }

}
