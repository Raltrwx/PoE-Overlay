import { Injectable } from '@angular/core';
import { KeyboardService, MouseService, WindowService } from '@app/service';
import { BehaviorSubject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ToolService {
    private readonly command$ = new BehaviorSubject<string>('');

    constructor(
        private readonly keyboard: KeyboardService,
        private readonly mouse: MouseService,
        private readonly window: WindowService) {
        this.init();
    }

    public command(command: string): void {
        this.command$.next(command);
    }

    private init(): void {
        this.command$.pipe(
            throttleTime(15)
        ).subscribe(command => {
            const gameBounds = this.window.getBounds();
            const stashWidth = gameBounds.width / 2.88;

            const point = this.mouse.getCursorScreenPoint();
            const relativePointX = point.x - gameBounds.x;
            if (relativePointX > stashWidth) {
                this.keyboard.setKeyboardDelay(5);
                switch (command) {
                    case 'storage-left':
                        this.keyboard.keyTap('left');
                        break;
                    case 'storage-right':
                        this.keyboard.keyTap('right');
                        break;
                    default:
                        break;
                }
            }
        });
    }
}
