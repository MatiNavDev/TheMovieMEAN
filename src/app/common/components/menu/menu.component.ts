import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { SessionService } from 'src/app/common/services/session.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  sessionMode: boolean;

  constructor(
    private sessionSrvc: SessionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.subscribeToSessionMode();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  private subscribeToSessionMode() {
    this.sessionSrvc
      .getSessionMode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(sessionMode => {
        this.sessionMode = sessionMode;
      });
  }

  /**
   * Navega hacia una ruta recibida
   */
  public onGoTo(route) {
    this.router.navigate([route], { relativeTo: this.route });
  }
}
