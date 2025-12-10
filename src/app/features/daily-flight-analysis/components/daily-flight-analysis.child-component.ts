import { Directive, Input } from "@angular/core";
import { DailyFlightAnalysisData } from "../../../core/interface/daily-flight-analysis.interface";

@Directive()
export abstract class DailyFlightAnalysisChildComponent {
  @Input() data: DailyFlightAnalysisData[] = [];
  @Input() activeIndex: number = 0;
}
