import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { SessionService } from 'src/app/common/services/session.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {

  destroy$ = new Subject()
  sessionMode: boolean;

  constructor(
    private sessionSrvc:SessionService, private cdRef:ChangeDetectorRef) { }

  ngOnInit() {
    this.subscribeToSessionMode();
  }

  ngOnDestroy(){
    this.destroy$.next(true);
  }

  private subscribeToSessionMode(){
    this.sessionSrvc.getSessionMode()
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe(sessionMode=>{
      this.sessionMode = sessionMode;
    })

  
    
  }

}
