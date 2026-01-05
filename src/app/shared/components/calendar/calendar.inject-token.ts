// calendar-overlay.token.ts
import { InjectionToken } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';

export const CALENDAR_OVERLAY_REF = new InjectionToken<OverlayRef>('CALENDAR_OVERLAY_REF');
