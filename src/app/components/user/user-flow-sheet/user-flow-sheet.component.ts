import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-flow-sheet',
  imports: [],
  templateUrl: './user-flow-sheet.component.html',
  styleUrls: ['./user-flow-sheet.component.css']
})
export class UserFlowSheetComponent implements OnInit {
  patientId: string | null = null;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Get the 'id' parameter from the URL
    this.patientId = this.route.snapshot.paramMap.get('id');
    
    // Now you can use this.patientId to fetch the patient's data from your service
    if (this.patientId) {
      console.log('Loading flow sheet for Patient ID:', this.patientId);
      // Example: this.patientService.getPatientFlowSheet(this.patientId).subscribe(data => { ... });
    }
  }
}
